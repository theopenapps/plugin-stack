#!/usr/bin/env node
// Fails when shared/ or a skill names something the OpenApps API doesn't have, or a limit it no longer applies.
//   node scripts/check-contract.ts [origin]
// It reads what the server publishes, so a change to the API shows up here on the next run.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const origin = process.argv[2] ?? "https://theopenapps.com";
const json = async (path: string): Promise<any> => {
  const res = await fetch(`${origin}${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
};
const [openapi, context] = await Promise.all([json("/v1/openapi.json"), json("/v1/agent-context")]);

const errors: string[] = [];
const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : path.endsWith(".md") ? [path] : [];
});
// Every skill holds a copy of shared/, which check-skills.ts compares, so each is read once.
// A store file quotes the store's own fields, which aren't OpenApps'.
const files = [...walk("shared"), ...walk("skills").filter((path) => !/references\/((data|cli|mcp|api)\.md$|stores\/)/.test(path))];

// Every operation and tool name a file uses is one the server publishes. Anything the documents spell counts, since a
// change type or a parameter can look like an operation.
const known = new Set(JSON.stringify([openapi, context]).match(/\b[a-z]+_[a-z0-9_]+\b/g));
const NAME = /`[^`]*?\b((?:changes|charts|featuring|leaderboards|listings|market|mcp|movers|new|publishers|scores|stores|tags)_[a-z_]+)\b/g;
for (const path of files)
  for (const [, name] of readFileSync(path, "utf8").matchAll(NAME) as Iterable<[string, string]>)
    if (!known.has(name)) errors.push(`${path}: ${name} isn't in the API's documents`);

// Every path api.md gives is a route, with a ref's {store}/{id} standing for the API's {store}/{plugin_id}.
const routes = new Set(Object.keys(openapi.paths));
for (const [, path] of readFileSync("shared/api.md", "utf8").matchAll(/`(\/[^`?]*)`/g) as Iterable<[string, string]>) {
  const route = `/v1${path.replace("{id}", "{plugin_id}").replace("chatgpt/kiwi-com", "{store}/{plugin_id}")}`;
  if (path !== "/v1/openapi.json" && !routes.has(route)) errors.push(`shared/api.md: ${path} isn't a route`);
}

// mcp.md's tools are on the server. An operation with no tool is named on a line that says so.
const tools = new Set(Object.keys(context.tools));
for (const name of ["listings_profile", "listings_copy", "tags_get"]) if (!tools.has(name)) errors.push(`shared/mcp.md: the server has no tool ${name}`);

// data.md's budgets are the ones the API states.
const limits = [...context.rate_limits.rest.matchAll(/(signed out|Free|Pro) (\d+) \/ (\d+); (\d+) rows/g)].map((m) => m.slice(2).map(Number));
const comma = (n: number) => n.toLocaleString("en-US");
const data = readFileSync("shared/data.md", "utf8");
const row = (label: string) => data.split("\n").find((line) => line.startsWith(`| ${label}`)) ?? "";
if (limits.length !== 3) errors.push("agent-context: the budgets' wording changed; update this check");
else {
  const calls = `| Calls per hour, 24 hours | ${limits.map((l) => l.slice(0, 2).map(comma).join(", ")).join(" | ")} |`;
  const rows = `| Rows per 24 hours | ${limits.map((l) => comma(l[2]!)).join(" | ")} |`;
  if (row("Calls per hour") !== calls) errors.push(`shared/data.md: expected ${calls}`);
  if (row("Rows per 24 hours") !== rows) errors.push(`shared/data.md: expected ${rows}`);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Contract ok: ${files.length} files against ${origin}`);
