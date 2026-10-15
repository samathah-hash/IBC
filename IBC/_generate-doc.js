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
    children: [new TextRun({ text: 'IBC Playwright Test Suite — Developer Reference', size: 24, color: '595959' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  }),

  // ── Root ──
  heading1('Root Directory'),
  body('The root of the IBC Playwright project contains the Node.js manifest, lockfile, Playwright configuration, and project-structure documentation. Test specifications and runtime artefacts live in sub-directories.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'Purpose'],
    ['package.json', 'Node.js project manifest. Declares @playwright/test and docx as development dependencies.'],
    ['package-lock.json', 'Locks the exact dependency versions installed for this project.'],
    ['playwright.config.ts', 'Playwright configuration. Sets the test directory, global timeout (5 minutes), Microsoft Edge, screenshot capture, the Pactrak QA base URL, and loads saved authentication state only when it matches the configured app origin.'],
    ['PROJECT_STRUCTURE.md / PROJECT_STRUCTURE.docx', 'Project-structure references in Markdown and Word formats.'],
    ['_generate-doc.js', 'Generates PROJECT_STRUCTURE.docx from the document content defined in this script.'],
  ]),

  // ── locators/ ──
  heading1('locators/'),
  body('Centralises all UI element selectors and static test data in plain TypeScript const objects. Keeping selectors here — rather than inside page classes or test files — means a UI change only needs to be fixed in one place.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'Contents'],
    ['bookingLocators.ts', 'Selectors and values for the Bookings page: the page URL, button names, combobox labels, radio button labels, CSS selectors for option lists and day-rate inputs, success message patterns, and the booking ID regex.'],
    ['customerLocators.ts', 'Selectors for the B2C login form and Customers page, including login field/button names, the Customers page URL, invite-customer button, drawer and popover selectors, and invite-confirmation message pattern.'],
  ]),

  // ── pages/ ──
  heading1('pages/'),
  body('Contains shared page-object workflows used by the functional tests.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'Responsibility'],
    ['LoginPage.ts', 'Handles B2C authentication using LOGIN_USERNAME and LOGIN_PASSWORD, waits up to 2 minutes for manual verification, and saves browser storage state to playwright/.auth/user.json. Skips login when no authentication redirect occurs and the browser remains on the configured app origin.'],
  ]),

  // ── tests/ ──
  heading1('tests/'),
  body('Contains the current Playwright test specifications.'),

  heading2('tests/functional/'),
  body('Isolated tests that verify a single feature in the application. Each test runs independently and focuses on one user journey.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['File', 'What it tests'],
    ['advancedsearch.spec.ts', 'Logs in, opens the dashboard, and clicks the Advanced Search control.'],
    ['userlogin.spec.ts', 'Verifies that a user can authenticate successfully and return to the configured app origin.'],
  ]),

  // ── playwright/ ──
  heading1('playwright/'),
  body('Runtime authentication state managed by Playwright. The configuration reuses it only when its origin matches the configured app origin.'),
  new Paragraph({ spacing: { after: 120 } }),
  table([
    ['Path', 'Purpose'],
    ['playwright/.auth/user.json', 'Saved browser storage state captured after login. This file is generated at runtime, may contain sensitive session data, and should not be committed to source control.'],
  ]),

  // ── test-results/ ──
  heading1('test-results/'),
  body('Auto-generated by Playwright after each test run. Contains one sub-folder per test, named after the test title. Each folder may contain:'),
  bullet('Screenshots captured at each step (enabled globally in playwright.config.ts).'),
  bullet('error-context.md — written when a test fails; summarises the error and the step that caused it, useful for diagnosing CI failures without re-running tests locally.'),
  body('This directory is generated output and should be excluded from source control.'),

  // ── Architecture ──
  heading1('Architecture Summary'),
  body('The current layout keeps selectors, test scenarios, configuration, and generated runtime data in separate locations:'),
  new Paragraph({ spacing: { after: 60 } }),
  codeBlock('playwright.config.ts       ← Playwright configuration'),
  codeBlock('locators/                  ← Selectors and static test data (single source of truth)'),
  codeBlock('pages/                     ← Shared page-object workflows (LoginPage)'),
  codeBlock('tests/'),
  codeBlock('  functional/              ← Current feature-level test specifications'),
  codeBlock('playwright/.auth/          ← Runtime: persisted auth state (gitignore this)'),
  codeBlock('test-results/              ← Runtime: screenshots and failure reports (gitignore this)'),
  new Paragraph({ spacing: { after: 120 } }),
  body('The current functional tests are advancedsearch.spec.ts and userlogin.spec.ts. Both use pages/LoginPage.ts for authentication. The locators directory contains booking and customer selector modules.'),
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
