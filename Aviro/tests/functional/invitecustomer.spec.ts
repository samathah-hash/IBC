import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CustomerPage } from '../../pages/CustomerPage';

test('Invite customer and verify customer is created', async ({ page, context }) => {
  const customerPage = new CustomerPage(page);
  const loginPage = new LoginPage(page);

  await customerPage.goto();
  await loginPage.loginIfNeeded(context);

  await customerPage.inviteCustomer();
  const invitedName = await customerPage.getInvitedCustomerName();
  await customerPage.dismissInviteToast();

  await customerPage.searchCustomer(invitedName);
  await customerPage.assertCustomerCreated(invitedName);
});
