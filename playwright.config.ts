import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["list"], ["html"]] : [["list"], ["html"]],
  use: {
    baseURL: "https://sdetchallenge.fetch.com",
    trace: "on-first-retry",
    video: "on",
    screenshot: "on",
  },
  projects: [
    {
      name: "tests",
      testMatch: /.*(tests).*.ts/,
    },
  ],
});
