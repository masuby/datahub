"""Copy deck (markdown) -> typed TypeScript dictionary.

Usage:
    python -I deck2ts.py <copy.xx.md> <out.ts> <locale> [--report]

Deck lines look like:  - `hero.title.line1` → From Data
Arrays use [0], objects in arrays [0].field. Keys are kept exactly; the
emitted object preserves deck order so diffs stay readable.
"""

import json
import re
import sys

src, out, locale, *flags = sys.argv[1:]
LINE = re.compile(r"^\s*-\s+`([^`]+)`\s*(?:→|->)\s*(.*?)\s*$")
TOKEN = re.compile(r"([A-Za-z_][A-Za-z0-9_]*)|\[(\d+)\]")

root: dict = {}
skipped, count = [], 0
in_notes = False
for n, raw in enumerate(open(src, encoding="utf-8"), 1):
    if raw.startswith("## ") and "not rendered" in raw.lower():
        in_notes = True
        continue
    if raw.startswith("## "):
        in_notes = False
    if in_notes:
        continue
    m = LINE.match(raw)
    if not m:
        if raw.lstrip().startswith("- `"):
            skipped.append((n, raw.rstrip()))
        continue
    path, value = m.group(1), m.group(2)
    # The deck marks a significant leading/trailing space as "␠", sometimes
    # followed by a note for the translator: `to␠ (the word "to" followed by
    # one space)`. Drop the note, then turn the marker into a real space.
    value = re.sub(r"␠\s*\([^)]*\)\s*$", "␠", value).replace("␠", " ")
    # Values occasionally carry a trailing note in parentheses marked "note:";
    # nothing in the deck format does that today, so take the value verbatim.
    parts = []
    for seg in path.split("."):
        toks = TOKEN.findall(seg)
        if not toks or "".join(f"{a}" if a else f"[{b}]" for a, b in toks) != seg:
            skipped.append((n, raw.rstrip()))
            parts = None
            break
        for a, b in toks:
            parts.append(a if a else int(b))
    if parts is None:
        continue
    node = root
    for i, p in enumerate(parts):
        last = i == len(parts) - 1
        nxt = None if last else parts[i + 1]
        if isinstance(p, int):
            assert isinstance(node, list), (n, path)
            while len(node) <= p:
                node.append(None)
            if last:
                node[p] = value
            else:
                if node[p] is None:
                    node[p] = [] if isinstance(nxt, int) else {}
                node = node[p]
        else:
            assert isinstance(node, dict), (n, path)
            if last:
                if p in node:
                    skipped.append((n, f"DUPLICATE {path}"))
                node[p] = value
            else:
                if p not in node:
                    node[p] = [] if isinstance(nxt, int) else {}
                node = node[p]
    count += 1


def holes(node, path=""):
    if isinstance(node, list):
        for i, v in enumerate(node):
            if v is None:
                yield f"{path}[{i}]"
            else:
                yield from holes(v, f"{path}[{i}]")
    elif isinstance(node, dict):
        for k, v in node.items():
            yield from holes(v, f"{path}.{k}" if path else k)


gaps = list(holes(root))
body = json.dumps(root, ensure_ascii=False, indent=2)
if locale == "en":
    ts = f"""import "server-only";

/**
 * English dictionary. Generated from the copy deck (copy.en.md) — the deck is
 * the source; regenerate rather than hand-editing so the two never drift.
 * `sw.ts` must have exactly this shape: the `Dictionary` type below enforces it.
 */
const en = {body} as const;

export default en;
"""
else:
    ts = f"""import "server-only";
import type {{ Dictionary }} from "../get-dictionary";

/**
 * Kiswahili dictionary. Generated from the reviewed Kiswahili copy deck
 * (copy.sw.md). Typed against the English dictionary, so a missing or extra
 * key fails the build.
 */
const sw = {body} satisfies Dictionary;

export default sw;
"""
open(out, "w", encoding="utf-8", newline="\n").write(ts)
print(f"{count} keys -> {out}; top-level: {', '.join(root.keys())}")
print(f"array holes: {gaps[:20]}" if gaps else "no array holes")
if skipped:
    print(f"{len(skipped)} unparsed '- `' lines:")
    for n, l in skipped[:40]:
        print(f"  {n}: {l[:160]}")
