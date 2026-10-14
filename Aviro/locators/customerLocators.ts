export const LoginLocators = {
  emailTextbox: /username or email address|email/i,
  signInButton: 'Sign in',
  passwordTextbox: /password/i,
};

export const CustomersLocators = {
  url: '/operator/customers',
  inviteCustomerButton: 'Invite customer',
  drawerContainer: '.user-form-drawer__paper',
  locationsButton: 'Select locations',
  locationOption: '.toolbar-searchable-select-popover__option',
  popoverBackdrop: '.MuiPopover-root .MuiBackdrop-root',
  // Submit button scoped by CSS to avoid matching the open-drawer button
  submitButton: '.user-form-drawer__actions button[type="submit"]',
  hasBeenInvited: /has been invited/,
  searchPlaceholder: /search/i,
};
