// scripts/setup-auth.ts
import { BASE_URL } from '../config/globals';
import { chromium } from '@playwright/test';
import * as fs from 'fs';

export async function loginAndSave(username: string, password: string, file: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  if (!fs.existsSync('auth')) fs.mkdirSync('auth');

  const page = await context.newPage();
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const signInUrl = `${baseUrl}/account/signin?redirect=/`;

  try {
    console.log('Navigating to sign-in:', signInUrl);
    await page.goto(signInUrl, { waitUntil: 'domcontentloaded', timeout: 120_000 });

    console.log('entering username')
    await page.getByRole('textbox', { name: 'Email or Username' }).fill(username);
    console.log('entering password')
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    console.log('signing in')
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/', { timeout: 15000 });
    await page.waitForTimeout(3000)
    await context.storageState({ path: `auth/${file}` });
    console.log('signed in')
  } catch (err) {
    throw new Error(`Login failed for user: ${username} → ${err}`);
  } finally {
    await browser.close();
  }
}
