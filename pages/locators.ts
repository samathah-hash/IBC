export const LoginLocators = {
  emailPlaceholder: 'Enter your email address',
  continueButton: 'Continue',
  passwordTextbox: /password/i,
};

export const BookingsLocators = {
  url: 'http://aviro-ui-qa.us-east-2.elasticbeanstalk.com/operator/bookings',
  pageHeading: 'Booking',
  createBookingButton: 'Create Booking',
  customerCombobox: 'Customer search results',
  locationCombobox: 'Location search results',
  optionLabel: '.MuiTypography-root.MuiTypography-body1.drawer-searchable-select-field__option-label',
  dropoffRadio: 'Dropoff',
  stackRadio: 'Stack',
  onePieceRadio: 'One piece',
  nextButton: 'Next',
  yesRadio: 'Yes',
  createBookingSubmit: 'Create booking',
  successMessage: /was created successfully/,
  bookingCreatedToast: 'Booking created',
  bookingIdPattern: /BK\d+/,
  searchPlaceholder: /search/i,
  searchButton: 'Search',
  dayRateInput: 'input.MuiInputBase-inputAdornedStart',
  dayRateValue: '500',
};

export const CustomersLocators = {
  url: 'http://aviro-ui-qa.us-east-2.elasticbeanstalk.com/operator/customers',
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
