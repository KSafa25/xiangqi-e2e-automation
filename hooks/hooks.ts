import { Before, After, IWorldOptions, World, setWorldConstructor, setDefaultTimeout, ITestCaseHookParameter } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { XiangqiPage, TempMailPage } from '../page_objects/XiangqiPage';
import { SignInPage } from '../page_objects/SignInPage';
import { ProfilePage } from '../page_objects/ProfilePage';

// Set a default timeout for all steps
setDefaultTimeout(60 * 1000); // 60 seconds

// Define a custom world context to hold our page objects and Playwright instances.
export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
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
  page!: Page;
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

// Before hook: Runs for ALL scenarios. It sets up the browser, page, and page objects.
Before(async function (this: ICustomWorld, scenario: ITestCaseHookParameter) {
  this.browser = await chromium.launch({
    headless: false,
    slowMo: 500, // Slows down Playwright operations by 500ms for observation
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  // Initialize all page objects
  this.pages = {
    xiangqiPage: new XiangqiPage(this.page),
    signInPage: new SignInPage(this.page),
    profilePage: new ProfilePage(this.page, 'e2euser'),
  };

  // Check if the current scenario has the @profile tag to handle the precondition
  if (scenario.pickle.tags.some(tag => tag.name === '@profile')) {
    console.log('Running scenario with @profile tag. Logging in user...');
    // Login logic as a precondition
    await this.pages.signInPage.navigateToSignInPage();
    await this.pages.signInPage.signIn('e2euser', 'e2euser123');
    await this.page.waitForSelector('text=e2euser', { timeout: 10000 });
  }
});

// After hook: Runs after each scenario to clean up.
After(async function (this: ICustomWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});