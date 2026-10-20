You have access to the Playwright MCP server. Use it to drive a live browser.
Do NOT write any test code until all manual steps are done.

Execute this manual test case ONE STEP AT A TIME using the MCP browser tools.
After each step, take a browser snapshot, confirm the step worked, and tell me
the exact locator you used for that step (based on what you saw in the snapshot).
Do not guess locators and do not use any locator you did not see in a snapshot.

Manual steps:
1. Go to https://rahulshettyacademy.com/seleniumPractise/#/
2. Search for "Beans" and add 1 quantity of "Beans - 1 Kg" to the cart
3. Search for "Pumpkin" and add 2 quantities of "Pumpkin - 1 Kg" to the cart
4. Click the cart image, then click "PROCEED TO CHECKOUT"
5. On the cart page, verify Beans - 1 Kg has quantity 1 and Pumpkin - 1 Kg has quantity 2
6. Click "Place Order"
7. Select "United States" from the Choose Country dropdown
8. Check the "Agree to the Terms & Conditions" checkbox
9. Click "Proceed"

After all steps pass, list every locator you discovered in a table (step, locator).

Then generate a Playwright JavaScript test at tests/mcp-driven-test.spec.js using
ONLY those discovered locators. 
Code style:
- beginner-friendly and simple
- test data (product names, quantities, country, expected message) as constants at the top
- small reusable helper functions (e.g. addProductToCart(page, name, qty))
- prefer getByRole / getByText / getByPlaceholder where the snapshot supports it
- no Promise.all, no env variables, no page object classes

Finally, run: npx playwright test tests/mcp-driven-test.spec.js --headed
If it fails, use the MCP browser to re-check the failing step, fix the locator
from what you observe, and re-run until it passes.











## Follow-up prompt :
On the cart page, take a snapshot and find the locator for the quantity cell in each product row. Assert the exact quantity (1 for Beans, 2 for Pumpkin) instead of checking that the row contains "1" or "2".
Use the constants for product search and add BEANS_QTY and PUMPKIN_QTY constants.
For every CSS locator in the test (.product, tr, select, checkbox), confirm it was seen via MCP. If a role-based locator exists in the snapshot, use that instead.
Then re-run the test with --headed until it passes.