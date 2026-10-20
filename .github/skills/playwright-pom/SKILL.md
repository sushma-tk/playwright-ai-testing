---
name: playwright-pom
description: Coding standard for Playwright test scripts in this project. Use whenever you write, generate or refactor a Playwright test. All tests must follow the Page Object Model (POM), keep every locator in a Page Object class, and drive those classes from the test file.
---

# Playwright Test Coding Standard

Follow every rule in this file when you write, generate or refactor a Playwright test in this project. If a rule here conflicts with your default habits, this file wins.

---

## 1. Design pattern: Page Object Model (required)

- Every test script **must** follow the **Page Object Model (POM)** design pattern.
- Create **one Page Object class per page or screen** of the application (for example: a products page, a cart page, an order/country page).
- A Page Object class represents what a user can **see** (locators) and **do** (actions) on that page.
- Tests describe the **flow and the checks**. Page Objects hold **how** to find and interact with elements.

---

## 2. Locator placement (required)

- **All locators must live inside a Page Object class.** No exceptions.
- The test file must **never** contain a locator. These are **not allowed** in a test file:
  - `page.getByRole(...)`, `page.getByText(...)`, `page.getByPlaceholder(...)`, `page.getByLabel(...)`
  - `page.locator(...)`, CSS selectors, XPath
- Locators must be the **real locators discovered through the Playwright MCP browser** (from a snapshot). Never guess or hand-write a locator.
- Locator priority, best first:
  1. `getByRole`
  2. `getByPlaceholder` / `getByLabel`
  3. `getByText`
  4. CSS `locator(...)` only if nothing above works
- One locator is defined **once**, in one class. Do not copy the same locator into two classes.

---

## 3. Project folder structure

```
project-root/
├── pages/                  # Page Object classes (one file per page)
│   ├── ProductsPage.js
│   ├── CartPage.js
│   └── ...
├── tests/                  # Test files (*.spec.js)
│   └── example.spec.js
└── playwright.config.js
```

- Page Object files go in `pages/`.
- Test files go in `tests/` and end with `.spec.js`.
- **File name = class name**, PascalCase, ending in `Page`: `pages/CartPage.js` contains `class CartPage`.

---

## 4. Page Object class structure (required)

Every Page Object class has these parts, **in this order**:

### 4.1 Constructor
- Takes `page` as its only parameter.
- Saves it as `this.page`.

### 4.2 Properties (locators)
- All fixed locators are defined as properties **inside the constructor**.
- Property names are camelCase and describe the element plus its type:
  `searchBox`, `cartIcon`, `placeOrderButton`, `countryDropdown`, `termsCheckbox`.

### 4.3 Dynamic locators
- A locator that needs a value (a product name, a row text) is a **regular method that returns a locator**. It is not `async` and does not click or fill anything.
- Name it after the element: `productHeading(name)`, `cartRow(productName)`, `quantityCell(productName)`.

### 4.4 Action methods
- One method per user action: `goto()`, `searchProduct(name)`, `addToCart()`, `selectCountry(country)`.
- Every action method:
  - is `async`
  - uses `await` on every Playwright call
  - uses **only** locators defined in the same class
  - starts with a verb and has a clear name
  - receives test data as **arguments** (never hardcodes test data)

### 4.5 Export
- Export the class at the **bottom** of the file with CommonJS:
```javascript
  module.exports = { CartPage };
```

### 4.6 Not allowed in a Page Object class
- `expect` assertions (assertions belong in the test file)
- Test data (product names, quantities, country names, messages)
- `waitForTimeout` or hard waits
- `Promise.all`, environment variables, base classes or inheritance

### Page Object template

```javascript
class ExamplePage {
  // 4.1 Constructor
  constructor(page) {
    this.page = page;

    // 4.2 Properties (locators)
    this.searchBox = page.getByPlaceholder('...');
    this.submitButton = page.getByRole('button', { name: '...' });
  }

  // 4.3 Dynamic locators
  itemHeading(name) {
    return this.page.getByRole('heading', { name: name });
  }

  // 4.4 Action methods
  async goto(url) {
    await this.page.goto(url);
  }

  async searchItem(text) {
    await this.searchBox.fill(text);
  }

  async submit() {
    await this.submitButton.click();
  }
}

// 4.5 Export
module.exports = { ExamplePage };
```

> The template shows the **shape only**. The `'...'` values must be replaced with real locators found through the MCP browser.

---

## 5. Importing and driving Page Objects from the test file (required)

### 5.1 Import
- Import Playwright first, then each Page Object with `require` and a relative path:
```javascript
  const { test, expect } = require('@playwright/test');
  const { ExamplePage } = require('../pages/ExamplePage');
```

### 5.2 Test data
- All test data goes in **constants at the top** of the test file, in UPPER_SNAKE_CASE:
```javascript
  const BASE_URL = 'https://...';
  const ITEM_NAME = '...';
  const ITEM_QTY = 2;
```

### 5.3 Create Page Objects
- Create each Page Object **inside the test**, passing `page`:
```javascript
  const examplePage = new ExamplePage(page);
```
- Variable name = class name in camelCase (`ExamplePage` → `examplePage`).

### 5.4 Drive the flow
- The test only:
  - **calls Page Object action methods**, and
  - **asserts on Page Object locators** with `expect`.
- Assertions use web-first `await expect(...)` (`toBeVisible`, `toHaveText`, `toContainText`).

### Test file template

```javascript
const { test, expect } = require('@playwright/test');
const { ExamplePage } = require('../pages/ExamplePage');

const BASE_URL = 'https://...';
const ITEM_NAME = '...';

test('clear name of the test case', async ({ page }) => {
  const examplePage = new ExamplePage(page);

  await examplePage.goto(BASE_URL);
  await examplePage.searchItem(ITEM_NAME);
  await expect(examplePage.itemHeading(ITEM_NAME)).toBeVisible();
  await examplePage.submit();
});
```

---

## 6. General code style

- Simple, beginner-friendly JavaScript (CommonJS `require`).
- Small methods that do one thing.
- One `test()` per test case, with a clear name.
- No `waitForTimeout`, no `Promise.all`, no environment variables.
- Short comments only where they help.

---

## 7. Final checklist (go through this before finishing)

- [ ] The test follows the Page Object Model.
- [ ] Every locator is inside a class in `pages/` and was discovered through the MCP browser.
- [ ] The test file has **zero** `page.getBy...` or `page.locator(...)` calls.
- [ ] Each class follows the order: constructor → properties → dynamic locators → actions → `module.exports`.
- [ ] No `expect` and no test data inside Page Object classes.
- [ ] The test file imports each class with `require('../pages/...')`, creates it with `new ClassName(page)`, and only calls its methods and asserts on its locators.
- [ ] Test data constants are at the top of the test file.
- [ ] The test runs and passes with `npx playwright test`.