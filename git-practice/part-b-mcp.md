# Part B – Git practice through Git MCP

**Setup:** `@cyanheads/git-mcp-server` added to `.vscode/mcp.json` next to the Playwright MCP server. GitHub Copilot in Agent mode with **Manual permissions**, so every tool call needed my approval. I typed no Git commands myself; the agent did every Git action through Git MCP tools.

**Branch:** `git-mcp-practice` (created from `main` by the agent)

---

## Scenario: Three+ commits

**Instruction I gave:**
```
Use only the Git MCP tools for every Git action, never the terminal.
Create a branch called git-mcp-practice from main and switch to it. Then make
these four commits, one at a time, each with a clear message:
1. Add test-data/greenkart-data.js exporting the GreenKart base URL, the country
   "United States" and a DEFAULT_TIMEOUT of 30000.
2. Add utils/cart-helpers.js with a buildProductName(name) function that returns
   the name followed by " - 1 Kg".
3. Add npm scripts "test" and "test:headed" to package.json.
4. Add utils/legacy-helpers.js with a wait(ms) function that waits using setTimeout.
Show me the git log when done.
```

**What the agent did (in order):**
1. `git_set_working_dir` – pointed Git MCP at the project folder
2. Read the workspace (`glob`, `view` on `package.json`, `playwright.config.js` and the existing tests) to understand the project
3. `git_branch` – checked the current branch
4. `git_branch` – created `git-mcp-practice` from `main`
5. `git_checkout` – switched to `git-mcp-practice`
6. For each of the 4 changes: `apply_patch` (create/edit the file) → `git_commit` with that one file in `filesToStage`
7. `git_log` and `git_status` – verified the result
8. Read the 4 files again to confirm the content

**Terminal used:** No.

**Result:**
| Commit ID | Message (chosen by agent) |
|-----------|---------------------------|
| `630f5ad` | Add GreenKart test data |
| `2aea128` | Add cart product name helper |
| `9180a39` | Add Playwright test scripts |
| `89476e0` | Add legacy wait helper |

**Observations:**
- The agent wrote its own commit messages. They're clear, but different from my Part A messages.
- It staged and committed in one step (`git_commit` with `filesToStage`) instead of a separate `git_add`.
- It only staged the files for each change. It left my uncommitted `.vscode/mcp.json` and untracked `git-practice/` alone, the same care I took manually with `git add <file>`.
- It read the project and verified its work before and after, which I didn't do in Part A.

---

## Scenario 1 – Same line edited differently
**Instruction I gave:**
```
Using only Git MCP tools, simulate a teammate conflict: create a branch
mcp-shared-1 from git-mcp-practice, change DEFAULT_TIMEOUT to 45000 there and
commit. Switch back to git-mcp-practice, change the same line to 60000 and commit.
Then merge mcp-shared-1 into git-mcp-practice. When the conflict happens, show it
to me, resolve it by keeping 45000, and complete the merge. Explain why that
resolution is right.
At the end, list every tool you called, in order, with the main arguments.
```

**What the agent did (in order):**
1. Asked my permission to use the file-editing tool (`apply_patch`), because Git MCP can't edit file contents → I allowed it
2. `git_set_working_dir` → project folder
3. `git_branch` → created `mcp-shared-1` from `git-mcp-practice`
4. `git_checkout` → `mcp-shared-1`
5. `apply_patch` → `DEFAULT_TIMEOUT` 30000 → 45000
6. `git_commit` → "Set shared timeout to 45000"
7. `git_checkout` → `git-mcp-practice`
8. `apply_patch` → `DEFAULT_TIMEOUT` 30000 → 60000
9. `git_commit` → "Set default timeout to 60000"
10. `git_merge` → merged `mcp-shared-1`, **conflict reported** in `test-data/greenkart-data.js`
11. `git_diff` + `git_status` → showed the conflict markers and confirmed the file was conflicted
12. `apply_patch` → kept `45000`, removed the markers
13. `git_diff` + `git_status` → checked the resolved file
14. `git_add` → staged only `test-data/greenkart-data.js`
15. `git_commit` → "Merge mcp-shared-1 and keep 45000 timeout" (`d449dbb`)
16. `git_show` (file + HEAD), `git_log`, `git_status` → verified the final value is 45000, the merge commit has two parents, and no conflicts remain

**Terminal used:** No.

**Conflict the agent showed:**
```
<<<<<<< HEAD
  DEFAULT_TIMEOUT: 60000,
=======
  DEFAULT_TIMEOUT: 45000,
>>>>>>> mcp-shared-1
```

**Result:** resolved correctly to `45000`. Merge commit `d449dbb`.

**Observations:**
- Git MCP has no tool for editing file contents, so creating and resolving the conflict needed the editor tool (`apply_patch`). The agent noticed this itself and asked before using it.
- Same steps as Part A, but the agent added extra checks I didn't do manually (`git_diff`/`git_status` before and after resolving, `git_show` on the merge commit).
- Its explanation of *why* was weaker than mine: it said 45000 was right only because I asked for it. In Part A, I gave a reason (faster failure, still long enough for the site). The agent follows the instruction; the judgment about which value is better stayed with me.
- The agent wrote the test data as an object (`DEFAULT_TIMEOUT: 45000,`), while in Part A I used separate `const` lines. Same task, slightly different code.

## Scenario 2 – One side deletes a file, the other modifies it
**Instruction I gave:**
```
Using only Git MCP tools for Git actions (you may use the file-editing tool for
file content), create a branch mcp-shared-2 from git-mcp-practice and delete
utils/legacy-helpers.js there with a commit. Switch back to git-mcp-practice,
change wait(ms) to have a default of 1000 and commit. Merge mcp-shared-2. When the
conflict happens, show it to me, resolve it by accepting the deletion, and complete
the merge. Explain why.
At the end, list every tool you called, in order, with the main arguments.
```

**What the agent did (in order):**
1. `git_set_working_dir` → project folder; read `legacy-helpers.js` first
2. `git_branch` → created `mcp-shared-2` from `git-mcp-practice`
3. `git_checkout` → `mcp-shared-2`
4. `apply_patch` → deleted `utils/legacy-helpers.js`
5. `git_commit` → "Delete legacy wait helper"
6. `git_checkout` → `git-mcp-practice`
7. `apply_patch` → `wait(ms)` → `wait(ms = 1000)`
8. `git_commit` → "Default legacy wait to 1000ms"
9. `git_merge` → merged `mcp-shared-2`, **delete/modify conflict** on `utils/legacy-helpers.js`
10. `git_diff` + `git_status` → confirmed the file was unmerged (deleted on one side, modified on the other)
11. `apply_patch` → deleted the file to accept the deletion
12. `git_add` → staged the deletion
13. `git_commit` → "Merge mcp-shared-2 and accept helper deletion" (`4393a3f`)
14. `git_show` on the file → **failed** with `path does not exist`, which proves the file is gone
15. `git_show` HEAD + `git_status` → confirmed the merge commit and no conflicts remain

**Terminal used:** No.

**Result:** resolved correctly. The file is deleted on `git-mcp-practice`. Merge commit `4393a3f`.

**Observations:**
- Same as Part A, there were no conflict markers to show for a delete/modify conflict. The agent said `git_diff` only reports the path as unmerged; it can't display content for this type.
- Git MCP has no `git rm` tool, so the agent deleted the file with the editor tool and then staged the deletion with `git_add`. In Part A, I did both in one step with `git rm`.
- The agent used a "failed" `git_show` on purpose as a check: the error `path does not exist` confirmed the deletion.
- Its "why" again just repeated my instruction ("matches your instruction and preserves the shared branch's intended removal"). In Part A, my reason was technical: hard waits aren't needed in Playwright and nothing used the file.
- It needed many `tool_search` calls to find the right Git MCP tools before each step. That's extra overhead that the manual approach doesn't have.

## Scenario 3 – Conflicting changes inside the same function
**Instruction I gave:**
```
Using only Git MCP tools for Git actions (you may use the file-editing tool for
file content), create a branch mcp-shared-3 from git-mcp-practice. There, change
buildProductName to trim spaces from the name and commit. Switch back to
git-mcp-practice, change buildProductName to capitalize the first letter and
commit. Merge mcp-shared-3. When the conflict happens, show it to me, resolve it
by keeping both changes (trim first, then capitalize), and complete the merge.
Explain why.
At the end, list every tool you called, in order, with the main arguments.
```

**What the agent did (in order):**
1. `git_set_working_dir` → project folder; read `cart-helpers.js` first
2. `git_branch` → created `mcp-shared-3` from `git-mcp-practice`
3. `git_checkout` → `mcp-shared-3`
4. `apply_patch` → `buildProductName` trims the name
5. `git_commit` → "Trim product names before building labels"
6. `git_checkout` → `git-mcp-practice`
7. `apply_patch` → `buildProductName` capitalizes the first letter
8. `git_commit` → "Capitalize first letter of product names"
9. `git_merge` → merged `mcp-shared-3`, **conflict reported** in `utils/cart-helpers.js`
10. `git_diff` + `git_status` → showed the conflict markers and confirmed the file was conflicted
11. `apply_patch` → combined both changes: trim first, then capitalize
12. `git_add` → staged only `utils/cart-helpers.js`
13. `git_commit` → "Merge trim and capitalization in product names" (`9df1c50`)
14. `git_show` (file + HEAD), `git_log`, `git_status` → verified both changes are in the file and no conflicts remain

**Terminal used:** No.

**Conflict the agent showed:**
```
<<<<<<< HEAD
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} - 1 Kg`;
=======
  return `${name.trim()} - 1 Kg`;
>>>>>>> mcp-shared-3
```

**Result:** resolved correctly by keeping both changes. Merge commit `9df1c50`.

**Observations:**
- Same result as Part A: both changes kept, trim before capitalize.
- The agent wrote the capitalize change as a **one-line** return. In Part A, I used two lines (`const formatted = ...` then `return`). Same behaviour, different code, so the conflict markers looked different.
- Its explanation was correct but brief: "preserves both changes in the requested order." It didn't explain *why* the order matters (a leading space would be "capitalized" instead of the first letter). I covered that in Part A.
- This scenario used the most `tool_search` calls so far (9). The agent kept re-searching for the same Git MCP tools (commit, add, diff) between steps.

## Scenario 4 – Both sides add different lines in the same place
**Instruction I gave:**
```
Using only Git MCP tools for Git actions (you may use the file-editing tool for
file content), create a branch mcp-shared-4 from git-mcp-practice. There, add a
"report" npm script that runs playwright show-report and commit. Switch back to
git-mcp-practice, add a "codegen" npm script for the GreenKart URL in the same
place and commit. Merge mcp-shared-4. When the conflict happens, show it to me,
resolve it by keeping both scripts with valid JSON, and complete the merge.
Explain why.
At the end, list every tool you called, in order, with the main arguments.
```

**What the agent did (in order):**
1. `git_set_working_dir` → project folder; read `package.json` first
2. `git_branch` → created `mcp-shared-4` from `git-mcp-practice`
3. `git_checkout` → `mcp-shared-4`
4. `apply_patch` → added `"report": "playwright show-report"`
5. `git_commit` → "Add Playwright report script"
6. `git_checkout` → `git-mcp-practice`
7. `apply_patch` → added the `codegen` script with the GreenKart URL
8. `git_commit` → "Add GreenKart Playwright codegen script"
9. `git_merge` → merged `mcp-shared-4`, **conflict reported** in `package.json`
10. `git_diff` + `git_status` → showed the conflict and confirmed `package.json` was conflicted
11. `apply_patch` → kept both scripts as separate JSON properties
12. `git_add` → staged only `package.json`
13. `git_commit` → "Merge report and GreenKart codegen scripts" (`1dc1bc4`)
14. `git_show` (file + HEAD), `git_log`, `git_status` → verified both scripts are present and no conflicts remain

**Terminal used:** No.

**Conflict the agent showed:**
```
<<<<<<< HEAD
"codegen": "playwright codegen https://rahulshettyacademy.com/seleniumPractise/#/"
=======
"report": "playwright show-report"
>>>>>>> mcp-shared-4
```

**Result:** resolved correctly by keeping both scripts. Merge commit `1dc1bc4`.

**Observations:**
- Same resolution as Part A: keep both, since the additions don't contradict.
- **The agent did not validate the JSON** before committing. It said so itself ("I did not run tests or a JSON parser"). It only re-read the file with `git_show`. In Part A, I ran `node -e "require('./package.json')"` before committing. I ran the same check afterwards to confirm the agent's result was valid.
- The agent's conflict block was smaller than mine in Part A. Its version only showed the two new lines, while mine also included the `test:headed` line, because I changed its comma on both sides.
- 9 `tool_search` calls again, including 3 in a row just to find the branch and commit tools.

## Cherry-pick
**Instruction I gave:**
```
Using only Git MCP tools for Git actions (you may use the file-editing tool for
file content), create a branch mcp-feature-extras from git-mcp-practice and make
three separate commits there: add a PRODUCTS list to the test data file, add a
formatQuantity(quantity) helper to cart-helpers.js, and add a "test:chromium" npm
script. Then switch back to git-mcp-practice and cherry-pick ONLY the
formatQuantity commit. Confirm that PRODUCTS and test:chromium did not come over.
At the end, list every tool you called, in order, with the main arguments.
```

**What the agent did (in order):**
1. `git_set_working_dir` → project folder; read `greenkart-data.js`, `cart-helpers.js`, `package.json` and `CLI-Codegen-test.spec.js` (to pick realistic product names)
2. `git_branch` → created `mcp-feature-extras` from `git-mcp-practice`
3. `git_checkout` → `mcp-feature-extras`
4. Three separate commits:

   | Commit ID | Message | Change |
   |-----------|---------|--------|
   | `2365210` | Add GreenKart products test data | `PRODUCTS: ['Beans', 'Pumpkin']` |
   | `bbd0239` | Add cart quantity formatter | `formatQuantity(quantity)` returning `"<quantity> Kg"` |
   | `2f646c2` | Add Chromium-only Playwright test script | `test:chromium` script |

   (each one: `apply_patch` → `git_commit` with only that file staged)
5. `git_checkout` → `git-mcp-practice`
6. `git_cherry_pick` → only `bbd0239` (used the full commit hash)
7. `git_show` on all 3 files, `git_log`, `git_status` → verified the result

**Terminal used:** No.

**Verification (by the agent):**
- `utils/cart-helpers.js` **has** `formatQuantity` ✅
- `test-data/greenkart-data.js` has **no** `PRODUCTS` ✅
- `package.json` has **no** `test:chromium` ✅
- No conflicts remain ✅

**Result:** only the chosen commit was copied to `git-mcp-practice`.

**Observations:**
- Same outcome as Part A, done with one `git_cherry_pick` call instead of `git log` + copying the ID + `git cherry-pick`.
- The agent found the right commit itself by remembering the commit it had just made. In Part A, I had to look it up in `git log` and copy the ID.
- It verified by reading the actual files with `git_show`, the same idea as my `grep` checks in Part A.
- The agent wrote `formatQuantity` differently: it returns `"2 Kg"`, while my Part A version returned just `"2"`. My instruction didn't say what the function should return, so the agent decided.
- It didn't report the new commit ID right away. When I asked for the log, it showed the cherry-pick created `30de32e`, a new copy of `bbd0239` with a different parent and hash. Same behaviour as Part A (`bc7c951` → `e4083c5`).



## Git log

**Instruction I gave:**
```
Show me the full git log as a graph for all branches, including the new commit ID
created by the cherry-pick. Then switch back to the main branch using Git MCP.
```

**What the agent did:** `git_set_working_dir` → `git_branch` (list all branches) → `git_log` once per branch (10 branches) → read the large outputs from temp files → **built the graph itself** from the commit parents → `git_checkout main` → `git_status`.

**Why it took so many steps:** Git MCP has no `--graph --all` option. In Part A, this was one command: `git log --oneline --graph --all`. The agent needed about 20 tool calls to produce the same picture.

Full graph: see `part-b-git-log.txt`.

---

# Comparison: Manual Git (Part A) vs Git MCP agent (Part B)

| | Part A – Manual | Part B – Git MCP agent |
|---|---|---|
| **What I typed** | About 60 Git commands, plus every file edit by hand | 7 natural-language prompts, plus approval clicks. No Git commands. |
| **Time** | About 1 hour, including learning each step | About 25 minutes for all scenarios and the log |
| **Tool calls** | One command per action | About 25–30 tool calls per scenario |
| **Tool discovery overhead** | None; I knew which command to run | 2–10 `tool_search` calls per scenario to find the right Git MCP tool, often searching again for tools it had already used |
| **File editing** | In the editor | Git MCP can't edit files, so the agent needed the separate `apply_patch` tool. In the first conflict it stopped to ask permission. |
| **Deleting a file** | `git rm` in one step | No delete tool: edited the file away with `apply_patch`, then `git_add` |
| **Staging** | Separate `git add <file>` | Staged and committed in one call (`git_commit` with `filesToStage`) |
| **Commit messages** | I wrote them | The agent wrote its own; clear, but different from mine |
| **Conflict resolution** | All 4 correct | All 4 correct, because I told it how to resolve each one |
| **Explaining why** | Real reasons (faster failure, Playwright auto-waits, trim before capitalize) | Mostly "because you asked." The judgment stayed with me. |
| **Checks** | I checked the JSON with `node` before committing | The agent did **not** validate the JSON, but did extra `git_diff`/`git_status`/`git_show` checks I skipped |
| **Cherry-pick** | `git log` → copy ID → `git cherry-pick` | One `git_cherry_pick` call; it remembered the commit it had just made |
| **Unrelated changes** | Protected by using `git add <file>` | Also left `.vscode/mcp.json` and `git-practice/` alone, without being told |
| **Code it wrote** | Exactly what I planned | Small differences: object-style test data, one-line capitalize, `formatQuantity` returning `"2 Kg"` instead of `"2"` |
| **Graph log** | 1 command | About 20 tool calls; it rebuilt the graph by hand |

**Takeaways**
- **Agent is better for:** repetitive multi-step work like creating branches, committing, merging, and verifying. It's faster and doesn't make typing mistakes, as long as the instructions are exact.
- **Manual is better for:** decisions. The agent resolved conflicts correctly only because I told it which side to keep. It couldn't explain *why* a resolution was right, and it skipped a validation step I would have done.
- **Git MCP limits:** no file editing, no `git rm`, no graph log. The agent worked around all of them, but each workaround cost extra tool calls.
- **Best approach:** know Git well enough to give precise instructions and review the result, then let the agent do the typing.