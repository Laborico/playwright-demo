import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import path from "path";

const AUTH_STATE_PATH = path.resolve(
  __dirname,
  "../playwright/.auth/ui-user.json",
);

type PageFixtures = {
  loggedInPage: Page;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<PageFixtures>({
  loggedInPage: async ({ browser }, use) => {
    // ---- setup ----
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH });
    const page = await context.newPage();

    // hand the value to the test
    await use(page);

    //cleanup
    await context.close();
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ loggedInPage }, use) => {
    await use(new InventoryPage(loggedInPage));
  },
});

export { expect } from "@playwright/test";

export const Tags = {
  login: "@login",
  inventory: "@inventory",
  functionality: {
    sorting: "@sorting"
  }
};
