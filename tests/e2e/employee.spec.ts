import { test } from '@fixtures/app-fixture';
import { createEmployeeRecord, demoUsers } from '@utils/test-data';

test.describe('OrangeHRM employee management', () => {
  test('@pom admin can add an employee through page objects', async ({
    loginPage,
    dashboardPage,
    employeePage
  }) => {
    const employee = createEmployeeRecord();

    await loginPage.open();
    await loginPage.login(demoUsers.admin.username, demoUsers.admin.password);
    await dashboardPage.expectLoaded();
    await dashboardPage.openPimModule();
    await employeePage.openAddEmployee();
    await employeePage.addEmployee(employee);
    await employeePage.expectEmployeeCreated(employee);
  });
});
