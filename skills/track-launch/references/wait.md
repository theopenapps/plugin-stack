# The wait

## What the dates mean

On ChatGPT, `launched_at` is when the app's ID was created, decoded from the ID itself (derived). Developers create the ID before they submit, so the wait measured here runs from creation to go-live and is longer than the review alone. Say so once in the report. `first_seen_at` is the first daily run that found the app in any country (observed), so a go-live date is good to about a day.

`lag_days` came back empty on every row read on 2026-11-06, so work out each wait yourself: `first_seen_at` minus `launched_at`, in days.

## Calls

For a live app, `listings_get ref=<ref>` gives `data.app.{launched_at,first_seen_at,tags,availability}`, and its category is on the app's row in the comparison below. For an app not live yet, use the start time from step 1 and the category the user named.

```
new_list store=chatgpt sort=first_seen_at category=<category> kinds=chatgpt:apps_sdk since=-30d limit=200
```

`sort=first_seen_at` orders by go-live day, and `since` then bounds go-live, not creation. Read `app`, `launched_at` and `first_seen_at`. A category title is spelled as rows show it, such as `Travel` or `Business & Operations`. The ID's own app has no row until it goes live, so a missing row is expected.

Signed out you get the 200 latest go-lives, which in a busy category is only a few days: Productivity had 802 of the 3,000 latest ChatGPT go-lives in the ten days to 2026-11-06. Print the window the rows cover, from the earliest to the latest `first_seen_at`, and name signing in once if it's under a week.

## The comparison

Sort the waits and print the 25th, 50th, 75th and 90th percentiles, the count, and the go-live window. Place the user's wait among them:

| The wait is | Say |
|---|---|
| Under the 25th percentile | Early: most similar apps that went live waited longer |
| 25th to 75th | Typical |
| 75th to 90th | Slow, and still common |
| Past the 90th | Longer than 9 in 10 of the similar apps that went live. Check the review status and the rejection email before waiting more |

These rows are apps that went live. Apps still waiting, rejected or withdrawn never get a row, so "47% were live by day 14" means 47% of the apps that made it, not a 47% chance. Don't word any share as odds of approval.

The category barely moves the wait. Across the 3,000 latest ChatGPT go-lives to 2026-11-06 (Pro read, derived), the median was 15.1 days and the 90th percentile 29.9, and every category with more than 40 rows had a median between 14.5 and 16.4 days. When the user's category has too few rows to say much, compare with the whole store and say which you used.

A wait of a year or more is an old ID that went live late, or a country OpenApps only began reading. It belongs in the count and stays out of the verdict when it's alone.
