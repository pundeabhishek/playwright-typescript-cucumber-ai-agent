// SauceDemo products page object for inventory and cart operations
import { expect, Locator } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class SauceDemoProductsPage extends BasePage {
  private readonly inventoryContainer: Locator = this.page.locator('.inventory_container');
  private readonly cartBadge: Locator = this.page.locator('.shopping_cart_badge');
  private readonly cartLink: Locator = this.page.locator('.shopping_cart_link');
  private readonly menuButton: Locator = this.page.locator('#react-burger-menu-btn');
  private readonly logoutLink: Locator = this.page.locator('#logout_sidebar_link');

  async expectLoaded(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
  }

  async addToCart(productName: string): Promise<void> {
    const addToCartButton = this.page.locator(`[data-test="add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await this.safeClick(addToCartButton);
  }

  async getCartBadgeCount(): Promise<number> {
    const badgeText = await this.cartBadge.textContent();
    return badgeText ? parseInt(badgeText, 10) : 0;
  }

  async openCart(): Promise<void> {
    await this.safeClick(this.cartLink);
  }

  async signOut(): Promise<void> {
    await this.safeClick(this.menuButton);
    await this.safeClick(this.logoutLink);
  }
}