import { BASE_URL } from '../config/globals';
import { chromium } from '@playwright/test';

async function loginAndSave(username: string, password: string, file: string) {
  const browser = await chromium.launch({ headless: false, slowMo: 50 }); // set headless: true in CI
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/account/signin?redirect=/`, {
      waitUntil: 'domcontentloaded', 
      timeout: 120_000, // allow more time in slow env
    });

    await page.getByRole('textbox', { name: 'Email or Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    await page.waitForSelector('.welcome-head', { timeout: 60_000 });
    await context.storageState({ path: file });
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
}

(async () => {
  await loginAndSave('e2euser', 'Fox@1234', 'auth-player1.json');
  await loginAndSave('Mahdeed03', 'Pakistan@05', 'auth-player2.json');
})();

//runs using the following command: 
//npx ts-node scripts/setup-auth.ts
