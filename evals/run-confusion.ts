#!/usr/bin/env node
// Runs a labelled query pool with all eight skills installed, and records the first tool each run calls.
//   node evals/run-confusion.ts <pilot dir> <pool.json> <out.json> <model> <runs> [max turns]
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

type Query = { query: string; expect: string };
type Run = { first: string; skills: unknown };

const [pilot, poolPath, out, model, runsArg, turns = "1"] = process.argv.slice(2);
if (!pilot || !poolPath || !out || !model || !runsArg) throw new Error("usage: run-confusion.ts <pilot dir> <pool.json> <out.json> <model> <runs> [max turns]");
const pool: Query[] = JSON.parse(readFileSync(poolPath, "utf8"));
const runs = Number(runsArg);
const SKILLS = new Set(["plugin-stack", "optimize-listing", "submit-plugin", "audit-discoverability", "design-widgets", "watch-competitors", "find-opening", "track-launch"]);

const claude = (query: string) => new Promise<string>((resolve, reject) => {
  const child = spawn("claude", ["-p", query, "--output-format", "stream-json", "--verbose", "--max-turns", turns, "--model", model,
    "--setting-sources", "project", "--strict-mcp-config", "--mcp-config", '{"mcpServers":{}}'], { cwd: pilot, stdio: ["ignore", "pipe", "ignore"], timeout: 170_000 });
  let stdout = "";
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.on("error", reject);
  child.on("close", (_code, signal) => signal ? reject(new Error(`claude stopped by ${signal}`)) : resolve(stdout));
});

const firstTool = (use: { name: string; input: Record<string, unknown> }) => {
  const path = String(use.input.file_path ?? "");
  if (use.name === "Skill") return String(use.input.skill);
  if (use.name === "Read" && path.includes(".claude/skills/")) return path.split(".claude/skills/")[1]!.split("/")[0]!;
  return `tool:${use.name}`;
};

const run = async (query: string): Promise<Run> => {
  let first: string | undefined, skills: unknown;
  for (const line of (await claude(query)).split("\n")) {
    let event: any;
    try { event = JSON.parse(line); } catch { continue; }
    if (event.type === "system" && event.subtype === "init") skills = event.skills;
    if (event.type === "assistant" && (first === undefined || first.startsWith("tool:"))) {
      const use = event.message.content.find((c: { type: string }) => c.type === "tool_use");
      if (use) first = firstTool(use);
    }
  }
  return { first: first ?? "text", skills };
};

// Six at once, each answer printed in the pool's order.
const answers: Promise<Run[]>[] = [];
const waiting: (() => void)[] = [];
let active = 0;
const job = async (item: Query) => {
  if (active >= 6) await new Promise<void>((go) => waiting.push(go));
  active++;
  try {
    const rs: Run[] = [];
    for (let i = 0; i < runs; i++) rs.push(await run(item.query));
    return rs;
  } finally { active--; waiting.shift()?.(); }
};
for (const item of pool) answers.push(job(item));

const results: (Query & { got: string[] })[] = [];
let installed: unknown;
for (const [i, item] of pool.entries()) {
  const rs = await answers[i]!, got = rs.map((r) => r.first);
  results.push({ ...item, got });
  installed = rs[0]?.skills;
  console.log(item.expect.slice(0, 10).padEnd(11), got, item.query.slice(0, 70));
}
writeFileSync(out, JSON.stringify({ model, installed, results }, null, 1));

const hit: Record<string, number> = {}, total: Record<string, number> = {}, confused: Record<string, number> = {};
for (const r of results) for (const g of r.got) {
  const expected = r.expect.split("|"), ok = expected.includes(g) || (expected.includes("none") && !SKILLS.has(g));
  total[r.expect] = (total[r.expect] ?? 0) + 1;
  hit[r.expect] = (hit[r.expect] ?? 0) + (ok ? 1 : 0);
  if (!ok) confused[`${r.expect} -> ${g}`] = (confused[`${r.expect} -> ${g}`] ?? 0) + 1;
}
console.log(Object.fromEntries(Object.keys(total).map((k) => [k, `${hit[k]}/${total[k]}`])));
console.log(Object.entries(confused).sort((a, b) => b[1] - a[1]));
