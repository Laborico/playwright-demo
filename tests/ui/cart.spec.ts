import { test, expect, Tags } from "@fixtures/ui.fixture";

test.describe("Cart test cases", { tag: Tags.cart }, () => {
  const backpack = "Sauce Labs Backpack";

  test("User can view, open and remove an item in the cart", async ({
    inventoryPage,
    cartPage,
    loggedInPage,
  }) => {
    await inventoryPage.goToInventoryPage();
    await inventoryPage.addToCartByName(backpack);

    await inventoryPage.header.openCart();

    await expect(loggedInPage).toHaveURL(/\/cart\.html/);
    await expect(cartPage.itemList.items).toHaveCount(1);
    await expect(cartPage.itemList.names).toHaveText([backpack]);

    await cartPage.openItemByName(backpack);

    await expect(loggedInPage).toHaveURL(/\/inventory-item\.html/);

    await loggedInPage.goBack();

    await expect(loggedInPage).toHaveURL(/\/cart\.html/);

    await cartPage.removeFromCartByName(backpack);

    await expect(cartPage.itemList.items).toHaveCount(0);
  });
});
