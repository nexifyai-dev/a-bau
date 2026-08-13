# Launch-Checkliste — A-Bau Website (a-bau.nexifyai.cloud → a-bau.info)

**Projekt:** A-Bau Meisterbetrieb GmbH · **Betreiber:** NeXifyAI · **Stand:** 2026-08-11
**Status:** 🟡 Staging — `noindex, nofollow` aktiv (kein Google-Index bis Kundenabnahme)

---

## 1. Ausstehende Kunden-Daten (P0 — Pflicht vor Go-Live)

| # | Aufgabe | Verantwortlich | Status |
|---|---------|---------------|--------|
| 1.1 | **USt-IdNr.** im Impressum eintragen (§ 5 DDG Pflichtangabe) | Kunde | 🔴 OFFEN |
| 1.2 | **Handwerkskammer** (zuständige HWK) + Meisterbrief-Nachweis im Impressum ergänzen | Kunde | 🔴 OFFEN |
| 1.3 | **Verbindliche Hauptnummer** bestätigen: Festnetz (02166) 9925056 oder Mobil 0162 18 15 229 | Kunde | 🔴 OFFEN |
| 1.4 | E-Mail-Adresse `e.pfeiffer@a-bau.info` bestätigen (Domain a-bau.info aktiv, Hostinger-SMTP) | Kunde | 🟡 Recherchiert (E3) |
| 1.5 | **Logo-Freigabe** durch Kunde (SVG-Logo in Header/Footer, Favicon) | Kunde | 🔴 OFFEN |
| 1.6 | Gründungsjahr der Firma (für Schema.org / Über-uns) bestätigen | Kunde | 🔴 OFFEN |
| 1.7 | Fotos/Referenzdaten prüfen: keine echten Kundendaten/Adressen öffentlich sichtbar? | Kunde + NeXifyAI | 🔴 OFFEN |

---

## 2. Anwaltliche Prüfung der Rechtstexte

| # | Aufgabe | Verantwortlich | Status |
|---|---------|---------------|--------|
| 2.1 | **Impressum** (`/impressum/`) anwaltlich prüfen (§ 5 DDG, § 18 MStV, USt-IdNr. ergänzt) | Anwalt / Kunde | 🔴 OFFEN |
| 2.2 | **Datenschutzerklärung** (`/datenschutz/`) prüfen: DSGVO Art. 12–14, TDDDG § 25, EU AI Act Art. 50 | Anwalt / Kunde | 🔴 OFFEN |
| 2.3 | **AGB** (`/agb/`) prüfen (BGB-Werkvertragsrecht, § 632a, § 634a, Haftungsklauseln) | Anwalt / Kunde | 🔴 OFFEN |
| 2.4 | **Nutzungsbedingungen** (`/nutzungsbedingungen/`) prüfen (Website-Nutzung, KI-Hinweis Art. 50 KI-VO) | Anwalt / Kunde | 🔴 OFFEN |
| 2.5 | **Cookie-Richtlinie** (`/cookie-richtlinie/`) prüfen (nur technisch notwendige Cookies) | Anwalt / Kunde | 🔴 OFFEN |
| 2.6 | Hinweis: KI-Assistent-Offenlegung (Art. 50 EU AI Act) im Chat-Widget + Datenschutz vorhanden | NeXifyAI | ✅ Umgesetzt |
| 2.7 | Hinweis: AVV (Auftragsverarbeitungsvertrag) mit Hosting-Anbieter vorhanden? | Kunde + NeXifyAI | 🔴 OFFEN |

---

## 3. DNS-Umstellung (a-bau.info → neue Site)

Aktuell läuft die Site unter `a-bau.nexifyai.cloud`. Nach Go-Live-Freigabe wird `a-bau.info` auf die neue Site umgestellt.

### 3.1 Vorbereitende Schritte

1. **A-bau.info-Registrar identifizieren** (WHOIS: `whois a-bau.info`) — Domain auf Registrar-Account prüfen.
2. **TTL** des A-Records auf 300 s (5 min) setzen, mindestens 24 h vor Umstellung.
3. **SSL-Zertifikat** für `a-bau.info` (und `www.a-bau.info`) vorbereiten — Cloudflare übernimmt das automatisch bei Proxied-CNAME.

### 3.2 Umstellungsschritte

```bash
# 1. CNAME a-bau.info → Cloudflare-Tunnel
#    Bei Cloudflare DNS (falls a-bau.info dort verwaltet):
#    Record: CNAME a-bau.info → <TUNNEL_UUID>.cfargotunnel.com  proxied=true
#    Record: CNAME www.a-bau.info → a-bau.info  proxied=true

# 2. Tunnel-Konfiguration erweitern (Caddy-Ingress-Regel vor Catch-All):
#    hostname: a-bau.info   → http://127.0.0.1:8095
#    hostname: www.a-bau.info → http://127.0.0.1:8095
#    (Via CF-API: PUT /accounts/{ACCOUNT_ID}/cfd_tunnel/{TUNNEL_UUID}/configurations)

# 3. Verify:
curl -I https://a-bau.info/
# Erwartetes Ergebnis: HTTP/2 200, Server: cloudflare
```

### 3.3 www-Weiterleitung

`www.a-bau.info` → `a-bau.info` (301 Redirect). Falls Cloudflare: Page Rule oder Redirect Rule anlegen.

---

## 4. 301-Redirect-Matrix (Alt-URLs von a-bau.info)

Die alte Website (a-bau.info) hatte folgende bekannte Routen. Diese müssen als 301-Weiterleitungen in `chat/server.py` (FastAPI/Starlette) oder einem vorgeschalteten Reverse Proxy eingetragen werden.

| Alt-URL (a-bau.info) | Neue URL | Priorität |
|----------------------|----------|-----------|
| `/` | `/` | P0 |
| `/kontakt/` oder `/kontakt.html` | `/kontakt/` | P0 |
| `/leistungen/` oder `/leistungen.html` | `/leistungen/` | P0 |
| `/impressum/` oder `/impressum.html` | `/impressum/` | P0 |
| `/datenschutz/` oder `/datenschutz.html` | `/datenschutz/` | P1 |
| Alle übrigen Alt-Pfade | `/` | P2 |

**Implementierung in `chat/server.py`** (Beispiel):
```python
from starlette.responses import RedirectResponse

@app.get("/kontakt.html")
async def redirect_kontakt():
    return RedirectResponse(url="/kontakt/", status_code=301)
```

Alternativ: Caddy-Konfiguration mit `redir` (wenn Server-seitig möglich).

> **Hinweis:** Genaue Alt-URLs vor Go-Live via Google Search Console (a-bau.info Property) oder Crawl-Tool ermitteln.

---

## 5. noindex entfernen (Go-Live-Freigabe)

Derzeit ist `noindex, nofollow` auf **allen** Seiten aktiv (Staging-Schutz).

**Schritt-für-Schritt nach Kundenabnahme:**

1. In `chat/server.py` den Response-Header entfernen:
   ```python
   # Entfernen / auskommentieren:
   # "X-Robots-Tag": "noindex, nofollow"
   ```
2. In `/public/robots.txt` den Disallow-Catch-All entfernen und `Sitemap` eintragen:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://a-bau.info/sitemap-index.xml
   ```
3. In allen `*.astro`-Seiten (Impressum, Datenschutz, Cookie-Richtlinie) das `noindex`-Prop **behalten** — diese Seiten sollen nicht indexiert werden.
4. Rebuild + Deploy: `cd site && pnpm build` → Service-Restart.
5. Google Search Console: `a-bau.info` Property einrichten, Sitemap einreichen, Indexierung manuell anfordern.

---

## 6. Security-Header (Caddy / Cloudflare)

Die folgenden Security-Header werden aktuell serverseitig in `chat/server.py` gesetzt. Vor Go-Live bitte prüfen und ggf. verschärfen:

| Header | Aktueller Wert (empfohlen) | Status |
|--------|---------------------------|--------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | 🟡 Prüfen (Cloudflare-Proxy) |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'` | 🟡 Zu prüfen (Inline-Scripts in Astro) |
| `X-Frame-Options` | `DENY` (bzw. via CSP `frame-ancestors 'none'`) | 🟡 Prüfen |
| `X-Content-Type-Options` | `nosniff` | ✅ Setzen |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ Setzen |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | ✅ Setzen |

> **Hinweis:** Cloudflare überschreibt HSTS auf Proxy-Ebene. Im Cloudflare-Dashboard unter SSL/TLS → Edge Certificates → HSTS aktivieren.

---

## 7. Monitoring & Backup

| Aufgabe | Frequenz | Verantwortlich | Status |
|---------|----------|---------------|--------|
| Health-Check `https://a-bau.info/health` | alle 5 min (Watchdog-Cron aktiv) | NeXifyAI | ✅ |
| Uptime-Monitoring (extern, z. B. UptimeRobot Free) | 5 min | NeXifyAI | 🔴 OFFEN |
| Git-Backup (Repo = Backup der Inhalte) | bei jedem Push | Automatisch | ✅ |
| KB-Backup `chat/data/kb.db` | nach Content-Updates | NeXifyAI | 🟡 Regenerierbar via `ingest.py` |
| Log-Rotation `chat/` (keine PII, max. 7 Tage) | täglich | NeXifyAI | ✅ Umgesetzt |
| Kunden-Abnahme-Report (PDF) | einmalig | NeXifyAI | 🔴 OFFEN |

---

## 8. Checkliste Abnahme-Gespräch (mit Kunden)

- [ ] Demo der Website auf Staging-URL
- [ ] Impressum: OFFEN-Marker gemeinsam ausfüllen (USt-IdNr., HWK)
- [ ] Kontaktdaten bestätigen (Telefon-Hauptnummer, E-Mail)
- [ ] Logo-SVG freigeben oder Korrektur beauftragen
- [ ] Fotos / Referenzprojekte: Datenschutz-Check (keine personenbezogenen Daten auf Fotos)
- [ ] Anwaltliche Prüfung der Rechtstexte beauftragen
- [ ] DNS-Zugang (Registrar a-bau.info) klären
- [ ] Go-Live-Termin festlegen

---

*Erstellt: 2026-08-11 · Betreiber: NeXifyAI*
