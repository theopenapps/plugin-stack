# Contributing

Open an issue for a bug, a wrong number or a skill you'd like. The numbers come from [OpenApps](https://theopenapps.com?ref=plugin-stack), so you can compare a report with the site. For a change, open a pull request against `main`. Every commit on `main` reaches plugin users as an update, so merge only what's ready.

## Layout

```text
skills/<name>/
  SKILL.md        When to use the skill, and its steps
  references/     What a step needs, one level deep
  LICENSE.txt
shared/           data.md, cli.md, mcp.md and api.md, copied into every skill's references/
evals/            Routing queries and traps
scripts/          check-skills.mjs, check-contract.mjs and test-installs.sh
.claude-plugin/   Claude Code plugin and marketplace
.codex-plugin/    Codex plugin
.agents/plugins/  Codex marketplace
```

## Rules

`scripts/check-skills.mjs` enforces the first three.

- A skill works alone. A single-skill install copies only that skill's folder, so a skill can't link to anything outside it.
- Skills name operations, such as `listings_versions`. Commands, tools and paths live in `shared/`. Edit `shared/`, then run `node scripts/check-skills.mjs --write` to copy it into every skill.
- Each store file starts with `Checked: YYYY-MM-DD against <url>`.
- `SKILL.md` holds the steps. Anything only some runs need goes in `references/`, with a step in `SKILL.md` saying when to read it.
- Every number has a date and a basis, and a report says what it couldn't read. Leave out a claim you can't back.

## Before you open a pull request

```bash
node scripts/check-skills.mjs
node scripts/check-contract.mjs
```

```bash
scripts/test-installs.sh
```

The second installs the skills into clean folders, as plugins for Claude Code and Codex and through `npx skills` for 11 agents, and checks that each one got all of them. CI runs both. Add `--run` to also ask each signed-in agent on your machine to use a skill, which spends model credits.

If you change a skill's description, run its queries from `evals/confusion-pool.json` with `evals/run_confusion.py`. If you change what a skill does, run its row in `evals/traps.md`.
