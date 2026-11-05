#!/usr/bin/env bash
# Installs the skills the way a user would, into clean folders, and checks that each agent got all of them.
#   scripts/test-installs.sh                            from this checkout
#   scripts/test-installs.sh theopenapps/plugin-stack   from GitHub
#   scripts/test-installs.sh --run [source]             then asks each signed-in agent here to use a skill (spends model credits)
set -uo pipefail
cd "$(dirname "$0")/.."
run=; [ "${1:-}" = --run ] && { run=1; shift; }
source=${1:-$PWD}
want=$(ls skills | wc -l | tr -d ' ')
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
failed=0

report() { printf '%-5s %s\n' "$1" "$2"; [ "$1" != FAIL ] || failed=1; }
expect() { # label, folder, how many skills
  local got; got=$(find "$2" -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')
  if [ "$got" = "$3" ]; then report ok "$1: $got skills"; else report FAIL "$1: $got skills, wanted $3"; fi
}
has() { command -v "$1" >/dev/null; }

claude_cache="$tmp/claude/plugins/cache/theopenapps/plugin-stack"
codex_cache="$tmp/codex/plugins/cache/theopenapps/plugin-stack"

if has claude; then
  [ "$source" != "$PWD" ] || claude plugin validate "$PWD" >/dev/null 2>&1 || report FAIL "claude plugin validate"
  export CLAUDE_CONFIG_DIR="$tmp/claude"
  { claude plugin marketplace add "$source" && claude plugin install plugin-stack@theopenapps; } >"$tmp/claude.log" 2>&1
  unset CLAUDE_CONFIG_DIR
  expect "Claude Code plugin" "$claude_cache" "$want"
else report skip "Claude Code plugin: no claude here"; fi

if has codex; then
  mkdir -p "$tmp/codex"
  { CODEX_HOME="$tmp/codex" codex plugin marketplace add "$source" && CODEX_HOME="$tmp/codex" codex plugin add plugin-stack@theopenapps; } >"$tmp/codex.log" 2>&1
  expect "Codex plugin" "$codex_cache" "$want"
else report skip "Codex plugin: no codex here"; fi

for agent in claude-code codex cursor opencode amp gemini-cli github-copilot windsurf cline goose pi; do
  mkdir -p "$tmp/skills/$agent"
  (cd "$tmp/skills/$agent" && npx -y skills add "$source" -a "$agent" --copy -y) >"$tmp/skills/$agent.log" 2>&1
  expect "npx skills -a $agent" "$tmp/skills/$agent" "$want"
done

mkdir -p "$tmp/one"
(cd "$tmp/one" && npx -y skills add "$source" --skill optimize-listing -a claude-code --copy -y) >"$tmp/one.log" 2>&1
expect "npx skills, one skill" "$tmp/one" 1
for file in data cli mcp api; do
  [ -f "$tmp/one/.claude/skills/optimize-listing/references/$file.md" ] || report FAIL "one skill: references/$file.md is missing"
done

if [ -n "$run" ]; then
  ask='Use the optimize-listing skill. Read its references/data.md, pick an OpenApps surface the way that file says, then read the top 3 apps on the ChatGPT store Featured chart. Reply with exactly three lines: SKILL=<absolute path of the optimize-listing SKILL.md you read>, SURFACE=<cli|mcp|api>, TOP3=<the three app names>.'
  session() { # label, folder, command
    local label=$1 dir=$2 out; shift 2; out="$tmp/$(echo "$label" | tr ' ' -).txt"
    has "$1" || { report skip "$label: no $1 here"; return; }
    (cd "$dir" && perl -e 'alarm shift; exec @ARGV' 300 "$@" </dev/null) >"$out" 2>&1
    if grep -q "SKILL=.*$(basename "$tmp").*optimize-listing/SKILL.md" "$out" && grep -q 'TOP3=.' "$out"; then
      report ok "$label: $(grep 'TOP3=' "$out" | tail -1)"
    elif grep -qiE 'billing|log ?in|expired|unauthorized|not authenticated' "$out"; then
      report skip "$label: not signed in"
    else report FAIL "$label: $(tail -1 "$out" | cut -c1-120)"; fi
  }
  codex_args=(exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox -c model_reasoning_effort=low)
  [ -z "${CODEX_MODEL:-}" ] || codex_args+=(-m "$CODEX_MODEL")
  mkdir -p "$tmp/w" "$tmp/codex-empty"
  ln -sf "$HOME/.codex/auth.json" "$tmp/codex/auth.json"; ln -sf "$HOME/.codex/auth.json" "$tmp/codex-empty/auth.json"
  session "Claude Code plugin session" "$tmp/w" claude -p "$ask" --plugin-dir "$(find "$claude_cache" -mindepth 1 -maxdepth 1 -type d | head -1)" --strict-mcp-config --model sonnet --dangerously-skip-permissions &
  CODEX_HOME="$tmp/codex" session "Codex plugin session" "$tmp/w" codex "${codex_args[@]}" "$ask" &
  session "Claude Code skills session" "$tmp/skills/claude-code" claude -p "$ask" --strict-mcp-config --model sonnet --dangerously-skip-permissions &
  CODEX_HOME="$tmp/codex-empty" session "Codex skills session" "$tmp/skills/codex" codex "${codex_args[@]}" "$ask" &
  session "Cursor skills session" "$tmp/skills/cursor" cursor-agent -p "$ask" --force --output-format text &
  session "OpenCode skills session" "$tmp/skills/opencode" opencode run "$ask" &
  session "Amp skills session" "$tmp/skills/amp" amp -x "$ask" --dangerously-allow-all &
  wait
fi

[ "$failed" = 0 ] && echo "installs pass" || { echo "installs failed"; exit 1; }
