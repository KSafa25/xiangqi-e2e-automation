import { Given, When, Then } from '@cucumber/cucumber';
import { Page, expect } from '@playwright/test';
import { ProfilePage } from '../page_objects/ProfilePage';
import { ICustomWorld } from '../hooks/hooks';

let profilePage: ProfilePage;
let username: string;

Given('I am signed into the system', async function () {
  // This step assumes a prior login test has run, or a mock session is created.
  // We'll simulate this by setting a dummy username for this test.
  username = 'e2euser';
  profilePage = new ProfilePage(page, username);
});

When('I navigate to the user profile page', async function () {
  await profilePage.navigateToProfile();
  await profilePage.verifyProfileUrl();
  await profilePage.verifyProfileElements();
});

When('I edit my profile information', async function () {
  await profilePage.editProfile();
});

When('I verify my game statistics', async function () {
  await profilePage.verifyRatingsAndStatistics();
});

When('I verify the recent games section', async function () {
  await profilePage.verifyRecentGames();
});

Then('I should be able to navigate back to the profile page', async function () {
  // This step is covered in the previous steps where a back button is hit.
  // We can add a final assertion to confirm we are back on the profile page.
  await expect(page.url()).toContain(username);
});