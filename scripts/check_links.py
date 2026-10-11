#!/usr/bin/env python3
"""Fail the build if any local href/src/url() reference points to a missing file."""
import re, sys
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parent.parent
ATTR = re.compile(r'''(?:href|src)\s*=\s*["']([^"']+)["']''', re.I)
CSSURL = re.compile(r'''url\(\s*["']?([^)"']+)["']?\s*\)''', re.I)
errors, checked = [], 0

def is_external(ref):
    return ref.startswith(("#", "mailto:", "tel:", "data:", "javascript:", "//")) or urlparse(ref).scheme in ("http", "https")

def check(src_file, ref):
    global checked
    if is_external(ref): return
    path = unquote(urlparse(ref).path)
    if not path: return
    base = ROOT if path.startswith("/") else src_file.parent
    target = (base / path.lstrip("/")).resolve()
    if target.is_dir(): target = target / "index.html"
    checked += 1
    if not target.exists():
        errors.append(f"{src_file.relative_to(ROOT)}: missing -> {ref}")

for f in ROOT.rglob("*"):
    if any(p in f.parts for p in (".git", "node_modules", "docs")) or not f.is_file(): continue
    if f.suffix in (".html", ".htm"):
        for m in ATTR.finditer(f.read_text(encoding="utf-8")): check(f, m.group(1))
    elif f.suffix == ".css":
        for m in CSSURL.finditer(f.read_text(encoding="utf-8")): check(f, m.group(1))

if errors:
    print("BROKEN PATHS FOUND:"); print("\n".join(errors)); sys.exit(1)
print(f"OK – {checked} local references verified, 0 broken.")
