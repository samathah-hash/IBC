import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { BookingsPage } from '../../pages/BookingsPage';

test('Create a booking and verify it is created', async ({ page, context }) => {
  const bookingsPage = new BookingsPage(page);
  const loginPage = new LoginPage(page);

  await bookingsPage.goto();
  await loginPage.loginIfNeeded(context);

  await bookingsPage.assertPageLoaded();
  await bookingsPage.createBooking();
  const bookingId = await bookingsPage.getCreatedBookingId();
  await bookingsPage.dismissSuccessToast();
  await bookingsPage.searchBooking(bookingId);
  await bookingsPage.assertBookingFound(bookingId);
  await bookingsPage.openBooking(bookingId);
  await bookingsPage.assertBookingDetails();
});
