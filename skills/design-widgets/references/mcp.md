# MCP

The server is `https://theopenapps.com/mcp`. To sign in, the user connects `https://theopenapps.com/mcp/account` in its place.

| Operation | Tool |
|---|---|
| `changes_list`, `charts_get`, `listings_search`, `mcp_toolset_get`, `new_list`, `stores_get` | The same name, with the same parameters |
| `listings_get`, `listings_metrics`, `listings_ranks_current`, `listings_tools` | `listings_profile` with `apps=[<ref>]`; one call covers all four |
| `listings_ranks_history` | None: date moves from the `rank_move` rows of `changes_list` |
| `listings_list`, `listings_versions`, `listings_widgets`, `tags_get` | None |

`listings_profile` answers with `data.profiles[].{app,ranks,metrics,tools}`, so the `listings_get` fields a skill names are under `app`, and its `data.charts`, `data.metrics` and `data.servers` paths are under `ranks`, `metrics` and `tools`.

With no tool for an operation, call it through `references/api.md` if you can fetch a URL. Otherwise add `Degraded: <operation> isn't on the MCP server, so <what is missing>`. Long descriptions and starter prompts need `listings_versions`. To find competitors without `tags_get`, use `listings_search` on 1-3 nouns.

## Output

Text answers hold a few columns, plus lines for the date, the plan and any cut. Set `response_format=detailed` when a skill names a field or path: `structuredContent` then holds the whole `{ data, meta }`. A long answer is trimmed with a `next_cursor`, so pass it as `cursor`.
