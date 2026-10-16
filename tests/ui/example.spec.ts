import { test, expect } from '@fixtures';

test('has title', async ({ loggedInPage }) => {
  await loggedInPage.goto('/inventory.html');

  await expect(loggedInPage).toHaveURL("/inventory.html")
  await expect(loggedInPage).toHaveTitle(/Swag Labs/);
});