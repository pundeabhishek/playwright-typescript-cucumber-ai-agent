
import { test, expect } from '@playwright/test';

test('fill form', async ({ page }) => {
  await page.goto('https://way2automation.com/way2auto_jquery/index.php');
  await page.fill('input[name="name"]', 'Abhishek Punde');
  await page.fill('input[name="phone"]', '9999999999');
  await page.fill('input[name="email"]', 'trainer@way2automation.com');
  await page.selectOption('select[name="country"]', 'Germany');
  await page.fill('input[name="city"]', 'Berlin');
  await page.waitForTimeout(3000);
});

