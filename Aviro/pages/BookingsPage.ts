import { Page, expect } from '@playwright/test';
import { BookingsLocators } from '../locators/bookingLocators';

export class BookingsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(BookingsLocators.url);
    await this.page.waitForLoadState('networkidle');
  }

  async assertPageLoaded() {
    await expect(this.page.getByText(BookingsLocators.pageHeading, { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(this.page.getByRole('button', { name: BookingsLocators.createBookingButton })).toBeVisible({ timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }

  async createBooking() {
    await this.page.getByRole('button', { name: BookingsLocators.createBookingButton }).click();

    await this.page.getByRole('combobox', { name: BookingsLocators.customerCombobox }).click();
    await this.page.getByRole('combobox', { name: BookingsLocators.customerCombobox }).fill('Walmart Inc. Logistics');
    await this.page.locator(BookingsLocators.optionLabel).first().click();

    await this.page.getByRole('combobox', { name: BookingsLocators.locationCombobox }).click();
    await this.page.getByRole('combobox', { name: BookingsLocators.locationCombobox }).fill('APM Terminals - Port of NYNJ');
    await this.page.locator(BookingsLocators.optionLabel).first().click();

    await this.page.getByRole('radio', { name: BookingsLocators.dropoffRadio }).check();
    await this.page.getByRole('radio', { name: BookingsLocators.stackRadio }).check();
    await this.page.getByRole('radio', { name: BookingsLocators.onePieceRadio }).check();
    await this.page.getByRole('button', { name: BookingsLocators.nextButton }).click();

    await this.page.getByRole('radio', { name: BookingsLocators.yesRadio }).check();
    await this.page.getByRole('button', { name: BookingsLocators.nextButton }).click();
    await this.page.getByRole('button', { name: BookingsLocators.nextButton }).click();
    const dayRateField = this.page.locator(BookingsLocators.dayRateInput);
    await dayRateField.waitFor({ state: 'visible', timeout: 15000 });
    await dayRateField.fill(BookingsLocators.dayRateValue);
    await this.page.keyboard.press('Tab'); // blur to enable Create button
    await this.page.getByRole('button', { name: BookingsLocators.createBookingSubmit }).click();
  }

  async getCreatedBookingId(): Promise<string> {
    const successMsg = this.page.locator(`text=${BookingsLocators.successMessage}`);
    await expect(successMsg).toBeVisible({ timeout: 15000 });
    const msgText = await successMsg.textContent();
    const bookingId = msgText?.match(BookingsLocators.bookingIdPattern)?.[0] ?? '';
    expect(bookingId).toBeTruthy();
    return bookingId;
  }

  async dismissSuccessToast() {
    const successMsg = this.page.locator(`text=${BookingsLocators.successMessage}`);
    await this.page.getByText(BookingsLocators.bookingCreatedToast).locator('xpath=ancestor::div[2]').getByRole('button').click();
    await expect(successMsg).toBeHidden();
  }

  async searchBooking(bookingId: string) {
    await this.page.getByPlaceholder(BookingsLocators.searchPlaceholder).fill(bookingId);
    await this.page.getByRole('button', { name: BookingsLocators.searchButton, exact: true }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async assertBookingFound(bookingId: string) {
    await expect(this.page.getByRole('button', { name: bookingId })).toHaveCount(1, { timeout: 15000 });
  }

  async openBooking(bookingId: string) {
    await this.page.getByRole('button', { name: bookingId }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async assertBookingDetails() {
    await expect(this.page.getByText('Walmart Inc. Logistics')).toBeVisible({ timeout: 15000 });
    await expect(this.page.getByText('APM Terminals - Port of NYNJ')).toBeVisible({ timeout: 15000 });
  }
}
