Read the skill file .github/skills/playwright-pom/SKILL.md and follow it exactly,
with one exception: for this task, do NOT use the Playwright MCP browser. Use only
the locators from the Playwright CLI codegen recording at
codegen/greenkart-codegen-raw.spec.js instead of MCP-discovered locators.

Refactor that recording into the Page Object Model defined in the skill file:
- Put the Page Object classes in a new folder pages/codegen/
- Create the test at tests/CLI-Codegen-test.spec.js
- Do not change codegen/greenkart-codegen-raw.spec.js, the skill file,
  or any existing files in pages/ or tests/

Go through the skill file's final checklist, then run
npx playwright test tests/CLI-Codegen-test.spec.js --headed and fix any
failure until it passes. List every change you had to make to the codegen
locators and why.