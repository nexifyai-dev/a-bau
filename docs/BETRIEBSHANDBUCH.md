# Betriebshandbuch — A-Bau Website & Chatbot (a-bau.nexifyai.cloud)

**Kunde:** A-Bau Meisterbetrieb GmbH · **Betreiber:** NeXifyAI (VPS 72.62.152.47, Container hermes-webui) · **Stand:** 2026-08-10

## Architektur (1 Dienst, 1 Port)
```
Browser → a-bau.nexifyai.cloud (Cloudflare, proxied)
  → Cloudflare-Tunnel f0f2b101-ed26-4130-8b04-16c43badf70a (Host)
  → Ingress: a-bau.nexifyai.cloud → http://127.0.0.1:8095
  → chat/server.py (FastAPI, Container-Host-Netz):
       statische Site (site/dist, Astro-Build) + /api/chat + /api/contact + /health
  → 9Router 127.0.0.1:20128 (LLM ds/deepseek-v4-flash, Think-Max)
  → SQLite chat/data/kb.db (FTS5-Retrieval, lokal, tenant-isoliert)
  → Hostinger-SMTP 465 (Formular-Versand an kontakt@a-bau.info)
```

## Betrieb
- **Start/Stop:** `cd /workspace/nexifyai/clients/abau && PORT=8095 python3 chat/server.py` (Log `/tmp/abau-server.log`). Stop: Prozess `chat/server.py` beenden.
- **Watchdog:** Hermes-Cron `abau-server-watchdog` (alle 5 min, no-agent): Skript `/root/.hermes/scripts/abau-healthcheck.sh` — startet Service bei Ausfall automatisch, meldet nur bei Aktion.
- **Health:** `curl http://127.0.0.1:8095/health` bzw. `https://a-bau.nexifyai.cloud/health` → `{"status":"ok","chat":true,"kb":true}`.
- **Backup:** Repo (git) = Backup der Inhalte; `site/dist` ist Build-Artefakt (reproduzierbar); `chat/data/kb.db` aus `chat/ingest.py` regenerierbar.

## Content-Änderungen
1. Inhalte editieren: `data/kontakt.yaml` (NAP — EINE Quelle!), `content/*.yaml` + `*.md` (Leistungen/Referenzen/FAQ/Recht).
2. Site bauen: `cd site && pnpm build` (Node 22, pnpm 11).
3. Chat-Wissen aktualisieren: `python3 chat/ingest.py` (Rechtstexte automatisch ausgeschlossen).
4. Service neu starten (siehe Betrieb).
5. Verifikation: Routen-200 + ein Chat-Test + `https://a-bau.nexifyai.cloud/health`.

## Wartung Chatbot
- Wissensquelle = `content/` (gleiche Dateien wie Site). Nach jedem Content-Update Re-Ingest Pflicht.
- Modell: `ds/deepseek-v4-flash` via 9Router (Think-Max); System-Prompt in `chat/server.py` (RAG-only, keine Preise, Quellen, Kontakt-Fallback, Injection-Schutz).
- Logs: nur Zugriffszeilen, keine PII; Rate-Limit 20/min/IP.
- Bei 9Router-Ausfall: /api/chat → 503, Widget zeigt Fallback (Kontakt/Telefon).

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
| /health nicht ok | Prozess tot → Watchdog startet; manuell: Skript `/root/.hermes/scripts/abau-healthcheck.sh` |
| Chat 503 | 9Router down (curl 127.0.0.1:20128/v1/models) oder KB fehlt → `python3 chat/ingest.py` |
| Formular 502 | Hostinger-SMTP-Creds in hermes.env (SMTP_*) prüfen; nie Resend verwenden (send.nexifyai.cloud = NXDOMAIN) |
| DNS-Propagation | DoH: `curl -H "accept: application/dns-json" "https://cloudflare-dns.com/dns-query?name=a-bau.nexifyai.cloud&type=CNAME"` |
| Eskalation | Pascal via Telegram (Owner-Chat) — Interna nur an verifizierten Pascal (§0b) |
