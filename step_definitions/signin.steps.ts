import { Given, When, Then } from '@cucumber/cucumber';
import { SignInPage } from '../page_objects/SignInPage';
import { ICustomWorld } from '../hooks/hooks';

Given('I am on the sign in page', async function (this: ICustomWorld) {
  const { signInPage } = this.pages;
  await signInPage.navigateToSignInPage();
});

When('I enter my email and password', async function (this: ICustomWorld) {
  const { signInPage } = this.pages;
  const email = 'e2euser'; // valid username
  const password = 'Fox@1234'; // valid password
  await signInPage.enterCredentials(email, password);
});

When('I enter my email and an incorrect password', async function (this: ICustomWorld) {
  const { signInPage } = this.pages;
  const email = 'e2euser';
  const password = 'WrongPassword';
  await signInPage.enterCredentials(email, password);
});

When('I re-enter my email and correct password', async function (this: ICustomWorld) {
  const { signInPage } = this.pages;
  const email = 'e2euser';
  const password = 'Fox@1234';
  await signInPage.enterCredentials(email, password);
});

When('I click the sign in button', async function (this: ICustomWorld) {
  const { signInPage } = this.pages;
  await signInPage.clickSignInButton();
});

Then('I should be logged in and redirected to the lobby', async function (this: ICustomWorld) {
  const { signInPage } = this.pages;
  await signInPage.verifyLoginRedirectToLobby();
});

Then(
  'I should see an error message with title {string} and content {string}',
  async function (this: ICustomWorld, title: string, content: string) {
    const { signInPage } = this.pages;
    await signInPage.verifyErrorMessage(title, content);
  }
);
Then('I retry with correct password if invalid password toast appears', async function (this: ICustomWorld) {
  const { signInPage } = this.pages;
  const email = 'e2euser';
  const correctPassword = 'Fox@1234';
  const expectedError = 'Invalid password';

  await signInPage.retryLoginIfInvalidPassword(email, correctPassword, expectedError);
});
