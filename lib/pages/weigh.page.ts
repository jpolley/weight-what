import { Page } from "@playwright/test";

export class WeighPage {
  readonly left0 = this.page.locator("#left_0");
  readonly left1 = this.page.locator("#left_1");
  readonly left2 = this.page.locator("#left_2");
  readonly left3 = this.page.locator("#left_3");

  readonly right0 = this.page.locator("#right_0");
  readonly right1 = this.page.locator("#right_1");
  readonly right2 = this.page.locator("#right_2");
  readonly right3 = this.page.locator("#right_3");

  readonly weighBtn = this.page.getByRole("button", { name: "Weigh" });
  readonly resetBtn = this.page.getByRole("button", { name: "Reset" });

  readonly bar0 = this.page.locator("#coin_0");
  readonly bar1 = this.page.locator("#coin_1");
  readonly bar2 = this.page.locator("#coin_2");
  readonly bar3 = this.page.locator("#coin_3");
  readonly bar4 = this.page.locator("#coin_4");
  readonly bar5 = this.page.locator("#coin_5");
  readonly bar6 = this.page.locator("#coin_6");
  readonly bar7 = this.page.locator("#coin_7");
  readonly bar8 = this.page.locator("#coin_8");

  readonly result1 = this.page.locator("ol > li:nth-child(1)");
  readonly result2 = this.page.locator("ol > li:nth-child(2)");
  readonly result3 = this.page.locator("ol > li:nth-child(3)");

  async goto() {
    await this.page.goto("/");
  }

  async locateFakeBar() {
    await this.weighBars([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ]);

    const result1 = await this.result1.innerText();

    if (result1.includes("=")) {
      return 8;
    }

    let barsToWeigh = await this.evalutateResult(result1);
    await this.weighBars(barsToWeigh);

    const result2 = await this.result2.innerText();

    barsToWeigh = await this.evalutateResult(result2);
    await this.weighBars(barsToWeigh);

    const result3 = await this.result3.innerText();

    return await this.evalutateResult(result3)[0][0];
  }

  evalutateResult(input: string): number[][] {
    // Extract arrays and comparison operator
    const match = input.match(/\[(.*?)\] (>|<) \[(.*?)\]/);
    const leftArrayStr = match[1];
    const operator = match[2];
    const rightArrayStr = match[3];

    // Convert string array to arrays of numbers
    const leftArray = leftArrayStr.split(",").map(Number);
    const rightArray = rightArrayStr.split(",").map(Number);

    let lesserArray: number[];

    if (operator === "<") {
      lesserArray = leftArray;
    } else {
      lesserArray = rightArray;
    }

    // Split the lesser array into two sub-arrays to make it easier to weigh
    const midIndex = Math.ceil(lesserArray.length / 2);
    const firstHalf = lesserArray.slice(0, midIndex);
    const secondHalf = lesserArray.slice(midIndex);

    return [firstHalf, secondHalf];
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
      await this[`left${i}`].fill(`${bars[i]}`);
    }
  }

  async fillRight(bars: number[]) {
    for (let i = 0; i < bars.length; i++) {
      await this[`right${i}`].fill(`${bars[i]}`);
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

    await this[`bar${number}`].click();

    return await dialogMessagePromise;
  }

  async printSummary(alertMessage, fakebar) {
    console.log(alertMessage);
    console.log(`The fake bar is: ${fakebar}`);
    console.log(`1. ${await this.result1.innerText()}`);
    if (await this.result2.isVisible()) {
      console.log(`2. ${await this.result2.innerText()}`);
      console.log(`3. ${await this.result3.innerText()}`);
    }
  }

  constructor(private readonly page: Page) {}
}
