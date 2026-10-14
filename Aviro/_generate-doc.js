const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  ShadingType, AlignmentType, VerticalAlign,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────

const ACCENT = '1F3A6B';   // dark navy for headings
const HEADER_BG = 'D9E1F2'; // light blue for table header rows

function heading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    run: { color: ACCENT, bold: true },
  });
}

function heading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 80 },
    run: { color: ACCENT },
  });
}

function heading3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 60 },
  });
}

function body(text) {
  return new Paragraph({ text, spacing: { after: 100 } });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text })],
    spacing: { after: 60 },
  });
}

function codeBlock(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Courier New', size: 18 })],
    spacing: { after: 60 },
    indent: { left: 720 },
  });
}

const cellBorders = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
  left:   { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
  right:  { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
};

function headerCell(text, widthPct) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    borders: cellBorders,
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: HEADER_BG },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, size: 20 })],
      spacing: { before: 60, after: 60 },
    })],
  });
}

function dataCell(text, widthPct) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    borders: cellBorders,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, size: 20 })],
      spacing: { before: 60, after: 60 },
    })],
  });
}

function table(rows) {
  // rows[0] is header, rest are data
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, i) =>
      new TableRow({
        tableHeader: i === 0,
        children: i === 0
          ? row.map((cell, j) => headerCell(cell, j === 0 ? 30 : 70))
          : row.map((cell, j) => dataCell(cell, j === 0 ? 30 : 70)),
      })
    ),
  });
}

// ── Document body ─────────────────────────────────────────────────────────────

const children = [

  // Title
  new Paragraph({
    children: [new TextRun({ text: 'Project Structure', bold: true, size: 56, color: ACCENT })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Aviro Playwright Test Suite — Developer Reference', size: 24, color: '595959' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  }),

  // ── Root ──
  heading1('Root Directory'),
  body('The root of the workspace contains the project manifest and the global Playwright configuration. All source code, test files, and runtime artefacts live in sub-directories.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'Purpose'],
    ['package.json', 'Node.js project manifest. Declares the @playwright/test dev dependency and project metadata.'],
    ['playwright.config.ts', 'Global Playwright configuration. Sets the test directory, global timeout (5 minutes), the target browser (Microsoft Edge), screenshot capture behaviour, and conditionally loads a saved authentication state when one exists.'],
  ]),

  // ── locators/ ──
  heading1('locators/'),
  body('Centralises all UI element selectors and static test data in plain TypeScript const objects. Keeping selectors here — rather than inside page classes or test files — means a UI change only needs to be fixed in one place.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'Contents'],
    ['bookingLocators.ts', 'Selectors and values for the Bookings page: the page URL, button names, combobox labels, radio button labels, CSS selectors for option lists and day-rate inputs, success message patterns, and the booking ID regex.'],
    ['customerLocators.ts', 'Selectors for both the Login and Customers pages: email/password field placeholders, the Customers page URL, invite-customer button name, drawer and popover CSS selectors, submit button selector, and the invite-confirmation message pattern.'],
  ]),

  // ── pages/ ──
  heading1('pages/'),
  body('Implements the Page Object Model (POM) pattern. Each class wraps a specific application page, exposing high-level action and assertion methods that tests call. Tests never interact with Playwright\'s page API directly — they go through these classes.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'Responsibility'],
    ['LoginPage.ts', 'Handles authentication. The loginIfNeeded() method checks whether the login form is visible, fills in credentials, waits for OTP completion (up to 2 minutes), and then persists the authenticated browser storage state to playwright/.auth/user.json so subsequent test runs can skip the login step.'],
    ['BookingsPage.ts', 'Covers the full booking lifecycle: navigating to the Bookings page, asserting it has loaded, driving the multi-step Create Booking wizard, extracting the generated booking ID from the success message, dismissing the toast, searching for the booking, and asserting its details.'],
    ['CustomerPage.ts', 'Covers customer operations: navigating to the Customers page, inviting a new customer through the drawer form, extracting the invited customer\'s name from the confirmation toast, dismissing the toast, searching for the customer, and asserting they appear in the list.'],
  ]),

  // ── tests/ ──
  heading1('tests/'),
  body('Contains all test specifications, organised by test type. Each .spec.ts file imports page classes, composes them into a test scenario, and makes assertions. Test files contain no raw selectors — those live in locators/.'),

  heading2('tests/functional/'),
  body('Isolated tests that verify a single feature in the application. Each test runs independently and focuses on one user journey.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'What it tests'],
    ['userlogin.spec.ts', 'Verifies that a user can authenticate successfully and land on the Bookings page.'],
    ['invitecustomer.spec.ts', 'Verifies that inviting a new customer completes successfully and the customer appears in the customer list.'],
    ['createbooking.spec.ts', 'Verifies that the full Create Booking wizard can be completed and the resulting booking can be found and inspected.'],
  ]),

  heading2('tests/integration/'),
  body('End-to-end tests that chain multiple features together into a single continuous flow, simulating realistic user journeys across the application.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'What it tests'],
    ['customer-location-booking.spec.ts', 'Full flow: logs in, invites a new customer, verifies the customer was created, then creates a booking for that customer and verifies the booking details.'],
  ]),

  // ── playwright/ ──
  heading1('playwright/'),
  body('Runtime artefacts managed by Playwright itself.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['Path', 'Purpose'],
    ['playwright/.auth/user.json', 'Saved browser storage state (cookies, local storage, session tokens) captured after a successful login. When this file exists, playwright.config.ts injects it via storageState so tests start already authenticated, avoiding repeated logins. This file is generated at runtime and should not be committed to source control.'],
  ]),

  // ── test-results/ ──
  heading1('test-results/'),
  body('Auto-generated by Playwright after each test run. Contains one sub-folder per test, named after the test title. Each folder may contain:'),
  bullet('Screenshots captured at each step (enabled globally in playwright.config.ts).'),
  bullet('error-context.md — written when a test fails; summarises the error and the step that caused it, useful for diagnosing CI failures without re-running tests locally.'),
  body('This directory is generated output and should be excluded from source control (add to .gitignore).'),

  // ── Architecture ──
  heading1('Architecture Summary'),
  body('The locators → pages → tests layering keeps each concern separate:'),
  new Paragraph({ spacing: { after: 60 } }),
  codeBlock('playwright.config.ts       ← Playwright configuration'),
  codeBlock('locators/                  ← Selectors and static test data (single source of truth)'),
  codeBlock('pages/                     ← Page Object Model classes (actions + assertions)'),
  codeBlock('tests/'),
  codeBlock('  functional/              ← Single-feature tests'),
  codeBlock('  integration/             ← Multi-feature end-to-end flows'),
  codeBlock('playwright/.auth/          ← Runtime: persisted auth state (gitignore this)'),
  codeBlock('test-results/              ← Runtime: screenshots and failure reports (gitignore this)'),
  new Paragraph({ spacing: { after: 120 } }),
  body('Changing a selector only touches locators/, changing a workflow only touches pages/, and adding a new scenario only touches tests/.'),
];

// ── Build and write ───────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22 } },
    },
  },
  sections: [{ properties: {}, children }],
});

Packer.toBuffer(doc).then(buffer => {
  const out = path.join(__dirname, 'PROJECT_STRUCTURE.docx');
  fs.writeFileSync(out, buffer);
  console.log('Created:', out);
});
