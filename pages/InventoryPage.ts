import { BasePage } from "./BasePage";
import { Locator } from "@playwright/test";

const SortOptions = {
  NameAscending: "az",
  NameDescending: "za",
  PriceAscending: "lohi",
  PriceDescending: "hilo",
} as const;

type SortOption = keyof typeof SortOptions;

export class InventoryPage extends BasePage {
  readonly InventoryItem: Locator = this.page.locator(
    "[data-test='inventory-item']",
  );
  readonly CartIcon: Locator = this.page.locator(
    "[data-test='shopping-cart-link']",
  );
  readonly SortDropdown: Locator = this.page.locator(
    "[data-test='product-sort-container']",
  );
  readonly AllProductNames: Locator = this.page.locator(
    "[data-test='inventory-item-name']",
  );

  async goToInventoryPage() {
    await this.navigate("/inventory.html");
  }

  async addToCartByName(productName: string) {
    await this.InventoryItem.filter({ hasText: productName })
      .getByRole("button", { name: "Add to cart" })
      .click();
  }

  async removeFromCartByName(productName: string) {
    await this.InventoryItem.filter({ hasText: productName })
      .getByRole("button", { name: "Remove" })
      .click();
  }

  async sortProductsBy(sortingOrder: SortOption) {
    await this.SortDropdown.selectOption(SortOptions[sortingOrder]);
  }

  async getProductNames() {
    return await this.AllProductNames.allTextContents();
  }
}
