# Signals

Every number below was read on 2026-11-06 unless it says otherwise. Use them to know what to expect, and report your own.

## Calls

A whole store costs about 20 to 35 calls and 400 to 700 rows at these limits.

| Call | Read |
|---|---|
| `tags_tree store=<store>` | `data.tags[].{id,label,facet,parent,depth,n,stores}` and `data.stores[].apps`. A tag's `n` counts the apps under its narrower tags too. Candidates come from facet `job`; facet `works` is the products an app connects to |
| `market_get store=<store>` | `data.stores[].launches.weeks[].{week,n}`, the store's launches per week for a year, and `lists[].{chart,title,apps}`, each list's size |
| `tags_get tag=<id> store=<store> limit=20`, with `kinds=connector` or `kinds=plugin` on Claude | `data.tag.n`, `data.kpis.new_30d`, `data.weeks[].{week,n}` (31 weeks), `data.children[].n`, and `data.top[]`, best chart place first: `name`, `publisher`, `launched_at`, `best.{chart,position}`, `prev_week`, and on ChatGPT `countries.{listed,of}` |
| `new_list store=chatgpt since=-28d limit=1`, then `since=-56d` | `data.total` and `data.facets[].{value,total}`: launches per ChatGPT category in one call each. Subtract the first from the second for the four weeks before. On Claude the facets are kinds, not categories |
| `charts_get store=chatgpt chart=<category chart> limit=20`, then with `at=-28d` | `data.total`, the list's size, and `rows[].{position,name,publisher,launched_at}`. `stores_get` names the charts |
| `charts_regions_get store=chatgpt chart=<chart> limit=50` | `rows[].{name,listed_in,positions}` |

Signed out, `tags_get` and `market_get` still give all 31 weeks and a year, so take growth from them. `new_list` reaches back 30 days, so its four weeks before are out of reach; `at` on `charts_get` reaches 7 days and answers with `meta.truncation_reason` `plan`, so read the `meta.as_of` you got, not the one you asked for; `charts_regions_get` gives US positions only but keeps `listed_in`; and any other country's chart needs a free account. `tags_tree` and `charts_regions_get` aren't MCP tools: call them through `references/api.md` when you can fetch a URL (its `/v1/openapi.json` names the path), and otherwise start from `tags_get` on a known id and walk its `children` and `siblings`.

## Growth: share of launches, not counts

The whole store moves, so a tag's count rises with it. ChatGPT went from 452 launches in the week of 2026-09-07 to 1,658 in the week of 2026-09-28 (derived, `market_get`), and every category's count jumped with it. Divide each candidate's launches by the store's launches in the same weeks, and compare the last four weeks with the four before. A share that rose is growing supply, whatever the raw count did.

ChatGPT's launch date is when the app's ID was created, and the app goes live later. Of 200 apps first seen live in the week to 2026-11-06, half took 13 days or more from ID to go-live, a quarter 22 or more and a tenth 31 or more (observed). So the last three or four weeks of a ChatGPT series always look like a fall. Shares hold up because every category lags alike; raw counts for those weeks don't, so don't report them as a decline. Claude's launch dates are the store's own (`release_basis` `store_reported`).

On Claude, 11,168 of 12,436 listings are in the community tier, with no review recorded (derived, tag `community`), so most of Claude's launches are community listings. Say so beside any Claude launch figure.

Lists grow too. ChatGPT's Productivity list went from 1,350 apps on 2026-10-09 to 3,107 on 2026-11-06 (observed, `charts_get` with `at`), so compare a list's size only at one date.

## Crowded: who holds the top

Many listings alone isn't crowded. A tag is crowded when its supply is large or rising and its top is held by brands with their own product or by the store's owner, since a new app doesn't displace either.

- Count, in the top 10, the store's owner (OpenAI on ChatGPT, Anthropic on Claude) and brands: companies with a product people already use outside the store, such as Dropbox or MyFitnessPal. A small studio whose store app is its only product isn't a brand here, even when its publisher matches the app's name. Which is which is a judgment from the name and publisher: say so. OpenAI's own apps were #1 in ChatGPT's Security, Communication and Healthcare, and 6 of the top 12 in Scientific Research (observed).
- On ChatGPT, read the top from `charts_get` on the category when a candidate maps to one, and from `tags_get` only for finer tags. In one run a fitness app was #2 on the Healthcare chart and #38 or absent in `tags_get` for its tag (observed), so check a surprising place against the chart.
- Count apps launched in the last 90 days among the top 20. This is the plainest sign the top still lets newcomers in. Scientific Research had 7; Security 4; Travel, Finance, Developer Tools, Creativity and Education had none (observed).
- Turnover against `at=-28d` counts only when the newcomers are new apps. Six of ChatGPT Productivity's top 10 changed in those 28 days, and every newcomer was an established brand: Dropbox, Todoist, Airtable, Trello, and OpenAI's Outlook Calendar and SharePoint (observed). That is brands arriving, not an opening.

On Claude there are no category lists. Use `best.position` from `tags_get`, which is the place in Claude's Most popular for most rows. Rows with no place come after the ranked ones, so count young apps only among rows that have one. Read how many of the tag's top 20 sit in the top 100, and the best one. Developer Tools, Productivity and Data & Analytics had all 20 in the top 100; Lifestyle had none, its best at #220 (observed). A low best place fits both an open top and a small demand, and the data can't tell the two apart: say both.

## Who it serves

`tags_get` rows carry `tags`, and the `for` facet among them is the audience. When most of a candidate's apps serve one audience, the other is worth a line: in one run, 191 of 203 ChatGPT fitness apps served consumers (derived), so tools for coaches and studios stood out. Label such a sub-niche as judgment, since no tag measures it.

## Gap against another store

`tags_tree` counts each tag per store. Divide by each store's `data.stores[].apps` to compare shares, since the stores differ in size. Education was 5.1% of ChatGPT and 2.5% of Claude; Lifestyle 6.6% and 3.1%; Developer Tools 11.0% and 25.7% (derived). A tag much thinner on one store is a candidate to port to, and still says nothing of whether that store's users want it.

## Countries, ChatGPT only

Claude and Cursor are one catalog worldwide. On ChatGPT, 10,935 of 12,874 apps are listed in all 48 countries and 1,848 are missing from some (derived, tags `worldwide` and `geo-restricted`). Of the US top 50 in Travel, 45 were in all 48 countries, and the Travel list held 661 to 722 apps in each of the 8 countries read, the US largest (observed, Pro). So a country thin in listings is rare. Report a country only when the US top apps are absent there (`positions` null in `charts_regions_get`) or its list is clearly smaller (`data.total` on `charts_get` with `region`). Whether a country lacks apps made for it, in its language or with its local services, is a judgment from the names in its top 20: label it so.

## Ranking

An opening is a candidate whose top lets newcomers in (young apps in the top 20, few owner or brand apps in the top 10) and whose launch share is flat or falling. Order openings by the young apps in the top 20, then by the lower launch share. Crowded is the reverse on both. A candidate with too few rows to read any of these is unclear, not an opening.

## The table

One row per candidate: the tag or category; listings, with date; launch share, four weeks before against the last four; the owner and brand apps in the top 10; the apps launched in 90 days in the top 20; the gap against the other store; the verdict.

## What this can't tell you

Put this section in every report, in these words or close:

- Demand isn't measured. These are counts of listings and launches, not of users, installs or calls.
- ChatGPT publishes no installs or usage. Claude publishes installs for some listings only, so they don't rank a whole tag.
- Chart order is the store's, and its rule isn't public. A place on it isn't a measure of use.
- Tags are OpenApps' own classification of each listing (derived), and an app can carry several.
- A thin tag can be thin because nobody wants it. Nothing here separates that from an opening.
