const { test, expect } = require('@playwright/test');

const PRODUCT_URL = 'https://rahulshettyacademy.com/seleniumPractise/#/';
const SEARCH_TEXT = 'Search for Vegetables and Fruits';
const BEANS_NAME = 'Beans - 1 Kg';
const PUMPKIN_NAME = 'Pumpkin - 1 Kg';
const BEANS_SEARCH = 'Beans';
const PUMPKIN_SEARCH = 'Pumpkin';
const BEANS_QTY = 1;
const PUMPKIN_QTY = 2;
const COUNTRY = 'United States';
const MESSAGE = 'Thank you, your order has been placed successfully';

async function addProductToCart(page, productName, quantity) {
  const searchBox = page.getByPlaceholder(SEARCH_TEXT);
  await searchBox.fill(productName);

  const addToCartButton = page.getByRole('button', { name: 'ADD TO CART' });
  await expect(page.getByRole('heading', { name: `${productName} - 1 Kg` })).toBeVisible();
  await expect(addToCartButton).toHaveCount(1);

  if (quantity > 1) {
    for (let i = 1; i < quantity; i++) {
      await page.getByRole('link', { name: '+' }).last().click();
    }
  }

  await addToCartButton.click();
}

async function verifyCartQuantities(page) {
  const rows = page.getByRole('row');
  const beansRow = rows.filter({ hasText: BEANS_NAME });
  const pumpkinRow = rows.filter({ hasText: PUMPKIN_NAME });

  await expect(beansRow.getByRole('cell').nth(2)).toHaveText(String(BEANS_QTY));
  await expect(pumpkinRow.getByRole('cell').nth(2)).toHaveText(String(PUMPKIN_QTY));
}

test('greenkart checkout flow', async ({ page }) => {
  await page.goto(PRODUCT_URL);

  await addProductToCart(page, BEANS_SEARCH, BEANS_QTY);
  await addProductToCart(page, PUMPKIN_SEARCH, PUMPKIN_QTY);

  await page.getByRole('img', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();

  await verifyCartQuantities(page);

  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.getByRole('combobox').selectOption(COUNTRY);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Proceed' }).click({ noWaitAfter: true });
  await expect(page.getByText(MESSAGE)).toBeVisible();
});
