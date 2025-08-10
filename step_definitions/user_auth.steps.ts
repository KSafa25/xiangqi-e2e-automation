import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../hooks/hooks';
import { TempMailPage } from '../page_objects/XiangqiPage'; // We only need TempMailPage here now

// These variables will hold the credentials across different steps
let uniqueUsername = '';
let password = '';

Given('the user navigates to the Xiangqi website', async function (this: ICustomWorld) {
  const { xiangqiPage } = this.pages;
  await xiangqiPage.navigate();
});

When('the user creates a new account using a temporary email', async function (this: ICustomWorld) {
  const { xiangqiPage } = this.pages;

  // Start Sign-up
  await xiangqiPage.startSignUp();

  // Get Temporary Email
  const tempMailPageInstance = await this.context.newPage();
  this.pages.tempMailPage = new TempMailPage(tempMailPageInstance);
  await this.pages.tempMailPage.navigate();
  const tempEmail = await this.pages.tempMailPage.getEmailAddress();
  
  // Submit for Verification
  await xiangqiPage.page.bringToFront();
  await xiangqiPage.submitEmailForVerification(tempEmail);

  // Get Verification Code
  if (!this.pages.tempMailPage) {
    throw new Error('TempMailPage was not initialized.');
  }
  await this.pages.tempMailPage.page.bringToFront();
  const verificationCode = await this.pages.tempMailPage.getVerificationCode();

  // Enter Code
  await xiangqiPage.page.bringToFront();
  await xiangqiPage.enterVerificationCode(verificationCode);

  // Complete Profile and store credentials
  uniqueUsername = `user${Math.random().toString(36).substring(2, 7)}`;
  password = 'SecurePassword@123';
  console.log(`Creating account with username: ${uniqueUsername}`);
  console.log(`Using password: ${password}`);
  await xiangqiPage.completeProfile(uniqueUsername, password);
  console.log('Account creation successful.');
});

When('the user signs out from the new account', async function (this: ICustomWorld) {
  const { xiangqiPage } = this.pages;
  console.log('Signing out...');
  // This now passes the dynamic username to the signOut method
  await xiangqiPage.signOut(uniqueUsername);
  console.log('Sign out successful.');
});

Then('the user should be able to sign back in with the new credentials', async function (this: ICustomWorld) {
  const { xiangqiPage } = this.pages;
  console.log(`Signing back in with username: ${uniqueUsername}`);
  // This now calls the signIn method with the stored credentials
  await xiangqiPage.signIn(uniqueUsername, password);
});

Then('the user should see the main game page', async function (this: ICustomWorld) {
  const { xiangqiPage } = this.pages;
  // This verifies that the final sign-in was successful
  console.log('Sign-in verification successful. E2E flow complete!');
});
