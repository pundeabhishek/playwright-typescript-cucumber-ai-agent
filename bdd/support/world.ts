// Custom Cucumber world creates isolated Playwright resources and shared page
// objects for every scenario.
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { ITestCaseHookParameter, setWorldConstructor, World } from '@cucumber/cucumber';
import { LoginPage } from '@pages/login-page';
import { DashboardPage } from '@pages/dashboard-page';
import { EmployeePage } from '@pages/employee-page';
import { env } from '@config/env';
import { Logger } from '@utils/logger';
import { ArtifactManager } from '@utils/artifact-manager';
import path from 'path';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  dashboardPage!: DashboardPage;
  employeePage!: EmployeePage;
  scenarioName = '';
  screenshotDirectory = '';

  async init(scenario?: ITestCaseHookParameter): Promise<void> {
    const headed = process.env.BDD_HEADED?.toLowerCase() !== 'false';
    this.scenarioName = scenario?.pickle.name ?? 'bdd-scenario';
    this.screenshotDirectory = ArtifactManager.cucumberScenarioDirectory(
      this.scenarioName,
      scenario?.pickle.id
    );
    Logger.info(`Starting Cucumber browser in ${headed ? 'headed' : 'headless'} mode.`);
    this.browser = await chromium.launch({ headless: !headed, slowMo: headed ? 150 : 0 });
    this.context = await this.browser.newContext({
      baseURL: env.baseUrl,
      viewport: { width: 1440, height: 900 }
    });
    this.page = await this.context.newPage();
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.employeePage = new EmployeePage(this.page);
  }

  async saveScreenshot(name: string): Promise<string> {
    const fileName = `${ArtifactManager.sanitizeName(name)}.png`;
    const outputPath = path.join(this.screenshotDirectory, fileName);
    await this.page.screenshot({ path: outputPath, fullPage: true });
    return outputPath;
  }

  async destroy(): Promise<void> {
    if (process.env.BDD_HEADED?.toLowerCase() !== 'false') {
      await this.page.waitForTimeout(1500);
    }
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
