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
import { Browser, BrowserContext, chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Import page objects
import { XiangqiPage, TempMailPage } from '../page_objects/XiangqiPage';
import { SignInPage } from '../page_objects/SignInPage';
import { ProfilePage } from '../page_objects/ProfilePage';
import { SettingsPage } from '../page_objects/SettingsPage';

// Load environment variables from .env file
dotenv.config();

// Set a default timeout for all steps
setDefaultTimeout(60 * 1000); // 60 seconds
const authFile = 'auth/user.json';

// This hook runs ONCE before all tests
BeforeAll(async function () {
  console.log('--- Performing one-time login ---');

  if (!fs.existsSync('auth')) {
    fs.mkdirSync('auth');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  if (!username || !password) {
    throw new Error('USERNAME or PASSWORD environment variables are not set.');
  }

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const signInUrl = `${baseUrl}/account/signin?redirect=/`;

  console.log('Navigating to sign-in:', signInUrl);
  await page.goto(signInUrl, { waitUntil: 'networkidle' });

  // Use your SignInPage POM
  const signInPage = new SignInPage(page);
  await signInPage.emailInput().waitFor({ state: 'visible', timeout: 30000 });
  await signInPage.enterCredentials(username, password);
  await signInPage.clickSignInButton();

  // ✅ Wait for either lobby OR home page after login
  try {
    await page.waitForURL('**/lobby', { timeout: 15000 });
  } catch {
    console.log('Not redirected to /lobby, checking for home page...');
    await page.waitForURL('**/', { timeout: 15000 });
  }

  // Save authentication state
  await page.context().storageState({ path: authFile });
  console.log('--- Login successful, auth state saved ---');

  await browser.close();
});

// This hook runs ONCE after all tests are finished
AfterAll(async function () {
  console.log('--- All tests finished ---');
});

// Define a custom world context
export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  pages: {
    xiangqiPage: XiangqiPage;
    signInPage: SignInPage;
    profilePage: ProfilePage;
    settingsPage: SettingsPage;
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
    settingsPage: SettingsPage;
    tempMailPage?: TempMailPage;
  };

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

// This hook runs BEFORE EACH scenario
Before(async function (this: ICustomWorld) {
  this.browser = await chromium.launch({ headless: false, slowMo: 100 });
  this.context = await this.browser.newContext({ storageState: authFile });
  const page = await this.context.newPage();

  // Initialize all page objects
  this.pages = {
    xiangqiPage: new XiangqiPage(page),
    signInPage: new SignInPage(page),
    profilePage: new ProfilePage(page),
    settingsPage: new SettingsPage(page),
  };
});

// This hook runs AFTER EACH scenario
After(async function (this: ICustomWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});
