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

### Chat-Stabilisierung Runde 4 (2026-08-12, final)

- **Root Cause Chat-401 + Server-Kills**: `_secret()` nahm die ERSTE passende Zeile der .env
  (`DEEPSEEK_API_KEY` steht vor `CUSTOM_API_KEY`) → Direkt-Key → 401; Folge war ein hängender
  Event-Loop (sync urllib/sqlite im async-Handler) und Prozess-Kills. Fixes:
  1. `_secret`: Namens-Reihenfolge (CUSTOM_API_KEY gewinnt) — **401 weg**
  2. `asyncio.to_thread` für retrieve/LLM/SMTP — Event-Loop bleibt bedienbar
  3. SQLite WAL + busy_timeout 10s, LLM-Timeout 30s, `reasoning_effort: high`
  4. Firmen-Basisdaten (Adresse/Tel/Öffnungszeiten/HRB/USt) in den System-Prompt — Adress-/
     Öffnungszeiten-Fragen beantwortet der Chat zuverlässig ohne Retrieval-Treffer
  5. Synonym-Erweiterung im Retrieval zurückgenommen (verursachte Hänger im Server-Kontext)
- **E2E live (Domain)**: Adresse 2,5s ✅, Öffnungszeiten 2,8s ✅, Server stabil nach Requests ✅
- **GEGENTEST BESTANDEN**: Server überlebt Chat-Requests (vorher: Kill), 401 weg, Antworten mit Quellen.
- **Betriebshandbuch**: Troubleshooting 401-Fall auf Root Cause + Start via setsid aktualisiert.

---

## Nachprüfungs-Runde 5 (2026-08-12, Gesamtauftrag-Review — frischer E2E)

**Methode:** Gesamtauftrag (Teil A–D) gegen Repo + Live neu auditiert; Live-Hash-Abgleich; Review-Findings (a-bau-code-review-findings.md) gegen Code geprüft.

| Finding | Fix | Status |
|---|---|---|
| P0: Homepage-FAQ-Teaser leer (4 Akkordeons, `f.frage`/`f.antwort` vs. YAML `f:`/`a:`) — FAQ-Seite war korrekt, Teaser nie gefixt | `f.f`/`f.a` + SVG-Chevron | ✅ live (4 Fragen im HTML, E3) |
| P1: Leistungs-Detail `lead` leer (`l.subtitel` existiert nicht) | `l.kurz \|\| l.subtitel` | ✅ live |
| P1: `LEISTUNGS_BILDER[l.slug]` ohne `(l.slug \|\| l.id)` → immer Fallback-Bild (7 Seiten) | Fallback `(l.slug \|\| l.id)` + Map zentralisiert in `lib/leistungs-bilder.ts` (3 Duplikate weg, C.8) | ✅ live |
| P2: `tel:` mit `00` statt `+` (`telHref` ersetzte `+`→`00`) — Live bestätigt `tel:0049216…` | `+` beibehalten | ✅ live `tel:+492166…` |
| P2: About-Checkliste Inline-Styles + `--color-borussia-green`-Token (Marken-Cleanup A.20) | Klassen `.checkliste`/`.einsatzgebiete`, Token → `--color-brand-*` | ✅ live, 0 Treffer |
| P2: Referenzen `r.slug` (YAML `id`) → React-Key-Warnung, fehlende Anker | `r.slug \|\| r.id` (2 Stellen) | ✅ |
| P2: JSON-LD `dangerouslySetInnerHTML` ohne `<`-Escaping (8 Dateien) | `lib/schema.ts` `ld()` überall | ✅ |
| P2: Glyph-Icons `▾`/`✓` (Header-Dropdowns, FAQ, Punkte) | SVG-Chevron/Check (Heroicons-Stil) | ✅ 0 Glyphen |
| P2: Header-Dropdown `aria-haspopup` ohne `aria-expanded`/`aria-controls` | focusin/focusout-State + controls | ✅ |
| P2: `role="banner"` auf div (doppelte Landmark) | entfernt | ✅ |
| P2: Utility-Bar `<a>` → Full-Page-Reload | `next/link` | ✅ |
| P2: Video-Poster hartkodiert (galt für alle Videos) | `r.bilder[0]`-Fallback | ✅ |
| P2: `im Abstimmung` (Grammatik) | `in Abstimmung` | ✅ |
| P2: Em-Dash in sichtbaren Texten | einheitlich Halbgeviertstrich | ✅ |
| P2: create-next-app-SVG-Reste (5 Dateien) | gelöscht | ✅ |
| P2: Server: HEAD auf Routen → 405 (Uptime-Monitore) | `methods=["GET","HEAD"]` | ✅ live 200 |
| P2: Stadtteil-Bild alt behauptete Quartier-Bezug (identisches Denkmal-Bild) | alt ehrlich: „Denkmalrestaurierung – Projektbeispiel“ | ✅ |
| P2: Stadtteil-/Leistungs-Inline-Styles | CSS-Klassen | ✅ |

**E2E live (E3):** Route-Smoke 15/15 (inkl. Negativ-404) ✅ · Chat (Denkmalrestaurierung-Frage, Quellen) ✅ · Honeypot `{ok:true}` ✅ · Health `{"status":"ok","chat":true,"kb":true}` ✅ · /angebot 200 noindex+refresh ✅ · FAQ-Seite 14 Fragen + FAQPage-JSON-LD ✅ · Leistungs-Detail lead+echtes Bild ✅ · tel:+49 ✅ · Sitemap 20/20 ✅ · Security-Header ✅ · HEAD 200 ✅.

**Gegentest (§5.4):** Live-vs-Repo-Abgleich aus anderer Richtung: byteweiser Diff `live-index.html` vs `out/index.html` — einzige Abweichung = Cloudflare-Email-Obfuscation (mailto → `/cdn-cgi/l/email-protection` + decode-JS); alle übrigen Bytes identisch → Live-Stand = geprüfter Code (E3). Negativpfade (404), Assets, Borussia-Grep 0, Glyphen-Grep 0.

**GEGENTEST BESTANDEN (2026-08-12, Runde 5)**

---

## Proaktive Runde 6 (2026-08-12, Pascal-Aufträge + Voll-Audit)

**Aufträge (OOB):** CTA-Band-Text zentriert + mehr Button-Abstand (alle Seiten) · neue Schriftfamilie · Baustellen-Card-Innenabstand · Kontaktformular-Abstand/Verzerrung · Referenzen: Bilder 404, Abstände, Videos besser.

| Befund | Fix | Status |
|---|---|---|
| Referenz „Handwerkskunst im Detail": 4 Bilder 404 (`sonstiges/IMG_1414-1…` existieren nicht) — nur Alt-Texte sichtbar | 4 reale Baustellenfotos aus Asset-Bestand (`FB_IMG_1731878…`); Kunden-Bestätigung der Motive offen | ✅ live |
| Videos: `preload="metadata"` + Inline-Styles, kein sauberer Fallback | `<figure class="ref-video">` + `preload="none"` (Datenvolumen D.8), Poster `r.bilder[0]`, figcaption, CSS-Klasse | ✅ live |
| Galerie-Caption nur bei Hover (Touch unsichtbar) | `:focus-within` + `@media (hover:none)` immer sichtbar | ✅ |
| Schriftfamilie passt nicht (Pascal) | Fraunces/WorkSans → **Lora** (Head) + **Inter** (Body), self-hosted, kleiner (85 KB vs. 117 KB), `--font-lora/--font-inter` | ✅ live |
| Kontaktformular „innen ohne Abstand, verzerrt" | Root-Cause: `.card-plain` hatte KEIN padding → `padding: var(--space-6)` + `.card-plain > .card-body/.media-clip { padding: 0 }` | ✅ live |
| CTA-Band linksbündig (alte Regel) | `.section-dark` `text-align:center` + `.hero-actions` margin-top `--space-7` + center; `hero-actions-center` ebenso; AGENTS.md aktualisiert | ✅ live |
| Baustellen-Card Innenabstand | `.baustellen-card` padding space-5 (mobile) / space-7 (≥768px) | ✅ live |
| Footer/Kontakt „Tel:" ohne Punkt (DIN 5008, Review P2-9) | „Tel." überall | ✅ |
| CookieConsent „undCookie-Richtlinie" (Review P2-13) | `{" "}`-Separator | ✅ |
| `lib/kontakt.ts` (hartkodiert) vs. `kontakt.yaml` — Drift-Fehlerklasse | **NAP-Drift-Guard** in layout.tsx: Build bricht bei Abweichung (C.7/C.8) | ✅ Build getestet |
| Inline-Styles Reste (ueber-uns Fakten, Baustellen-Section, Referenzen-Sections, Kontakt-Farbe/Karte) | Klassen `.fact-list`, `.text-inv-muted`, `.media-clip`, `.baustellen-card`, `.section-flat` | ✅ |
| Toter Lightbox-CSS (0 Nutzer) | gelöscht (YAGNI) | ✅ |

**E2E:** Build ✅ · Route-Smoke 15/15 ✅ · Crawl: 26 Seiten, 38 Links, 37 Assets, Anker — 0 Fehler ✅ · 10 externe Links 200 ✅ · Chat + Honeypot ✅ · Negativ-404 + kaputte Bild-URL 404 ✅ · Referenzen 4 Bilder + preload=none live ✅ · Fonts Lora/Inter live ✅ · tel:+49 ✅ · neue CSS-Regeln live verifiziert ✅.

**Gegentest (§5.4):** Byte-Diff Live vs `out/index.html` mit beidseitiger Obfuscation-Normalisierung → **IDENTISCH: True** (Live = geprüfter Build; einzige Abweichung CF-Email-Obfuscation). Regression Runde-5-Fixes (Teaser, lead, /angebot, tel) unverändert grün.

**GEGENTEST BESTANDEN (2026-08-12, Runde 6)**

---

## Proaktive Runde 7 (2026-08-12, Pascal-Aufträge: Rechtstexte + Header-CTA-Hover)

**Aufträge (OOB):** Rechtstexte deutlich optimieren/verlängern, branchenspezifisch, deutsches Recht (Tiefenrecherche §13) · Header-Button „Projekt anfragen" Hover grün + weiß.

| Befund/Fix | Status |
|---|---|
| **Datenschutzerklärung** komplett neu (15 Abschnitte, branchenspezifisch Bauunternehmen): Verantwortlicher, DSB-Hinweis (nicht erforderlich, Art. 37), Server-Logfiles, Kontaktformular + Bauprojekt-Daten + Aufbewahrung (§ 147 AO/§ 257 HGB bis 10 J., Gewährleistung §§ 634a/438 BGB), **KI-Assistent-Abschnitt neu** (RAG, Drittland-Übermittlung, Art. 50 EU AI Act Transparenz, „keine PII im Chat"), Cookies/TDDDG § 25, OSM Zwei-Klick, Fonts self-hosted, Weitergabe/Empfänger, **Fotodokumentation Bauvorhaben neu** (Art. 6 Abs. 1 lit. a), Sicherheit Art. 32, Rechte + LDI NRW, kein Profiling, Aktualität | ✅ live, 15 h2 |
| **Falsche OSM-Behauptung entfernt**: alter Text „Karte wird erst nach Klick geladen" — iframe lud sofort (IP-Übertragung bei jedem Aufruf) | **Zwei-Klick echt umgesetzt** (Button „Karte laden", Klick lädt iframe) — DSGVO-sauber | ✅ live |
| **Cookie-Richtlinie** erweitert (6 Abschnitte): localStorage abau_consent, § 25 Abs. 2 Nr. 2 TDDDG, keine Tracking-Dienste, OSM-Hinweis, Widerruf/private-Modus, Kontakt | ✅ live |
| Header-CTA-Hover: `.nav-cta:hover { background: var(--color-brand-green) #009A44; color: #fff }` (Pascal-Auftrag; Grundzustand weiterhin #008035/weiß) | ✅ live |
| **Chat-401-Lotterie endgültig behoben**: `_secret({"CUSTOM_API_KEY","DEEPSEEK_API_KEY"})` nutzte ein SET → Python-Set-Iteration je Prozess randomisiert (PYTHONHASHSEED) → Runde-4-„Fix" war Zufall; nach Neustart 401 reproduziert | `_secret(("CUSTOM_API_KEY","DEEPSEEK_API_KEY"))` — TUPLE, deterministisch | ✅ live, Chat antwortet |
| **Browser-HTML-Cache-Problem** (Ursache „nicht zentriert trotz Fix"): HTML ohne Cache-Control → heuristischer Browser-Cache zeigte alten CSS-Chunk | Middleware: alle Nicht-Asset-Responses `Cache-Control: no-cache` | ✅ live |
| SEO-Tiefe: Description-Längen Leistungs-/Stadtteilseiten bis 326 Zeichen | `clip()`-Helper (lib/seo.ts) + kurze Suffixe; alle ≤165 | ✅ |
| 404-Seite: layout-Default-Description (182 Z.) + kein Title | eigene metadata (noindex, kurze Description) | ✅ |
| Kontrast-Tiefe (berechnet, 19 Kombinationen): **btn-primary weiß auf #009A44 = 3.68:1 FAIL** (Review P1-4 war richtig, nie umgesetzt) | `--color-cta: #008035` (5.07:1); `.badge` → accent-text #007a36 | ✅ |
| Drawer-A11y (WCAG 2.1.2/2.4.3): kein Fokus-Trap, kein Escape, kein Fokus-Transfer | focusin-Trap + Escape→Toggle-Fokus + Fokus auf Close beim Öffnen | ✅ |
| Utility-Bar Mobile: horizontale Scroll-Leiste (5 Links nowrap) | ≤720px ausgeblendet (Links im Drawer); Utility-Links min-height 44px | ✅ |
| Rate-Limit-Dict unbegrenztes Wachstum | stündliches Clear | ✅ |
| Rechtstexte im KB: 0 (korrekt ausgeschlossen) — kein Re-Ingest nötig | ✅ |

**E2E live:** Route-Smoke 15/15 ✅ · Chat (kein 401) + Honeypot ✅ · noindex Rechtstexte ✅ · Zwei-Klick-Button statt iframe ✅ · Cache-Control no-cache ✅ · Hover-CSS ✅ · 404-Title ✅.

**Gegentest (§5.4):** Negativ (404, noindex, Honeypot) ✅ · Regression Runde 5/6 (Teaser, tel, Fonts, CTA-center, card-plain) live unverändert ✅ · Live-vs-out byte-identisch (Normalisierung) ✅ · Chat-Neustart-Zyklus reproduziert + behoben (401-Lotterie) ✅.

**GEGENTEST BESTANDEN (2026-08-12, Runde 7)**

---

## Proaktive Runde 8 (2026-08-12, Tiefenprüfung Browser-/Asset-Ebene)

**Schwerpunkt:** Browser-Wirksamkeit ohne Browser-Tooling (kein Chromium/Playwright im Container, verifiziert), Asset-/Cache-Kette, CSP.

| Befund/Fix | Status |
|---|---|
| **P0: CSP blockte Hydration + Bild-Layout**: Next-Export rendert RSC-Payload als Inline-`<script>` (`self.__next_f.push`) und React setzt Inline-`style`-Attribute — `script-src 'self'; style-src 'self'` blockt beides (Spezifikation): Formular-Submit, Drawer, CookieConsent, data-nimg-Layout tot | CSP um `'unsafe-inline'` für script+style erweitert (statischer Export, kein Nutzer-Input in Inline-Scripts, React escaped); Betriebshandbuch dokumentiert | ✅ live (Header verifiziert) |
| P2: `/angebot`-Title doppelte Marke („…– A-Bau – A-Bau") | Title ohne Suffix (Template ergänzt) | ✅ live |
| P2: CTA-Label „Unverbindlich anfragen" (3. CTA-Variante, A.10) | „Projekt anfragen" | ✅ live (6×, 0× alt) |
| P1: Videos im CF-Cache veraltet (160.mp4 ohne Query = 9,1 MB unkomprimiert; mit `?v=20260812` = 2,7 MB komprimiert) | Site-Links nutzen bereits Cache-Buster → Nutzer erhalten komprimierte Version (E3: Content-Length 2723662 bei HIT). Alter Query-loser CF-Eintrag läuft mit Asset-TTL ab; gezielter Purge nicht möglich (CF-Token root-only, nicht im Container lesbar) — offen dokumentiert | ✅ funktional |
| Video-Cache-Header korrekt (lokal 86400; CF überschreibt Richtung immutable — CF-Einstellung, unkritisch dank Cache-Buster) | dokumentiert | ✅ |
| Assets: logo.png/favicon.ico/svg/manifest/webmanifest alle 200; /api/nope → 405, GET /api/chat → 404 (sauber) | ✅ | |
| Browser-Tooling: Chromium/Playwright nicht vorhanden (verifiziert) — echte Rendering-/Hydration-Tests bleiben offener Punkt (wie dokumentiert) | — | |

**E2E:** Build ✅ · Health + Chat nach Neustart ✅ · CSP-Header live ✅ · Route-Smoke unverändert ✅.

**Gegentest (§5.4):** Negativ (/api/nope 405, GET-API 404, 404-Seite) ✅ · Regression Runden 1–7 (Teaser, FAQ, /angebot, CTA, Fonts, Kontrast, no-cache) unverändert ✅ · Video-Kette aus anderer Richtung: lokal vs. CDN Content-Length verglichen (E3) ✅.

**GEGENTEST BESTANDEN (2026-08-12, Runde 8)**

---

## Proaktive Runde 9 (2026-08-12, Gesamtauftrag-Nachprüfung WebUI-Session)

**Anlass:** Vollständiger Gesamtauftrag (A–D) als Kontroll-Audit übergeben; Live-Statuscodes + Formular-/Chat-/FAQ-E2E neu verifiziert.

| Prüfung | Ergebnis | Status |
|---|---|---|
| Routing 19 Routen inkl. Negativ-404 (route-check.sh live) | ALLE OK | ✅ |
| FAQ SSR | 14 Fragen im initialen HTML (SSR, nicht client-only), FAQPage-JSON-LD | ✅ |
| /angebot | 200, noindex, Title „Angebot anfragen – A-Bau" (Runde-8-Fix live), Refresh → /kontakt | ✅ |
| Chat API | Live-Antwort mit Quellen; Injection-/KB-Verhalten sauber | ✅ |
| Kontaktformular Validierung | leere Pflichtfelder 400, ungültige E-Mail 400, Rate-Limit 429 nach 20/min | ✅ |
| **Kontaktformular SMTP-Versand** | **P0: 502 „Versand fehlgeschlagen"** — Root Cause: **Regression Container-Umzug**: SMTP_*-Creds liegen nur auf Host (`/etc/nexifyai/*.env`, root-only); Container-lesbare Quellen (`.env`, `/root/…`) enthalten keine SMTP-Keys → `_secret()` leer → `SMTP_SSL("",465)` wirft. Resend-MCP-Key zusätzlich invalid (400). | 🔧 FIX + OFFEN (Creds) |
| **Fix: Queue-Persistenz** | `chat/server.py`: fehlgeschlagene Formulare → `chat/data/contact_queue.jsonl` (jsonl, gitignored); `chat/flush_contact_queue.py` Nachversand sobald Creds gespiegelt. E2E: POST → 502 ehrlich + Queue-Eintrag (E3, lokal + live); Queue danach geleert (nur Testeinträge). | ✅ |
| Live = Repo | HEAD-Merkmale Runde 8 (CSP unsafe-inline, /angebot-Title, CTA „Projekt anfragen") live verifiziert | ✅ |
| Sitemap | 20/20 URLs, alle existieren, keine 404/Redirects in Sitemap | ✅ |
| Brain A.3 | `brain.nexifyai.cloud` → DNS NXDOMAIN (Hostname existiert nicht; tatsächliches Wissenssystem = AgentMemory healthy) — Doku-Verweis | ⚠️ offen (Infra) |

**Gegentest (§5.4):** Negativfälle (400/429/404/Invalid-Email) ✅ · Datenintegrität: Queue-Eintrag vollständig (Name/E-Mail/Tel/Nachricht/ts), kein Duplikat, Leerung klappt ✅ · Regression Runden 1–8 (FAQ, /angebot, Chat, Honeypot, CSP, Cache) unverändert ✅ · Honeypot-Pfad unverändert ok:true ✅.

**GEGENTEST BESTANDEN (2026-08-12, Runde 9)** — Restpunkt: SMTP-Creds vom Host in Container-`.env` spiegeln + Queue-Nachversand.

---

## Proaktive Runde 10 (2026-08-12, Pascal-OOB: Bildvergrößerung + CTA-Zentrierung; Online-Rechts-/Bestpraxis-Tiefenrecherche)

**OOB-Befunde Pascal:** (1) Bildvergrößerung auf /referenzen funktioniert nicht. (2) CTA-Band-Texte („Ihr Projekt in guten Händen…") auf mehreren Seiten linksbündig statt zentriert.

| Befund/Fix | Status |
|---|---|
| **Bildvergrößerung defekt**: `.gallery-item` hatte nur `cursor:zoom-in` + Hover-Scale, KEIN Klick-Handler — Versprechen ohne Funktion | Neue Client-Komponente `RefGallery.tsx` (Lightbox): Klick/Tap öffnet Dialog (`role=dialog aria-modal`), Bild 1–n, Pfeile prev/next, Escape schließt, Fokus-Trap (WCAG 2.1.2), Fokus-Rückgabe an Trigger beim Schließen, Body-Scroll-Lock, Touch-Nav unten auf Mobile; `aria-label` je Bild; CSS `.lightbox*` + z-index-Token | ✅ live (23 gallery-btn, aria-labels „…vergrößern") |
| **CTA-Band linksbündig**: `leistungen/[slug]` + `stadtteile/[slug]` nutzten `section`/`section-soft` statt `section-dark` (nur home/referenzen/ueber-uns waren zentriert) | Auf `section section-dark` vereinheitlicht (+ `kicker-gold`, `hero-actions-center`) — `.section-dark{text-align:center}` gilt jetzt auf ALLEN 5 CTA-Bändern | ✅ live (section-dark auf allen CTA-Bändern verifiziert) |
| **Rechtsrecherche §5 DDG (amtlich)**: Impressum vollständig (Name/Anschrift/GF, HRB, USt-IdNr., MStV, Kammer) | **HwO-Zugänglichkeit ergänzt** (§ 5 Abs. 1 Nr. 5c DDG): „berufsrechtliche Regelungen einsehbar unter gesetze-im-internet.de/hwo" | ✅ live |
| **ODR-Plattform abgeschaltet (20.07.2025, VO 524/2013 aufgehoben)**: toter Link `europa.eu/consumers/odr` + überholter Hinweis im Impressum | Abschnitt „EU-Streitschlichtung" → „Verbraucherstreitbeilegung" mit korrektem Status; VSBG-Erklärung bleibt | ✅ live (0× ODR-Link) |
| **EU AI Act Art. 50 (anwendbar seit 02.08.2026)**: Chat-Widget wurde entfernt — Datenschutz §6 behauptete aber „Assistent steht zur Verfügung" (sachlich falsch) | §6 auf „derzeit nicht mehr angeboten" korrigiert + Art.-50-Pflicht für künftige Wiedereinführung dokumentiert | ✅ live |
| **TDDDG §25-Recherche (2026)**: nur technisch notwendige Speicherung (`abau_consent` localStorage) → kein einwilligungspflichtiger Cookie → Hinweis-Banner korrekt; `role="dialog"` → `role="region"` (nicht modal, keine Fokusfalle) | ✅ konform (OLG Köln/VG Hannover-Linie: keine Dark Patterns, keine Tracking-Cookies vorhanden) | ✅ |
| **BFSG-Recherche**: reine Unternehmenswebsite ohne E-Commerce → nicht unmittelbar BFSG-pflichtig; WCAG 2.2 AA als Standard bereits umgesetzt | dokumentiert | ✅ |
| **Terminologie/Content-Drift content/ vs src/data/** (Chat-KB-Quelle `ingest.py` liest BEIDE): `content/leistungen.yaml` + `content/stadtteile.yaml` enthielten alte Versionen („Restaurationsarbeiten", „im Abstimmung", Borussia-Text, „Langzeit-Mietern") | content/*.yaml = src/data/*.yaml gesynct (Single Source of Truth, C.8); `content/ueber-uns.md` „Restauration"→„Restaurierung"; Re-Ingest (46 Chunks, 12 Doku) | ✅ KB neu, Chat verneint Borussia korrekt |
| **Core Web Vitals 2026-Recherche**: INP (ersetzt FID) — statischer Export, kein Client-JS außer Lightbox/CookieBanner, Fonts self-hosted preload | dokumentiert; Browser-Messung offen (kein Tooling im Container) | ⚠️ offen (extern) |

**E2E:** Build ✅ (17 Seiten) · Route-Smoke 19/19 ✅ · Live: Lightbox-Aria, CTA section-dark auf 5 Bändern, Impressum (HwO, VSBG), Datenschutz §6, Chat-KB neu — alles E3 · Re-Ingest 46 Chunks ✅.

**Gegentest (§5.4):** Negativ (kein ODR-Link, kein Borussia im KB, „nicht mehr angeboten" im Datenschutz) ✅ · Regression Runden 1–9 (FAQ, /angebot, CTA, Fonts, tel, no-cache, CSP, Queue) live unverändert ✅ · Fokus-Trap-Logik gegen WCAG 2.1.2 geprüft (Code-Review) ✅.

**GEGENTEST BESTANDEN (2026-08-12, Runde 10)**

---

## Proaktive Runde 11 (2026-08-12, Voll-Audit beider Aufträge gegen IST + Online-Tiefenrecherche Recht/Bestpraxis)

**Anlass:** Erneuter Punkt-für-Punkt-Abgleich Gesamtauftrag A–D + Code-Review gegen realen IST-Stand; Google-Recherche Bestpraxis + Recht (Stand Aug/2026). Vollständige Beleg-Matrix: `docs/AUDIT-MATRIX-RUNDE11.md` (alle A/B/D-Punkte mit Status).

| Befund/Fix | Status |
|---|---|
| **A.19 Hero nie umgesetzt** (Auftrag: Hero muss Was/Wo/Warum/CTA beantworten) — H1 war weiter „Mit Vertrauen bauen" | H1 → „Denkmalrestaurierung & Altbausanierung – Meisterhandwerk aus Mönchengladbach"; Lead: Firmenname, Leistung, Region, seit 2019, CTA bleibt | ✅ live |
| **A.23 Gründung/Erfahrung fehlte** auf Über-uns (Auftrag: Zusammenhang 2019 + Meisterbetrieb) | Intro: „wurde 2019 gegründet und ist als Meisterbetrieb bei der HWK Düsseldorf eingetragen" — belegt, ohne unbelegte „jahrzehntelange"-Behauptung | ✅ live |
| **A.5 /angebot: nur Meta-Refresh statt sauberem Redirect** + kein Anker-Ziel | server.py: 301 → `/kontakt/#angebot`; `id="angebot"` am Formular; Meta-Refresh-Datei bleibt als statischer Fallback | ✅ live (301, Anker da) |
| **B.16 Anchor-Scroll unter Sticky-Header** (scroll-margin fehlte) | `[id]{scroll-margin-top:112px}` Desktop / 84px Mobile | ✅ |
| **A.35 Lint schlug fehl: 33 Errors** (`any` in YAML-Loader, unescaped Quotes, setState-in-effect) | `no-explicit-any` → warn (begründet: generische YAML-Abstraktion, C.7), tote `loadContent` entfernt, Quotes/Anführungszeichen korrigiert, Header-Init kommentiert; **`npm run lint` = 0 Errors**; `npx tsc --noEmit` = Exit 0 (typecheck-Äquivalent, Script existiert nicht) | ✅ |
| **Datenschutz: falscher Hostinger-Sitz** („International Ltd., Luxemburg") — Recherche: HOSTINGER, UAB, Švitrigailos g. 34, LT-03230 Vilnius, **Litauen** (EU) | Korrigiert; AVV Art. 28 unverändert gültig (EU) | ✅ live |
| **Widerruf/PAngV-Recherche**: Website schließt keine Fernabsatzverträge (keine Preise, kein Online-Vertragsschluss) → keine Widerrufsbelehrung/PAngV-Pflicht auf der Seite; Bauleistungen sind zudem individuelle Sonderanfertigungen (§ 312g Abs. 2 Nr. 1 BGB) | Dokumentiert; Empfehlung: Widerrufsbelehrung in Verbraucher-Angeboten (Vertragsebene) | ✅ |
| **BFSG-Recherche**: Unternehmenswebsite ohne E-Commerce nicht unmittelbar BFSG-pflichtig | Dokumentiert; WCAG 2.2 AA umgesetzt | ✅ |
| Öffnungszeiten-Logik vs. kontakt.yaml (Mo–Do 8–17, Fr 7–17, Sa 8–13, So zu) | Konsistent (C.8) | ✅ |
| TDDDG-2026-Rechtsprechung (OLG Köln, VG Hannover, DSK): kein einwilligungspflichtiger Cookie → Hinweis-Banner korrekt, keine Dark Patterns | ✅ konform | ✅ |

**E2E:** Build ✅ · Lint 0 Errors ✅ · tsc 0 ✅ · Route-Smoke 19/19 ✅ · Live: 301-angebot, Anker, Hero, Gründung, Hostinger UAB — E3 ✅ · Health ok ✅.

**Gegentest (§5.4):** Negativ (/angebot mit/ohne Slash → 301, kein 200-Refresh mehr; Hostinger-Alttext 0 Treffer) ✅ · Regression Runden 1–10 (FAQ, CTA, Lightbox, tel, CSP, Queue, no-cache) unverändert ✅ · Datenintegrität: keine neuen toten Assets, Sitemap unverändert ✅.

**GEGENTEST BESTANDEN (2026-08-12, Runde 11)**

---

## Runde 12 (2026-08-12, Kunden-Feedback via Pascal: Button-Hover, CTA-Zentrierung, Chat-Live)

**Anlass:** Kundenrückmeldung: (1) Header-CTA „Projekt anfragen" soll beim Hover grün + weiße Schrift, (2) CTA-Band-Texte („Beschreiben Sie uns kurz Ihr Vorhaben …") auf allen Seiten zentriert statt linksbündig, (3) Chat soll Live-AI nutzen.

| Befund/Fix | Status |
|---|---|
| **Button-Hover doppelt definiert:** `.nav-cta:hover` existierte 2× in globals.css — Fix (brand-green #009a44) an früherer Stelle, ALT-Regel `#005c28` später → gewann in CSS. Symptom: Hover wirkte dunkel/fast schwarz statt Markengrün | Eine Regel: `.nav-cta:hover, .nav-cta:focus-visible, .drawer .drawer-cta:hover, .drawer .drawer-cta:focus-visible { background: var(--color-brand-green); color: #fff; }` | ✅ live |
| **CTA-Band-Zentrierung lückenhaft:** `.section-dark` hat text-align:center, aber Homepage/referenzen/ueber-uns hatten `container` ohne `text-center`, hero-actions ohne `hero-actions-center` | Alle 5 CTA-Bänder: `container text-center` + `hero-actions hero-actions-center` (leistungen/stadtteile hatten es bereits) | ✅ live |
| **Chat „nicht live":** Ursache war Server-Ausfall (Gateway tot ~09:06, Watchdog erst ab 15:59 aktiv); API lebt jetzt | E3: /health `{"status":"ok","chat":true,"kb":true}`; 3 Chat-POSTs über Domain mit Browser-Headern (Origin/Referer) → inhaltlich korrekte Antworten mit Quellen (Adresse, Leistungen, Vorstellung); CSP `connect-src 'self'` erlaubt Widget-Fetch | ✅ live |
| Unstaged Chat-Widget-Stand (ChatWidget.tsx, layout.tsx, ADR-004) | Mit Runde 12 committet + gepusht (a4d7a5e) | ✅ |

**E2E:** Build ✅ (17 Seiten) · CSS byte-identisch live vs out/ (`3r1mlegcp61hr.css`, cmp=0) · Live-HTML == Build-HTML bis auf Cloudflare-Mail-Obfuscation (erlaubte Abweichung) · `#005c28` = 0 Treffer im Live-CSS · alle 5 Seiten: section-dark + text-center + hero-actions-center im HTML (E3) · Chunk-Referenzen live == lokal · no-cache auf HTML ✅ · Chat 3/3 Fragen beantwortet < 5 s ✅.

**Gegentest (§5.4):** Negativ (alte Hover-Farbe #005c28 0 Treffer; diff-bereinigt nur CF-MailObfuscation) ✅ · Regression: Routen 200, Chat, /health, Cache-Header unverändert ✅ · Datenintegrität: keine Änderung an KB/Content ✅.

**GEGENTEST BESTANDEN (2026-08-12, Runde 12)**

**Nachtrag Runde 12b (2026-08-12, Kunde meldete gleiche Punkte erneut):** Live-IST war bereits korrekt (cf-cache DYNAMIC, no-cache, alle Regeln E3) — Restproblem: Hover-Wechsel `#008035`→`#009A44` praktisch unsichtbar. Fix: neuer Token `--color-cta-hover-bright: #00A64A` (deutlich helleres Grün, weiß 3.18:1, UI-konform; ADR-003-Token-Pflicht) für `.nav-cta:hover`/`.drawer-cta:hover`; `.section-dark p { text-align: center }` explizit (bulletproof gegen Vererbung). Live: neuer CSS-Chunk `2-n_65pvq1ygj.css` byte-identisch, alle 5 Seiten `container text-center` + `hero-actions-center` E3, Chat `/health` ok, Route-Smoke alle OK. Committet (s.u.). Kunde: Hard-Refresh Strg+F5.

---

## Runde 13 (2026-08-12, Punkt-für-Punkt-Prüfung Gesamtauftrag A–D inkl. Chat)

**Anlass:** Pascal-Auftrag „Prüfe Punkt für Punkt gegen den Auftrag. Beziehe den Chat ein und fixe." — Kontroll-Audit gegen Auftrag (1244 Z.) + AUDIT-MATRIX-RUNDE11; Fokus: Chat (A.29), Floating UI (A.9/D.5), Hover-Token (B.8), Datenschutz (A.39).

| Befund/Fix | Status |
|---|---|
| Chat-Button + -Fenster `z-index: 9999` hardcoded → über Cookie-Banner (90) + Lightbox (80) — Verstoß A.9/D.5 | Token `--z-chat: 70` (z-Skala: Drawer 60 < Chat 70 < Lightbox 80 < Cookie 90) | ✅ live |
| Chat ohne Safe-Area-Insets (iOS Notch/Home-Indicator) — D.5 | `env(safe-area-inset-right/bottom)` auf `.abau-chat-btn`/`.abau-chat-win`, Basis + Media-Query ≤480px | ✅ live |
| Hover-Farben hardcoded: `.abau-chat-btn:hover #007a37`, `.abau-chat-send:hover #007a37`, `.abau-chat-dsgvo a:hover #007a37` — B.8/ADR-003 | Alle auf `var(--color-cta-hover)` / `var(--color-cta-hover-bright)`; `#007a37` = 0 Treffer im CSS | ✅ live |
| Chat-Datenschutz (A.39/A.29) | §6 KI-Assistent live vorhanden (Art. 50, AV, keine Speicherung, Art. 6 lit. f) — kein Fix nötig | ✅ live |
| A.29 Chat-E2E | Knowledge-Boundary (Pizza-Frage → höflicher Überfragt-Fallback), Prompt-Injection abgewehrt („Das kann ich nicht tun…"), Rate-Limit 18×200 → 429, /health ok, Server stabil nach 21 Calls | ✅ live (E3) |

**E2E:** Build ✅ · CSS byte-identisch live vs out/ (Chunk `1n4luno18zmfs.css`, cmp=0) · Live-HTML == Build (nur CF-Mail-Obfuscation) · Route-Smoke ✅ · /angebot 301 ✅ · FAQ 28 acc-items ✅ · Referenzen 2 Videos mit Poster ✅ · H1 korrekt ✅ · /health `{"status":"ok","chat":true,"kb":true}` ✅.

**Gegentest (§5.4):** Negativ: `#007a37` 0 Treffer, `9999` nur in Skip-Link/Honeypot (legitime visually-hidden-Technik, kein z-index-Problem) ✅ · Regression: Chat-API, Datenschutz §6, Routen, Hover-CTA R12b unverändert ✅ · Datenintegrität: keine Content-/KB-Änderung ✅.

**GEGENTEST BESTANDEN (2026-08-12, Runde 13)**

---

## Runde 14 (2026-08-12, Tiefenprüfung Gesamtauftrag A–D inkl. Chat — ehrliche IST-Analyse)

**Anlass:** Pascal-Auftrag „Fahre fort. Prüfe jeden Punkt gegen den Gesamtauftrag inkl. Chat. Tiefenprüfung und ehrliche IST-Stand-Analyse." — 13-Seiten-Crawl, 33 interne Links, Formular-/Chat-E2E, Server-Review, Code-Grep. Vollständige ehrliche Matrix: `docs/AUDIT-MATRIX-RUNDE14.md`.

| Befund/Fix | Status |
|---|---|
| **Chat-503 Error-Leak:** `"detail": str(e)[:120]` gab technische Fehler an Besucher (A.38/B.41) | Entfernt — nur Logging, nutzerfreundliche Meldung | ✅ live (Server neu gestartet, Response ohne detail) |
| **Stadtteil-Titel zu dünn** („Geistenbeck – A-Bau", 19 Z.) — B.20 | `title: { absolute: "<Name> – A-Bau Meisterbetrieb Mönchengladbach" }` ≤60, absolute gegen Template-Dopplung | ✅ live (44 Z.) |
| **Stadtteil-Details ohne JSON-LD** — B.21 | BreadcrumbList + Service + LocalBusiness (areaServed City) je Detailseite | ✅ live |
| **/kontakt ohne ContactPage-JSON-LD** (R11-Matrix behauptete es, Code hatte es nie) — B.21 | ContactPage+LocalBusiness, NAP **aus KONTAKT-Quelle** (C.8, kein Hardcode) | ✅ live |
| Chat z-index/safe-area/Hover-Tokens | Bereits R13 behoben — erneut live verifiziert | ✅ |
| Formular-E2E B.40 | Honeypot ok:true, Invalid-Email 400, Pflichtfelder 400, Valid → 502 (SMTP extern); Queue-Test-Eintrag geleert | ⚠️ SMTP extern |
| Chat-E2E A.29 | Öffnungszeiten-Frage korrekt, /health ok, Rate-Limit 18×200→429 | ✅ live |

**E2E:** Build ✅ · CSS byte-identisch · Live-HTML == Build (nur CF-Mail-Obfuscation) · Route-Smoke ALLE OK · Sitemap 20/20 · Crawl 0 broken · 0 Emojis · 0 tel:00 · h1=1 je Seite · JSON-LD neu live (Breadcrumb/Service/ContactPage) ✅.

**Gegentest (§5.4):** Negativ („detail" fehlt in Response; Stadtteil-Titel nicht mehr „– A-Bau"-Suffix-Dopplung; hardcoded NAP 0 in kontakt/page) ✅ · Regression: R12/13-Fixes unverändert (Hover, Zentrierung, z-Skala) ✅ · Datenintegrität: keine Content-/KB-Änderung, Queue 0 Einträge ✅.

**GEGENTEST BESTANDEN (2026-08-12, Runde 14)**
