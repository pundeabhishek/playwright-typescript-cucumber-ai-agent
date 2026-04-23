import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { createEmployeeRecord, demoUsers } from '@utils/test-data';
import { Logger } from '@utils/logger';

Given('the user opens the OrangeHRM login page', async function (this: CustomWorld) {
  Logger.step('Given the user opens the OrangeHRM login page');
  await this.loginPage.open();
});

When('the user logs in with valid demo credentials', async function (this: CustomWorld) {
  Logger.step('When the user logs in with valid demo credentials');
  await this.loginPage.login(demoUsers.admin.username, demoUsers.admin.password);
});

When('the user logs in with invalid demo credentials', async function (this: CustomWorld) {
  Logger.step('When the user logs in with invalid demo credentials');
  await this.loginPage.login(demoUsers.invalid.username, demoUsers.invalid.password);
});

Then('the dashboard page should be displayed', async function (this: CustomWorld) {
  Logger.step('Then the dashboard page should be displayed');
  await this.dashboardPage.expectLoaded();
});

Then('a login error message should be displayed', async function (this: CustomWorld) {
  Logger.step('Then a login error message should be displayed');
  await this.loginPage.expectError('Invalid credentials');
});

When('the user adds a new employee', async function (this: CustomWorld) {
  Logger.step('When the user adds a new employee');
  const employee = createEmployeeRecord();
  this.parameters.employee = employee;
  await this.dashboardPage.openPimModule();
  await this.employeePage.openAddEmployee();
  await this.employeePage.addEmployee(employee);
});

Then('the employee profile should be saved', async function (this: CustomWorld) {
  Logger.step('Then the employee profile should be saved');
  await this.employeePage.expectEmployeeCreated(this.parameters.employee);
});
