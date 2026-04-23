import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: /login/i });
    this.errorBanner = page.getByRole('alert').first();
  }

  async open(): Promise<void> {
    await this.visit('auth/login');
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.safeFill(this.usernameInput, username);
    await this.safeFill(this.passwordInput, password);
    await this.safeClick(this.loginButton);
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorBanner).toContainText(message);
  }
}
