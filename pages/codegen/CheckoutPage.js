class CheckoutPage {
  constructor(page) {
    this.page = page;

    this.countryDropdown = page.getByRole('combobox');
    this.termsCheckbox = page.getByRole('checkbox');
    this.proceedButton = page.getByRole('button', { name: 'Proceed' });
    this.confirmationMessage = page.locator('#root');
  }

  async selectCountry(country) {
    await this.countryDropdown.selectOption(country);
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async proceed() {
    await this.proceedButton.click();
  }
}

module.exports = { CheckoutPage };
