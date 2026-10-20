class CartPage {
  constructor(page) {
    this.page = page;

    this.cartRows = page.getByRole('row');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  cartRow(productName) {
    return this.cartRows.filter({ hasText: productName });
  }

  quantityCell(productName) {
    return this.cartRow(productName).getByRole('cell').nth(2);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

module.exports = { CartPage };
