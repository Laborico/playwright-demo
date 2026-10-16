import { test } from '@playwright/test';

test('authenticate as user', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('textbox', { name: 'Username' })
    .fill(process.env.UI_STANDARD_USER);
  await page
    .getByRole('textbox', { name: 'Password' })
    .fill(process.env.UI_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('/inventory.html');
  await page.context().storageState({
    path: 'playwright/.auth/ui-user.json'
  });
});