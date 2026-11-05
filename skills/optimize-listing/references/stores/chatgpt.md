Checked: 2026-11-05 against https://developers.openai.com/plugins/deploy/submission.md. Over 90 days old: fetch that URL, and where it disagrees follow the store's docs and say so in the report.

# ChatGPT listings

Also read on that date: https://developers.openai.com/plugins/plugin-guidelines.md, https://developers.openai.com/plugins/deploy/submission-errors.md, https://developers.openai.com/plugins/deploy/app-review.md and https://help.openai.com/en/articles/6825453-chatgpt-release-notes (needs a browser).

## Fields

All copy lives in the ZIP's manifest: `extensions.com.openai.interface` in root `plugin.json`, or `interface` in `.codex-plugin/plugin.json`. If the first exists, OpenAI ignores the second. A plugin from the earlier submission form may have no local package; **Download release ZIP** in the published version's **…** menu gets it.

A change needs a new ZIP, a new version with its own checks, a review, then **Publish plugin**, so batch every change into one version. One review runs per plugin at a time, and OpenAI publishes no timeline.

| Field | Limit | Where to edit | Cost of a change | What is shown |
|---|---|---|---|---|
| `displayName` | 30 | `interface` | Review | Name |
| `shortDescription` | 30, one line | `interface` | Review | Subtitle, with the name |
| `longDescription` | 4,000 | `interface` | Review | Description of tasks, intended users and limitations |
| `defaultPrompt` | 3, of 128 each, unique, no @mentions | `interface` | Review | Starter prompts |
| `category` | One, from the list below | `interface` | Review | Category, with the landing rule below |
| `capabilities` | 20, of 120 each | `interface` | Review | Capability labels; the docs don't say where they display |
| `keywords` | None stated | Manifest root | Review | Documented only as discovery terms; see Search |
| `developerName` | 80 | `interface` | No effect | The verified identity's name, whatever the ZIP says |
| `screenshots` | One per starter prompt, exactly 706 px wide, 400 to 860 px tall; only with custom UI | `interface` | Review | Not shown in the directory |
| Translations | Subtitle 30, description 4,000 | `extensions.com.openai.publication.translations` | Review | Validated, not displayed yet |

Upload accepts 80 for the name, 240 for the subtitle and 512 for a prompt, and then final submission fails, so write to the limits above. The package `name` must match on update, so a rename changes `displayName` only.

## Preflight

Reject a draft with any of these:

- a single generic dictionary word as the name
- "MCP", "MCP Server" or "Plugin" appended to the name
- pricing, trials, promotions, comparisons or unverifiable claims in the subtitle or description
- implied OpenAI endorsement

## Category

The list: Productivity, Creativity, Developer Tools, Business & Operations, Data & Analytics, Communication, Education & Research, Security, Finance, Healthcare, Travel, Entertainment, Other.

`Entertainment` lands in Other and `Education & Research` in Education (observed). On 2026-11-05 Daily Tarot's manifest said `Entertainment` and it sat in Other.

## Keywords

Set by 51% of new apps and 8% of older ones (observed by OpenApps, Oct 25, 2026). Add a few real terms the plugin honors.

## Ordering

Documented by OpenAI:

- A plugin reaches the directory's main pages only when OpenAI selects it for enhanced distribution. That can't be requested, and few plugins get it at publication.
- Rankings prioritize plugins people keep using after installation, on web and mobile (release notes, Aug 21, 2026).

Observed by OpenApps:

- 93% of recent go-lives sat in a US category list, and none on a home shelf, New & Noteworthy or Popular (Oct 25, 2026).
- There is one global order. A country changes only which apps appear, and a fall in rank can just mean apps were placed above.

## Search

OpenAI doesn't document what directory search reads. Observed by OpenApps on 2026-11-05: the top 50 of its search for 64 short queries, signed out, US. This is one snapshot and a correlation, so it can't show that adding a word lifts a plugin.

| Rank | Query in the name | Query in `keywords` |
|---|---|---|
| 1-3 | 76% | 44% |
| 4-10 | 51% | 58% |
| 11-25 | 26% | 76% |
| 26-50 | 13% | 75% |

The top result held the query in its name on 53 of 64 queries. Of 2,706 results, 859 held it only in `keywords`, at a median rank of 24, and 4% held it in none of the name, subtitle, description and `keywords`.

Placement that fits this: the main target word in `displayName`, related words in `keywords`, contested words in `longDescription`. A name can carry a job and stay within the rules: `AI Video Maker` was #18 in Creativity on 2026-11-05.

## Reading numbers

Charts are `category:<c>`, as `stores_get store=chatgpt` lists them; `category:featured` is Popular. ChatGPT publishes no metrics, so `listings_metrics` has nothing here and rank is the one public number.
