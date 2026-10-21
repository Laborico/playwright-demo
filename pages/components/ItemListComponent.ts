import { Locator, Page } from "@playwright/test";

export class ItemListComponent {
  readonly items: Locator;
  readonly names: Locator;

  constructor(page: Page) {
    this.items = page.locator("[data-test='inventory-item']");
    this.names = page.locator("[data-test='inventory-item-name']");
  }

  itemByName(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async openByName(productName: string) {
    await this.names.filter({ hasText: productName }).click();
  }

  async removeByName(productName: string) {
    await this.itemByName(productName)
      .getByRole("button", { name: "Remove" })
      .click();
  }

  async getProductNames() {
    return await this.names.allTextContents();
  }
}
