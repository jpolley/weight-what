import { test, expect } from "@playwright/test";
import { WeighPage } from "@pages";

test.describe("Weigh gold bars", async () => {
  test("locate the fake bar that weighs less", async ({ page }) => {
    const weighPage = new WeighPage(page);
    await weighPage.goto();

    const fakebar = await weighPage.locateFakeBar();
    const alertMessage = await weighPage.clickFakeBar(fakebar);

    expect(alertMessage).toBe("Yay! You find it!");

    await weighPage.printSummary(alertMessage, fakebar);
  });
});
