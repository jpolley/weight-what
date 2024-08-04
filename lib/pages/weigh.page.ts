import { Page } from "@playwright/test";
import { evalutateResult } from "lib/helpers";

export class WeighPage {
  readonly leftBars = Array.from({ length: 9 }, (_, i) => this.page.locator(`#left_${i}`));
  readonly rightBars = Array.from({ length: 9 }, (_, i) => this.page.locator(`#right_${i}`));
  readonly bars = Array.from({ length: 9 }, (_, i) => this.page.locator(`#coin_${i}`));
  readonly results = Array.from({ length: 3 }, (_, i) => this.page.locator(`ol > li:nth-child(${i + 1})`));

  readonly weighBtn = this.page.getByRole("button", { name: "Weigh" });
  readonly resetBtn = this.page.getByRole("button", { name: "Reset" });

  getLeftBar(index: number) {
    if (index < 0 || index >= this.leftBars.length) {
      throw new Error(`Invalid left bar index: ${index}`);
    }
    return this.leftBars[index];
  }

  getRightBar(index: number) {
    if (index < 0 || index >= this.rightBars.length) {
      throw new Error(`Invalid right bar index: ${index}`);
    }
    return this.rightBars[index];
  }

  getBar(index: number) {
    if (index < 0 || index >= this.bars.length) {
      throw new Error(`Invalid bar index: ${index}`);
    }
    return this.bars[index];
  }

  getResult(index: number) {
    if (index < 0 || index >= this.results.length) {
      throw new Error(`Invalid result index: ${index}`);
    }
    return this.results[index];
  }

  async goto() {
    await this.page.goto("/");
  }

  async locateFakeBar() {
    await this.weighBars([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ]);

    let result = await this.getResult(0).innerText();

    if (result.includes("=")) {
      return 8;
    }

    let barsToWeigh = await evalutateResult(result);
    await this.weighBars(barsToWeigh);

    result = await this.getResult(1).innerText();

    barsToWeigh = await evalutateResult(result);
    await this.weighBars(barsToWeigh);

    result = await this.getResult(2).innerText();

    return await evalutateResult(result)[0][0];
  }

  async weighBars(bars: number[][]) {
    const leftBars = bars[0];
    const rightBars = bars[1];

    await this.clickReset();
    await this.fillLeft(leftBars);
    await this.fillRight(rightBars);
    await this.clickWeigh();
  }

  async fillLeft(bars: number[]) {
    for (let i = 0; i < bars.length; i++) {
      await this.leftBars[i].fill(`${bars[i]}`);
    }
  }

  async fillRight(bars: number[]) {
    for (let i = 0; i < bars.length; i++) {
      await this.rightBars[i].fill(`${bars[i]}`);
    }
  }

  async clickWeigh() {
    await this.weighBtn.click();
  }

  async clickReset() {
    await this.resetBtn.click();
  }

  async clickFakeBar(number: number): Promise<string> {
    const dialogMessagePromise = new Promise<string>((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        await dialog.dismiss();
        resolve(message);
      });
    });

    await this.getBar(number).click();

    return await dialogMessagePromise;
  }

  async numberOfWeighs() {
    if (await this.getResult(1).isVisible()) {
      return "After weighing three times,";
    } else {
      return "After weighing one time,";
    }
  }

  async printSummary(alertMessage: string, fakebar: number) {
    console.log(alertMessage);
    console.log(`${await this.numberOfWeighs()} the fake bar is: ${fakebar}`);
    console.log(`1. ${await this.getResult(0).innerText()}`);
    if (await this.getResult(1).isVisible()) {
      console.log(`2. ${await this.getResult(1).innerText()}`);
      console.log(`3. ${await this.getResult(2).innerText()}`);
    }
  }

  constructor(private readonly page: Page) {}
}
