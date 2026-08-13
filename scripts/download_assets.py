#!/usr/bin/env python3
"""A-Bau Assets: Download wp-json-Medien -> WebP-Optimierung + Manifest."""
import json, os, re, sys, urllib.request, hashlib
from PIL import Image

BASE = "/workspace/nexifyai/clients/abau"
SITE = f"{BASE}/site/public/assets"
ORIG = f"{BASE}/assets/original"
os.makedirs(ORIG, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/126 Safari/537.36"}
API = "https://a-bau.info/wp-json/wp/v2/media?per_page=100"

def fetch(url, timeout=40):
    req = urllib.request.Request(url, headers=UA)
    return urllib.request.urlopen(req, timeout=timeout).read()

media = json.loads(fetch(API))
skip_kw = ("woocommerce-placeholder", "extendify-demo", "sample")
cats = {
    "denkmal": ("denkmal", "restaur", "historisch", "altbau", "d11ef", "9f6d2e", "d0514d", "d14d3f"),
    "krankenhaus": ("krankenhaus", "gesundheit", "IMG_1414", "IMG_1415", "IMG_1416", "IMG_1417"),
    "badezimmer": ("badezimmer", "bad"),
    "innenausbau": ("innen", "raum", "wohn", "b1b985", "e8147d", "b56a42", "8fefc1", "92d2c3", "a2e996", "f251fe", "9d72ec", "8cac8b", "97e8c2"),
    "schlüsselfertig": ("schlüssel", "neubau", "313a5e", "739ff7", "c641d5", "263589", "b689b7", "c9a379", "13aa27", "03e891", "bd7ae7", "82fbaa", "583dbb", "3531ed"),
    "sanierung": ("sanier", "fassade", "dach", "f344eb", "bd9a7c", "75", "5ae308"),
    "sonstiges": (),
}
video_ext = (".mp4", ".mov", ".webm")
manifest, skipped = [], []
for m in media:
    src = m.get("source_url") or ""
    if not src: continue
    fn = src.split("/")[-1]
    if any(k in fn.lower() for k in skip_kw): continue
    if fn.lower().endswith(video_ext):
        # Videos: nur registrieren, nicht konvertieren
        manifest.append({"id": m["id"], "date": (m.get("date") or "")[:10], "file": fn, "url": src, "kind": "video"})
        continue
    try:
        raw = fetch(src)
    except Exception as e:
        skipped.append((fn, str(e))); continue
    p = os.path.join(ORIG, fn)
    open(p, "wb").write(raw)
    try:
        im = Image.open(p)
        im.load()
    except Exception as e:
        skipped.append((fn, f"not-image: {e}")); continue
    cat = next((c for c, kws in cats.items() if any(k.lower() in fn.lower() for k in kws)), "sonstiges")
    if im.mode in ("RGBA", "P", "LA"): im = im.convert("RGBA")
    else: im = im.convert("RGB")
    w, h = im.size
    if w > 1600:
        im = im.resize((1600, int(h * 1600 / w)), Image.LANCZOS)
    out = f"{SITE}/{cat}/{os.path.splitext(fn)[0]}.webp"
    im.save(out, "WEBP", quality=82, method=6)
    alt = {
        "denkmal": "Restaurierung denkmalgeschützter Bausubstanz – A-Bau Meisterbetrieb Mönchengladbach",
        "krankenhaus": "Krankenhausbau / Gesundheitsbau – A-Bau Meisterbetrieb Mönchengladbach",
        "badezimmer": "Badezimmer-Innenausbau – A-Bau Meisterbetrieb Mönchengladbach",
        "innenausbau": "Innenausbau Projekt – A-Bau Meisterbetrieb Mönchengladbach",
        "schlüsselfertig": "Schlüsselfertiger Neubau – A-Bau Meisterbetrieb Mönchengladbach",
        "sanierung": "Sanierung Altbau – A-Bau Meisterbetrieb Mönchengladbach",
        "sonstiges": "Bauprojekt – A-Bau Meisterbetrieb Mönchengladbach",
    }[cat]
    manifest.append({"id": m["id"], "date": (m.get("date") or "")[:10], "file": fn, "cat": cat, "webp": f"{cat}/{os.path.splitext(fn)[0]}.webp", "w": im.size[0], "h": im.size[1], "alt": alt, "orig_bytes": len(raw)})
    print(f"OK {fn} -> {cat} {im.size}")

json.dump(manifest, open(f"{BASE}/assets/manifest.json", "w"), indent=1, ensure_ascii=False)
print(f"\nTOTAL {len(manifest)} Medien ({sum(1 for x in manifest if x.get('kind')=='video')} Videos), skipped {len(skipped)}")
for s in skipped: print("SKIP", s)
