# Betriebshandbuch — A-Bau Website & Chatbot (a-bau.nexifyai.cloud)

**Kunde:** A-Bau Meisterbetrieb GmbH · **Betreiber:** NeXifyAI (VPS 72.62.152.47, Container hermes-webui) · **Stand:** 2026-08-12

**Deploy-Quelle (seit 2026-08-12):** Git-Repo `https://github.com/nexifyai-dev/a-bau.git`, main = Next.js-16-Stand (GAG-1:1, Design-Referenz `docs/DESIGN-ABAU-v2-2026-08-11.md`). Container-Spiegel: `/workspace/nexifyai/repos/a-bau` (bind-mounted → auch Host-seitig sichtbar). Verzeichnis `/workspace/nexifyai/clients/abau` = Arbeitskopie des Agenten (Next.js-Basis, identisch mit Repo-Stand; historischer Astro-Zwischenstand entfernt).

## Architektur (1 Dienst, 1 Port)
```
Browser → a-bau.nexifyai.cloud (Cloudflare, proxied)
  → Cloudflare-Tunnel f0f2b101-ed26-4130-8b04-16c43badf70a (Host)
  → Ingress: a-bau.nexifyai.cloud → http://127.0.0.1:8095
  → chat/server.py (FastAPI, Container-Host-Netz):
       statische Site (site/out, Next.js-Export) + /api/chat + /api/contact + /health
  → 9Router 127.0.0.1:20128 (LLM ds/deepseek-v4-flash, Think-Max)
  → SQLite chat/data/kb.db (FTS5-Retrieval, lokal, tenant-isoliert)
  → Hostinger-SMTP 465 (Formular-Versand an kontakt@a-bau.info)
```

## Betrieb
- **Start/Stop (setsid, überlebt Session-Ende):** `bash /tmp/start-abau.sh` (= `cd /workspace/nexifyai/repos/a-bau && PORT=8095 setsid /app/venv/bin/python3 chat/server.py >> /tmp/abau-server.log 2>&1 < /dev/null &`). Stop: Prozess `chat/server.py` beenden.
- **Watchdog AKTIV (seit 2026-08-12 15:59 E3):** Hermes-Cron-Job `abau-server-watchdog` (id `a1a70191e61a`, every 5m, no_agent, Script `~/.hermes/scripts/abau-watchdog.sh` — startet via setsid aus `repos/a-bau` mit venv-Python). Voraussetzung: Hermes-Gateway läuft im Container (Cron-Scheduler). Start Gateway: `bash /tmp/start-gateway.sh` (setsid `hermes gateway`), Status: `hermes cron status` — „✓ Gateway is running". **Ausfall 2026-08-12:** Container-Gateway war ~09:06 MESZ gestorben → alle Cron-Jobs feuerten nicht → Server-Ausfall ohne Auto-Restart (Host-Error, 502 über Domain). Fix: Gateway per setsid gestartet; Watchdog-Job lief 15:59 completed/ok (Gegentest bestanden). Scheduler-Tick prüfen: `hermes cron status` (Ticker heartbeat < 60 s) + `hermes cron runs`/executions.db für `a1a70191e61a`.
- **Log-Aufbewahrung (DSGVO, seit R23):** Hermes-Cron-Job `abau-log-cleanup` (täglich 03:00, no_agent, Script `~/.hermes/scripts/abau-log-cleanup.sh`) löscht `/tmp/abau-server*.log` + `abau-watchdog.log` nach 7 Tagen.
- **Health:** `curl http://127.0.0.1:8095/health` bzw. `https://a-bau.nexifyai.cloud/health` → `{"status":"ok","chat":true,"kb":true}`.
- **Backup:** Repo (git) = Backup der Inhalte; `site/out` ist Build-Artefakt (reproduzierbar via `npm run build`); `chat/data/kb.db` aus `chat/ingest.py` regenerierbar.

## Content-Änderungen
1. Inhalte editieren: `data/kontakt.yaml` (NAP — EINE Quelle!), `content/*.yaml` + `*.md` (Leistungen/Referenzen/FAQ/Recht).
2. Site bauen: `cd site && npm run build` (Next.js 16, static export → `out/`; Node 22; pnpm-Store im Container defekt — npm nutzen).
3. Chat-Wissen aktualisieren: `python3 chat/ingest.py` (liest `content/` + `site/src/data/`, inkl. `kontakt.yaml`; Rechtstexte automatisch ausgeschlossen).
4. Service neu starten (siehe Betrieb).
5. Verifikation: Routen-200 + ein Chat-Test + `https://a-bau.nexifyai.cloud/health`.

## Wartung Chatbot
- **Widget (seit 2026-08-12, ADR-004):** Floating „A-Bau KI-Assistent" (unten rechts, `site/src/components/ChatWidget.tsx`, in layout.tsx). KI-Offenlegung Art. 50 EU AI Act im Widget + Datenschutz §6. API: `POST /api/chat {message}` → `{answer, quellen}`; kein Konversationsgedächtnis serverseitig (stateless), Verlauf nur im Client-State.
- Wissensquelle = `content/` (gleiche Dateien wie Site). Nach jedem Content-Update Re-Ingest Pflicht.
- Modell: `ds/deepseek-v4-flash` via 9Router (Think-Max); System-Prompt in `chat/server.py` (RAG-only, keine Preise, Quellen, Kontakt-Fallback, Injection-Schutz).
- Logs: nur Zugriffszeilen, keine PII; Rate-Limit 20/min/IP.
- Bei 9Router-Ausfall: /api/chat → 503, Widget zeigt Fehlermeldung (Kontakt/Telefon).
- Key: `_secret()` liest `/home/hermeswebui/.hermes/.env` (CUSTOM_API_KEY = 9Router-Key, verifiziert 2026-08-12). Kein Key im Client.

## Deploy-Änderungen (Domain/Port)
- Tunnel-Route: CF-API `PUT /accounts/{ACCOUNT_ID}/cfd_tunnel/{TUNNEL_ID}/configurations` (Token `CLOUDFLARE_API_TOKEN`; Ingress vor Catch-All einfügen).
- DNS: CNAME `a-bau.nexifyai.cloud` → `f0f2b101-ed26-4130-8b04-16c43badf70a.cfargotunnel.com`, proxied=true. Global-Key-Auth: `CLOUDFLARE_API_KEY` + `CLOUDFLARE_E_MAIL` (DELETE+POST, kein PATCH).
- Port-Kollisionen: 3000 = WhatsApp-Bridge; 8091 = Altlast-Ingress wa-webhook (ungenutzt); A-Bau nutzt **8095**.

## Go-Live-Freigabe (Kunde)
1. Rechtstexte anwaltlich prüfen; USt-IdNr./HWK im Impressum ergänzen.
2. Verbindliche Kontaktdaten bestätigen (Festnetz 02166 9925056 vs. Mobil 0162 18 15 229; E-Mail kontakt@a-bau.info).
3. `noindex, nofollow` in `chat/server.py` HEADERS entfernen → Rebuild + Restart.
4. Kunden-Abnahme-Report (PDF) via `nexify-pdf-ci-report` + Versand (Hostinger-SMTP + IMAP-Nachweis).

## Troubleshooting
| Symptom | Ursache/Fix |
|---|---|
| Site 502/404 über Domain | Tunnel-Ingress/DNS prüfen (obige API-Schritte); `server: cloudflare`-Header checken |
| /health nicht ok | Prozess tot → Watchdog (every 5m, s. Betrieb) startet binnen 5 min neu; sofort: `bash /tmp/start-abau.sh` |
| **Chat 401 (LLM-Fallback)** | **Root Cause 2026-08-12 behoben:** `_secret()` las Dateien in Datei-Reihenfolge mit `k in names` → die ERSTE passende Zeile in `/home/hermeswebui/.hermes/.env` gewann; dort steht `DEEPSEEK_API_KEY` VOR `CUSTOM_API_KEY` → Server nutzte den Direkt-Key → 401. Fix in `chat/server.py`: Namens-Reihenfolge (`for n in names`) — `CUSTOM_API_KEY` aus der Datei gewinnt jetzt. Zusätzlich: `asyncio.to_thread` für retrieve/LLM/SMTP (Event-Loop nicht blockieren), SQLite WAL + busy_timeout, LLM-Timeout 30s, `reasoning_effort: high` (Tunnel-Timeout-Falle). Key-Check: `curl -X POST http://127.0.0.1:20128/v1/chat/completions -H "Authorization: Bearer $(grep -m1 '^CUSTOM_API_KEY=' /home/hermeswebui/.hermes/.env | cut -d= -f2)" -d '{"model":"ds/deepseek-v4-flash","messages":[{"role":"user","content":"OK"}],"max_tokens":5}'` → 200. Danach Live-Test: `curl -X POST https://a-bau.nexifyai.cloud/api/chat -d '{"message":"test"}'` → echte Antwort statt `401`. Start: `setsid /app/venv/bin/python3 chat/server.py` (überlebt Session-Ende; Hermes-Background-Kinder werden sonst gekillt). |
| Chat 503 | 9Router down (curl 127.0.0.1:20128/v1/models) oder KB fehlt → `python3 chat/ingest.py` |
| Formular 502 | **Regression Container-Umzug (2026-08-12):** SMTP-Creds liegen nur auf Host (`/etc/nexifyai/*.env`, root-only) — Container-lesbare Quellen (`/home/hermeswebui/.hermes/.env`, `/root/...`) enthalten keine `SMTP_*`-Keys → `_secret()` liefert leer → Versand schlägt fehl. Fix: `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD` in `/home/hermeswebui/.hermes/.env` eintragen (Werte vom Host spiegeln) + Server-Neustart + `python3 chat/flush_contact_queue.py` (Nachversand gesammelter Anfragen). **Kein Datenverlust seit 2026-08-12:** fehlgeschlagene Formulare landen in `chat/data/contact_queue.jsonl` (gitignored, DSGVO: nur Formularfelder). Nie Resend verwenden (send.nexifyai.cloud = NXDOMAIN) |
| DNS-Propagation | DoH: `curl -H "accept: application/dns-json" "https://cloudflare-dns.com/dns-query?name=a-bau.nexifyai.cloud&type=CNAME"` |
| Eskalation | Pascal via Telegram (Owner-Chat) — Interna nur an verifizierten Pascal (§0b) |

## Log-Verwaltung (DSGVO — max. 7 Tage)

Server-Logs (`/tmp/abau-server.log`) enthalten ausschließlich Zugriffszeilen (IP, Pfad, Status, Größe) — **keine** personenbezogenen Daten aus Formularen oder Chat-Nachrichten. Löschung spätestens nach 7 Tagen:

```bash
# Manuell:
truncate -s 0 /tmp/abau-server.log

# Automatisch via Cron (täglich, 7 Tage Aufbewahrung):
find /tmp/ -name "abau-server*.log" -mtime +7 -delete
```

Falls Systemd-Journal: `journalctl --vacuum-time=7d`

Chat-Verläufe werden **nicht** persistiert (kein Chat-Log in der Datenbank); Anfragen gehen direkt zum 9Router und werden dort nach Verarbeitung nicht gespeichert.

## Rollback-Verfahren

1. **Code-Rollback:** `git revert HEAD` im Repo, dann `pnpm build` + Service-Restart.
2. **Vollständiger Rollback:** `git checkout <vorheriger-commit>`, Build, Restart.
3. **DNS-Rollback:** A-Record/CNAME auf alte IP zurücksetzen (TTL beachten, min. 5 min Wartezeit).
4. **KB-Rollback:** `python3 chat/ingest.py` mit vorherigem Content-Stand neu ausführen.
5. **Verifikation:** `curl https://a-bau.nexifyai.cloud/health` → `{"status":"ok","chat":true,"kb":true}`

## Security-Header (Übersicht)

Aktuelle Security-Header (gesetzt in `chat/server.py` HEADERS-Dict):

| Header | Wert |
|--------|------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Robots-Tag` | `noindex, nofollow` (bis Kundenabnahme, Go-Live-Punkt 3) |
| CSP | `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src https://www.openstreetmap.org; connect-src 'self'; base-uri 'self'; form-action 'self'` — `'unsafe-inline'` für script/style erforderlich: Next.js-Export rendert RSC-Payload als Inline-`<script>` und React setzt Inline-`style`-Attribute; ohne diese Keywords blockt der Browser Hydration + Bild-Layout (P0, 2026-08-12). Kein Nutzer-Input in Inline-Scripts (statisch generiert), React escaped Inhalte |
| HSTS | Über Cloudflare-Dashboard (SSL/TLS → Edge Certificates → HSTS) |

Empfehlung vor Go-Live: Security-Header-Test via [securityheaders.com](https://securityheaders.com/).

## Content-Pflege (Kurzreferenz)

| Aufgabe | Datei | Schritt danach |
|---------|-------|---------------|
| NAP ändern (Telefon, E-Mail, Adresse) | `site/src/data/kontakt.yaml` | `npm run build` + Restart |
| Leistungen ändern | `site/src/data/leistungen.yaml` | `npm run build` + `ingest.py` + Restart |
| FAQ ändern (≥150, Chat-Wissen) | `content/faq.yaml` (kanonisch) → nach Änderung `cp content/faq.yaml site/src/data/faq.yaml` | `npm run build` + `ingest.py` + Restart |
| Referenzen ändern | `site/src/data/referenzen.yaml` | `npm run build` + `ingest.py` + Restart |
| Bilder ersetzen | `site/public/assets/` | `npm run build` + Restart |
| Rechtstexte ändern (Impressum, Datenschutz, **AGB, Nutzungsbedingungen**) | `content/*.md` (Rendering liest content/) | `npm run build` + Restart (kein Re-Ingest — Rechtstexte absichtlich aus KB ausgeschlossen) |

**Wichtig:** `kontakt.yaml` ist die **einzige Wahrheitsquelle** für NAP-Daten. Niemals Telefon/E-Mail/Adresse direkt in `.astro`-Dateien oder Template-Strings eintragen.
