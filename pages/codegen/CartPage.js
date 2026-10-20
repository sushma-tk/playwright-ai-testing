class CartPage {
  constructor(page) {
    this.page = page;

    this.cartTable = page.locator('tbody');
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

module.exports = { CartPage };
