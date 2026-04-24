// SauceDemo cart page object for cart verification and checkout
import { expect, Locator } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class SauceDemoCartPage extends BasePage {
  private readonly cartContents: Locator = this.page.locator('.cart_contents');
  private readonly cartItem: Locator = this.page.locator('.cart_item');
  private readonly checkoutButton: Locator = this.page.locator('#checkout');
  private readonly continueShoppingButton: Locator = this.page.locator('#continue-shopping');

  async expectLoaded(): Promise<void> {
    await expect(this.cartContents).toBeVisible();
  }

  async verifyItemInCart(productName: string): Promise<void> {
    const itemName = this.page.locator('.inventory_item_name');
    await expect(itemName).toContainText(productName);
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItem.count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.safeClick(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.safeClick(this.continueShoppingButton);
  }
}