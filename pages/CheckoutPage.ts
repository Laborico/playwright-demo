import { BasePage } from "./BasePage";
import { HeaderComponent } from "./components/HeaderComponent";
import { ItemListComponent } from "./components/ItemListComponent";

export type CheckoutInfo = {
  firstName: string;
  lastName: string;
  zipCode: string;
};

export class CheckoutPage extends BasePage {
  readonly header = new HeaderComponent(this.page);
  readonly itemList = new ItemListComponent(this.page);

  readonly firstNameInput = this.page.getByRole("textbox", {
    name: "First Name",
  });
  readonly lastNameInput = this.page.getByRole("textbox", {
    name: "Last Name",
  });
  readonly zipCodeInput = this.page.getByRole("textbox", {
    name: "Zip/Postal Code",
  });
  readonly continueButton = this.page.getByRole("button", { name: "Continue" });
  readonly finishButton = this.page.getByRole("button", { name: "Finish" });

  readonly paymentInfoLabel = this.page.getByText("Payment Information:");
  readonly paymentInfoValue = this.page.locator(
    "[data-test='payment-info-value']",
  );
  readonly shippingInfoLabel = this.page.getByText("Shipping Information:");
  readonly shippingInfoValue = this.page.locator(
    "[data-test='shipping-info-value']",
  );
  readonly orderCompleteHeader = this.page.getByRole("heading", {
    name: "Thank you for your order!",
  });

  async fillInformation({ firstName, lastName, zipCode }: CheckoutInfo) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}
