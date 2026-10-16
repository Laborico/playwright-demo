import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import path from 'path';

const AUTH_STATE_PATH = path.resolve(__dirname, '../playwright/.auth/ui-user.json');

type PageFixtures = {
  loggedInPage: Page;
  loginPage: LoginPage;
};

export const test = base.extend<PageFixtures>({
  loggedInPage: async ({ browser }, use) => {
    // ---- setup ----
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH })
    const page = await context.newPage()

    // hand the value to the test
    await use(page);
  },
  loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
});

export { expect } from '@playwright/test';