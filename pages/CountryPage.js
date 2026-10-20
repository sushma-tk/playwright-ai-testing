class CountryPage {
  constructor(page) {
    this.page = page;

    this.countryDropdown = page.getByRole('combobox');
    this.termsCheckbox = page.getByRole('checkbox');
    this.proceedButton = page.getByRole('button', { name: 'Proceed' });
  }

  confirmationMessage(message) {
    return this.page.getByText(message);
  }

  async selectCountry(country) {
    await this.countryDropdown.selectOption(country);
  }

  async agreeToTerms() {
    await this.termsCheckbox.check();
  }

  async proceed() {
    await this.proceedButton.click();
  }
}

module.exports = { CountryPage };
