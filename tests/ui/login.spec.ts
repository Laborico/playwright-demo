import { test, expect, Tags } from "@fixtures/ui.fixture";

test.describe("Login test cases", { tag: Tags.login }, () => {
  test("Login as valid user", async ({ loginPage, page }) => {
    const user: string = process.env.UI_STANDARD_USER;
    const password: string = process.env.UI_PASSWORD;

    await loginPage.goToLoginPage();

    await loginPage.login(user, password);

    await expect(page).toHaveURL("/inventory.html");
  });

  test("Login as invalid user", async ({ loginPage }) => {
    const user: string = process.env.UI_LOCKEDOUT_USER;
    const password: string = process.env.UI_PASSWORD;

    await loginPage.goToLoginPage();

    await loginPage.login(user, password);

    await expect(loginPage.LoginError).toBeVisible();
  });
});
