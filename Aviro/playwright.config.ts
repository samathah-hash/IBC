import { defineConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, 'playwright/.auth/user.json');
const baseURL = process.env.BASE_URL ?? 'https://qa.pactrak.com';
const appOrigin = new URL(baseURL).origin;
const hasMatchingAuth = fs.existsSync(authFile) && (() => {
  try {
    const state = JSON.parse(fs.readFileSync(authFile, 'utf8')) as { origins?: { origin: string }[] };
    return state.origins?.some(origin => origin.origin === appOrigin) ?? false;
  } catch {
    return false;
  }
})();

export default defineConfig({
  testDir: './tests',
  timeout: 300000, // 5 minutes — covers OTP wait + full booking workflow
  use: {
    baseURL,
    channel: 'msedge',
    screenshot: 'on',
    // Reuse saved login state when it exists; first run will create it
    ...(hasMatchingAuth ? { storageState: authFile } : {}),
  },
});