import { chromium, FullConfig } from '@playwright/test';
import { BASE_URL } from '../config/globals';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const authFile = 'auth/user.json';

  try {
    console.log('--- Running Global Setup: Logging in ---');
    await page.goto(`${BASE_URL}/account/signin?redirect=/`); // Assuming a /login route exists

    // Use environment variables for credentials for security
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !password) {
      throw new Error('USERNAME and PASSWORD environment variables must be set.');
    }

    // // Replace with your actual login form selectors
    // await page.locator('input[name="username"]').fill(username);
    // await page.locator('input[name="password"]').fill(password);
    // await page.getByRole('button', { name: 'Sign In' }).click();

    // Using the specific locators you provided from your SignInPage
    await page.getByRole('textbox', { name: 'Email or Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    // Wait for a clear indicator that login was successful, e.g., the settings button is visible.
    await page.waitForSelector("button:has-text('settings')");
    console.log('--- Login Successful ---');


    // Save the authentication state to a file
    await page.context().storageState({ path: authFile });
    console.log(`--- Authentication state saved to ${authFile} ---`);

  } catch (error) {
    console.error('Global setup failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
