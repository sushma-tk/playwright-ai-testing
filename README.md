# Playwright AI Testing

Hands-on work using AI coding agents with Playwright. Everything here uses the same demo app so results are easy to compare.

**Application under test:** [GreenKart – Rahul Shetty Academy](https://rahulshettyacademy.com/seleniumPractise/#/)

**Tools:** VS Code, Playwright (JavaScript), GitHub Copilot (Agent mode), Playwright MCP server

---

## What's inside

| # | Topic | Prompt | Test |
|---|-------|--------|------|
| 1 | Generate a test with the Playwright MCP server | [prompts/mcp-driven-test-prompt.md](prompts/mcp-driven-test-prompt.md) | [tests/mcp-driven-test.spec.js](tests/mcp-driven-test.spec.js) |
| 2 | Enforce Page Object Model with a skill file | [prompts/Skill-File-POM-Enforcement-prompt.md](prompts/Skill-File-POM-Enforcement-prompt.md) | [tests/Skill-File-POM-Enforcement-test.spec.js](tests/Skill-File-POM-Enforcement-test.spec.js) |

---

## 1. MCP-driven test generation

### Goal
Let an AI agent drive a live browser through the Playwright MCP server, find the real locators by itself, and turn them into a working Playwright test.

### What I did
1. Created a new Playwright project in VS Code (JavaScript).
2. Added the Playwright MCP server in `.vscode/mcp.json` so Copilot can control a browser.
3. Wrote the manual steps for a checkout flow.
4. Gave Copilot a prompt telling it to run the steps **one at a time** through MCP, take a snapshot after each step, and only use locators it actually saw.
5. Did not give the agent any locators. It found all of them itself.
6. Had the agent generate the test from those locators and run it.
7. Asked for fixes through follow-up prompts in the same chat (no hand edits), and saved prompt in the prompt file.
8. Test passes against the live site.

### Test case: GreenKart checkout
1. Open the GreenKart home page
2. Search for **Beans** and add **1 kg** to the cart
3. Search for **Pumpkin** and add **2 kg** to the cart
4. Open the cart and click **Proceed to Checkout**
5. Check that both products and quantities are correct in the cart
6. Click **Place Order**
7. Select **United States** from the country dropdown
8. Tick **Agree to the Terms & Conditions**
9. Click **Proceed**
10. Verify the message “Thank you, your order has been placed successfully” is shown

### MCP setup
`.vscode/mcp.json`
```json
{
  "servers": {
    "playwright": {
      "command": "/opt/homebrew/bin/npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```
> Use the output of `which npx` for the command path on your machine.
> In VS Code, send any message in Copilot Chat first, then click **Start** above `"playwright"` in `mcp.json`.

---

## 2. Page Object Model with a skill file

### Goal
Write my coding standard in a skill file, then have the AI agent refactor the test from topic 1 to follow it using one prompt.

### What I did
1. Wrote a skill file: [.github/skills/playwright-pom/SKILL.md](.github/skills/playwright-pom/SKILL.md).
2. Gave the agent one prompt: read the skill file, re-run the same test case through MCP to rediscover the locators, and build a new POM-based test.
3. The prompt points to the topic 1 prompt file instead of repeating the manual steps.
4. Kept the topic 1 test unchanged so both versions can be compared.
5. Test passes against the live site.

### What the skill file requires
- **Page Object Model:** one Page Object class per page.
- **Locators:** all locators live in the Page Object classes, never in the test file, and must be discovered through MCP.
- **Class structure:** constructor → locator properties → dynamic locators → action methods → `module.exports`. No assertions or test data inside classes.
- **Test file:** imports classes with `require`, creates them with `new ClassName(page)`, keeps test data as constants at the top, and only calls methods and asserts on page object locators.

### Page Objects created
| File | Page |
|------|------|
| [pages/ProductsPage.js](pages/ProductsPage.js) | Search, set quantity, add to cart, open cart, proceed to checkout |
| [pages/CartPage.js](pages/CartPage.js) | Quantity per product, place order |
| [pages/CountryPage.js](pages/CountryPage.js) | Choose country, agree to terms, proceed, confirmation message |

---

## How to run
```bash
npm install
npx playwright install
npx playwright test                 # run all tests
npx playwright test --headed        # watch it in a browser
```










