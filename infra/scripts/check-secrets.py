"""Revisión local de patrones de credenciales en archivos e historial Git.

No imprime valores y no envía contenido a servicios externos. Los valores de
las plantillas y las credenciales ficticias de pruebas no son secretos reales.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PATTERNS = {
    "clave privada": rb"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----",
    "token GitHub": rb"\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b",
    "clave AWS": rb"\b(?:AKIA|ASIA)[0-9A-Z]{16}\b",
    "token Slack": rb"\bxox[baprs]-[A-Za-z0-9-]{20,}\b",
    "clave API": rb"\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b",
    "Google API": rb"\bAIza[0-9A-Za-z_-]{35}\b",
    "credenciales en URL": rb"(?:postgres(?:ql)?|mysql)://[^\s/:]+:[^\s/@]{8,}@",
}
findings = set()
def git(*args, data=None):
    return subprocess.run(["git", "-C", str(ROOT), *args], input=data, capture_output=True, check=True).stdout

def inspect(data, location):
    for label, pattern in PATTERNS.items():
        if re.search(pattern, data):
            findings.add((location, label))

working = git("ls-files", "--cached", "--others", "--exclude-standard", "-z").decode().split("\0")
count = 0
for name in set(filter(None, working)):
    path = ROOT / name
    if not path.is_file():
        continue
    if path.name == ".env" or (path.name.startswith(".env.") and path.name != ".env.example"):
        findings.add((name, "archivo de entorno privado versionable"))
    inspect(path.read_bytes(), name)
    count += 1

objects = git("rev-list", "--objects", "--all").decode().splitlines()
locations = {}
for entry in objects:
    oid, _, name = entry.partition(" ")
    locations.setdefault(oid, name)
    if name and Path(name).name == ".env":
        findings.add((name, "archivo .env en historial"))
ids = ("\n".join(locations) + "\n").encode()
metadata = git("cat-file", "--batch-check", data=ids).decode().splitlines()
blobs = [line.split()[0] for line in metadata if len(line.split()) == 3 and line.split()[1] == "blob"]
raw = git("cat-file", "--batch", data=("\n".join(blobs) + "\n").encode())
pos = 0
for oid in blobs:
    end = raw.index(b"\n", pos)
    header = raw[pos:end].decode().split()
    size = int(header[2])
    data = raw[end + 1:end + 1 + size]
    inspect(data, f"historial:{locations[oid]} ({oid[:8]})")
    pos = end + 1 + size + 1
if findings:
    for location, label in sorted(findings):
        print(f"REVISAR {label}: {location}")
    sys.exit(1)
print(f"OK: sin coincidencias; {count} archivos actuales y {len(blobs)} blobs del historial. Revisión por patrones, no certificación exhaustiva.")
