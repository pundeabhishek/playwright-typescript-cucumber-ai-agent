// Central Playwright runtime configuration for reporting, parallel execution,
// and cross-browser coverage.
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import { paths } from './src/config/paths';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : '50%',
  reporter: [
    ['list'],
    ['allure-playwright', { resultsDir: paths.allureResults }],
    ['html', { open: 'never', outputFolder: paths.playwrightHtml }]
  ],
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: env.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15_000,
    navigationTimeout: 60_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
  outputDir: paths.playwrightResults
});
