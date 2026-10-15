import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'ui',
      testMatch: "ui/**/*",
      use: { baseURL: process.env.UI_BASE_URL },
    },

    {
      name: 'api',
      testMatch: "api/**/*",
      use: { baseURL: process.env.API_BASE_URL },
    },
  ],
});
