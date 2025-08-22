import { Page, expect } from '@playwright/test';

export class ProfilePage {
  constructor(private page: Page, private username: string) {}

  public async navigateToProfile() {
    await this.page.getByText(this.username).click();
    await this.page.getByRole('link', { name: 'profileProfile' }).click();
  }

  public async verifyProfileUrl() {
    await this.page.waitForURL(`**/user/${this.username}`);
    expect(this.page.url()).toContain(`user/${this.username}`);
  }

  public async verifyProfileElements() {
    await this.page.locator('#profile-header').getByText(this.username).click();
    await this.page.getByRole('img', { name: 'Pakistan' }).click();
    await this.page.getByText('Joined:').click();
    await this.page.getByText('Last Online:').click();
    await this.page.getByRole('button', { name: 'Friends:' }).click();
    // Assuming a test framework that handles going back or reset state.
  }

  public async editProfile() {
    await this.page.getByRole('link', { name: 'link-iconEdit Profile' }).click();
    await this.page.locator('#edit-profile div').filter({ hasText: 'Pakistan' }).nth(1).click();
    await this.page.getByRole('option', { name: 'Oman', exact: true }).locator('div').click();
    await this.page.getByRole('textbox', { name: 'Bio' }).click();
    await this.page.getByRole('textbox', { name: 'Bio' }).fill('this is the automation test account!');
    await this.page.getByRole('button', { name: 'Save Changes' }).click();
    await this.page.waitForSelector('.toastr', { state: 'visible' }); // Wait for the toast message
  }

  public async verifyRatingsAndStatistics() {
    await this.page.getByText('Ratings').click();
    await this.verifyRatingStats('Bullet', '271'); // Placeholder rating
    await this.page.goBack();
    
    await this.verifyRatingStats('Rapid', '271'); // Placeholder rating
    await this.page.goBack();

    await this.verifyRatingStats('Puzzle', '271'); // Placeholder rating
    await this.page.goBack();

    await this.verifyRatingStats('Daily', '271'); // Placeholder rating
    await this.page.goBack();

    // Helper function
    async function verifyRatingStats(ratingType: string, expectedRating: string) {
      await this.page.getByText(`${ratingType} Rating`).click();
      await expect(this.page.getByText('Game Statistics')).toBeVisible();
      await this.page.locator('.react-select__indicator').first().click();
      await this.page.getByText('3 Months', { exact: true }).click();
      await expect(this.page.getByText(`${expectedRating} Current Rating`)).toBeVisible();
    }
  }

  public async verifyRecentGames() {
    await this.page.getByText('Recent GamesPublic').click();
    await this.page.locator('div').filter({ hasText: /^Recent GamesPublic$/ }).locator('svg').click();
    await this.page.getByText('Private', { exact: true }).click();
    await this.page.getByRole('button', { name: 'More Games' }).click();
    await expect(this.page.url()).toContain('/games/history');
    await this.page.goBack();
  }
}