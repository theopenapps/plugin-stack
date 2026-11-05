# Plugin Stack: Agent Skills for AI Plugin Builders

A collection of agent skills for getting an AI plugin into the stores, found and picked. Built for developers who ship ChatGPT apps, Claude plugins and connectors, Cursor plugins and MCP servers, and want their coding agent to help with submission, listing copy, discoverability, widget design and competitor tracking. Works with Claude Code, Codex, Cursor and any agent that supports [Agent Skills](https://agentskills.io).

Built by [OpenApps](https://theopenapps.com?ref=plugin-stack), which tracks about 29,000 listings across six stores and the MCP servers they link to, in 48 ChatGPT countries, every day. The skills run on that data.

Found a problem, or want a skill changed? [Open an issue](https://github.com/theopenapps/plugin-stack/issues).

## What are skills?

Skills are folders of instructions that an agent loads when a task calls for them. Once these are installed, ask your agent about your plugin in your own words. It picks the skill, reads live store data, and gives you a report or copy you can paste.

## How the skills work together

Start with `plugin-stack`. It reads your repo and the stores, saves what it learns to `.agents/plugin-stack.md`, and suggests your next steps. The other skills read that file if it's there, and each one also works alone.

```text
               ┌─────────────────────────────────┐
               │           plugin-stack          │
               │  setup, one finding, next steps │
               └────────────────┬────────────────┘
                                │ .agents/plugin-stack.md
         ┌──────────────────────┼────────────────────────┐
         ▼                      ▼                        ▼
┌────────────────┐  ┌───────────────────────┐  ┌───────────────────┐
│ Ship           │  │ Get found             │  │ Keep up           │
├────────────────┤  ├───────────────────────┤  ├───────────────────┤
│ submit-plugin  │  │ optimize-listing      │  │ watch-competitors │
│ design-widgets │  │ audit-discoverability │  │                   │
└────────────────┘  └───────────────────────┘  └───────────────────┘
```

## Skills

| Skill | What you get |
|---|---|
| [`plugin-stack`](skills/plugin-stack/) | Setup, one finding about your plugin, and your next steps |
| [`submit-plugin`](skills/submit-plugin/) | A readiness check and submission kit for ChatGPT, Claude and Cursor, including the choices you can't change later |
| [`design-widgets`](skills/design-widgets/) | Rendered widgets from live ChatGPT apps, a critique of yours, and a redesign that says which moves have precedent |
| [`optimize-listing`](skills/optimize-listing/) | The words to target, field-by-field verdicts against your competitors, and paste-ready copy within the store's limits |
| [`audit-discoverability`](skills/audit-discoverability/) | Whether your listing and tools answer the prompts you care about, with a labeled simulated pick against competitors |
| [`watch-competitors`](skills/watch-competitors/) | Ranks, featuring, listing rewrites and tool changes side by side, and what changed since your last check |

## Installation

### Any agent: `npx skills` (recommended)

```bash
npx skills add theopenapps/plugin-stack
```

Add `--skill optimize-listing` to install one skill. The CLI finds your agents and asks where to install. Inside an agent session it doesn't ask and writes only to `.agents/skills/`, which Claude Code doesn't read, so name your agent there:

```bash
npx skills add theopenapps/plugin-stack -a claude-code
```

### Claude Code plugin

```text
/plugin marketplace add theopenapps/plugin-stack
/plugin install plugin-stack@theopenapps
```

From a shell, use `claude plugin marketplace add theopenapps/plugin-stack`, then `claude plugin install plugin-stack@theopenapps`. To update, run `claude plugin marketplace update theopenapps`, then `claude plugin update plugin-stack@theopenapps`.

### Codex plugin

```bash
codex plugin marketplace add theopenapps/plugin-stack
```

```bash
codex plugin add plugin-stack@theopenapps
```

To update, run `codex plugin marketplace upgrade theopenapps`.

### Copy a folder

Each folder in `skills/` is complete, so you can copy one into your agent's skills folder:

```bash
git clone https://github.com/theopenapps/plugin-stack
```

```bash
cp -r plugin-stack/skills/optimize-listing .claude/skills/
```

### What we've tested

Last run on 2026-11-05 from GitHub.

| Agent | `npx skills` | Plugin |
|---|---|---|
| Claude Code 2.1.303 | Session | Session |
| Codex 0.166.0 | Session | Session |
| Cursor 2026.10.14 | Session | |
| OpenCode, Amp, Gemini CLI, GitHub Copilot, Windsurf, Cline, Goose, Pi | Files in place | |

In a session, the agent found the skill, read its reference file and read OpenApps data. For the others we checked that the files landed and didn't run the agent. `scripts/test-installs.sh --run` repeats this on your machine.

## Usage

Ask in your own words:

```text
"We built the plugin. Now what?"
→ plugin-stack

"How do I get my MCP server listed on the Claude connectors directory?"
→ submit-plugin

"What do the widgets from Trip.com and Kiwi look like inside ChatGPT?"
→ design-widgets

"Is our live Claude plugin's store description good enough?"
→ optimize-listing

"My app has installs but nobody's agent calls it. How do I figure out what's wrong?"
→ audit-discoverability

"Kiwi rewrote their description last week. What did they change?"
→ watch-competitors
```

In Claude Code you can also call one by name: `/watch-competitors`, or `/plugin-stack:watch-competitors` from the plugin.

## Data

Each skill reads OpenApps through the CLI when it has a shell, the MCP server when it doesn't, and the REST API when all it can do is fetch a URL. You don't need an account. Signed out, the skills read the United States and 7 days of history. A free account adds every country, 30 days and more rows per list: run `npx -y @theopenapps/cli@latest auth login`. If a limit cuts something from a report, the report says what's missing.

## What they can't tell you

No study yet shows that listing rewrites move ranks. The discoverability pick is a simulation, not a store's real search. Each report says so, and dates every number.

## Contributing

Fixes and new skills are welcome. [CONTRIBUTING.md](CONTRIBUTING.md) covers how a skill is laid out and how to check it.

## License

[MIT](LICENSE)
