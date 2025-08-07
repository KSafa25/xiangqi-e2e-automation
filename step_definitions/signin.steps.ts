import { Given, When, Then } from '@cucumber/cucumber';
import { SignInPage } from '../page_objects/SignInPage';
import { CustomWorld } from '../hooks/hooks';

Given('I am on the sign in page', async function (this: CustomWorld) {
  const signInPage = new SignInPage(this.page);
  await signInPage.navigateToSignInPage();
});

When('I enter my email and password', async function (this: CustomWorld) {
  const signInPage = new SignInPage(this.page);
  const email = 'Ksafa'; // valid username
  const password = 'Fox@1234'; // valid password
  await signInPage.enterCredentials(email, password);
});

When('I enter my email and an incorrect password', async function (this: CustomWorld) {
  const signInPage = new SignInPage(this.page);
  const email = 'Ksafa';
  const password = 'WrongPassword';
  await signInPage.enterCredentials(email, password);
});

When('I re-enter my email and correct password', async function (this: CustomWorld) {
  const signInPage = new SignInPage(this.page);
  const email = 'Ksafa';
  const password = 'Fox@1234';
  await signInPage.enterCredentials(email, password);
});

When('I click the sign in button', async function (this: CustomWorld) {
  const signInPage = new SignInPage(this.page);
  await signInPage.clickSignInButton();
});

Then('I should be logged in and redirected to the lobby', async function (this: CustomWorld) {
  const signInPage = new SignInPage(this.page);
  await signInPage.verifyLoginRedirectToLobby();
});

Then(
  'I should see an error message with title {string} and content {string}',
  async function (this: CustomWorld, title: string, content: string) {
    const signInPage = new SignInPage(this.page);
    await signInPage.verifyErrorMessage(title, content);
  }
);
Then('I retry with correct password if invalid password toast appears', async function (this: CustomWorld) {
  const signInPage = new SignInPage(this.page);
  const email = 'Ksafa';
  const correctPassword = 'Fox@1234';
  const expectedError = 'Invalid password';

  await signInPage.retryLoginIfInvalidPassword(email, correctPassword, expectedError);
});
