import { test } from '@fixtures/app-fixture';
import { demoUsers } from '@utils/test-data';

test.describe('OrangeHRM login flow', () => {
  test('@pom @smoke admin user can sign in through the POM flow', async ({ loginPage, dashboardPage }) => {
    await loginPage.open();
    await loginPage.login(demoUsers.admin.username, demoUsers.admin.password);
    await dashboardPage.expectLoaded();
  });

  test('@pom invalid user sees a login error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(demoUsers.invalid.username, demoUsers.invalid.password);
    await loginPage.expectError('Invalid credentials');
  });
});
