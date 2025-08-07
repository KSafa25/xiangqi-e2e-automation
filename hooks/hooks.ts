import { chromium, Browser, Page } from 'playwright';
import { Before, After, World, setDefaultTimeout } from '@cucumber/cucumber'; // Import setDefaultTimeout

// Set a global timeout for all steps (e.g., 60 seconds)
setDefaultTimeout(60 * 1000); // 60 seconds

export interface CustomWorld extends World {
  browser: Browser;
  page: Page;
}

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: false, channel: 'chrome' });
  this.page = await this.browser.newPage();
});

After(async function (this: CustomWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});