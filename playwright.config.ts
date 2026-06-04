import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices[ 'Desktop Chrome' ],
        channel: 'chrome',
      },
    },
  ],
});
