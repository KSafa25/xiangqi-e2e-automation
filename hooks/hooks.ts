import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  IWorldOptions,
  World,
  setWorldConstructor,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Import page objects
import { XiangqiPage, TempMailPage } from '../page_objects/XiangqiPage';
import { SignInPage } from '../page_objects/SignInPage';
import { ProfilePage } from '../page_objects/ProfilePage';
import { SettingsPage } from '../page_objects/settingsPage';

// Load environment variables
dotenv.config();

// Default step timeout
setDefaultTimeout(60 * 1000); // 60 seconds
const authFile = 'auth/user.json';

// One-time login hook
BeforeAll(async () => {
  console.log('--- Performing one-time login ---');

  if (!fs.existsSync('auth')) fs.mkdirSync('auth');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  if (!username || !password) throw new Error('USERNAME or PASSWORD not set in .env');

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const signInUrl = `${baseUrl}/account/signin?redirect=/`;

  console.log('Navigating to sign-in:', signInUrl);
  await page.goto(signInUrl, { waitUntil: 'networkidle' });

  const signInPage = new SignInPage(page);
  await signInPage.emailInput().waitFor({ state: 'visible', timeout: 30000 });
  await signInPage.enterCredentials(username, password);
  await signInPage.clickSignInButton();

  try {
    await page.waitForURL('**/lobby', { timeout: 15000 });
  } catch {
    console.log('Not redirected to /lobby, checking home page...');
    await page.waitForURL('**/', { timeout: 15000 });
  }

  await page.context().storageState({ path: authFile });
  console.log('--- One-time login successful ---');

  await browser.close();
});

// After all tests
AfterAll(async () => {
  console.log('--- All tests finished ---');
});

// Custom world interface
export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  pages: {
    xiangqiPage: XiangqiPage;
    signInPage: SignInPage;
    profilePage: ProfilePage;
    settingsPage: SettingsPage;
    tempMailPage?: TempMailPage;
  };
}

// Custom world implementation
class CustomWorld extends World implements ICustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  pages!: {
    xiangqiPage: XiangqiPage;
    signInPage: SignInPage;
    profilePage: ProfilePage;
    settingsPage: SettingsPage;
    tempMailPage?: TempMailPage;
  };

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

// Before each scenario: conditional pre-login
Before(async function (this: ICustomWorld, scenario) {
  const usePreLogin = scenario.pickle.tags.some(tag => tag.name === '@prelogin');

  this.browser = await chromium.launch({ headless: false, slowMo: 100 });

  if (usePreLogin) {
    // Pre-logged-in context
    this.context = await this.browser.newContext({ storageState: authFile });
    console.log(`Scenario "${scenario.pickle.name}" using pre-login state.`);
  } else {
    // Fresh context for signup/login/profile scenarios
    this.context = await this.browser.newContext();
    console.log(`Scenario "${scenario.pickle.name}" starting fresh.`);
  }

  this.page = await this.context.newPage();

  // Initialize page objects
  this.pages = {
    xiangqiPage: new XiangqiPage(this.page),
    signInPage: new SignInPage(this.page),
    profilePage: new ProfilePage(this.page),
    settingsPage: new SettingsPage(this.page),
  };
});

// After each scenario
After(async function (this: ICustomWorld) {
  if (this.browser) await this.browser.close();
});
