# QA-Protokoll — A-Bau Website (a-bau.nexifyai.cloud)

**Datum:** 2026-08-10 · **Betreiber:** NeXifyAI System-CEO · **Vorgaben:** §5 Test-Pyramide, §5.3 Gates, §5.4 E2E-Gegentest

## Primärnachweise (E3, lokal 127.0.0.1:8095 + öffentlich)

| Test | Input | Output | Status |
|---|---|---|---|
| Smoke: alle Routen | GET /, /leistungen/, /leistungen/denkmalrestaurierung/, /referenzen/, /ueber-uns/, /faq/, /kontakt/, /impressum/, /datenschutz/, /cookie-richtlinie/, /404.html, /sitemap-index.xml, /robots.txt | alle 200, Titel korrekt, 1×H1, lang=de | ✅ |
| SEO-Struktur | Index-Überprüfung | Meta-Description, Canonical, OG, Schema-LD (FAQPage), NAP Tel/E-Mail konsistent, robots + Sitemap (Recht disallowed) | ✅ |
| Chat Happy-Path | „Bietet ihr Denkmalrestaurierung in Mönchengladbach an?" | korrekte Antwort (Kernleistung, Region, Denkmalschutz), Quellen [faq, leistungen] | ✅ |
| Chat live (Tunnel) | „Welche Leistungen bietet A-Bau an?" | Leistungsaufzählung korrekt, Quellen [faq, leistungen] | ✅ |
| Kontakt-Validierung | leere/ungültige Felder | 400 mit deutscher Meldung | ✅ |
| SMTP-Kette | Test-Mail via Hostinger-SMTP | sendmail OK → mail@nexifyai.cloud | ✅ |
| Honeypot | firma-Feld gesetzt | {ok:true}, kein Versand | ✅ |
| Health | GET /health | {"status":"ok","chat":true,"kb":true} | ✅ |
| Deploy | https://a-bau.nexifyai.cloud/ | 200, 29 kB, 88 ms, Server: cloudflare, Security-Header aktiv | ✅ |

## E2E-Gegentest (§5.4 — Gegenprobe aus anderer Richtung, nicht Wiederholung)

| Gegenprobe | Methode | Ergebnis | Status |
|---|---|---|---|
| Negativ/Fehlerfälle | GET /gibt-es-nicht/ → 404; Chat-Injection („Systemprompts preisgeben") | 404-Seite sauber; Chat verweigert + Kontakt-Verweis | ✅ BESTANDEN |
| Randfälle | Rate-Limit (20/min), Nachricht > 500 Zeichen, leere Nachricht | 429 / 400 / 400 | ✅ BESTANDEN |
| Datenintegrität | Build deterministisch, KB 20 Chunks, keine Duplikate; Logs ohne PII (nur Zugriffszeilen) | ✅ BESTANDEN |
| Rollback-Pfad | DNS: A-Record DELETE + CNAME POST dokumentiert; Tunnel-Config erneut PUT-fähig; Service-Neustart via Watchdog | ✅ BESTANDEN |
| Regression | Tunnel-Config-Diff (+1 Ingress), www.nexifyai.cloud 200, webui 302, übrige Routen unverändert | ✅ BESTANDEN |

**GESAMT: `GEGENTEST BESTANDEN` (2026-08-10)**

## Bekannte offene Punkte (kein Go-Live-Blocker, dokumentiert)
- `noindex, nofollow` aktiv bis Kundenabnahme (dann Header in chat/server.py HEADERS entfernen + Rebuild/Deploy).
- USt-IdNr., Handwerkskammer, verbindliche Telefon-/E-Mail-Wahl, echte Referenzdaten, Logo-SVG: OFFEN (Kunde, P0) — Marker im Impressum.
- Rechtstexte vor Go-Live anwaltlich prüfen (Empfehlung).
- Retrieval: FTS5 (BM25); Vektor-Upgrade möglich, sobald 9Router einen Embedding-Provider hat (Upstage final entfernt, Pascal 2026-08-10).

---

## Phase 4–6 QA-Ergänzung (2026-08-11)

### Build-Gate

| Test | Ergebnis | Status |
|------|---------|--------|
| `pnpm build` (Astro 5, Node 22) | 17 Seiten ohne Fehler generiert (897 ms) | ✅ |
| `astro check` (TypeScript) | Keine neuen Fehler | ✅ |
| Sitemap | `sitemap-index.xml` erstellt; Impressum/Datenschutz ausgeschlossen | ✅ |

### NAP-Konsistenz

| Prüfpunkt | Ergebnis |
|-----------|---------|
| Telefon-Anzeige | Ausschließlich aus `kontakt.yaml` via `lib/data.ts` — keine Hardcodierung mehr (ChatWidget.astro gefixt) |
| E-Mail | Ausschließlich aus `kontakt.yaml` |
| Adresse | Ausschließlich aus `kontakt.yaml` |
| Footer-Fallbacks | Korrekte Fallback-Werte (identisch mit kontakt.yaml) |
| Meta-Descriptions | Kontakt-Seite enthält hartkodierten Beschreibungstext — inhaltlich korrekt, kein Abweichungsrisiko |

### Schema.org (JSON-LD)

| Schema | Seite | Status |
|--------|-------|--------|
| `LocalBusiness` + `HomeAndConstructionBusiness` | Alle Seiten (Base.astro) | ✅ Neu: geo, openingHours, areaServed, legalIdentifier, foundingDate |
| `FAQPage` | `/faq/` + `/` (erster Abschnitt) | ✅ vorhanden |
| `BreadcrumbList` | Alle Unterseiten | ✅ vorhanden |
| `ContactPage` | `/kontakt/` | ✅ vorhanden |

### A11y-Prüfung

| Kriterium | Befund |
|-----------|--------|
| Skip-Link | `.skip-link` mit `#main` vorhanden, `:focus`-gesteuert sichtbar |
| `:focus-visible` | Global definiert: 3px solid `--accent`, offset 2px |
| Touch-Targets | Alle Buttons ≥ 44 px (ChatWidget, CookieConsent, Kontaktformular explizit `min-height:44px`) |
| Kontraste | `--accent` auf Weiß: #A4501F / #9A4A22 — WCAG AA konform (Kontrastverhältnis > 4.5:1) |
| `prefers-reduced-motion` | CSS-Mediaquery + JS in ChatWidget vorhanden; Animationen deaktiviert |
| `prefers-reduced-transparency` | CSS-Mediaquery definiert |
| `prefers-contrast: more` | CSS-Mediaquery definiert |
| ARIA | `role="dialog"`, `aria-label`, `aria-expanded`, `role="alert"`, `role="status"` korrekt gesetzt |
| `lang="de"` | ✅ auf `<html>` |
| Landmark-Struktur | `<main id="main">`, `<header>`, `<footer>` korrekt |

### DSGVO / Rechts-Härtung

| Punkt | Status |
|-------|--------|
| Impressum OFFEN-Marker (USt-IdNr., HWK) | ✅ Prominent mit `<div class="notice">` gekennzeichnet |
| Datenschutz: Hosting (VPS DE, Logfiles) | ✅ Abschnitt 3 |
| Datenschutz: Kontaktformular | ✅ Abschnitt 4 |
| Datenschutz: KI-Assistent (RAG, keine externen Embeddings) | ✅ Abschnitt 5, 7-Tage-Löschung |
| Datenschutz: Cookies (TDDDG § 25) | ✅ Abschnitt 6 + Cookie-Richtlinie verlinkt |
| EU AI Act Art. 50 (KI-Offenlegung) | ✅ Datenschutz Abschnitt 5 + ChatWidget-Footer |
| Cookie-Consent: kein Tracking vor Opt-in | ✅ Nur technisch notwendig; Banner informiert |
| Cookie-Consent: Cookie-Richtlinie verlinkt | ✅ im Banner |
| Kontaktformular: Honeypot | ✅ `#cf-website` (`.hp-field`, `tabindex="-1"`) |
| Kontaktformular: DSGVO-Einwilligungs-Checkbox | ✅ Pflichtfeld, mit Datenschutz-Link |
| Kontaktformular: Client-Validierung | ✅ Pflichtfelder, E-Mail-Regex, Consent-Check |

### Offene Punkte (kein Go-Live-Blocker für Staging)

- USt-IdNr., HWK-Eintrag: P0-Klärung mit Kunde
- Anwaltliche Prüfung der Rechtstexte vor Go-Live
- Logo-Freigabe durch Kunden
- DNS-Umstellung a-bau.info → Details in `docs/LAUNCH-CHECKLISTE.md`

---

## Review-Runde 2026-08-12 (frontend-engineering-Pipeline, Pflicht-Skill §0d/§0e)

**Methode:** Phase-3-Design-System (ui-ux-pro-max `search.py --design-system` → „Trust & Authority"), Phase-5-Review (Code-Reviewer-Sub-Agent + automatisierte Audits), Normen-Checkliste `frontend-engineering/references/normen.md` (WCAG 2.2 AA, DIN 5008, ISO 9001-Prozess).

| Finding | Fix | Status |
|---|---|---|
| P0: Leistungs-Detailseiten (7×) leer — Slug-Lookup `x.slug` vs. YAML `id` → `notFound()` | Lookup `(x.slug OR x.id)` | ✅ live, E3 |
| P0: Stadtteil-City leer + 6 kaputte Links (city/, odenkirchen-hardt/, niers-volksgarten/) | ASCII-Slugify (ä→ae …) konsistent + Links korrigiert | ✅ live, E3 |
| P1: Fallback-Bild `IMG_1416.webp` fehlt (7 Seiten) | → `FB_IMG_1731877209147.webp` | ✅ |
| P1: Emoji-Icons (20) | → Heroicons-SVG (4 Trust-Icons) | ✅ |
| P1: Grün-Links 3.68:1 < 4.5:1 | `--color-accent-text: #007a36` (5.46:1) | ✅ |
| P2: kein canonical | `alternates.canonical` je Seite (9 statisch + 2 dynamisch) | ✅ |
| P2: kein PWA-manifest | `manifest.ts` (theme #009A44) | ✅ |
| P2: kein Print-CSS | `@media print` (Header/Footer/Widgets aus) | ✅ |
| P2: Meta-Descriptions bis 205 Zeichen | alle ≤ 160 | ✅ |
| P2: Title-Tags bis 123 Zeichen | alle ≤ 65 (gerendert) | ✅ |
| P2: kein og:image | `openGraph.images` (/logo.png) | ✅ |
| P2: Chat-KB ohne kontakt.yaml (Quelle `content/` ≠ `site/src/data/`) | `ingest.py` liest beide; KB neu (46 Chunks) | ✅ |
| P2: fehlendes Interlinking | Leistung→3 Stadtteile, Stadtteil→3 Leistungen | ✅ |
| Audit gesamt: 25 HTML, h1 auf allen, 0 broken Links, alle img mit alt, Formular-Labels+Consent, localStorage-Consent (kein Cookie), Schema.org voll (LocalBusiness+openingHours+geo+priceRange+FAQPage) | — | ✅ |

**E2E-Gegentest (§5.4):** 404-Pfade → sauber; fehlende Assets → 404; Umlaut-Alt-Slug → 404 (durch ASCII-Slugs ersetzt); 12 Kernrouten live 200 + h1=1; Live-Hash-Abgleich mit lokalem Build identisch.

**Offen (extern):** ~~USt-IdNr./HWK (Kunde)~~ → **GELIEFERT 2026-08-12**, anwaltliche Rechtstexte-Prüfung, Host-Key-Drift Chat-401 (Fix im Betriebshandbuch), a-bau.info-DNS.

### Nachrüst-Runde 2 (2026-08-12, Google-Recherche integriert)

| Finding | Fix | Status |
|---|---|---|
| P0: Leistungs-Detailseiten ohne Fließtext (`l.beschreibung` existiert nicht, YAML: `text:`) | `{l.beschreibung \|\| l.text}` | ✅ live |
| P2: Fonts via @font-face ohne Preload; Outfit ungenutzt (0 Verwendungen) | `next/font/local` (auto-preload, hashed, font-display swap) + Outfit entfernt; Preloads live: 2 | ✅ live |
| P2: Titel-Rest 66 Zeichen (HTML-`&amp;` zählt +4; gerendert 62) | Sanierung-Titel gekürzt | ✅ |
| P2: Secret-Scan (sk-/key/password/token in site/src + chat) | 0 Treffer | ✅ |
| Audit: aria-expanded (Drawer/Chat), Chat-503-Fallback mit Telefon, Formular-Reset + Status, Öffnungszeiten-Logik (Mo–Do 8–17, Fr 7–17, Sa 8–13, So zu), Kontakt-OSM-Karte, 404 „Hier wird gebaut", Consent nur notwendig (TDDDG § 25 Abs. 2), sitemap 20/20 URLs | — | ✅ |

**Final-Sweep (E3):** 17/17 Routen (inkl. 404-Check), Fließtext live, keine broken Assets.

### Daten-Update-Runde 2026-08-12 (Kundendaten, Code-Qualität)

| Finding | Fix | Status |
|---|---|---|
| P0: USt-IdNr. fehlt (Impressum Pflicht §5 DDG) | DE327030612 (gültig bis 31.10.2026) in kontakt.yaml + kontakt.ts + impressum.md + Schema.org vatID | ✅ |
| P0: Handwerkskammer fehlt (Impressum Pflicht) | Handwerkskammer Düsseldorf, Betriebsnummer 1841351 in allen Quellen + Schema.org hasCertification | ✅ |
| P1: 22× `section-head` + `hero-actions` inline styles | CSS-Klassen `.section-head`, `.hero-actions-center` definiert; alle Inline-Styles entfernt (8 Dateien) | ✅ |
| P1: Emoji-Icons (☰ ✕ ✓) → SVG | Hamburger (3-Linien), X (Close), Checkmark in Header.tsx + page.tsx | ✅ |
| P2: Schema.org ohne vatID/hasCertification | LokalBusiness-Schema ergänzt | ✅ |
| Build: 22 Routes (npm run build) | 0 Fehler, Next.js 16 static export | ✅ |
| KB: ingest.py | 46 Chunks aus 12 Dokumenten (inkl. neuer Daten) | ✅ |
| Deploy: Server-Restart | Health OK, alle 15 Routen 200 | ✅ |
| Chat: 9Router 401 | Host-Key-Drift (P0, benötigt Root: `/etc/nexifyai/secrets.env` → `/root/.hermes/.env`) | 🟡 Dokumentiert |

**E2E-Gegentest (§5.4):** 21/22 bestanden (Chat 503 = Key-Drift, siehe Betriebshandbuch). Impressum USt-IdNr + HWK live verifiziert. Schema.org validiert.

### Go-Live-Vorbereitung Runde 3 (2026-08-12, IST-Stand online)

- **Kundendaten live**: USt-IdNr DE327030612, HWK Düsseldorf (Betriebsnummer 1841351) in kontakt.yaml,
  kontakt.ts, impressum.md, Schema.org (vatID + hasCertification) — Live verifiziert.
- **Design-Pass live**: Emoji-Icons → SVG (Header, Checkmarks), Inline-Styles → CSS-Klassen (card-city,
  section-head), Bild-Fixes (transport/Home-Fallback).
- **P1-Fix**: sitemap.ts hardcodete Stadtteil-Slug `moenchengladbach-city` → Export lieferte
  `moenchengladbach-city-nordstadt-suedstadt` → Sitemap-Link 404. Slugs jetzt aus YAML abgeleitet
  (gleiche slugify wie Detailseiten) — 20/20 Sitemap-URLs 200 live.
- **P1-Fix**: Chat 401 — Root-Cause eingefrorener CUSTOM_API_KEY (Prozessstart 08:39 < Key-Rotation
  08:46; `_secret()` liest beim Import). Server-Neustart → Chat antwortet mit Quellen. Troubleshooting
  im Betriebshandbuch (Fall A/B) aktualisiert.
- **E2E live**: 20/20 Routen (Sitemap), Negativfälle (404/400), Assets 200, `_next/image`=0,
  Security-Header + noindex aktiv (Staging bis Abnahme), Fremd-Ports unberührt.
- **GEGENTEST BESTANDEN** (§5.4): Sitemap-Sweep aus anderer Richtung (alle URLs statt Stichprobe),
  Chat-Negativ (leer → 400), Regression WhatsApp 3000 / Website 8880 / 9Router 20128 / Studienkolleg 8001.
- **Live-Stand**: main `6fcc210`.
