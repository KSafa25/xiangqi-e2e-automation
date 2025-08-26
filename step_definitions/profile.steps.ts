import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../hooks/hooks';
import { expect } from '@playwright/test';
import { BASE_URL } from '../config/globals';

let username = '';

Given('a user is logged into the system as {string}', async function (this: ICustomWorld, user: string) {
  username = user;
  const { signInPage } = this.pages;
  await signInPage.navigateToSignInPage();
  await signInPage.enterCredentials(user, 'Fox@1234');
  await signInPage.clickSignInButton();
  await expect(this.pages.signInPage.page.getByText(user)).toBeVisible({ timeout: 10000 });
});

When('the user navigates to their profile page', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await profilePage.navigateToProfile(username);
});

Then('the user\'s profile URL should contain {string}', async function (this: ICustomWorld, expectedUsername: string) {
  const { profilePage } = this.pages;
  await profilePage.verifyProfileUrl(expectedUsername);
});

Then('the user\'s profile header elements are visible', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await expect(profilePage.profileHeader(username)).toBeVisible();
});

Then('the country flag is visible', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await expect(profilePage.countryFlag).toBeVisible();
});

// The corrected step definition with escaped parentheses.
Then('the core profile information \\(Joined, Last Online, Friends) is visible', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await expect(profilePage.joinedText).toBeVisible();
  await expect(profilePage.lastOnlineText).toBeVisible();
  await expect(profilePage.friendsButton).toBeVisible();
});

Then('the user taps on the Friends button and navigates to the Friends page', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await profilePage.navigateToFriends();
});

Then('the user navigates back to the profile page', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await profilePage.page.goto(`${BASE_URL}/@${username}`);
  await profilePage.verifyProfileUrl(username);
});

When('the user edits their profile details', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await profilePage.editProfileButton.click();
});

Then('the user selects {string} as their country', async function (this: ICustomWorld, country: string) {
  const { profilePage } = this.pages;
  await profilePage.countryDropdown.click();
  await profilePage.page.getByRole('option', { name: country, exact: true }).locator('div').click();
});

Then('the user adds or updates their bio with {string}', async function (this: ICustomWorld, bioText: string) {
  const { profilePage } = this.pages;
  await profilePage.bioInput.fill(bioText);
});

Then('the user saves the changes to their profile', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await profilePage.saveChangesButton.click();
  await profilePage.page.waitForTimeout(2000);
});

When('the user updates the Recent Games visibility', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await expect(profilePage.recentGamesDropdown).toBeVisible();
});

Then('the user changes the Recent Games visibility to {string}', async function (this: ICustomWorld, visibility: string) {
  const { profilePage } = this.pages;
  await profilePage.updateRecentGamesVisibility(visibility);
});

When('the user navigates to Game History from the profile page', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await profilePage.navigateToMoreGames();
});

Then('the user can see more games on the Game History page', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await expect(profilePage.gameHistoryPageHeader).toBeVisible();
});

Then('the user resets all changes made to their profile', async function (this: ICustomWorld) {
  const { profilePage } = this.pages;
  await profilePage.resetProfile(username);
});
