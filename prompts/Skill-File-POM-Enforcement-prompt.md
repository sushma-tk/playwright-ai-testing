Read the skill file .github/skills/playwright-pom/SKILL.md and follow it exactly.

Re-run the manual test case from prompts/mcp-driven-test-prompt.md step by step through the Playwright MCP browser so you rediscover the real locators. Take a snapshot after each step and only use locators you actually see.

Then refactor tests/mcp-driven-test.spec.js into a new test at
tests/Skill-File-POM-Enforcement-test.spec.js that follows the skill file: put every locator in Page Object classes inside the pages/ folder, and have the test only import and drive those classes. Do not change tests/mcp-driven-test.spec.js.

Go through the skill file's final checklist, then run
npx playwright test tests/Skill-File-POM-Enforcement-test.spec.js --headed and fix any failure using the MCP browser until it passes.