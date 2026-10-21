import { Locator, Page } from "@playwright/test";

export class HeaderComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator("[data-test='shopping-cart-link']");
    this.cartBadge = page.locator("[data-test='shopping-cart-badge']");
  }

  async openCart() {
    await this.cartLink.click();
  }
}
