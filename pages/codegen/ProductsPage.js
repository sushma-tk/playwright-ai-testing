class ProductsPage {
  constructor(page) {
    this.page = page;

    this.searchBox = page.getByRole('searchbox', { name: 'Search for Vegetables and' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
  }

  addToCartButton(productIndex) {
    return this.page.getByRole('button', { name: 'ADD TO CART' }).nth(productIndex);
  }

  increaseQuantityLink(productIndex) {
    return this.page.getByRole('link', { name: '+' }).nth(productIndex);
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async searchProduct(productName) {
    await this.searchBox.fill(productName);
  }

  async addProductToCart(productIndex) {
    await this.addToCartButton(productIndex).click();
  }

  async increaseQuantity(productIndex) {
    await this.increaseQuantityLink(productIndex).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { ProductsPage };
