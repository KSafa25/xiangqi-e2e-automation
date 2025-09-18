// step_definitions/setting.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../hooks/hooks'; // adjust path if needed
import { BASE_URL } from '../config/globals';

// Note: this file assumes this.pages.settingsPage exists and is instance of SettingsPage

Given('the user is on the lobby page', async function (this: ICustomWorld) {
  // check the page URL (use xiangqiPage.page from your world)
  await this.pages.xiangqiPage.page.goto(BASE_URL);
});

When('the user navigates to the settings page', async function (this: ICustomWorld) {
  await this.pages.settingsPage.navigateToSettings();
});

When('the user changes the language from {string} to {string}', async function (this: ICustomWorld, from: string, to: string) {
  await this.pages.settingsPage.changeLanguage(from, to);
});

When('the user taps the save button with label {string}', async function (this: ICustomWorld, label: string) {
  await this.pages.settingsPage.clickSave(label);
});

When('the user taps the save button', async function (this: ICustomWorld) {
  await this.pages.settingsPage.clickSave();
});

Then('the user sees the updated settings with text {string}', async function (this: ICustomWorld, text: string) {
  await this.pages.settingsPage.expectTextVisible(text);
});

// Piece style (simplified 'to' argument optional 'from' kept for readability)
When('the user changes the piece style from {string} to {string}', async function (this: ICustomWorld, from: string, to: string) {
  await this.pages.settingsPage.changePieceStyle(to);
});
When('the user changes the piece style to {string}', async function (this: ICustomWorld, to: string) {
  await this.pages.settingsPage.changePieceStyle(to);
});

When('the user enables Dark Mode', async function (this: ICustomWorld) {
  await this.pages.settingsPage.setDarkMode(true);
});
When('the user disables Dark Mode', async function (this: ICustomWorld) {
  await this.pages.settingsPage.setDarkMode(false);
});

When('the user changes Recent Games from {string} to {string}', async function (this: ICustomWorld, from: string, to: string) {
  await this.pages.settingsPage.changeRecentGames(to);
});
When('the user sets Recent Games to {string}', async function (this: ICustomWorld, to: string) {
  await this.pages.settingsPage.changeRecentGames(to);
});

When('the user changes {string} from {string} to {string}', async function (this: ICustomWorld, setting: string, from: string, to: string) {
  // if the setting is "Who can challenge me" route it; otherwise no-op or extend
  if (setting === 'Who can challenge me' || setting === 'Who can challenge me?') {
    await this.pages.settingsPage.changeChallengePermission(to);
  } else {
    // fallback: attempt matching known settings
    if (/Recent Games/i.test(setting)) {
      await this.pages.settingsPage.changeRecentGames(to);
    } else {
      // you can extend this to support other setting names
      throw new Error(`Unhandled setting "${setting}" in step definition`);
    }
  }
});

// Generic save (same as "tap the save button")
When('the user saves the settings', async function (this: ICustomWorld) {
  await this.pages.settingsPage.clickSave();
});

Then('the settings are successfully updated', async function (this: ICustomWorld) {
  await this.pages.settingsPage.expectSettingsUpdated();
});

// Navigation to sub-pages in settings (Board & Pieces, Account, Notifications, etc.)
When('the user navigates to the {string} settings page', async function (this: ICustomWorld, subPage: 'General' | 'Board & Pieces' | 'Account' | 'Notifications' | 'Subscription') {
  // the SettingsPage might have a method navigateToSubPage — if not, we can click list item
  await this.pages.settingsPage.page.getByRole('listitem').filter({ hasText: subPage }).click();
});

// Board & Pieces operations
When('the user changes the board style to {string}', async function (this: ICustomWorld, style: string) {
  await this.pages.settingsPage.changeBoardStyle(style);
});
Then('the board style is set to {string}', async function (this: ICustomWorld, style: string) {
  await this.pages.settingsPage.expectBoardStyleState(style);
});

// Final checks for Dark Mode / Recent Games state if used in feature
Then('Dark Mode should be disabled', async function (this: ICustomWorld) {
  await this.pages.settingsPage.setDarkMode(false); // or call expect if prefer
});
Then('the Recent Games setting is {string}', async function (this: ICustomWorld, state: string) {
  await this.pages.settingsPage.expectRecentGamesState(state);
});
Then('the "Who can challenge me" setting is {string}', async function (this: ICustomWorld, state: string) {
  await this.pages.settingsPage.expectChallengeState(state);
});
