import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('Advanced search', async ({ page, context }) => {
  await page.goto('/');
  await new LoginPage(page).loginIfNeeded(context);
  await page.goto('/dashboard');
  await page.locator('.spinner-container').waitFor({ state: 'hidden', timeout: 30000 });
  await page.getByRole('img').nth(5).click();
  await page.locator('.advancedSearchIcon').click();
  await page.waitForTimeout(3000);
});