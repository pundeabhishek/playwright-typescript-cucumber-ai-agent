import { test } from '@fixtures/app-fixture';
import { demoUsers } from '@utils/test-data';

test.describe('OrangeHRM visual regression', () => {
  test('captures visual checkpoints exactly where the test asks for them', async ({
    loginPage,
    dashboardPage,
    compareScreenshot
  }) => {
    await loginPage.open();

    await compareScreenshot({
      name: 'orangehrm-login-page',
      fullPage: true
    });

    await loginPage.login(demoUsers.admin.username, demoUsers.admin.password);
    await dashboardPage.expectLoaded();
    await dashboardPage.openPimModule();

    await compareScreenshot({
      name: 'orangehrm-pim-header',
      locatorSelector: 'h6.oxd-topbar-header-breadcrumb-module'
    });
  });
});
