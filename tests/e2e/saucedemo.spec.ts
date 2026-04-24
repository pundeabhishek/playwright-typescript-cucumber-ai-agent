import { test } from '@playwright/test';
import { SauceDemoLoginPage } from '@pages/saucedemo-login-page';
import { SauceDemoProductsPage } from '@pages/saucedemo-products-page';
import { SauceDemoCartPage } from '@pages/saucedemo-cart-page';

test.describe('SauceDemo e-commerce flow', () => {
  test('user can login, add item to cart, verify and sign out', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    const productsPage = new SauceDemoProductsPage(page);
    const cartPage = new SauceDemoCartPage(page);

    // Login to SauceDemo
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    // Verify products page loaded
    await productsPage.expectLoaded();

    // Add Sauce Labs Backpack to cart
    await productsPage.addToCart('Sauce Labs Backpack');

    // Verify cart badge shows 1 item
    const cartCount = await productsPage.getCartBadgeCount();
    test.expect(cartCount).toBe(1);

    // Open cart
    await productsPage.openCart();

    // Verify cart page loaded
    await cartPage.expectLoaded();

    // Verify Sauce Labs Backpack is in cart
    await cartPage.verifyItemInCart('Sauce Labs Backpack');

    // Verify cart has 1 item
    const itemCount = await cartPage.getCartItemCount();
    test.expect(itemCount).toBe(1);

    // Go back to products page
    await cartPage.continueShopping();

    // Sign out
    await productsPage.signOut();

    // Verify back to login page
    await loginPage.expectLoginPageVisible();
  });
});