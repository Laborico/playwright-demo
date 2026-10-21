import { BasePage } from "./BasePage";
import { HeaderComponent } from "./components/HeaderComponent";
import { ItemListComponent } from "./components/ItemListComponent";

export class CartPage extends BasePage {
  readonly header = new HeaderComponent(this.page);
  readonly itemList = new ItemListComponent(this.page);

  async goToCartPage() {
    await this.navigate("/cart.html");
  }

  async checkout() {
    await this.page.getByRole("button", { name: "Checkout" }).click();
  }

  async openItemByName(productName: string) {
    await this.itemList.openByName(productName);
  }

  async removeFromCartByName(productName: string) {
    await this.itemList.removeByName(productName);
  }
}
