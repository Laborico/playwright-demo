import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  readonly UserEmail: Locator = this.page.getByRole('textbox', { name: 'Username' });
  readonly UserPassword: Locator = this.page.getByRole('textbox', { name: 'Password' });
  readonly LoginButton: Locator = this.page.getByRole('button', { name: 'Login' })

  async goToLoginPage() {
    await this.navigate("/");
  }

  async login(username: string, password: string) {
    await this.UserEmail.fill(username);
    await this.UserPassword.fill(password);
    await this.LoginButton.click();
    await this.waitForPageLoad();
  }
}