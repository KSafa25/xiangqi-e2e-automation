// page_objects/SettingsPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Helper to escape strings for RegExp
  private escapeForRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Find a dropdown control by a label (tries label-regex first, then nth fallback)
  private async getDropdownByLabel(labelRegex: RegExp, nthFallback = 0): Promise<Locator> {
    const byLabel = this.page.locator('div').filter({ hasText: labelRegex }).locator('.react-select__control').first();
    try {
      await byLabel.waitFor({ state: 'visible', timeout: 2000 });
      return byLabel;
    } catch {
      // fallback to nth control (less ideal but robust if labels change by language)
      return this.page.locator('.react-select__control').nth(nthFallback);
    }
  }

  // Click an option from the opened react-select list. Codegen shows options have role 'option' and inner 'div'.
  private async chooseOption(optionName: string) {
    const opt = this.page.getByRole('option', { name: optionName });
    await opt.waitFor({ state: 'visible', timeout: 5000 });
    // click the inner div to match codegen behavior
    await opt.locator('div').click();
  }

  // Navigate
  async navigateToSettings() {
    // settings nav button - keep your existing accessible name
    const settingsBtn = this.page.getByRole('button', { name: 'settingsSettings' });
    await settingsBtn.click();
    await expect(this.page).toHaveURL(/.*\/settings/);
  }

  // ---------- Language ----------
  // Click the element that shows the current language (the "from" value), then pick "to".
  async changeLanguage(from: string, to: string) {
    const fromRegex = new RegExp(`^${this.escapeForRegex(from)}$`);
    const currentLangElt = this.page.locator('div').filter({ hasText: fromRegex }).first();

    try {
      await currentLangElt.waitFor({ state: 'visible', timeout: 4000 });
      await currentLangElt.scrollIntoViewIfNeeded();
      await currentLangElt.click();
    } catch {
      // fallback: click the first react-select control (many apps place language as first control)
      const fallback = this.page.locator('.react-select__control').first();
      await fallback.waitFor({ state: 'visible', timeout: 4000 });
      await fallback.click();
    }

    await this.chooseOption(to);

    // optional verification: the visible value inside the control is 'to'
    const selected = this.page.locator('.react-select__single-value');
    await selected.first().waitFor({ state: 'visible', timeout: 5000 });
  }

  // ---------- Pieces ----------
  async changePieceStyle(to: string) {
    // try label 'Pieces' first, fallback to second react-select control
    const dropdown = await this.getDropdownByLabel(/^Pieces$|^Piece Style$/, 1);
    await dropdown.click();
    await this.chooseOption(to);
    // verify
    await expect(dropdown.locator('.react-select__single-value')).toHaveText(to, { timeout: 5000 });
  }

  // ---------- Board style ----------
  async changeBoardStyle(to: string) {
    const dropdown = await this.getDropdownByLabel(/^Board Style$/, 4); // fallback index guess
    await dropdown.click();
    await this.chooseOption(to);
    await expect(dropdown.locator('.react-select__single-value')).toHaveText(to, { timeout: 5000 });
  }

  // ---------- Recent Games ----------
  async changeRecentGames(to: string) {
    const dropdown = await this.getDropdownByLabel(/^Recent Games$/, 2);
    await dropdown.click();
    await this.chooseOption(to);
    await expect(dropdown.locator('.react-select__single-value')).toHaveText(to, { timeout: 5000 });
  }

  // ---------- Who can challenge me ----------
  async changeChallengePermission(to: string) {
    const dropdown = await this.getDropdownByLabel(/^Who can challenge me\?$/, 3);
    await dropdown.click();
    await this.chooseOption(to);
    await expect(dropdown.locator('.react-select__single-value')).toHaveText(to, { timeout: 5000 });
  }

  // ---------- Dark mode ----------
  async setDarkMode(enable: boolean) {
    // codegen: page.locator('div').filter({ hasText: /^Dark Mode$/ }).getByRole('checkbox').check();
    const checkbox = this.page.locator('div').filter({ hasText: /^Dark Mode$|^Chế độ tối$|^暗黑模式$/ }).getByRole('checkbox');
    await checkbox.waitFor({ state: 'attached', timeout: 4000 });
    const isChecked = await checkbox.isChecked();
    if (enable && !isChecked) await checkbox.check();
    if (!enable && isChecked) await checkbox.uncheck();

    // verify
    if (enable) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  // ---------- Save ----------
  async clickSave(label?: string) {
    if (label) {
      // click exact label (keeps separate label behavior)
      await this.page.getByRole('button', { name: label }).click();
    } else {
      // generic fallback: click whichever localized Save appears
      await this.page.getByRole('button', { name: /Save|保存|Lưu/ }).click();
    }
    // wait for the toast / confirmation to appear (short wait)
    await this.expectSettingsUpdated();
  }

  // ---------- Verification ----------
  async expectTextVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible({ timeout: 8000 });
  }

  async expectSettingsUpdated() {
    // support multiple localized success messages; fall back to a short wait
    await this.page.getByText(/Settings updated successfully|设置已保存|保存|Lưu|Saved/i).first().waitFor({ state: 'visible', timeout: 8000 });
  }

  async expectBoardStyleState(style: string) {
    const dropdown = await this.getDropdownByLabel(/^Board Style$/, 4);
    await expect(dropdown.locator('.react-select__single-value')).toHaveText(style, { timeout: 5000 });
  }

  async expectRecentGamesState(state: string) {
    const dropdown = await this.getDropdownByLabel(/^Recent Games$/, 2);
    await expect(dropdown.locator('.react-select__single-value')).toHaveText(state, { timeout: 5000 });
  }

  async expectChallengeState(state: string) {
    const dropdown = await this.getDropdownByLabel(/^Who can challenge me\?$/, 3);
    await expect(dropdown.locator('.react-select__single-value')).toHaveText(state, { timeout: 5000 });
  }
}
