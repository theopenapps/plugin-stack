# plugin-stack

**You built the plugin. Now get it picked.**

Agent skills for AI plugins: ChatGPT apps, Claude plugins and connectors, Cursor plugins and MCP servers. They run on live store data from [OpenApps](https://theopenapps.com), which tracks about 29,000 listings across six stores and the MCP servers they link to, in 48 ChatGPT countries, every day.

## Install

```bash
npx skills add theopenapps/plugin-stack
```

Add `--skill optimize-listing` to install one skill. Each one works alone.

In Claude Code you can also install it as a plugin:

```text
/plugin marketplace add theopenapps/plugin-stack
/plugin install plugin-stack@theopenapps
```

## Skills

Ask your agent what to do next for your plugin. `plugin-stack` reads your repo and the stores, saves what it learns to `.agents/plugin-stack.md`, and suggests two or three next steps. The other skills read that file if it's there.

| Skill | What you get |
|---|---|
| `plugin-stack` | Setup, one finding about your plugin, and your next steps |
| `optimize-listing` | The words to target, field-by-field verdicts against your competitors, and paste-ready copy within the store's limits |
| `submit-plugin` | A readiness check and submission kit for ChatGPT, Claude and Cursor, including the choices you can't change later |
| `audit-discoverability` | Whether your listing and tools answer the prompts you care about, with a labeled simulated pick against competitors |
| `design-widgets` | Rendered widgets from live ChatGPT apps, a critique of yours, and a redesign that says which moves have precedent |
| `watch-competitors` | Ranks, featuring, listing rewrites and tool changes side by side, and what changed since your last check |

## What they can't tell you

No study yet shows that listing rewrites move ranks. The discoverability pick is a simulation, not a store's real search. Each report says so, and dates every number.

## Data

Each skill reads OpenApps through the CLI when it has a shell, the MCP server when it doesn't, and the REST API when all it can do is fetch a URL. You don't need an account. Signed out, the skills read the United States and 7 days of history. A free account adds every country, 30 days and more rows per list: run `npx -y @theopenapps/cli@latest auth login`. If a limit cuts something from a report, the report says what's missing.

## Changing the skills

Skills name operations, such as `listings_versions`. Commands, tools and paths live in `shared/`, which every skill carries a copy of, so a single-skill install still works. Edit `shared/`, then run `node scripts/check-skills.mjs --write`.

## License

[MIT](LICENSE)
