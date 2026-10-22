import { test, expect, AUTH_STATE_PATH } from "@fixtures/ui.fixture";

test("authenticate as valid user", async ({ loginPage, page }) => {
  const user: string = process.env.UI_STANDARD_USER;
  const password: string = process.env.UI_PASSWORD;

  await loginPage.goToLoginPage();

  await loginPage.login(user, password);

  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({ path: AUTH_STATE_PATH });
});
