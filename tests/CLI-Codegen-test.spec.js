const { test, expect } = require('@playwright/test');
const { ProductsPage } = require('../pages/codegen/ProductsPage');
const { CartPage } = require('../pages/codegen/CartPage');
const { CheckoutPage } = require('../pages/codegen/CheckoutPage');

const BASE_URL = 'https://rahulshettyacademy.com/seleniumPractise/#/';
const FIRST_PRODUCT = 'beans';
const SECOND_PRODUCT = 'pumpkin';
const FIRST_PRODUCT_INDEX = 6;
const SECOND_PRODUCT_INDEX = 11;
const FIRST_PRODUCT_QUANTITY = '1';
const SECOND_PRODUCT_QUANTITY = '2';
const COUNTRY = 'United States';
const CONFIRMATION_MESSAGE =
  "Thank you, your order has been placed successfully You'll be redirected to Home page shortly!!";

test('add products to the cart and complete checkout', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await productsPage.goto(BASE_URL);
  await productsPage.searchProduct(FIRST_PRODUCT);
  await productsPage.addProductToCart(FIRST_PRODUCT_INDEX);
  await productsPage.searchProduct(SECOND_PRODUCT);
  await productsPage.increaseQuantity(SECOND_PRODUCT_INDEX);
  await productsPage.addProductToCart(SECOND_PRODUCT_INDEX);
  await productsPage.openCart();
  await cartPage.proceedToCheckout();

  await expect(cartPage.cartTable).toContainText(FIRST_PRODUCT_QUANTITY);
  await expect(cartPage.cartTable).toContainText(SECOND_PRODUCT_QUANTITY);

  await cartPage.placeOrder();
  await checkoutPage.selectCountry(COUNTRY);
  await checkoutPage.acceptTerms();
  await checkoutPage.proceed();

  await expect(checkoutPage.confirmationMessage).toContainText(CONFIRMATION_MESSAGE);
  await productsPage.goto(BASE_URL);
});
