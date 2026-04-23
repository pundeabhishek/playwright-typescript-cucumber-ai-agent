import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { EmployeeRecord } from '@utils/test-data';

export class EmployeePage extends BasePage {
  readonly addEmployeeLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly personalDetailsHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.addEmployeeLink = page.getByRole('link', { name: /add employee/i });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('form input').nth(4);
    this.saveButton = page.getByRole('button', { name: /^save$/i });
    this.personalDetailsHeader = page.getByRole('heading', { name: /personal details/i });
  }

  async openAddEmployee(): Promise<void> {
    await this.safeClick(this.addEmployeeLink);
    await expect(this.page).toHaveURL(/\/pim\/addEmployee/, { timeout: 30_000 });
    await expect(this.firstNameInput).toBeVisible({ timeout: 30_000 });
  }

  async addEmployee(employee: EmployeeRecord): Promise<void> {
    await expect(this.firstNameInput).toBeEditable();
    await expect(this.lastNameInput).toBeEditable();
    await expect(this.employeeIdInput).toBeEditable();
    await this.safeFill(this.firstNameInput, employee.firstName);
    await this.safeFill(this.lastNameInput, employee.lastName);
    await this.employeeIdInput.fill(employee.employeeId);
    await expect(this.saveButton).toBeEnabled();
    await this.safeClick(this.saveButton);
  }

  async expectEmployeeCreated(employee: EmployeeRecord): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails/, { timeout: 30_000 });
    await expect(this.personalDetailsHeader).toBeVisible({ timeout: 30_000 });
    await expect(this.firstNameInput).toHaveValue(employee.firstName, { timeout: 30_000 });
    await expect(this.lastNameInput).toHaveValue(employee.lastName, { timeout: 30_000 });
  }

  async getEmployeeId(): Promise<string> {
    return (await this.employeeIdInput.inputValue()).trim();
  }
}
