#!/usr/bin/env python3
"""A-Bau Wissens-Ingest: content/* -> Chunks -> FTS5-Index (SQLite).
Einmalig nach Content-Änderungen ausführen (Betriebshandbuch)."""
import os, re, sqlite3, sys
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
DB = os.path.join(ROOT, "chat", "data", "kb.db")

def yaml_to_text(path):
    d = yaml.safe_load(open(path, encoding="utf-8"))
    parts = []
    def walk(o, src):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ("bild", "bilder", "video", "og_bild", "nav", "footer", "hinweise"): continue
                walk(v, src)
        elif isinstance(o, list):
            for x in o: walk(x, src)
        elif isinstance(o, str) and o.strip():
            parts.append(o.strip())
    walk(d, path)
    return " ".join(parts)

def md_to_text(path):
    raw = open(path, encoding="utf-8").read()
    raw = re.sub(r"<[^>]+>", " ", raw)
    raw = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", raw)
    raw = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", raw)
    return re.sub(r"\s+", " ", raw)

def chunks(text, size=700, overlap=80):
    text = re.sub(r"\s+", " ", text).strip()
    out, i = [], 0
    while i < len(text):
        out.append(text[i:i + size])
        i += max(size - overlap, 1)
    return out

def main():
    docs = []
    EXCLUDE = {"impressum.md", "datenschutz.md", "agb.md", "nutzungsbedingungen.md"}
    # EINDEUTIGE Dokumente: content/ ist kanonisch (R10-Sync hält content/ == src/data/).
    # src/data/ wird nur für Dateien genutzt, die es in content/ nicht gibt (kontakt.yaml).
    # Doppelte Ingests (46 statt 23 Chunks) verfälschen BM25-Gewichtung und Quellen-Anzeige.
    DIRS = [CONTENT, os.path.join(ROOT, "site", "src", "data")]
    seen = set()
    for d in DIRS:
        if not os.path.isdir(d):
            continue
        for fn in sorted(os.listdir(d)):
            if fn in EXCLUDE or fn in seen:
                continue  # content/ gewinnt (kanonisch); kein Doppel-Ingest
            p = os.path.join(d, fn)
            if fn.endswith(".yaml"): txt = yaml_to_text(p)
            elif fn.endswith(".md"): txt = md_to_text(p)
            else: continue
            if len(txt) < 40: continue
            seen.add(fn)
            docs.append((f"{os.path.basename(d)}/{fn}", txt))
    rows = []
    for fn, txt in docs:
        for c in chunks(txt):
            rows.append((c, fn))
    os.makedirs(os.path.dirname(DB), exist_ok=True)
    con = sqlite3.connect(DB)
    con.execute("DROP TABLE IF EXISTS chunks")
    con.execute("DROP TABLE IF EXISTS chunks_fts")
    con.execute("CREATE TABLE chunks(id INTEGER PRIMARY KEY, text TEXT, source TEXT)")
    con.execute("CREATE VIRTUAL TABLE chunks_fts USING fts5(text, source, content='chunks', content_rowid='id', tokenize='unicode61 remove_diacritics 2')")
    con.executemany("INSERT INTO chunks(text, source) VALUES(?,?)", rows)
    con.execute("INSERT INTO chunks_fts(chunks_fts) VALUES('rebuild')")
    con.commit()
    n = con.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
    con.close()
    print(f"INGEST OK: {n} Chunks aus {len(docs)} Dokumenten -> {DB}")

if __name__ == "__main__":
    main()
