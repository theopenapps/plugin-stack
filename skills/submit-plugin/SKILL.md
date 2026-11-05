---
name: submit-plugin
description: "Submit an AI plugin to the ChatGPT, Claude or Cursor stores: a store-ready kit with first-listing copy, assets, reviewer answers and the choices that can't change later, such as MCP origin, slug and countries. Use when preparing a plugin for submission, or after a rejection."
license: MIT
compatibility: Needs network access, and one of Node.js for npx, the OpenApps MCP server or a tool that fetches URLs.
---

# Submit plugin

## Read at each step

| Step | Read |
|---|---|
| 1 | `.agents/plugin-stack.md` if present, [references/data.md](references/data.md) |
| 2-4 | `references/stores/<store>.md` for each store in scope |
| 4 | [references/kit.md](references/kit.md) |

A store with no file here: work from its own docs and say the report has no checked notes for it.

## Steps

1. **Fix the scope.** The plugin, the stores, and whether this is a first submission or a rejection. Done when each is named.

   Rejection or a stuck review: read the reviewer's reasons, keep the choices already made, skip steps 2 and 4, and run step 3 from the store file's "Rejected or stuck" section. Step 3 is then done when each reason maps to a requirement and a change, or the cause is marked unknown where the store gives none, and one next action is stated.

2. **Lock the permanent choices.** Done when the user has confirmed each choice the store won't let them change later.
3. **Check readiness.** Mark each requirement in the store file pass, fail or can't-tell, and name the evidence. `pass` needs something run or opened: the manifest's actual value, a `tools/list` call against the exact origin being locked from a client with no stored credentials, the sign-in flow in a clean browser session, the listed URLs loading. Reading the code earns only can't-tell. Done when every requirement has a mark and its evidence.
4. **Build the kit.** Copy drawn from the plugin's closest live listings, even when a kit already exists. Done when every kit item has content or a named owner, and the hand-off names the listings you read.
5. **Hand off.** Done when every fail, every can't-tell and every manual store step is one numbered action, in order. The user submits; you prepare. If `.agents/plugin-stack.md` exists, add `submit-plugin: <today>, stores: <stores>` under Runs, in your own words.
