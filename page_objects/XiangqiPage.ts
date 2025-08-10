import { Page, Locator, expect } from '@playwright/test';

/**
 * XiangqiPage contains all the selectors and methods for interacting with the xiangqi.com website.
 */
export class XiangqiPage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly emailInput: Locator;
  readonly emailSubmitButton: Locator;
  readonly verificationCodeInputs: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly countryDropdown: Locator;
  readonly skillLevelDropdown: Locator;
  readonly profileForm: Locator;
  readonly profileSubmitButton: Locator;
  
  // Locators for sign-out and sign-in
  readonly userAvatarButton: Locator;
  readonly signOutLink: Locator; // Changed from button to link
  readonly usernameLoginInput: Locator;
  readonly passwordLoginInput: Locator;
  readonly finalSignInButton: Locator;
  readonly mainGamePageIdentifier: Locator;


  constructor(page: Page) {
    this.page = page;
    // Sign-up flow
    this.signInButton = page.getByRole('button', { name: 'sign in iconSign In' });
    this.signUpButton = page.getByRole('button', { name: 'Sign Up' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.emailSubmitButton = page.locator('form').filter({ hasText: 'EmailSign UpPlay as Guest' }).getByRole('button');
    this.verificationCodeInputs = page.locator('input[aria-label^="Digit"]');
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.countryDropdown = page.locator('#react-select-2-placeholder');
    this.skillLevelDropdown = page.locator('#react-select-3-placeholder');
    this.profileForm = page.locator('form').filter({ hasText: 'UsernamePasswordCountry/' });
    this.profileSubmitButton = this.profileForm.getByRole('button');

    // Sign-out and Sign-in flow - Updated based on your codegen
    this.userAvatarButton = page.locator('button.items-center.gap-2'); 
    this.signOutLink = page.locator('a').filter({ hasText: 'Logout' });
    this.usernameLoginInput = page.getByRole('textbox', { name: 'Email or Username' });
    this.passwordLoginInput = page.getByRole('textbox', { name: 'Password' });
    this.finalSignInButton = page.locator('form').getByRole('button', { name: 'Sign In' });
    this.mainGamePageIdentifier = page.getByRole('button', { name: 'New Game' });
  }

  /**
   * Navigates to the base URL.
   */
  async navigate() {
    await this.page.goto('https://play.xiangqi.com/');
  }

  /**
   * Clicks the sign-in and then the sign-up button to open the registration form.
   */
  async startSignUp() {
    await this.signInButton.click();
    await this.signUpButton.click();
  }

  /**
   * Enters the provided email and submits the form to trigger the verification step.
   * @param email - The email address to use for registration.
   */
  async submitEmailForVerification(email: string) {
    await this.emailInput.fill(email);
    await this.emailSubmitButton.click();
  }

  /**
   * Enters the 6-digit verification code.
   * @param code - The 6-digit code as a string.
   */
  async enterVerificationCode(code: string) {
    const codeDigits = code.split('');
    const inputs = await this.verificationCodeInputs.all();
    for (let i = 0; i < Math.min(codeDigits.length, inputs.length); i++) {
        await inputs[i].fill(codeDigits[i]);
    }
  }

  /**
   * Fills out the final user profile form.
   * @param username - The desired username.
   * @param password - The desired password.
   */
  async completeProfile(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    
    await this.countryDropdown.click();
    await this.page.getByText('China', { exact: true }).click();

    await this.skillLevelDropdown.click();
    await this.page.getByText('Beginner').click();

    await this.profileSubmitButton.click();
    await this.page.waitForTimeout(3000);
  }

  /**
   * Signs the user out of the application using the newly identified locators.
   */
async signOut(username: string) {
    // Dynamically find the button by the username text it contains
    await this.page.getByText(username).click();
    // Clicks the "Logout" link from the dropdown
    await this.signOutLink.click();
    await expect(this.finalSignInButton).toBeVisible({ timeout: 10000 });
  }

  /**
   * Signs the user in with the provided credentials.
   * @param username - The username to use for login.
   * @param password - The password to use for login.
   */
  async signIn(username: string, password: string) {
    await this.usernameLoginInput.fill(username);
    await this.passwordLoginInput.fill(password);
    await this.finalSignInButton.click();
  }

//   /**
//    * Verifies that the user has successfully landed on the main game page.
//    */
//   async verifyLoginSuccess() {
//     await expect(this.mainGamePageIdentifier).toBeVisible({ timeout: 15000 });
//   }
}

/**
 * TempMailPage contains selectors and methods for interacting with the temp-mail.io website.
 */
export class TempMailPage {
  readonly page: Page;
  readonly copyEmailButton: Locator;
  readonly emailInboxItem: Locator;
  readonly verificationCodeElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.copyEmailButton = page.locator('.icon.cursor-\\[inherit\\].w-7');
    this.emailInboxItem = page.getByText('Xiangqi.com - Activate Your Account');
    this.verificationCodeElement = page.getByRole('heading', { name: /\d{6}/ });
  }

  /**
   * Navigates to the temp-mail website.
   */
  async navigate() {
    await this.page.goto('https://temp-mail.io/en');
  }

  /**
   * Retrieves the temporary email address displayed on the page.
   * @returns The temporary email address as a string.
   */
  async getEmailAddress(): Promise<string> {
    console.log('Waiting for temp-mail page to load...');
    await this.page.waitForTimeout(7000);
    
    await this.copyEmailButton.waitFor({ state: 'visible', timeout: 20000 });
    const email = await this.page.locator('#email').inputValue();
    console.log(`[DEBUG] Found temporary email: ${email}`);
    return email;
  }

  /**
   * Waits for the verification email to arrive and extracts the 6-digit code.
   * @returns The 6-digit verification code as a string.
   */
  async getVerificationCode(): Promise<string> {
    console.log('Waiting for verification email to arrive...');
    await this.page.waitForTimeout(10000);

    await this.emailInboxItem.first().waitFor({ state: 'visible', timeout: 30000 });
    await this.emailInboxItem.first().click();
    await this.verificationCodeElement.waitFor({ state: 'visible', timeout: 10000 });
    const code = await this.verificationCodeElement.innerText();
    return code.trim();
  }
}
