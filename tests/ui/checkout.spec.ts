import { test, expect, Tags } from "@fixtures/ui.fixture";

test.describe("Checkout test cases", { tag: Tags.checkout }, () => {
  const backpack = "Sauce Labs Backpack";

  test("User can complete a checkout", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    loggedInPage,
  }) => {
    await inventoryPage.goToInventoryPage();
    await inventoryPage.addToCartByName(backpack);
    await inventoryPage.header.openCart();

    await cartPage.checkout();

    await expect(loggedInPage).toHaveURL(/\/checkout-step-one\.html/);

    await checkoutPage.fillInformation({
      firstName: "John",
      lastName: "Doe",
      zipCode: "12345",
    });
    await checkoutPage.continue();

    await expect(loggedInPage).toHaveURL(/\/checkout-step-two\.html/);
    await expect(checkoutPage.paymentInfoLabel).toBeVisible();
    await expect(checkoutPage.paymentInfoValue).toHaveText("SauceCard #31337");
    await expect(checkoutPage.shippingInfoLabel).toBeVisible();
    await expect(checkoutPage.shippingInfoValue).toHaveText(
      "Free Pony Express Delivery!",
    );
    await expect(checkoutPage.itemList.items).toHaveCount(1);
    await expect(checkoutPage.itemList.names).toHaveText([backpack]);

    await checkoutPage.finish();

    await expect(loggedInPage).toHaveURL(/\/checkout-complete\.html/);
    await expect(checkoutPage.orderCompleteHeader).toBeVisible();
  });
});
