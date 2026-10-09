"""Comprueba archivos y anclas de los enlaces Markdown locales del monorepo."""
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[2]
DOCS = [ROOT / "README.md", ROOT / "CONTRIBUTING.md", ROOT / "CLAUDE.md"]
DOCS += list((ROOT / "docs").rglob("*.md"))
DOCS += list((ROOT / "apps").glob("*/README.md"))
DOCS += list((ROOT / "apps").glob("*/CLAUDE.md"))
DOCS += list((ROOT / "apps/frontend/src").rglob("README.md"))

def anchors(path):
    headings = re.findall(r'id=["\']([^"\']+)["\']', path.read_text(encoding="utf-8-sig"))
    used = {}
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        if not re.match(r"^#{1,6} ", line):
            continue
        value = re.sub(r"^#{1,6} ", "", line).strip().lower()
        value = re.sub(r"<[^>]+>", "", value)
        value = "".join(c for c in value if c in "- _" or unicodedata.category(c)[0] in "LN")
        value = value.replace(" ", "-")
        count = used.get(value, 0)
        used[value] = count + 1
        headings.append(f"{value}-{count}" if count else value)
    return set(headings)

errors = []
checked = 0
for doc in DOCS:
    if not doc.exists():
        errors.append(f"Falta {doc.relative_to(ROOT)}")
        continue
    content = doc.read_text(encoding="utf-8-sig")
    content = re.sub(r"```.*?```", "", content, flags=re.S)
    for match in re.finditer(r"\[[^\]]*\]\(([^\s)]+)\)", content):
        target = match.group(1).strip("<>")
        if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target):
            continue
        path, _, anchor = unquote(target).partition("#")
        resolved = (doc.parent / path).resolve() if path else doc
        checked += 1
        if not resolved.is_relative_to(ROOT) or not resolved.exists():
            errors.append(f"{doc.relative_to(ROOT)}: {target}")
        elif anchor and resolved.suffix == ".md" and anchor not in anchors(resolved):
            errors.append(f"{doc.relative_to(ROOT)}: ancla inexistente {target}")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"OK: {checked} enlaces internos (archivos y anclas), {len(DOCS)} documentos.")
