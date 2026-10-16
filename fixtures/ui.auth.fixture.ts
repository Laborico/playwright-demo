import { test as base, Page } from '@playwright/test';
import path from 'path';

const AUTH_STATE_PATH = path.resolve(__dirname, '../playwright/.auth/ui-user.json');

type AuthFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ browser }, use) => {
    // ---- setup ----
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH })
    const page = await context.newPage()

    // hand the value to the test
    await use(page);
  },
});

export { expect } from '@playwright/test';