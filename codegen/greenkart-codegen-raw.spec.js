import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
  await page.getByRole('searchbox', { name: 'Search for Vegetables and' }).click();
  await page.getByRole('searchbox', { name: 'Search for Vegetables and' }).fill('beans');
  await page.getByRole('button', { name: 'ADD TO CART' }).click();
  await page.getByRole('searchbox', { name: 'Search for Vegetables and' }).dblclick();
  await page.getByRole('searchbox', { name: 'Search for Vegetables and' }).fill('pumpkin');
  await page.getByRole('link', { name: '+' }).click();
  await page.getByRole('button', { name: 'ADD TO CART' }).click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
  await expect(page.locator('tbody')).toContainText('1');
  await expect(page.locator('tbody')).toContainText('2');
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.getByRole('combobox').selectOption('United States');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Proceed' }).click();
  await expect(page.locator('#root')).toContainText('Thank you, your order has been placed successfully You\'ll be redirected to Home page shortly!!');
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
});