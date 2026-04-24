// SauceDemo login page object for authentication flow
import { expect, Locator } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class SauceDemoLoginPage extends BasePage {
  private readonly usernameInput: Locator = this.page.locator('#user-name');
  private readonly passwordInput: Locator = this.page.locator('#password');
  private readonly loginButton: Locator = this.page.locator('#login-button');
  private readonly errorMessage: Locator = this.page.locator('[data-test="error"]');

  async open(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.safeFill(this.usernameInput, username);
    await this.safeFill(this.passwordInput, password);
    await this.safeClick(this.loginButton);
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectLoginPageVisible(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }
}