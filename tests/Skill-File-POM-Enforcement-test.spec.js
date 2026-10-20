const { test, expect } = require('@playwright/test');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { CountryPage } = require('../pages/CountryPage');

const BASE_URL = 'https://rahulshettyacademy.com/seleniumPractise/#/';
const BEANS_SEARCH = 'Beans';
const BEANS_NAME = 'Beans - 1 Kg';
const BEANS_QTY = 1;
const PUMPKIN_SEARCH = 'Pumpkin';
const PUMPKIN_NAME = 'Pumpkin - 1 Kg';
const PUMPKIN_QTY = 2;
const COUNTRY = 'United States';
const ORDER_CONFIRMATION_MESSAGE = 'Thank you, your order has been placed successfully';

test('complete GreenKart checkout using page objects', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const countryPage = new CountryPage(page);

  await productsPage.goto(BASE_URL);

  await productsPage.searchProduct(BEANS_SEARCH);
  await expect(productsPage.productHeading(BEANS_NAME)).toBeVisible();
  await expect(productsPage.addToCartButton).toHaveCount(1);
  await productsPage.setQuantity(BEANS_QTY);
  await productsPage.addToCart();

  await productsPage.searchProduct(PUMPKIN_SEARCH);
  await expect(productsPage.productHeading(BEANS_NAME)).toBeHidden();
  await expect(productsPage.productHeading(PUMPKIN_NAME)).toBeVisible();
  await expect(productsPage.addToCartButton).toHaveCount(1);
  await productsPage.setQuantity(PUMPKIN_QTY);
  await productsPage.addToCart();

  await productsPage.openCart();
  await productsPage.proceedToCheckout();

  await expect(cartPage.quantityCell(BEANS_NAME)).toHaveText(String(BEANS_QTY));
  await expect(cartPage.quantityCell(PUMPKIN_NAME)).toHaveText(String(PUMPKIN_QTY));

  await cartPage.placeOrder();
  await countryPage.selectCountry(COUNTRY);
  await countryPage.agreeToTerms();
  await countryPage.proceed();

  await expect(countryPage.confirmationMessage(ORDER_CONFIRMATION_MESSAGE)).toBeVisible();
});
