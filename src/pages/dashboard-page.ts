import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class DashboardPage extends BasePage {
  readonly dashboardHeader: Locator;
  readonly sidePanel: Locator;
  readonly userDropdown: Locator;
  readonly pageHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.getByRole('heading', { name: /dashboard/i });
    this.sidePanel = page.locator('aside');
    this.userDropdown = page.locator('.oxd-userdropdown-name');
    this.pageHeader = page.locator('.oxd-topbar-header-title');
  }

  async expectLoaded(): Promise<void> {
    await this.assertUrlContains('/dashboard');
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.sidePanel).toBeVisible();
  }

  async openPimModule(): Promise<void> {
    await expect(this.sidePanel).toBeVisible();
    const pimMenu = this.page.getByRole('link', { name: /^pim$/i });
    await this.safeClick(pimMenu);
    await expect(this.pageHeader).toContainText('PIM');
  }
}
