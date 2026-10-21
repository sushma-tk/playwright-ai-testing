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
| 3 | Playwright CLI codegen + POM, compared with MCP | [prompts/CLI-Codegen-prompt.md](prompts/CLI-Codegen-prompt.md) | [tests/CLI-Codegen-test.spec.js](tests/CLI-Codegen-test.spec.js) |
| 4 | Git workflows: manual vs Git MCP agent | [git-practice/part-b-mcp.md](git-practice/part-b-mcp.md) | [git-practice/part-a-manual.md](git-practice/part-a-manual.md) (notes, no test) |

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

## 3. Playwright CLI codegen + POM
 
### Goal
Repeat topics 1 and 2 using Playwright CLI `codegen` instead of the MCP server, then compare the two approaches.
 
### What I did
1. Recorded the same test case by hand with codegen, including assertions for quantities and the confirmation message:
```bash
   npx playwright codegen https://rahulshettyacademy.com/seleniumPractise/#/ -o codegen/greenkart-codegen-raw.spec.js
```
2. Saved the raw recording unchanged: [codegen/greenkart-codegen-raw.spec.js](codegen/greenkart-codegen-raw.spec.js).
3. Gave the agent one prompt with the recording and the **same skill file from topic 2, unchanged**. The prompt tells the agent to use the codegen locators instead of MCP and does not repeat the manual steps.
4. The agent refactored the recording into POM, with page classes in `pages/codegen/` so the topic 2 page objects stay untouched.
5. Test passes against the live site.
### Page Objects created
| File | Page |
|------|------|
| [pages/codegen/ProductsPage.js](pages/codegen/ProductsPage.js) | Search, increase quantity, add to cart, open cart |
| [pages/codegen/CartPage.js](pages/codegen/CartPage.js) | Cart table, proceed to checkout, place order |
| [pages/codegen/CheckoutPage.js](pages/codegen/CheckoutPage.js) | Choose country, accept terms, proceed, confirmation message |
 
### MCP vs CLI codegen
 
| | MCP (topics 1–2) | CLI codegen (topic 3) |
|---|---|---|
| **Locator quality** | Role- and name-based, tied to the product (`heading 'Beans - 1 Kg'`, exact quantity cell). Stable. | Index-based (`nth(6)`, `nth(11)`), a truncated search box name, and CSS (`tbody`, `#root`). Depends on product order and timing. |
| **Agent effort** | High. The agent drove the browser step by step, took snapshots and found every locator itself. Topic 1 needed follow-up prompts. | Low. I recorded the flow by hand; the agent only restructured the recorded code into POM from one prompt. |
| **Manual clean-up** | Little. After a few follow-ups the locators and assertions were solid. | More needed: replace index locators with name-based ones, check the exact quantity cell instead of the whole table, target only the message text, and remove the extra `goto` recorded during the redirect. |
| **Best for** | Reliable, readable tests that need less fixing later. | A quick first draft of a flow that needs review before relying on it. |
 
**Takeaway:** codegen is faster to start, but MCP gives better locators because the agent reads the page by role and name. Codegen records exactly what was clicked, including positions and timing.
 
---

## 4. Git workflows: manual vs Git MCP
 
### Goal
Practice commits, merge-conflict resolution and cherry-pick by hand, then repeat every scenario by giving an AI agent plain-English instructions through a Git MCP server.
 
### Part A – Manual (branch `git-manual-practice`)
- **4 commits:** shared test data file, product name helper, npm scripts, legacy wait helper.
- **4 conflict scenarios.** A `shared-N` branch played a teammate; merging it simulated a `git pull`:
  | # | Scenario | Resolution |
  |---|----------|------------|
  | 1 | Same line edited differently (timeout 45000 vs 60000) | Kept one value (45000) |
  | 2 | One side deleted a file, the other modified it | Accepted the deletion (`git rm`) |
  | 3 | Conflicting changes in the same function (trim vs capitalize) | Combined both: trim, then capitalize |
  | 4 | Both sides added a different npm script in the same place | Kept both and checked the JSON is valid |
- **Cherry-pick:** made 3 commits on `feature-extras`, then brought only the middle one (`formatQuantity` helper) onto `git-manual-practice` with `git cherry-pick`.
- Notes: [git-practice/part-a-manual.md](git-practice/part-a-manual.md) · History: [git-practice/part-a-git-log.txt](git-practice/part-a-git-log.txt)
### Part B – Git MCP (branch `git-mcp-practice`)
- Added [`@cyanheads/git-mcp-server`](https://github.com/cyanheads/git-mcp-server) to `.vscode/mcp.json`. I picked it because it has merge and cherry-pick tools.
- Repeated every Part A scenario with **7 natural-language prompts** to Copilot. I typed no Git commands; the agent used Git MCP tools (`git_branch`, `git_checkout`, `git_commit`, `git_merge`, `git_add`, `git_cherry_pick`, `git_log`…) plus a file-editing tool for code changes.
- Practice branches used `mcp-shared-1` to `mcp-shared-4` and `mcp-feature-extras`, so they stay separate from Part A.
- Prompts, agent actions and comparison: [git-practice/part-b-mcp.md](git-practice/part-b-mcp.md) · History: [git-practice/part-b-git-log.txt](git-practice/part-b-git-log.txt)
### Manual vs agent (short version)
| | Manual | Git MCP agent |
|---|---|---|
| **Effort** | About 60 commands typed | 7 prompts, no Git commands |
| **Speed** | About 1 hour | About 25 minutes |
| **Conflict decisions** | My own, with technical reasons | Correct, but only because I said which side to keep |
| **Checks** | Validated JSON before committing | Skipped JSON validation; added extra Git status/diff checks |
| **Tool gaps** | None | No file editing, no `git rm`, no graph log, so it needed workarounds and many extra tool calls |
 
**Takeaway:** the agent is great at doing Git steps quickly from clear instructions, but the decisions and the final review still need someone who understands Git.
 
> All practice branches are pushed to GitHub but **not merged** into `main`. Use the branch dropdown to see them.

---

## How to run
```bash
npm install
npx playwright install
npx playwright test                 # run all tests
npx playwright test --headed        # watch it in a browser
```










