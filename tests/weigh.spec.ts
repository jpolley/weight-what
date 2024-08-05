import { test, expect } from "@playwright/test";
import { WeighPage } from "@pages";
import { evalutateResult } from "@helpers";

test.describe("Weigh gold bars", async () => {
  test("locate the fake bar that weighs less", async ({ page }) => {
    let fakebar: number;

    const weighPage = new WeighPage(page);
    await weighPage.goto();

    await weighPage.weighBars([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ]);

    let result = await weighPage.getResult(0);

    if (result.includes("=")) {
      fakebar = 8;
    } else {
      let barsToWeigh = evalutateResult(result);
      await weighPage.weighBars(barsToWeigh);

      result = await weighPage.getResult(1);

      barsToWeigh = evalutateResult(result);
      await weighPage.weighBars(barsToWeigh);

      result = await weighPage.getResult(2);

      fakebar = evalutateResult(result)[0][0];
    }

    const alertMessage = await weighPage.clickFakeBar(fakebar);

    expect(alertMessage).toBe("Yay! You find it!");

    await weighPage.printSummary(alertMessage, fakebar);
  });
});
