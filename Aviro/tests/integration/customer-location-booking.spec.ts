import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CustomerPage } from '../../pages/CustomerPage';
import { BookingsPage } from '../../pages/BookingsPage';

test('Full flow: login, invite customer, and create booking', async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  const customerPage = new CustomerPage(page);
  const bookingsPage = new BookingsPage(page);

  // Login via bookings page
  await bookingsPage.goto();
  await loginPage.loginIfNeeded(context);

  // Invite customer and verify creation
  await customerPage.goto();
  await customerPage.inviteCustomer();
  const invitedName = await customerPage.getInvitedCustomerName();
  await customerPage.dismissInviteToast();
  await customerPage.searchCustomer(invitedName);
  await customerPage.assertCustomerCreated(invitedName);

  // Create booking and verify details
  await bookingsPage.goto();
  await bookingsPage.assertPageLoaded();
  await bookingsPage.createBooking();
  const bookingId = await bookingsPage.getCreatedBookingId();
  await bookingsPage.dismissSuccessToast();
  await bookingsPage.searchBooking(bookingId);
  await bookingsPage.assertBookingFound(bookingId);
  await bookingsPage.openBooking(bookingId);
  await bookingsPage.assertBookingDetails();
});
