#!/usr/bin/env python3
"""Run a labelled query pool with all six skills installed; record the first tool each run calls."""
import json, subprocess, sys, collections, concurrent.futures as cf
pilot, pool_path, out, model, runs = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], int(sys.argv[5])
pool = json.load(open(pool_path)); TURNS=sys.argv[6] if len(sys.argv)>6 else "1"
SKILLS = {"plugin-stack","optimize-listing","submit-plugin","audit-discoverability","design-widgets","watch-competitors"}
def run(q):
    p = subprocess.run(["claude","-p",q,"--output-format","stream-json","--verbose","--max-turns",TURNS,"--model",model,
        "--setting-sources","project","--strict-mcp-config","--mcp-config",'{"mcpServers":{}}'],cwd=pilot,capture_output=True,text=True,timeout=170)
    first=None; skills=None
    for line in p.stdout.splitlines():
        try: e=json.loads(line)
        except Exception: continue
        if e.get("type")=="system" and e.get("subtype")=="init": skills=e.get("skills")
        if e.get("type")=="assistant" and (first is None or first.startswith("tool:")):
            for c in e["message"]["content"]:
                if c.get("type")=="tool_use":
                    inp=c["input"]; path=str(inp.get("file_path",""))
                    if c["name"]=="Skill": first=inp.get("skill")
                    elif c["name"]=="Read" and ".claude/skills/" in path: first=path.split(".claude/skills/")[1].split("/")[0]
                    else: first="tool:"+c["name"]
                    break
    return first or "text", skills
def job(item):
    return item, [run(item["query"]) for _ in range(runs)]
res=[]
with cf.ThreadPoolExecutor(6) as ex:
    for item,rs in ex.map(job,pool):
        got=[r[0] for r in rs]
        res.append({**item,"got":got})
        print(item["expect"][:10].ljust(11), got, item["query"][:70], flush=True)
        init=rs[0][1]
json.dump({"model":model,"installed":init,"results":res},open(out,"w"),indent=1)
hit=collections.Counter(); tot=collections.Counter(); conf=collections.Counter()
for r in res:
    for g in r["got"]:
        tot[r["expect"]]+=1
        exp=r["expect"].split("|"); ok=(g in exp) or ("none" in exp and g not in SKILLS)
        hit[r["expect"]]+=ok
        if not ok: conf[(r["expect"],g)]+=1
print({k:f"{hit[k]}/{tot[k]}" for k in tot}); print(conf.most_common())
