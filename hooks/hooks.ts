import { Before, After, IWorldOptions, World, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { XiangqiPage, TempMailPage } from '../page_objects/XiangqiPage';
import { SignInPage } from '../page_objects/SignInPage'; // Adjust path if needed

// Set a default timeout for all steps
setDefaultTimeout(60 * 1000); // 60 seconds

// Define a custom world context. tempMailPage is optional because it's created dynamically.
export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  pages: {
    xiangqiPage: XiangqiPage;
    signInPage: SignInPage;
    tempMailPage?: TempMailPage; // Optional: will be created during the signup test run
  };
}

class CustomWorld extends World implements ICustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  pages!: {
    xiangqiPage: XiangqiPage;
    signInPage: SignInPage;
    tempMailPage?: TempMailPage;
  };

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

// General Before hook: Runs for ALL scenarios.
// It sets up a single page and the page objects that use it.
Before(async function (this: ICustomWorld) {
  this.browser = await chromium.launch({
    headless: false,
    slowMo: 500, // Slows down Playwright operations by 500ms for observation
  });
  this.context = await this.browser.newContext();
  const page = await this.context.newPage();
  this.pages = {
    xiangqiPage: new XiangqiPage(page),
    signInPage: new SignInPage(page),
  };
});

// NOTE: The tag-specific Before hook for @signup has been removed.

// After hook: Runs after each scenario to clean up.
After(async function (this: ICustomWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});
