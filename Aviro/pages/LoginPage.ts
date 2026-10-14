import { Page, BrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { LoginLocators } from '../locators/customerLocators';

const AUTH_FILE = path.join(__dirname, '../playwright/.auth/user.json');

export class LoginPage {
  constructor(private page: Page) {}

  async loginIfNeeded(context: BrowserContext) {
    const emailTextbox = this.page.getByRole('textbox', { name: LoginLocators.emailTextbox });
    let needsLogin = new URL(this.page.url()).hostname.endsWith('.b2clogin.com');
    if (!needsLogin) {
      try {
        await this.page.waitForURL(url => url.hostname.endsWith('.b2clogin.com'), { timeout: 10000 });
        needsLogin = true;
      } catch {
        return;
      }
    }

    if (needsLogin) {
      await emailTextbox.waitFor({ state: 'visible', timeout: 30000 });
      const initialUrl = new URL(this.page.url());
      const returnUrl = initialUrl.searchParams.get('redirect_uri') ?? initialUrl.href;
      const appOrigin = new URL(returnUrl).origin;
      const username = process.env.LOGIN_USERNAME;
      const password = process.env.LOGIN_PASSWORD;

      if (!username || !password) {
        throw new Error('Set LOGIN_USERNAME and LOGIN_PASSWORD before running the login test.');
      }

      await emailTextbox.fill(username);
      await this.page.getByRole('button', { name: LoginLocators.signInButton, exact: true }).click();
      await this.page.waitForLoadState('networkidle');

      await this.page.getByRole('textbox', { name: LoginLocators.passwordTextbox }).fill(password);
      await this.page.getByRole('button', { name: LoginLocators.signInButton, exact: true }).click();
      await this.page.waitForLoadState('networkidle');

      const sendCodeButton = this.page.getByRole('button', { name: /verification code|send code|generate code/i });
      await sendCodeButton.waitFor({ state: 'visible', timeout: 15000 });
      await sendCodeButton.click();

      // Waits up to 2 minutes for user to complete verification in the browser.
      await this.page.waitForURL(url => new URL(url).origin === appOrigin, { timeout: 120000 });
      await this.page.goto(returnUrl);
      await this.page.waitForLoadState('networkidle');

      fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
      await context.storageState({ path: AUTH_FILE });
    }
  }
}
