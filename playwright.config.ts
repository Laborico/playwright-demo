import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    video: "retain-on-failure",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "ui-setup",
      testDir: "./tests",
      testMatch: /ui\.auth\.setup\.ts/,
      use: { baseURL: process.env.UI_BASE_URL },
    },
    {
      name: "ui",
      dependencies: ["ui-setup"],
      testMatch: "ui/**/*.spec.ts",
      use: { baseURL: process.env.UI_BASE_URL },
    },

    {
      name: "api",
      testMatch: "api/**/*.spec.ts",
      use: {
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    },
  ],
});
