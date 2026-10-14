import { Page, BrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { LoginLocators, BookingsLocators } from './locators';

const AUTH_FILE = path.join(__dirname, '../playwright/.auth/user.json');

export class LoginPage {
  constructor(private page: Page) {}

  async loginIfNeeded(context: BrowserContext) {
    if (await this.page.getByPlaceholder(LoginLocators.emailPlaceholder).isVisible()) {
      await this.page.getByPlaceholder(LoginLocators.emailPlaceholder).fill('samatha_h@trigent.com');
      await this.page.getByRole('button', { name: LoginLocators.continueButton, exact: true }).click();
      await this.page.waitForLoadState('networkidle');

      await this.page.getByRole('textbox', { name: LoginLocators.passwordTextbox }).fill('Giddu@123SDSD');
      await this.page.getByRole('button', { name: LoginLocators.continueButton, exact: true }).click();
      await this.page.waitForLoadState('networkidle');

      // Waits up to 2 minutes for user to enter OTP in the browser
      await this.page.waitForURL('**aviro-ui-qa**', { timeout: 120000 });
      await this.page.goto(BookingsLocators.url);
      await this.page.waitForLoadState('networkidle');

      fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
      await context.storageState({ path: AUTH_FILE });
    }
  }
}
