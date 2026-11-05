# CLI

```bash
npx -y @theopenapps/cli@latest <command> [flags]
```

An operation's first `_` is a space and the rest are `-`: `charts_get` is `charts get`, `listings_ranks_history` is `listings ranks-history`, `mcp_toolset_get` is `mcp toolset-get`. `--help` on a command shows which parameters are positional, such as `charts get <store> <chart>` and `listings versions <ref>`. The rest are flags, spelled the same way: `limit=20` is `--limit 20`, `diff_from=-7d` is `--diff-from=-7d`. Write relative times with `=`.

Sign in with `auth login`, or set `OPENAPPS_API_KEY`.

## Output

Full JSON runs about ten times the size of the rows a list needs, so choose per call.

| You need | Flags | You get |
|---|---|---|
| Rows of `charts_get`, `changes_list`, `listings_search`, `new_list` or `tags_get` | `--format csv --fields <a,b>` | Rows on stdout, and on stderr the date, the next cursor and `truncated` |
| Anything else, or `meta` and `data` beyond the rows | None | The whole answer as JSON |

A wrong field name prints the allowed ones. When stderr says `truncated`, or a skill reads `data.total`, `data.since` or `data.held`, repeat the call without `--format` to read them.

## Exit codes

A cut exits 0. Busy is 1 with "temporarily unavailable", not found is 3 with `Closest:` candidates, and budget spent is 4.
