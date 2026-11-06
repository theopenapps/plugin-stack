# After it's live

## Countries

`listings_get ref=<ref>` gives `data.app.availability[].{region,status,as_of,reason}`: `listed` or `not_listed` per country. Only rows with `reason: complete` count. A country with no row, or one `meta.coverage` names as dark, is unknown, not unlisted.

Signed out, availability has the United States alone. The reach tags on the same answer still say which side the app is on, and they're derived from every country: `worldwide` is listed in every country with data, `geo-restricted` is missing in some. With either tag, print it and name signing in once to get the countries.

Don't wait for missing countries to fill in by themselves. On 2026-11-06, 20% of ChatGPT apps live for 3 days or less carried `geo-restricted`, and 16% of those live 4 to 10 days (1,440 and 1,560 apps, Pro read, derived from tags). WRDO, live on 2026-11-06, was listed in South Africa alone (observed). The store doesn't publish why an app is missing in a country, so name the countries and leave the reason out.

## What gets apps delisted

```
tags_get tag=delisted store=chatgpt limit=200
```

`data.tag.n` is how many ChatGPT apps are delisted now, and `data.related[].{id,label,n,lift}` lists the tags they carry more often than apps at large: a lift of 1.58 means 58% more often. Set the app's job tags, from `listings_get`, against that list, and print the lift and `n` of each one it shares. On 2026-11-06 there were 135, and `agent-building` (lift 2.24, n 9), `shopping` (1.92, 17), `commerce` (1.62, 27), `travel-places` (1.58, 21) and `developer-tools` (1.55, 23) led the list (derived). With n under 30, call it a lean, not a pattern. Delisted rows lose their category, so `category` is empty on them: match by tag.

Each row's `mcp_status` is the server's status now. Count `error`, `dead` and `blocked` among the delisted rows, then the store's share: `tags_get tag=mcp-down store=chatgpt limit=1` gives `data.tag.n`, every ChatGPT app whose server is down, blocked or erroring, and `stores_get` the store's size. On 2026-11-06 it was 15 of the 136 delisted rows (11%) against 590 of 12,987 apps store-wide (4.5%), observed. A down server can follow the delisting as easily as cause it, so word it as company, not cause.

Then the app's own server: `mcp_toolset_get app=<ref>` gives `data.servers[].{url,status,checked_at}`. Print `checked_at`, because it's the last check, and `null` means not checked yet. No servers is a finding on its own: OpenApps found no MCP URL for the listing.

## Whether they come back

```
changes_list store=chatgpt types=delisted since=-90d limit=200
```

Each event has `t`, `app` and `before.listed_at`, the last day it was seen listed. An app is back when it's no longer among the `tags_get tag=delisted` rows, or `listings_get` shows a `listed` country after the event's `t`. Count the events and the returns, and print the window from the earliest event's `t`, because `data.since` can start before OpenApps recorded any.

Signed out this answer holds back every event outside a chart's top 100 and starts 7 days back, so it can come back empty with `data.held` above zero: print `Degraded: delistings outside the top 100 need a free account` and use the 135-row tag read alone. On 2026-11-06, the 92 ChatGPT delistings recorded since the first on 2026-10-14 were all still delisted (Pro read, observed), so a return is rare enough to plan without. Claude had 25 delistings in the 14 days to the same date; run the same read with `store=claude` for a Claude app.

## Your app was delisted or rejected

```
changes_list store=chatgpt apps=<ref> types=delisted,mcp_status_change,toolset_change,listing_change since=-30d
```

Passing `apps` reads the app's own events on every plan. Put them in date order with the server's `status` and `checked_at`, so the user sees what changed before the delisting. `mcp_status_change` returned no ChatGPT rows over 60 days read on 2026-11-06, so take the status from `mcp_toolset_get` and don't read an empty answer as a healthy server.

Then check what the store reviews, in this order: the server answers `tools/list` from a client with no stored credentials; sign-in works in a clean browser session; the tools still match what the listing promises. Name what you ran and what it returned. The store's own email, if any, decides: hand its reasons to `submit-plugin`.
