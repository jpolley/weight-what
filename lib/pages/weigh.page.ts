import { Locator, Page } from "@playwright/test";
import { WeightBars, splitArray, parseResultFromString } from "@helpers";
import { parse } from "path";

export class WeighPage {
  readonly weighButton = this.page.getByRole("button", { name: "Weigh" });
  readonly resetButton = this.page.getByRole("button", { name: "Reset" });

  barAtIndex(index: number): Locator {
    return this.page.locator(`#coin_${index}`);
  }

  barInBowlAtIndex(bowlSide: "left" | "right", index: number): Locator {
    return this.page.locator(`#${bowlSide}_${index}`);
  }

  results(): Locator {
    return this.page.locator("ol > li");
  }

  resultsRow(row: number): Locator {
    return this.results().nth(row);
  }

  constructor(private readonly page: Page) {}

  visit() {
    this.page.goto("/");
  }

  async fillBowlWithBars(bars: number[], bowlSide: "left" | "right") {
    for (let i = 0; i < bars.length; i++) {
      await this.barInBowlAtIndex(bowlSide, i).fill(`${bars[i]}`);
    }
  }

  async weighBowls(leftBowlBars: number[], rightBowlBars: number[]) {
    await this.resetButton.click();
    await this.fillBowlWithBars(leftBowlBars, "left");
    await this.fillBowlWithBars(rightBowlBars, "right");
    await this.weighButton.click();
  }

  async findFakeBar(): Promise<number> {
    let weightBars = WeightBars;

    while (weightBars.length > 1) {
      await this.resetButton.click();
      weightBars = await this.findArrayContainingFakeBar(weightBars);
    }

    return weightBars[0];
  }

  async clickFakeBar(index: number): Promise<string> {
    const dialogMessagePromise = new Promise<string>((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        await dialog.dismiss();
        resolve(message);
      });
    });

    await this.barAtIndex(index).click();
    return await dialogMessagePromise;
  }

  private async findArrayContainingFakeBar(array: number[]) {
    const [left, right, leftOver] = splitArray(array);
    const resultString = await this.executeWeightCheck(left, right);
    const { leftArray, operator, rightArray } = parseResultFromString(resultString);

    if (operator === "=") {
      return leftOver;
    } else if (operator === "<") {
      return leftArray;
    } else {
      return rightArray;
    }
  }

  private async executeWeightCheck(left: number[], right: number[]) {
    const resultRowCount = await this.results().count();
    await this.weighBowls(left, right);
    return await this.resultsRow(resultRowCount).innerText();
  }
}
