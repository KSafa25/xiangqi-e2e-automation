import { Page, Locator, expect } from '@playwright/test';
import { BASE_URL } from '../config/globals';

/**
 * ProfilePage contains all the selectors and methods for interacting with the user profile page.
 */
export class ProfilePage {
  readonly page: Page;
  
  // Locators
  readonly usernameButton: (username: string) => Locator;
  readonly profileLink: Locator;
  readonly profileHeader: (username: string) => Locator;
  readonly countryFlag: Locator;
  readonly joinedText: Locator;
  readonly lastOnlineText: Locator;
  readonly friendsButton: Locator;
  readonly backButton: Locator;
  readonly editProfileButton: Locator;
  readonly countryDropdown: Locator;
  readonly bioInput: Locator;
  readonly saveChangesButton: Locator;
  readonly ratingsTabs: Locator;
  readonly ratingsHistoryDropdown: Locator;
  readonly currentRatingDisplay: Locator;
  readonly recentGamesDropdown: Locator;
  readonly moreGamesButton: Locator;
  readonly gameHistoryPageHeader: Locator;
  
  constructor(page: Page) {
    this.page = page;
    
    // Locators based on the provided codegen
    this.usernameButton = (username: string) => page.getByText(username).first();
    this.profileLink = page.getByRole('link', { name: 'profileProfile' });
    this.profileHeader = (username: string) => page.locator('#profile-header').getByText(username, { exact: true });
    this.countryFlag = page.getByRole('img', { name: 'Pakistan' }); // This locator will need to be dynamic
    this.joinedText = page.getByText('Joined:');
    this.lastOnlineText = page.getByText('Last Online:');
    this.friendsButton = page.getByRole('button', { name: 'Friends:' });
    this.backButton = page.getByRole('button', { name: 'back-icon' });
    this.editProfileButton = page.getByRole('link', { name: 'link-iconEdit Profile' });
    this.countryDropdown = page.locator('#edit-profile div').filter({ hasText: 'Pakistan' }).nth(1);
    this.bioInput = page.getByRole('textbox', { name: 'Bio' });
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
    this.ratingsTabs = page.locator('.flex.gap-4.my-4');
    this.ratingsHistoryDropdown = page.getByText('This Week');
    this.currentRatingDisplay = page.getByText('Current Rating');
    this.recentGamesDropdown = page.locator('div').filter({ hasText: /^Recent GamesPublic$/ }).locator('svg');
    this.moreGamesButton = page.getByRole('button', { name: 'More Games' });
    this.gameHistoryPageHeader = page.getByRole('heading', { name: 'Game History' });
  }
  
  /**
   * Navigates to the user's profile page from the main page.
   * @param username The username of the logged-in user.
   */
  async navigateToProfile(username: string) {
    await this.usernameButton(username).click();
    await this.profileLink.click();
  }

  /**
   * Verifies the URL and checks for the username in it.
   * @param username The username to verify in the URL.
   */
  async verifyProfileUrl(username: string) {
    const url = this.page.url();
    expect(url).toContain(`@${username.toLowerCase()}`);
  }

  /**
   * Verifies the visibility of core profile elements.
   * @param username The username to verify in the header.
   */
  async verifyCoreProfileElements(username: string) {
    await expect(this.profileHeader(username)).toBeVisible();
    await expect(this.countryFlag).toBeVisible();
    await expect(this.joinedText).toBeVisible();
    await expect(this.lastOnlineText).toBeVisible();
    await expect(this.friendsButton).toBeVisible();
  }

  /**
   * Navigates to the friends page.
   */
  async navigateToFriends() {
    await this.friendsButton.click();
    await expect(this.page).toHaveURL(/.*\/friends$/);
  }

  /**
   * Edits the user's profile details.
   * @param newCountry The new country to select.
   * @param newBio The new bio text.
   */
  async editProfile(newCountry: string, newBio: string) {
    // The previous error was a timeout on this button.
    // The correct URL path should fix this.
    await this.editProfileButton.click();
    await this.countryDropdown.click();
    await this.page.getByRole('option', { name: newCountry, exact: true }).locator('div').click();
    await this.bioInput.fill(newBio);
    await this.saveChangesButton.click();
    await this.page.waitForTimeout(2000); // Wait for save operation
  }

  /**
   * Verifies the statistics and history for a given rating type.
   * @param ratingType The type of rating (e.g., "Bullet", "Rapid").
   * @param timePeriod The time period to select (e.g., "3 Months").
   */
  async verifyRatingStatistics(ratingType: string, timePeriod: string) {
    await this.ratingsTabs.getByText(ratingType).click();
    await expect(this.page.getByRole('heading', { name: 'Game Statistics' })).toBeVisible();
    await this.ratingsHistoryDropdown.click();
    await this.page.getByText(timePeriod, { exact: true }).click();
    await expect(this.currentRatingDisplay).toBeVisible();
  }

  /**
   * Updates the visibility of recent games.
   * @param visibility The new visibility setting ("Public" or "Private").
   */
  async updateRecentGamesVisibility(visibility: string) {
    await this.recentGamesDropdown.click();
    await this.page.getByText(visibility, { exact: true }).click();
  }
  
  /**
   * Navigates to the game history page from the profile page.
   */
  async navigateToMoreGames() {
    await this.moreGamesButton.click();
    await expect(this.gameHistoryPageHeader).toBeVisible();
  }

  /**
   * Resets the profile settings back to their original state.
   * This method performs the teardown for the profile test case.
   */
  async resetProfile(username: string) {
    // Navigate back to the profile page if not already there
    await this.page.goto(`${BASE_URL}/@${username}`);

    // Step 1: Go to edit profile
    await this.editProfileButton.click();
    
    // Step 2: Change the country from Oman to Pakistan
    await this.page.locator('.react-select__input-container').click();
    await this.page.getByText('Pakistan', { exact: true }).click();

    // Step 3 & 4: Erase the bio and save changes
    await this.bioInput.fill('');
    await this.saveChangesButton.click();
    
    // Step 5: From recent game dropdown select public
    await this.page.locator('div').filter({ hasText: /^Private$/ }).nth(2).click();
    await this.page.getByText('Public', { exact: true }).click();
  }
  
  /**
   * Resets the profile settings back to their original state.
   * This method performs the teardown for the profile test case.
   */
//   async resetProfile(username: string) {
//     // Navigate back to the profile page if not already there
//     await this.page.goto(`${BASE_URL}/@${username}`);
    
//     // Step 1: Reset country and bio
//     await this.editProfileButton.click();
//     await this.countryDropdown.click();
//     await this.page.getByRole('option', { name: 'Pakistan', exact: true }).locator('div').click();
//     await this.bioInput.fill(''); // Erase the bio
//     await this.saveChangesButton.click();

//     // Step 2: Reset Recent Games visibility
//     await this.page.reload(); // Reload the page to ensure fresh state
//     await this.recentGamesDropdown.click();
//     await this.page.getByText('Public', { exact: true }).click();
//   }
}
