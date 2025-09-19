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
import { loginAndSave } from '../scripts/setup-auth';

// Page objects
import { XiangqiPage, TempMailPage } from '../page_objects/XiangqiPage';
import { SignInPage } from '../page_objects/SignInPage';
import { GameplayPage } from '../page_objects/GamePlayPage';
import { ProfilePage } from '../page_objects/ProfilePage';
import { SettingsPage } from '../page_objects/settingsPage';
import { GameHistoryPage } from '../page_objects/GameHistoryPage';
import { PuzzlePage } from '../page_objects/PuzzlePage';

// Load environment variables
dotenv.config();

// Default step timeout
setDefaultTimeout(60 * 1000);

const player1AuthFile = 'auth/user.json';
const player2AuthFile = 'auth/auth-player2.json';

BeforeAll(async () => {
  console.log('--- Performing one-time logins ---');

  const usernameA = process.env.USERNAME;
  const passwordA = process.env.PASSWORD;
  const usernameB = process.env.PLAYER2_USERNAME;
  const passwordB = process.env.PLAYER2_PASSWORD;

  if (!usernameA || !passwordA || !usernameB || !passwordB)
    throw new Error('Missing USERNAME/PASSWORD or PLAYER2_USERNAME/PLAYER2_PASSWORD in .env');

  await loginAndSave(usernameA, passwordA, 'user.json');
  await loginAndSave(usernameB, passwordB, 'auth-player2.json');

  console.log('--- One-time logins successful ---');
});

AfterAll(async () => {
  console.log('--- All tests finished ---');
});

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
    GamePlayPage: GameplayPage;
    player1Page?: Page;
    player2Page?: Page;
    gameHistoryPage: GameHistoryPage,
    puzzlePage: PuzzlePage,
  };
  contexts?: {
    player1Context?: BrowserContext;
    player2Context?: BrowserContext;
  };
  gameplay1?: GameplayPage;
  gameplay2?: GameplayPage;
}

class CustomWorld extends World implements ICustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  pages!: {
    xiangqiPage: XiangqiPage;
    signInPage: SignInPage;
    profilePage: ProfilePage;
    settingsPage: SettingsPage;
    GamePlayPage: GameplayPage;
    tempMailPage?: TempMailPage;
    player1Page?: Page;
    player2Page?: Page;
    gameHistoryPage: GameHistoryPage,
    puzzlePage: PuzzlePage,
  };

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

Before(async function (this: ICustomWorld, scenario) {
  const usePreLogin = scenario.pickle.tags.some(tag => tag.name === '@prelogin');

  this.browser = await chromium.launch({ headless: false, slowMo: 500 });

  if (usePreLogin) {
    this.context = await this.browser.newContext({ storageState: player1AuthFile });
    console.log(`Scenario "${scenario.pickle.name}" using pre-login state.`);
  } else {
    this.context = await this.browser.newContext();
    console.log(`Scenario "${scenario.pickle.name}" starting fresh.`);
  }
  this.page = await this.context.newPage();
  this.pages = {
    xiangqiPage: new XiangqiPage(this.page),
    signInPage: new SignInPage(this.page),
    profilePage: new ProfilePage(this.page),
    settingsPage: new SettingsPage(this.page),
    GamePlayPage: new GameplayPage(this.page),
    gameHistoryPage: new GameHistoryPage(this.page),
    puzzlePage: new PuzzlePage(this.page),
  };
});

After(async function (this: ICustomWorld) {
  if (this.browser) await this.browser.close();
});
