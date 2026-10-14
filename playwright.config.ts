import { defineConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, 'playwright/.auth/user.json');
const hasAuth = fs.existsSync(authFile);

export default defineConfig({
  testDir: './tests',
  timeout: 300000,
  use: {
    channel: 'msedge',
    screenshot: 'on',
    ...(hasAuth ? { storageState: authFile } : {}),
  },
});
