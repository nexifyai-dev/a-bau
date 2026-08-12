# Nutzerhandbuch — A-Bau Meisterbetrieb GmbH Website

Website: https://a-bau.nexifyai.cloud · Repo: `nexifyai-dev/a-bau` (Push = Deploy)

## 1. Aufbau
Next.js 16 (Static Export) + FastAPI (`chat/server.py`, Port 8095). Seiten: Home, Leistungen (7),
Referenzen, Stadtteile (6), Über uns, FAQ (14), Kontakt, Angebot, Impressum, Datenschutz,
Cookie-Richtlinie, 404, Suche.

## 2. Inhalte pflegen (ohne Code)
Alle Texte/Daten liegen in `site/src/data/*.yaml` (eine Quelle je Bereich):

| Datei | Inhalt |
|---|---|
| `kontakt.yaml` | Firma, Adresse, Telefon, E-Mail, Öffnungszeiten, HRB, USt-IdNr., HWK |
| `leistungen.yaml` | 7 Leistungen (titel, kurz, text, punkte, bild) |
| `referenzen.yaml` | Referenz-Kategorien (titel, text, bilder, video) — optional ort/jahr/umfang |
| `stadtteile.yaml` | 6 Stadtteile (text, schwerpunkt) |
| `faq.yaml` | 14 FAQ — Felder heißen `f:` und `a:` (NICHT frage/antwort!) |
| `site.yaml` | Meta: Titel, Claim, Navigation |

Rechtstexte: `content/impressum.md`, `content/datenschutz.md` (nach Änderung anwaltlich prüfen).

## 3. Bilder & Videos
- Bilder: `site/public/assets/…` (WebP empfohlen, ≤ ~400 KB; große Formate vorher komprimieren).
- Videos: `site/public/assets/videos/` — MP4, ≤ ~3 MB (ffmpeg: `-c:v libx264 -crf 28 -movflags +faststart`).
  Neue Videos NIE unkomprimiert einspielen (CDN-Cache-Falle, max-age 1 Tag für MP4).

## 4. FAQ ändern
1. `faq.yaml` bearbeiten (Felder `f`/`a`).
2. Build + Push (siehe Deployment). Chat-Wissen: `chat/ingest.py` ausführen, `chat/data/kb.db` committen.

## 5. Chat (KI-Assistent)
Seit 2026-08-12 **entfernt** (Komponente, CSS, Datenschutz-Abschnitt). Backend `/api/chat` bleibt
deaktiviert verfügbar. Wiedereinbau: ChatWidget-Komponente aus Git-Historie + Datenschutz-Abschnitt.

## 6. Deployment
`git push origin main` deployt (Host-Tunnel → 127.0.0.1:8095). Server im Container:
`setsid /app/venv/bin/python3 chat/server.py` (Log `/tmp/abau-server.log`).
Health: `curl http://127.0.0.1:8095/health` oder https://a-bau.nexifyai.cloud/health.
Watchdog: `~/.hermes/scripts/abau-watchdog.sh` + Cron-Job `abau-server-watchdog`
(feuert nur, wenn Hermes-Gateway läuft — sonst manuell starten).

## 7. Fehlerbehebung (kurz)
- **Chat 401**: `.env`-Key-Check (CUSTOM_API_KEY aktuell?), Server neu starten. Details: BETRIEBSHANDBUCH.md.
- **Seite 502**: Server-Prozess prüfen → `bash /tmp/start-abau.sh` (bzw. Watchdog-Script).
- **Bilder 404 nach Update**: `images.unoptimized` beachten — Bilder liegen statisch unter `/assets`.

## 8. Backup / Wiederherstellung
Repo = Backup (Code + Inhalte). KB regenerierbar: `chat/ingest.py`. Build-Artefakt: `site/out/`.
