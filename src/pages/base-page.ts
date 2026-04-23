// Base page contains shared browser actions used by higher-level page objects.
import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async visit(path = ''): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  }

  async assertUrlContains(value: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(value));
  }

  protected async safeFill(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }

  protected async safeClick(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.click();
  }
}
