import { test, expect, Tags } from "@fixtures/ui.fixture";

test.describe("Inventory test cases", { tag: Tags.inventory }, () => {
  const itemList: Record<string, string> = {
    backpack: "Sauce Labs Backpack",
    bike_light: "Sauce Labs Bike Light",
    "t-shirt": "Sauce Labs Bolt T-Shirt",
  };

  test("User can add items to cart", async ({ inventoryPage }) => {
    await inventoryPage.goToInventoryPage();

    await inventoryPage.addToCartByName(itemList["backpack"]);

    await expect(inventoryPage.header.cartLink).toHaveText("1");

    await inventoryPage.addToCartByName(itemList["bike_light"]);
    await inventoryPage.addToCartByName(itemList["t-shirt"]);

    await expect(inventoryPage.header.cartLink).toHaveText("3");
  });

  test("User can remove items from cart", async ({ inventoryPage }) => {
    await inventoryPage.goToInventoryPage();

    await inventoryPage.addToCartByName(itemList["backpack"]);
    await inventoryPage.addToCartByName(itemList["bike_light"]);
    await inventoryPage.addToCartByName(itemList["t-shirt"]);

    await expect(inventoryPage.header.cartLink).toHaveText("3");

    await inventoryPage.removeFromCartByName(itemList["backpack"]);
    await inventoryPage.removeFromCartByName(itemList["bike_light"]);
    await inventoryPage.removeFromCartByName(itemList["t-shirt"]);

    await expect(inventoryPage.header.cartLink).toHaveText("");
  });

  test(
    "User can sort products: Name",
    { tag: Tags.functionality.sorting },
    async ({ inventoryPage }) => {
      await inventoryPage.goToInventoryPage();

      // SauceDemo sorts by name ascending by default
      const unsortedNames = await inventoryPage.getProductNames();

      await inventoryPage.sortProductsBy("NameDescending");

      const sortedNames = await inventoryPage.getProductNames();

      const expectedNames = [...unsortedNames].sort((a, b) =>
        b.localeCompare(a),
      );

      expect(sortedNames).toEqual(expectedNames);

      await inventoryPage.sortProductsBy("NameAscending");

      expect(await inventoryPage.getProductNames()).toEqual(unsortedNames);
    },
  );
});
