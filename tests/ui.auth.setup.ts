import { test } from '@fixtures/ui.fixture';

test('authenticate as user', async ({ loginPage, page }) => {

  const user:string = process.env.UI_STANDARD_USER;
  const password:string = process.env.UI_PASSWORD;

  await loginPage.goToLoginPage();

  await loginPage.login(user, password);

  await page.context().storageState({
    path: 'playwright/.auth/ui-user.json'
  });
});