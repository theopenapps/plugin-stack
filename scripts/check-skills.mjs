#!/usr/bin/env node
// Fails when a skill breaks a rule of this repo. No dependencies.
//   node scripts/check-skills.mjs          check
//   node scripts/check-skills.mjs --write  copy shared/ into every skill, then check
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = "skills";
const errors = [];
const fail = (file, why) => errors.push(`${file}: ${why}`);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const skills = readdirSync(root).filter((name) => statSync(join(root, name)).isDirectory());
const shared = readdirSync("shared").map((name) => `references/${name}`);
const sharedPath = (rel) => join("shared", rel.replace("references/", ""));
const licenses = new Map();

// Skills name operations. Only shared/cli.md spells out a command or flag.
const command = /\b(?:listings (?:search|list|get|versions|widgets|metrics|tools|ranks-current|ranks-history)|charts get|changes list|tags get|new list|stores get|mcp toolset-get)\b|@theopenapps\/cli|--(?:apps|since|limit|store|types|cursor|from|diff-from|server|app|sort|category|latest|format|fields)\b/;

if (process.argv.includes("--write")) {
  for (const skill of skills) for (const rel of shared) copyFileSync(sharedPath(rel), join(root, skill, rel));
}

for (const skill of skills) {
  const dir = join(root, skill);
  const main = join(dir, "SKILL.md");
  if (!existsSync(main)) { fail(dir, "no SKILL.md"); continue; }

  const text = readFileSync(main, "utf8");
  const front = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const field = (key) => front.match(new RegExp(`^${key}: "?(.*?)"?$`, "m"))?.[1];
  if (field("name") !== skill) fail(main, `name is ${field("name")}, directory is ${skill}`);
  const description = field("description") ?? "";
  if (!description) fail(main, "no description");
  if (description.length > 1024) fail(main, `description is ${description.length} characters, the limit is 1,024`);
  if (/[<>]/.test(description)) fail(main, "description contains an angle bracket");
  if (field("license") !== "MIT") fail(main, "license isn't MIT");
  if (!field("compatibility")) fail(main, "no compatibility");
  if (!text.includes("references/data.md")) fail(main, "doesn't reach references/data.md");

  for (const rel of shared) {
    const path = join(dir, rel);
    if (!existsSync(path)) fail(path, "missing; run with --write");
    else if (readFileSync(path, "utf8") !== readFileSync(sharedPath(rel), "utf8")) fail(path, "differs from shared/; run with --write");
  }

  const license = join(dir, "LICENSE.txt");
  if (!existsSync(license)) fail(license, "missing");
  else {
    const body = readFileSync(license, "utf8");
    licenses.set(body, [...(licenses.get(body) ?? []), skill]);
  }

  for (const path of walk(dir)) {
    const body = readFileSync(path, "utf8");
    const rel = relative(dir, path);
    const isShared = shared.includes(rel);
    if (body.includes("../")) fail(path, "contains ../");
    if (/\bTODO\b/.test(body)) fail(path, "contains TODO");
    if (!isShared && command.test(body.replace(/^---\n[\s\S]*?\n---/, ""))) fail(path, `spells out a command: ${body.match(command)[0]}; name the operation`);
    if (!rel.startsWith("references/")) continue;
    if (/\]\((?!https?:)[^)]+\)/.test(body)) fail(path, "a reference links to another file");
    if (isShared) continue;
    const reached = text.includes(rel) || (rel.startsWith("references/stores/") && text.includes("references/stores/<store>.md"));
    if (!reached) fail(path, "SKILL.md doesn't reach it");
    if (rel.startsWith("references/stores/")) {
      const date = body.match(/^Checked: (\d{4}-\d{2}-\d{2}) against https?:/m)?.[1];
      if (!date || Number.isNaN(Date.parse(date))) fail(path, "no 'Checked: YYYY-MM-DD against <url>' line");
    }
  }
}

if (licenses.size > 1) fail("LICENSE.txt", `differs across skills: ${[...licenses.values()].map((s) => s.join(", ")).join(" | ")}`);

// Claude Code holds back an update until the version changes. With no version, every commit on main is an update.
for (const manifest of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"]) {
  if ("version" in JSON.parse(readFileSync(manifest, "utf8"))) fail(manifest, "has a version");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`${skills.length} skills pass`);
