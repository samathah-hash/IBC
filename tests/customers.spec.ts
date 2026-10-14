import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CustomersPage } from '../pages/CustomersPage';

test('Invite customer and verify customer is created', async ({ page, context }) => {
  const customersPage = new CustomersPage(page);
  const loginPage = new LoginPage(page);

  await customersPage.goto();
  await loginPage.loginIfNeeded(context);

  await customersPage.inviteCustomer();
  const invitedName = await customersPage.getInvitedCustomerName();
  await customersPage.dismissInviteToast();

  await customersPage.searchCustomer(invitedName);
  await customersPage.assertCustomerCreated(invitedName);
});
