import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../hooks/hooks'; // Adjust path if needed
import { expect } from '@playwright/test';
import { BASE_URL } from '../config/globals';

Given('the user is on the lobby page', async function (this: ICustomWorld) {
  // check the page URL (use xiangqiPage.page from your world)
  await this.pages.xiangqiPage.page.goto(BASE_URL);
});

When('the user navigates to the settings page', async function (this: ICustomWorld) {
  await this.pages.settingsPage.navigateToSettings();
});

Then('the user toggles on the dark theme', async function () {
  await this.pages.settingsPage.toggleDarkTheme(true);
});

Then('the user changes the recent games from public to private', async function () {
  await this.pages.settingsPage.changeRecentGames("Private");
});

Then('the user changes who can challenge me to friends only', async function () {
  await this.pages.settingsPage.changeChallengeOption("Friends Only");
});

Then('the user changes the piece style from traditional to english', async function () {
  await this.pages.settingsPage.changePieceStyle("English");
});

Then('the user hits the save button', async function () {
  await this.pages.settingsPage.saveChanges();
});

Then('the settings are updated accordingly', async function () {
  await this.pages.settingsPage.verifySettingsUpdated();
});

When('the user navigates to board and pieces settings', async function () {
  await this.pages.settingsPage.openBoardAndPieces();
});

Then('the user changes the board style from wooden to simple', async function () {
  await this.pages.settingsPage.changeBoardStyle("Simple");
});

Then('the user hits the save button for board', async function () {
  await this.pages.settingsPage.saveChanges();
});

Then('a toast message should appear and the board settings are applied', async function () {
  await this.pages.settingsPage.verifyToastAppears();
});

When('the user navigates to the account settings', async function () {
  await this.pages.settingsPage.openAccount();
});

Then('the account page appears', async function () {
  await this.pages.settingsPage.verifyAccountPage();
});

When('the user navigates to notifications settings', async function () {
  await this.pages.settingsPage.openNotifications();
});

Then('the notifications page appears', async function () {
  await this.pages.settingsPage.verifyNotificationsPage();
});

When('the user navigates to subscription settings', async function () {
  await this.pages.settingsPage.openSubscription();
});

Then('the subscription page appears', async function () {
  await this.pages.settingsPage.verifySubscriptionPage();
});

When('the user navigates to general settings', async function () {
  await this.pages.settingsPage.openGeneral();
});

Then('the general page appears', async function () {
  await this.pages.settingsPage.verifyGeneralPage();
});

Then('the user toggles off the dark theme', async function () {
  await this.pages.settingsPage.toggleDarkTheme(false);
});

Then('the user changes the recent games from private to public', async function () {
  await this.pages.settingsPage.changeRecentGames("Public");
});

Then('the user changes who can challenge me to any user', async function () {
  await this.pages.settingsPage.changeChallengeOption("All Users");
});

Then('the settings are saved successfully', async function () {
  await this.pages.settingsPage.verifyToastAppears();
});

// When('the user changes the language to Tiếng Việt', async function () {
//   await this.pages.settingsPage.changeLanguage("Tiếng Việt");
// });

// Then('the language is set to Tiếng Việt', async function () {
//   await this.pages.settingsPage.verifyLanguage("Tiếng Việt");
// });

// When('the user changes the language back to English', async function () {
//   await this.pages.settingsPage.changeLanguage("English");
// });

// Then('the user taps on Lưu to save changes', async function () {
//   await this.pages.settingsPage.saveChangesWithVietnamese();
// });

// Then('the language is set back to English', async function () {
//   await this.pages.settingsPage.verifyLanguage("English");
// });

When('the user changes the language to Tiếng Việt', async function () {
  await this.pages.settingsPage.changeLanguage('Tiếng Việt');
});

When('the user taps on save button', async function () {
  await this.pages.settingsPage.saveChangesLocalized();
});

Then('the language is set to Tiếng Việt', async function () {
  await this.pages.settingsPage.verifyLanguage('Tiếng Việt');
});

When('the user changes the language back to English', async function () {
  await this.pages.settingsPage.changeLanguage('English');
});

When('the user taps on Lưu to save changes', async function () {
  await this.pages.settingsPage.saveChangesLocalized();
});

Then('the language is set back to English', async function () {
  await this.pages.settingsPage.verifyLanguage('English');
});
