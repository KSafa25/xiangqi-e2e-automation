import { Page, expect } from '@playwright/test';
import { BASE_URL } from '../config/globals';

export class SignInPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  emailInput = () => this.page.getByRole('textbox', { name: 'Email or Username' });
  passwordInput = () => this.page.getByRole('textbox', { name: 'Password' });
  signInButton = () => this.page.locator('form').getByRole('button', { name: 'Sign In' });

  // Toast message (adjust selector as needed)
  toast = () => this.page.locator('.toastr');

  // Actions
  async navigateToSignInPage() {
    await this.page.goto(`${BASE_URL}/account/signin?redirect=/`);
  }

  async enterCredentials(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
  }

  async clickSignInButton() {
    await this.signInButton().click();
  }

  async verifyLoginRedirectToLobby() {
    await expect(this.page).toHaveURL(`${BASE_URL}/`);
  }

  async verifyErrorMessage(title: string, content: string) {
    const toast = this.toast();
    await expect(toast).toBeVisible({ timeout: 10000 }); // Adjust timeout as needed
    await expect(toast).toContainText(title);
    await expect(toast).toContainText(content);
  }

  async retryLoginIfInvalidPassword(email: string, correctPassword: string, expectedError: string) {
    const toast = this.toast();

    // Wait and check if toast with expected error appears
    await expect(toast).toBeVisible({ timeout: 10000 });
    const text = await toast.textContent();

    if (text?.includes(expectedError)) {
      await this.enterCredentials(email, correctPassword);
      await this.clickSignInButton();
    } else {
      throw new Error(`Expected error message '${expectedError}' not found in toast`);
    }
  }
}
  