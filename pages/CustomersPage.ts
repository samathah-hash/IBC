import { Page, expect } from '@playwright/test';
import { CustomersLocators } from './locators';

function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export class CustomersPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(CustomersLocators.url);
    await this.page.waitForLoadState('networkidle');
  }

  async inviteCustomer(): Promise<string> {
    await this.page.getByRole('button', { name: CustomersLocators.inviteCustomerButton }).click();

    const companyName = 'Test' + randomString(6);
    const contactName = randomString(5) + ' ' + randomString(5);
    const email = `${randomString(8)}@gmail.com`;
    const phone = randomString(8);
    const address = randomString(10) + ' Street';

    // Inputs inside the drawer have no id/aria-label; target by position within the drawer
    const drawer = this.page.locator(CustomersLocators.drawerContainer);
    const inputs = drawer.locator('input');
    await inputs.nth(0).fill(companyName);  // Company name
    await inputs.nth(1).fill(contactName); // Primary contact's name
    await inputs.nth(2).fill(email);       // Primary contact's email
    await inputs.nth(3).fill(phone);       // Phone
    await inputs.nth(4).fill(address);     // Primary business address

    // Open Location(s) popover and select the first option
    await this.page.getByRole('button', { name: CustomersLocators.locationsButton }).click();
    await this.page.locator(CustomersLocators.locationOption).first().click();
    // Click the MUI backdrop to dismiss the popover before submitting
    await this.page.locator(CustomersLocators.popoverBackdrop).click();

    const submitBtn = this.page.locator(CustomersLocators.submitButton);
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    return companyName;
  }

  async getInvitedCustomerName(): Promise<string> {
    const toast = this.page.locator('text=/has been invited/');
    await expect(toast).toBeVisible({ timeout: 15000 });
    const text = await toast.textContent() ?? '';
    // Toast format: "<Company Name> has been invited"
    return text.replace(/\s*has been invited.*/, '').trim();
  }

  async dismissInviteToast() {
    const toast = this.page.locator('text=/has been invited/');
    await toast.locator('xpath=ancestor::div[2]').getByRole('button').click();
    await expect(toast).toBeHidden();
  }

  async searchCustomer(name: string) {
    await this.page.getByPlaceholder(CustomersLocators.searchPlaceholder).fill(name);
    await this.page.waitForLoadState('networkidle');
  }

  async assertCustomerCreated(name: string) {
    await expect(this.page.getByText(name)).toHaveCount(1, { timeout: 15000 });
  }
}
