import { Before, After, IWorldOptions, World, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { XiangqiPage, TempMailPage } from '../page_objects/XiangqiPage';
import { SignInPage } from '../page_objects/SignInPage';
import { ProfilePage } from '../page_objects/ProfilePage';

// Set a default timeout for all steps
setDefaultTimeout(60 * 1000); // 60 seconds

// Define a custom world context.
export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  pages: {
    xiangqiPage: XiangqiPage;
    signInPage: SignInPage;
    profilePage: ProfilePage;
    tempMailPage?: TempMailPage;
  };
}

class CustomWorld extends World implements ICustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  pages!: {
    xiangqiPage: XiangqiPage;
    signInPage: SignInPage;
    profilePage: ProfilePage;
    tempMailPage?: TempMailPage;
  };

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

// General Before hook: Runs for ALL scenarios.
Before(async function (this: ICustomWorld) {
  this.browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });
  this.context = await this.browser.newContext();
  const page = await this.context.newPage();
  this.pages = {
    xiangqiPage: new XiangqiPage(page),
    signInPage: new SignInPage(page),
    profilePage: new ProfilePage(page),
  };
});

// After hook: Runs after each scenario to clean up.
After(async function (this: ICustomWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});
