import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('User can login successfully', async ({ page, context }) => {
  const loginPage = new LoginPage(page);

  await page.goto(process.env.LOGIN_URL ?? '/');
  await loginPage.loginIfNeeded(context);
  const appOrigin = new URL(process.env.BASE_URL ?? 'https://qa.pactrak.com').origin;
  await expect(page).toHaveURL(url => new URL(url).origin === appOrigin);
});
