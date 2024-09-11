import { test, expect } from "@playwright/test";
import { WeighPage } from "@pages";
import { printSummary } from "@helpers";

test.describe("Weigh gold bars", async () => {
  test("locate the bar that weighs less than others", async ({ page }) => {
    const weighPage = new WeighPage(page);
    await weighPage.visit();

    const fakeBar = await weighPage.findFakeBar();
    const dialogMessageText = await weighPage.clickFakeBar(fakeBar);

    expect(dialogMessageText).toBe("Yay! You find it!");
    printSummary(fakeBar, await weighPage.results().allInnerTexts());
  });
});
