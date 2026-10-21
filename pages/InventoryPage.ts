import { BasePage } from "./BasePage";
import { Locator } from "@playwright/test";
import { HeaderComponent } from "./components/HeaderComponent";
import { ItemListComponent } from "./components/ItemListComponent";

const SortOptions = {
  NameAscending: "az",
  NameDescending: "za",
  PriceAscending: "lohi",
  PriceDescending: "hilo",
} as const;

type SortOption = keyof typeof SortOptions;

export class InventoryPage extends BasePage {
  readonly header = new HeaderComponent(this.page);
  readonly itemList = new ItemListComponent(this.page);

  readonly SortDropdown: Locator = this.page.locator(
    "[data-test='product-sort-container']",
  );

  async goToInventoryPage() {
    await this.navigate("/inventory.html");
  }

  async addToCartByName(productName: string) {
    await this.itemList.itemByName(productName)
      .getByRole("button", { name: "Add to cart" })
      .click();
  }

  async removeFromCartByName(productName: string) {
    await this.itemList.removeByName(productName);
  }

  async sortProductsBy(sortingOrder: SortOption) {
    await this.SortDropdown.selectOption(SortOptions[sortingOrder]);
  }

  async getProductNames() {
    return await this.itemList.getProductNames();
  }
}
