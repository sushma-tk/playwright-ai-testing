class ProductsPage {
  constructor(page) {
    this.page = page;

    this.searchBox = page.getByRole('searchbox', { name: 'Search for Vegetables and Fruits' });
    this.quantityInput = page.getByRole('spinbutton');
    this.addToCartButton = page.getByRole('button', { name: 'ADD TO CART' });
    this.cartIcon = page.getByRole('img', { name: 'Cart' });
    this.checkoutButton = page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
  }

  productHeading(name) {
    return this.page.getByRole('heading', { name: name });
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async searchProduct(searchText) {
    await this.searchBox.fill(searchText);
  }

  async setQuantity(quantity) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { ProductsPage };
