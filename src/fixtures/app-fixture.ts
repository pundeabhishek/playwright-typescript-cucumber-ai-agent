// Shared Playwright fixtures keep tests small by providing ready-to-use
// page objects and cross-cutting helpers such as visual comparison.
import { test as base, TestInfo } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { DashboardPage } from '@pages/dashboard-page';
import { EmployeePage } from '@pages/employee-page';
import { compareScreenshot as compareScreenshotCore } from '@visual/compare-screenshot';
import { VisualFixtures } from '@visual/types';
import { VisualTracker } from '@visual/visual-tracker';
import { Logger } from '@utils/logger';

type AppFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeePage: EmployeePage;
};

export const test = base.extend<AppFixtures & VisualFixtures>({
  visualTracker: async ({}, use) => {
    await use(new VisualTracker());
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  employeePage: async ({ page }, use) => {
    await use(new EmployeePage(page));
  },
  compareScreenshot: async ({ page, visualTracker }, use, testInfo: TestInfo) => {
    await use(async options => {
      const result = await compareScreenshotCore({ ...options, page }, testInfo);

      if (result.mismatch) {
        visualTracker.addMismatch({
          ...result,
          projectName: testInfo.project.name,
          testTitle: testInfo.title
        });
      }

      return result;
    });
  }
});

test.afterEach(async ({ visualTracker }, testInfo) => {
  visualTracker.flush();

  if (testInfo.status !== 'passed' && testInfo.status !== 'skipped') {
    Logger.warn('Skipping visual mismatch assertion because the test already failed.', {
      title: testInfo.title,
      status: testInfo.status
    });
    return;
  }

  visualTracker.assertNoMismatches();
});

export { expect } from '@playwright/test';
