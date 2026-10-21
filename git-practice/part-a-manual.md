# Part A – Manual Git Practice

**Branch:** `git-manual-practice` (created from `main`)

## Commits

| # | Commit ID | Message | What changed |
|---|-----------|---------|--------------|
| 1 | `fe70ffe` | Add shared GreenKart test data file | New `test-data/greenkart-data.js` with base URL, country and default timeout constants |
| 2 | `7ca9a20` | Add helper to build product names | New `utils/cart-helpers.js` with `buildProductName(name)`, which returns `"<name> - 1 Kg"` |
| 3 | `5a8b450` | Add npm scripts for running tests | `package.json`: added `test` and `test:headed` scripts |
| 4 | `a7d21e2` | Add legacy wait helper | New `utils/legacy-helpers.js` with a `wait(ms)` hard-wait helper (used in conflict scenario 2) |

## Conflict scenarios

*How I simulated a shared-branch pull:* for each scenario I created a `shared-N` branch to act as a teammate's branch, committed a change there, committed a different change on `git-manual-practice`, then ran `git merge shared-N`. That's the merge step that `git pull` does.

### Scenario 1 – Same line edited differently
- **Teammate (`shared-1`):** changed `DEFAULT_TIMEOUT` from `30000` to `45000` – "Increase default timeout to 45 seconds"
- **Me (`git-manual-practice`):** changed the same line to `60000` – "Increase default timeout to 60 seconds"
- **Command:** `git merge shared-1`
- **Git output:**
```
  Auto-merging test-data/greenkart-data.js
  CONFLICT (content): Merge conflict in test-data/greenkart-data.js
  Automatic merge failed; fix conflicts and then commit the result.
```
- **What I saw in the file:**
```
  <<<<<<< HEAD
  const DEFAULT_TIMEOUT = 60000;
  =======
  const DEFAULT_TIMEOUT = 45000;
  >>>>>>> shared-1
```
- **Resolution:** kept `45000`, deleted my `60000` line and the conflict markers, then ran `git add test-data/greenkart-data.js` and `git commit --no-edit`.
- **Merge commit:** `b4badfb`
- **Why:** both sides changed the exact same line, so Git couldn't decide automatically. Only one timeout value can exist, so I had to pick one. I kept the teammate's 45 seconds: it's long enough for this site, and the test fails faster than with 60 seconds when something is actually broken.


### Scenario 2 – One side deletes a file, the other modifies it

- **Teammate (`shared-2`):** deleted `utils/legacy-helpers.js` with `git rm` – "Remove unused legacy wait helper" (`1966a62`)
- **Me (`git-manual-practice`):** changed `function wait(ms)` to `function wait(ms = 1000)` – "Add default value to wait helper" (`eb8f293`)
- **Command:** `git merge shared-2`
- **Git output:**
```
  CONFLICT (modify/delete): utils/legacy-helpers.js deleted in shared-2 and modified in HEAD.  Version HEAD of utils/legacy-helpers.js left in tree.
  Automatic merge failed; fix conflicts and then commit the result.
```
- **What happened:** there were no conflict markers this time. Git kept my edited version of the file in the folder and waited for me to decide: keep the file or delete it.
- **Resolution:** accepted the teammate's deletion with `git rm utils/legacy-helpers.js`, then `git commit --no-edit`.
- **Merge commit:** `8d4c1e1`
- **Why:** the `wait()` helper is a hard wait, which Playwright doesn't need because it auto-waits, and no test uses it. My change only improved a file that shouldn't exist, so deleting it was the right call. If my change had been important, I would have run `git add utils/legacy-helpers.js` instead to keep the file.


### Scenario 3 – Conflicting changes inside the same function

- **Teammate (`shared-3`):** changed `buildProductName` to trim spaces – "Trim spaces in product name" (`e7a24e3`)
```javascript
  return `${name.trim()} - 1 Kg`;
```
- **Me (`git-manual-practice`):** changed `buildProductName` to capitalize the first letter – "Capitalize first letter of product name" (`31db2cb`)
```javascript
  const formatted = name.charAt(0).toUpperCase() + name.slice(1);
  return `${formatted} - 1 Kg`;
```
- **Command:** `git merge shared-3`
- **Git output:**
```
  Auto-merging utils/cart-helpers.js
  CONFLICT (content): Merge conflict in utils/cart-helpers.js
  Automatic merge failed; fix conflicts and then commit the result.
```
- **What I saw in the file:**
```
  <<<<<<< HEAD
    const formatted = name.charAt(0).toUpperCase() + name.slice(1);
    return `${formatted} - 1 Kg`;
  =======
    return `${name.trim()} - 1 Kg`;
  >>>>>>> shared-3
```
- **Resolution:** combined both changes, trimming first and then capitalizing:
```javascript
  function buildProductName(name) {
    const trimmed = name.trim();
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return `${formatted} - 1 Kg`;
  }
```
  Then ran `git add utils/cart-helpers.js` and `git commit --no-edit`.
- **Merge commit:** `2d5710a`
- **Why:** both changes edited the body of the same function, so Git couldn't merge them. But they don't contradict each other; they're two separate improvements. Picking one side would have lost the other, so I combined them by hand. Order matters: trimming first means a name like `"  beans"` becomes `"Beans"`. If I capitalized first, it would try to capitalize a space.


### Scenario 4 – Both sides add different lines in the same place

- **Teammate (`shared-4`):** added a `report` script after `test:headed` in `package.json` – "Add npm script to open HTML report" (`f1a7a13`)
- **Me (`git-manual-practice`):** added a `codegen` script in the same place – "Add npm script to start codegen" (`34c0a35`)
- **Command:** `git merge shared-4`
- **Git output:**
```
  Auto-merging package.json
  CONFLICT (content): Merge conflict in package.json
  Automatic merge failed; fix conflicts and then commit the result.
```
- **What I saw in the file:**
```
  <<<<<<< HEAD
    "test:headed": "playwright test --headed",
    "codegen": "playwright codegen https://rahulshettyacademy.com/seleniumPractise/#/"
  =======
    "test:headed": "playwright test --headed",
    "report": "playwright show-report"
  >>>>>>> shared-4
```
- **Resolution:** kept **both** scripts, removed the markers and the duplicate `test:headed` line, and fixed the commas:
```json
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "report": "playwright show-report",
    "codegen": "playwright codegen https://rahulshettyacademy.com/seleniumPractise/#/"
  },
```
  Checked the JSON was valid with `node -e "require('./package.json')"` (no error), then ran `git add package.json` and `git commit --no-edit`.
- **Merge commit:** `caeca15`
- **Why:** both sides added a new, unrelated script at the same spot. Both also had to add a comma to the `test:headed` line, so Git saw the same line changed twice. Nothing actually contradicts, so the right fix is to keep both. JSON breaks on a single missing or extra comma, so I validated the file before committing.


## Cherry-pick

- **Setup:** created a `feature-extras` branch from `git-manual-practice` and made three separate commits:

  | Commit ID | Message | Change |
  |-----------|---------|--------|
  | `cc0baf7` | Add product list to test data | Added `PRODUCTS` list to `test-data/greenkart-data.js` |
  | `bc7c951` | Add helper to format quantity as text | Added `formatQuantity(quantity)` to `utils/cart-helpers.js` |
  | `83d97b9` | Add chromium-only test script | Added `test:chromium` script to `package.json` |

- **Goal:** bring **only** the `formatQuantity` helper (`bc7c951`) onto `git-manual-practice`, without the commits before or after it.
- **Commands:**
```bash
  git checkout git-manual-practice
  git cherry-pick bc7c951
```
- **Output:**
```
  [git-manual-practice e4083c5] Add helper to format quantity as text
   Date: Tue Oct 20 14:06:37 2026 -0700
   1 file changed, 5 insertions(+), 1 deletion(-)
```
- **Verification:**
```
  grep formatQuantity utils/cart-helpers.js   → found (function + export) ✅
  grep PRODUCTS test-data/greenkart-data.js   → nothing ✅
  grep test:chromium package.json             → nothing ✅
```
- **Result:** only the chosen change was copied. The new commit has a **new ID** (`e4083c5`) because cherry-pick creates a copy of the commit on the current branch; the original `bc7c951` stays on `feature-extras`. No conflict happened because the cherry-picked commit only touched `cart-helpers.js`, which hadn't changed on `git-manual-practice` since `feature-extras` was created.
- **Why cherry-pick instead of merge or reset:** merging `feature-extras` would have brought in all three commits. Resetting would have thrown away later work. Cherry-pick takes just the one change I need.

## Git log
See `part-a-git-log.txt` (created with `git log --oneline --graph --all`).
