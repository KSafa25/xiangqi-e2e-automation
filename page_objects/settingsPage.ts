import { Page, Locator, expect } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Helper to escape strings for RegExp (from your original code)
  private escapeForRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Find a dropdown control by a label (from your original code)
  private async getDropdownByLabel(labelRegex: RegExp, nthFallback = 0): Promise<Locator> {
    const byLabel = this.page.locator('div').filter({ hasText: labelRegex }).locator('.react-select__control').first();
    try {
      await byLabel.waitFor({ state: 'visible', timeout: 2000 });
      return byLabel;
    } catch {
      return this.page.locator('.react-select__control').nth(nthFallback);
    }
  }

  // Click an option from the opened react-select list (from your original code)
  private async chooseOption(optionName: string) {
    const opt = this.page.getByRole('option', { name: optionName, exact: true });
    await opt.waitFor({ state: 'visible', timeout: 5000 });
    await opt.click();
  }

  // --- Locators for Navigation Tabs (NEW) ---
  private boardAndPiecesNav = () => this.page.getByRole('listitem').filter({ hasText: /Board & Pieces|棋盘和棋子|Bàn cờ & Quân cờ/ });
  private accountNav = () => this.page.getByRole('listitem').filter({ hasText: /Account|账户|Tài khoản/ });
  private notificationsNav = () => this.page.getByRole('listitem').filter({ hasText: /Notifications|通知|Thông báo/ });
  private subscriptionNav = () => this.page.getByRole('listitem').filter({ hasText: /Subscription|订阅|Đăng ký/ });
  private generalNav = () => this.page.getByRole('listitem').filter({ hasText: /General|通用|Chung/ });


  // --- Navigation (Kept your original function as requested) ---
  async navigateToSettings() {
    const settingsBtn = this.page.getByRole('button', { name: 'settingsSettings' });
    await settingsBtn.click();
    await expect(this.page).toHaveURL(/.*\/settings/);
  }

  // --- Navigation to Tabs (NEW) ---
  async navigateToTab(tabName: 'Board & Pieces' | 'Account' | 'Notifications' | 'Subscription' | 'General') {
    switch(tabName) {
      case 'Board & Pieces': await this.boardAndPiecesNav().click(); break;
      case 'Account': await this.accountNav().click(); break;
      case 'Notifications': await this.notificationsNav().click(); break;
      case 'Subscription': await this.subscriptionNav().click(); break;
      case 'General': await this.generalNav().click(); break;
    }
  }

   async toggleDarkTheme(enable: boolean) {
    const checkbox = this.page.locator('div').filter({ hasText: /^Dark Mode$/ }).getByRole('checkbox');
    if (enable) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

//   async changeRecentGames(option: string) {
//     await this.page.locator('.access-options-select .react-select__indicator').first().click();
//     await this.page.getByRole('option', { name: option }).click();
//   }

//   async changeChallengeOption(option: string) {
//     await this.page.locator('div:nth-child(8) .react-select__indicator').click();
//     await this.page.getByText(option, { exact: true }).click();
//   }

//   async changeRecentGames(option: string) {
//     // Locate the currently selected value in the dropdown
//     const currentValue = await this.page
//       .locator('.access-options-select .react-select__single-value')
//       .textContent();

//     if (currentValue?.trim() === option) {
//       console.log(`Recent Games is already set to "${option}". Skipping...`);
//       return;
//     }

//     console.log(`Changing Recent Games from "${currentValue}" to "${option}"`);
//     await this.page.locator('.access-options-select .react-select__indicator').first().click();
//     await this.page.getByRole('option', { name: option }).click();
//   }

//   async changeChallengeOption(option: string) {
//     // Locate the currently selected value in the dropdown
//     const currentValue = await this.page
//       .locator('div:nth-child(8) .react-select__single-value')
//       .textContent();

//     if (currentValue?.trim() === option) {
//       console.log(`Who can challenge me is already set to "${option}". Skipping...`);
//       return;
//     }

//     console.log(`Changing Who can challenge me from "${currentValue}" to "${option}"`);
//     await this.page.locator('div:nth-child(8) .react-select__indicator').click();
//     await this.page.getByText(option, { exact: true }).click();
//   }

  async changeRecentGames(option: string) {
    const container = this.page.locator('.access-options-select').first();
    const currentValue = await container.locator('.react-select__single-value').textContent();

    if (currentValue?.trim() === option) {
      console.log(`Recent Games is already set to "${option}". Skipping...`);
      return;
    }

    console.log(`Changing Recent Games from "${currentValue}" to "${option}"`);
    await container.locator('.react-select__indicator').click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async changeChallengeOption(option: string) {
    const container = this.page.locator('.access-options-select').nth(1); // second dropdown
    const currentValue = await container.locator('.react-select__single-value').textContent();

    if (currentValue?.trim() === option) {
      console.log(`Who can challenge me is already set to "${option}". Skipping...`);
      return;
    }

    console.log(`Changing Who can challenge me from "${currentValue}" to "${option}"`);
    await container.locator('.react-select__indicator').click();
    await this.page.getByText(option, { exact: true }).click();
  }



  async changePieceStyle(option: string) {
    await this.page.getByRole('main').locator('a').first().click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async saveChanges() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async saveChangesWithVietnamese() {
    await this.page.getByRole('button', { name: 'Lưu' }).click();
  }

  async verifySettingsUpdated() {
    await expect(this.page.locator('.toastr')).toBeVisible();
  }

  async openBoardAndPieces() {
    await this.page.getByRole('listitem').filter({ hasText: 'Board & Pieces' }).click();
  }

  async changeBoardStyle(option: string) {
    await this.page.locator('.react-select__indicator').click();
    await this.page.getByRole('option', { name: option }).locator('div').click();
  }

  async verifyToastAppears() {
    await expect(this.page.locator('.toastr')).toBeVisible();
  }

  async openAccount() {
    await this.page.getByRole('listitem').filter({ hasText: 'Account' }).click();
    await this.page.waitForTimeout(2000);
  }

//   async verifyAccountPage() {
//     await expect(this.page.getByText('Account')).toBeVisible();
//   }

  async openNotifications() {
    await this.page.getByRole('listitem').filter({ hasText: 'Notifications' }).click();
    await this.page.waitForTimeout(2000);
  }

//   async verifyNotificationsPage() {
//     await expect(this.page.getByText('Notifications')).toBeVisible();
//   }

  async openSubscription() {
    await this.page.getByRole('listitem').filter({ hasText: 'Subscription' }).click();
    await this.page.waitForTimeout(2000);
  }

//   async verifySubscriptionPage() {
//     await expect(this.page.getByText('Subscription')).toBeVisible();
//   }

  async openGeneral() {
    await this.page.getByRole('listitem').filter({ hasText: 'General' }).click();
  }

  async verifyGeneralPage() {
    await expect(this.page.getByText('General')).toBeVisible();
  }

//   async changeLanguage(option: string) {
//     await this.page.locator('.react-select__indicator').first().click();
//     await this.page.getByRole('option', { name: option }).locator('div').click();
//   }

//   async verifyLanguage(language: string) {
//     await expect(this.page.getByText(language)).toBeVisible();
//   }
//   // --- change language robustly ---
//   async changeLanguage(option: string) {
//     // Try to open the language select (we use the first visible indicator by default)
//     await this.page.locator('.react-select__indicator').first().click();
//     // select the option
//     await this.page.getByRole('option', { name: option }).locator('div').click();
//   }

//   // --- verify language robustly ---
//   async verifyLanguage(language: string) {
//     // Primary check: localized "Save" button text is usually a reliable indicator:
//     if (language === 'Tiếng Việt') {
//       const l = this.page.getByRole('button', { name: 'Lưu' });
//       if ((await l.count()) > 0) {
//         await expect(l.first()).toBeVisible({ timeout: 10000 });
//         return;
//       }
//       // fallback: check language select single-value
//     } else if (language === 'English') {
//       const s = this.page.getByRole('button', { name: 'Save' });
//       if ((await s.count()) > 0) {
//         await expect(s.first()).toBeVisible({ timeout: 10000 });
//         return;
//       }
//       // fallback: check language select single-value
//     }

//     // Final fallback: check the select's displayed value
//     // Find any .react-select__single-value that contains the language text
//     const sel = this.page.locator('.react-select__single-value').filter({ hasText: language });
//     if ((await sel.count()) > 0) {
//       await expect(sel.first()).toBeVisible({ timeout: 10000 });
//       return;
//     }

//     // If nothing matched, throw a helpful error
//     const html = await this.page.content();
//     throw new Error(
//       `verifyLanguage('${language}') failed — couldn't find localized Save button nor select value.\n` +
//       `Page snapshot length: ${html.length}. Consider saving a screenshot or dumping HTML for debugging.`
//     );
//   }

async changeLanguage(language: string) {
  // open language dropdown
  await this.page.locator('.react-select__indicator').first().click();
  await this.page.getByRole('option', { name: language }).locator('div').click();
}

async verifyLanguage(language: string) {
  if (language === 'Tiếng Việt') {
    // After saving Vietnamese, button should show "Lưu"
    await expect(this.page.getByRole('button', { name: 'Lưu' })).toBeVisible({ timeout: 10000 });
    return;
  }

  if (language === 'English') {
    // After switching back, first you click "Lưu", then UI reverts to "Save"
    // Wait for the Save button or the select to show English
    const saveBtn = this.page.getByRole('button', { name: 'Save' });
    const langSelect = this.page.locator('.react-select__single-value').filter({ hasText: 'English' });

    await Promise.race([
      saveBtn.waitFor({ state: 'visible', timeout: 10000 }),
      langSelect.first().waitFor({ state: 'visible', timeout: 10000 })
    ]);
    return;
  }

  throw new Error(`verifyLanguage: unsupported language ${language}`);
}
async saveChangesLocalized() {
  // Works whether button says "Save" or "Lưu"
  const btnLuu = this.page.getByRole('button', { name: 'Lưu' });
  if (await btnLuu.count()) {
    await btnLuu.click();
    await this.page.waitForTimeout(2000); // wait for UI to update
  } else {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(2000); // wait for UI to update
  }
  // wait for toast confirm
  //await expect(this.page.locator('.toastr')).toBeVisible({ timeout: 5000 });
}



}

