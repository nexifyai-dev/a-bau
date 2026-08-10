# PLAN — Vollumfängliche Neugestaltung a-bau.info (A-Bau Meisterbetrieb GmbH)

**Version:** 1.0 · **Datum:** 2026-08-10 · **Autor:** NeXifyAI System-CEO (Hermes)
**Geltungsbasis:** Arbeitsvorgaben v3.3 (§3 Queen-Mode, §5 Test-Pyramide + §5.4 E2E-Gegentest, §11, §12, §13) · CEO-Mission 2026-08-07 · ZK
**Zusatz-Auftrag Pascal (2026-08-10):** DIN-, ISO- und DSGVO-Vorgaben sowie alle Rechtssseiten verbindlich einbeziehen.

---

## AUFTRAG
Vollumfängliche Neugestaltung der Website a-bau.info (A-Bau Meisterbetrieb GmbH, Mönchengladbach): neue hochwertige, umfangreiche, vertrauensvolle Website auf Deutsch, inklusive AI-Chatbot (9Router-API, antwortet aus Website-Wissen per LLM+RAG). Vorhandene Bilder nutzen, fehlende Daten recherchieren (teilweise erledigt), alle Rechtssseiten (Impressum, Datenschutz, Cookie-Consent, AGB-Prüfung) sowie DIN-/ISO-/DSGVO-Vorgaben einbeziehen.

## KONTEXT
- Audit 2026-08-10 (E1–E3): Alt-Site = WordPress 6.x/AIOSEO auf IONOS (217.160.0.24), PHP 8.1.34 (EOL), keine Kompression, keine Security-Header, **kein Impressum/Datenschutz (404), kein Cookie-Consent** → Pflichtverstoß, Abmahnrisiko. SEO: 3× H1, autogenerierte Meta-Description, Template-Platzhalter (`/ueber-uns`, `/portfolio`, Fake-Zitat „Elisabeth Müller"), `hello-world`/`sample-page` indexiert, kein LocalBusiness-Schema. Kontakt-/Adress-Inkonsistenzen (Cylex ×2, Telefon ×2, E-Mail-Domain a-bau.de tot/NXDOMAIN). Reputation: 11880 5/5 (1, Apr 2026, „zuverlässiges Generalbauunternehmen"), Google 3/5 (4), ProvenExpert 1/5 (1).
- Kunde: Neukunden-Anfrage über VP; Angebots-Prozess mit Kundenkonto-Einladung (Angebots-Pflicht, GDOK §10).
- Infrastruktur: VPS 72.62.152.47 (Frankfurt, DE — DSGVO-freundlich), 9Router 127.0.0.1:20128 (E3), lokales Supabase mit pgvector, Caddy, Cloudflare.

## ZIEL (verifizierbar, binär)
1. Neue Website live unter **`a-bau.nexifyai.cloud`** (aktuelles Ziel; spätere eigene Domain nach Kundenentscheid): ✅ HTTP 200, CWV LCP < 2,5 s, Lighthouse ≥ 90 (Perf/SEO/A11y/Best Practices), keine 404 auf öffentlichen Seiten.
2. Alle Rechtssseiten vorhanden und vollständig: Impressum (§5 DDG/§18 MStV, HRB 18836, GF, USt-IdNr.), Datenschutz (Art. 12–14 DSGVO, TDDDG §25), Cookie-Consent-Banner (kein Tracking-Cookie vor Einwilligung), 404-Seite. ✅ DSGVO-Checkliste abgehakt (Tool-Check + manuelle Prüfung).
3. Barrierefreiheit: WCAG 2.2 AA / EN 301 549 (BFSG) — axe-Scan 0 kritische/seriöse Fehler, Tastaturbedienung, Kontraste, Fokus-Styles, Alt-Texte, Video-Untertitel. ✅
4. AI-Chatbot auf allen Seiten: antwortet deutsch, ausschließlich aus Website-Wissen (RAG), nennt Quellen, keine erfundenen Preise, DSGVO-Hinweis, KI-Offenlegung (EU AI Act Art. 50), Fallback auf Kontaktformular. ✅ E2E: Happy-Path + Negativ + Injection-Test.
5. SEO: LocalBusiness/LocalService + FAQPage + BreadcrumbList Schema (validator.schema.org ✅), Meta/OG/Twitter, Sitemap, robots, hreflang, semantisches HTML, DIN-5008-konforme Texte, ISO-8601/-639/-4217-Auszeichnungen. ✅
6. Inhalte: keine Platzhalter, keine Fake-Zitate; echte Referenzdaten (Kunde liefert), 12–15 FAQ, alle 7 Leistungen beschrieben. ✅
7. Kontaktdaten zentral und konsistent (eine Quelle `data/kontakt.yaml`), überall identisch. ✅

## UMFANG (IN SCOPE)
- Kompletter Neuaufbau (statisch generiert, Astro 5): Start, Leistungen, Referenzen, Über uns, Kontakt, FAQ, Impressum, Datenschutz, 404.
- Download + Aufbereitung der 86 vorhandenen Medien (Bilder WebP/AVIF, responsive srcset, Alt-Texte; Videos mit Poster; Logo-Retina).
- RAG-Chatbot: FastAPI-Service `chat/`, Retrieval via SQLite-FTS5 (lokal, tenant-isoliert; kein externer Embedding-Provider — Upstage final entfernt, Pascal 2026-08-10), 9Router (ds/deepseek-v4-flash, Think-Max), Widget.
- Rechtstexte als vollständige Entwürfe (kein Mock) + Consent-Banner + AVV-Hosting.
- Staging-Deploy + DNS-Umzug nach Abnahme; 301-Redirects alter URLs.
- Betriebshandbuch + ZK/AgentMemory-Update.

## AUSSCHLUSS (OUT OF SCOPE)
- Kein WordPress-Weiterbetrieb, kein WooCommerce/Shop, kein Blog-System.
- Keine bezahlten SEO-Tools (SerpApi/Ahrefs), keine laufende SEO-Kampagne.
- Keine Social-Media-Anlage/-Betreuung (Footer-Platzhalter werden entfernt; Anlage nur auf Kundenwunsch als Folgeprojekt).
- Keine anwaltliche Endabnahme (Hinweis: Rechtstexte vor Go-Live durch Rechtsanwalt prüfen lassen — Kunde bestätigt).
- Kein Widerrufsrecht-/Fernabsatz-Setup außer juristisch geprüfter Hinweise.

## PRIORITÄT
P0 (Kunde/VP): offene Datenpunkte (USt-IdNr., Telefon, E-Mail, HWK, Referenzdaten, Logo-SVG) — blockieren Phase 2.
P0 (System): 9Router E3-Verfügbarkeit, Supabase-pgvector-Erreichbarkeit, Caddy/Staging-Domain.
P1: Build + Chatbot. P2: Reputations-Maßnahmen (Rezensionsmanagement Google/ProvenExpert — Empfehlung an Kunde). P3: Blog/Video-Sektion später.

## ABHÄNGIGKEITEN
| Abhängigkeit | Status | Blockiert |
|---|---|---|
| 9Router 127.0.0.1:20128 (LLM+Embedding) | E3 (ZK/AGENTS.md) | Chatbot |
| Supabase-lokal, pgvector verfügbar | E1/E2 — vor Phase 4 verifizieren | RAG |
| Caddy + Domain a-bau.nexifyai.cloud | E2 prüfen | Staging |
| Kunden-Klärung offener Datenpunkte | OFFEN — P0, via VP/Kunde | Phase 2 Inhalte |
| Eigene Domain (Kunde, später — kein IONOS-Umzug jetzt) | OFFEN — später | späterer Umzug |
| Asset-Download von a-bau.info (wp-json) | E3 (86 Medien inventarisiert) | Phase 1 |
| Skills: vps-website-hosting, din-iso-deutsche-texte, dsgvo-tdddg-compliance, website-audit-de | installiert | QA |

## PHASEN (atomar, je Phase Gate nach §5.3)
### Phase 1 — Setup & Assets (P0)
- Ordner `site/`, `chat/`, `assets/`; Astro-5-Scaffold; Config (de, Build, Bild-Optimierung); Caddy-Staging.
- Assets-Download (86 Medien, wp-json), Sortierung nach Kategorie (Denkmal/Innenausbau/Krankenhaus/Schlüsselfertig/Sanierung/Transport/Badezimmer), Logo-Verarbeitung, Asset-Manifest `assets/manifest.json` (Quelle-ID, Verwendung, Alt-Text-Vorschlag).
- Gate: alle Assets lokal, 0 Fehler, Manifest vollständig (✅/❌).

### Phase 2 — Inhalte (P0, hängt an Kunden-Klärung)
- Texte neu (DIN-5008-Typografie, deutsche Sprache, charmant-business, keine KI-Floskeln): Hero, 7 Leistungen, Über uns (Register-Fakten, nur Belegtes), Referenzen (echte Projektdaten), Kontakt, FAQ 12–15, Datenschutz-Textbausteine.
- Rechtstexte-Entwürfe vollständig (Impressum §5 DDG/§18 MStV; Datenschutz Art. 12–14 DSGVO inkl. Chatbot + Hosting-AVV + Consent; AGB-Prüfvermerk).
- `data/kontakt.yaml`: EINE Wahrheitsquelle (Adresse Luisental 69, HRB 18836, GF, Tel, E-Mail, Öffnungszeiten Mo–Do 8–17/Fr 7–17/Sa 8–13 — vorab 11880-Stand, Kunde bestätigt).
- Gate: 0 Platzhalter, alle Pflichtfelder Impressum gefüllt oder als OFFEN markiert.

### Phase 3 — Design & Build (P1)
- **Design-Grundlage (Pflicht, Pascal 2026-08-10): Apple-Design-Prinzipien** — Quelle: `emilkowalski/skills` (apple-design) + WWDC (Designing Fluid Interfaces, Foundations 2026), Skill `apple-design` vor Build laden:
  - Fluid Interfaces: Feedback auf pointer-down, Springs statt fixer CSS-Transitions für gestengetriebene UI (Drawer, Lightbox, Accordion, Chat-Panel, Cookie-Banner), Interruptibility (vom Präsentationswert animieren), Momentum/Velocity-Handoff, Rubber-banding an Grenzen.
  - Materialien & Tiefe: transluzente Sticky-Nav/Header (`backdrop-filter: blur + saturate`, Content scrollt darunter), Scroll-Edge-Effekte statt harter Divider, kontextabhängige Schatten.
  - Typografie: Tracking größenabhängig (Display negativ ~-0.02em, Body ~0), Leading invers zur Größe, Hierarchie aus weight+size+leading, `rem`-basiert, System-Font-Fallback; Manrope/Outfit als Custom-Faces.
  - Foundations: Clarity/Deference/Depth/Craft — UI tritt zurück, Inhalte führen; verteidigbare Spacing-/Timing-Werte; Wayfinding (Wo bin ich? Wohin kann ich?).
  - A11y: `prefers-reduced-motion` (Cross-Fade statt Slide/Spring), `prefers-reduced-transparency` (frostige Flächen solide), `prefers-contrast: more` — ergänzt WCAG 2.2 AA (Phase-3-Gate: axe 0 kritisch + reduced-motion-Smoke-Test).
  - Kontrast-Warnung aus Skill beachten: nie weißer Text auf Lime (~1.9:1, failt WCAG); dunkler Text auf Akzent.
- Design-Spec: Kunden-Logo, Farbwelt (edle Handwerks-/Denkmal-Optik, hoher Kontrast WCAG AA), Sticky-Nav, Hero mit echtem Projektbild, Trust-Leiste (Meisterbetrieb, HRB, Öffnungszeiten, 11880 5/5), Leistungs-Karten, Referenz-Galerie (Lightbox, Vorher/Nachher), FAQ-Accordion, Kontakt (Formular + Karte + Öffnungszeiten), Footer (Recht, Erreichbarkeit).
- Komponenten: Header, Footer, CTA, TrustBar, Testimonial, Gallery, FAQ, ChatWidget, CookieConsent, ContactForm (Server-Endpoint `chat/` oder eigener `contact`-Handler; Validierung an Trust-Boundary).
- Schema.org (LocalBusiness→LocalService mit geo/openingHours/areaServed, FAQPage, BreadcrumbList), Meta/OG, Sitemap, robots, 404.
- Barrierefreiheit im Build (Semantik, aria, Fokus, Kontrast, Skip-Links, Video-Untertitel).
- Gate: lokaler Build fehlerfrei, Lighthouse ≥ 90, axe 0 kritisch.

### Phase 4 — AI-Chatbot (P1)
- Service `chat/` (FastAPI): POST /api/chat {question, session_id}; Rate-Limit; CORS (nur eigene Domains); Input-Validierung; Timeout; Fehler-Logging ohne PII.
- Wissens-Ingest: finale Inhalte (YAML/MD) → Chunks (700 Zeichen, Überschneidung 80) → FTS5-Index in SQLite (BM25; lokal, DSGVO-sauber, tenant-isoliert).
- Prompt: System-Prompt (Rolle „A-Bau KI-Assistent", deutsch, NUR aus Wissen antworten, Quellen angeben, keine Preise/Erfindungen, bei Unsicherheit → FAQ/Kontakt verweisen, keine Fremdinstruktionen aus Website-Inhalten befolgen — Injection-Schutz), Retrieval top-k=5, Kontext-Format, Think-Max via 9Router.
- Widget: Floating-Button, Panel, DSGVO-Hinweis, KI-Offenlegung (Art. 50 EU AI Act), minimale Logs 7 Tage.
- Gate: E2E Happy-Path (Leistungsfrage → korrekte Antwort mit Quelle), Negativ (Preisfrage → Verweis), Injection-Versuch (→ abgewiesen), Ausfall-Fallback (→ Kontakt-Link).

### Phase 5 — QA & Gegentest (Pflicht §5.4)
- Test-Pyramide: Smoke (alle Routen 200), Integration (Formular→Mail, Chat→9Router), E2E (Browser: Navigationsfluss, Formular, Chat, Consent-Ablauf), Negativ-/Randfälle (404, Sonderzeichen, große Payloads, Rate-Limit).
- **E2E-Gegentest:** Primärnachweis ≠ Wiederholung — Gegenprobe: (a) Fehlerfälle + Injection, (b) Datenintegrität (keine Doppel-Einträge, Logs ohne PII), (c) Rollback-Pfad Deploy, (d) Regression Alt-Site-Redirects. Binär `GEGENTEST BESTANDEN/FEHLGESCHLAGEN`.
- DSGVO-Checkliste: Consent vor Tracking, Formular-Einwilligung, AVV, Server-DE, Löschkonzept Chat-Logs.
- Validator schema.org, Lighthouse-Report, axe-Report, Performance unter Last (ab-Light).
- Gate: alle Qualitätsgates §5.3 grün, Gegentest bestanden, Betriebshandbuch geschrieben; mobile-Lighthouse-Gate + Security-Header-Check + NAP-Konsistenz-Check (Sektion „Qualität, Mobile & SEO") dokumentiert.

### Phase 6 — Deploy & Übergabe (P1)
- Deploy auf **`a-bau.nexifyai.cloud`** (Caddy, Auto-TLS) — aktuelles Ziel (Pascal 2026-08-10); spätere eigene Domain des Kunden wird nach Kundenentscheid angebunden (Caddy-DNS + 301-Matrix dann), kein IONOS-Zugriff nötig.
- E3-Nachweis (HTTP 200, TLS, alle Routen) + Kundenabnahme (PDF-Report via `nexify-pdf-ci-report`, Versand via Hostinger-SMTP + IMAP-Nachweis).
- Backup + Rollback-Doku; 301-Matrix Alt-URLs (a-bau.info → neue Struktur) erst beim späteren Domain-Umzug aktivieren, jetzt nur vorbereiten.
- Übergabe: Betriebshandbuch (Betrieb, Chatbot-Wartung, Content-Pflege, Troubleshooting), Doku in ZK + AgentMemory, Angebot/Rechnung über Kundenkonto-Prozess (Einladungs-Mail, GDOK §10).

## QUALITÄT, MOBILE & SEO — PRÄVENTION (Pascal 2026-08-10: „alle Dinge + gesamtes gelerntes Wissen, Fehler vor Entstehung vermeiden")

Gelernte Pitfalls aus NeXify-Betrieb (E3, 2026) aktiv als Build-Regeln — nicht erst in QA finden:

### Mobile (Pflicht)
- Mobile-first-Build (nicht Desktop→Shrink); Breakpoints ≤ 360 px testen (iPhone SE-Klasse), kein horizontaler Scroll (Test: `document.scrollingElement.scrollWidth <= innerWidth`).
- Touch-Targets ≥ 44×44 px (WCAG 2.5.5/2.5.8), Abstände zwischen tappbaren Elementen; sticky mobile CTA (Anruf/Kontakt) nur mit Fokus-/Aria-Management; Drawer-Menü mit Apple-Design-Springs + `setPointerCapture`, bei `prefers-reduced-motion` Cross-Fade.
- Bilder: `srcset`/`sizes` + WebP/AVIF, Lazy-Loading (`loading="lazy"` unterhalb des Folds, Hero `eager`+`fetchpriority=high`), feste `width`/`height`/`aspect-ratio` → **kein CLS** (Alt-Site-Befund: 2,5 MB unoptimierte Bilder).
- Videos: `<video>` mit Poster, `preload="none"`/`metadata`, mp4-H.264, Größen-Attribute, Untertitel (EN 301 549).
- Fonts self-hosted, `font-display: swap`, Subsets, Preload kritischer Fonts; kein Google-Fonts-CDN (DSGVO + Latenz).
- LCP-Ziel < 2,5 s auf 4G (Lighthouse mobile als eigener Gate-Run, nicht nur Desktop).

### SEO (Pflicht, On-Page vollständig)
- Je Seite: 1×H1, unique Title 50–60 Zeichen, Meta-Description 140–160 (nicht autogeneriert — Alt-Site-Fehler), Canonical, OG/Twitter, Breadcrumb.
- URL-Struktur kurz & sprechend (`/leistungen/denkmalrestaurierung/`); 301-Matrix Alt→Neu vorbereitet; 404-Seite mit Navigation; Sitemap.xml + robots (Allow, Sitemap-Verweis) + `index.html`-redirect.
- Schema.org: LocalService/LocalBusiness (geo, openingHours, areaServed: Mönchengladbach/NRW, telephone, email), FAQPage, BreadcrumbList — via validator.schema.org prüfen.
- **Local-SEO/NAP-Disziplin (Kern-Lektion aus Audit):** Adresse/Telefon/E-Mail exakt EINMAL zentral (`data/kontakt.yaml`) und identisch überall; Alt-Einträge (Cylex Pastorsgasse, doppelte Telefonnummern, tote E-Mail a-bau.de) beim Kunden bereinigen lassen; Google-Business-Profile beanspruchen + Rezensionsmanagement (11880 5/5 als Vertrauensanker; ProvenExpert 1/5 adressieren, nicht verstecken).
- Keywords (aus Audit): „Bauunternehmen Mönchengladbach", „Denkmalrestaurierung", „Innenausbau NRW", „Krankenhausbau", „Schlüsselfertigbau" — in Titles/H2/Body natürlich (kein Keyword-Stuffing); regionale Landing-Intents (Geistenbeck/NRW).
- Technik-Ranking: Kompression (brotli/gzip — Alt-Site hatte KEINE), HTTP/2/3, CWV (LCP/INP/CLS), TTFB < 600 ms (statisch + Caddy), semantisches HTML5.
- Nach Deploy: Indexierbarkeit prüfen (Google Search Console einrichten = Kunden-Empfehlung, Screaming-Frog/Free-Proxy-Test); kein `noindex`-Leak; Staging vor Crawl schützen (`X-Robots-Tag: noindex` auf a-bau.nexifyai.cloud bis Abnahme!).

### Security & Betrieb (aus heutigen Befunden + Betriebshandbuch-Pflicht §12)
- Security-Header (Caddy/App): HSTS, CSP, X-Frame-Options/`frame-ancestors`, X-Content-Type-Options, Referrer-Policy, Permissions-Policy — Alt-Site hatte keine (E3).
- Formular-Mailversand: **Hostinger-SMTP 465 (Mailbox-Login), NICHT Resend** — Resend sendet mit Return-Path `send.nexifyai.cloud` = NXDOMAIN → „Sender address rejected" (heute E3 bewiesen). Zustellnachweis via IMAP.
- Formular: Server-seitige Validierung (Trust-Boundary), Honeypot + Rate-Limit, DSGVO-Einwilligung (Checkbox, Art. 6/7), keine PII in Logs (7-Tage-Löschung), Erfolgs-/Fehler-UX.
- Analytics: kein Google Analytics ohne Consent; Empfehlung: DSGVO-freundliche Option (Plausible/Matomo self-hosted) NACH Consent-Entscheid; Banner = TDDDG §25.
- Karte: OpenStreetMap/OSM-Embed statt Google-Maps-API (kein Tracking ohne Einwilligung), DSGVO-Hinweis.
- Deploy: Caddy Auto-TLS, www→non-www + http→https (Alt-Site: 301-Kette ok), gzip/brotli, Cache-Control (immutable für gehashte Assets), **Service-Worker vorsichtig** (Pitfall service-worker-cache-ops: falsche Strategie = kaputtes Frontend — nur mit Versions-Hash + Stale-while-revalidate, sonst weglassen).
- Monitoring: Uptime-Probe (Cron/Healthcheck), Chatbot-Service als systemd-Unit mit Restart=always + Health-Endpoint, Log-Rotation, Backup = Repo/Build-Artefakt + wöchentliches Offsite (ZK).
- Chatbot-Betrieb: Wissens-Re-Ingest bei Content-Änderungen (skriptgesteuert), Token-Kosten-Monitoring, Rate-Limit, Fallback Kontakt.

### Content-Qualität (aus Audit-Lektionen)
- Keine Template-Platzhalter, keine Fake-Zitate (Alt-Site: „Elisabeth Müller", „Projektleiter: Müller" — entfernen), keine demo-Seiten (`hello-world`, `sample-page`), keine generischen Social-Links (nur echte Profile oder weglassen).
- DIN-5008-konforme deutsche Texte (Skill `din-iso-deutsche-texte`), tatsächliche Leistungsbeschreibungen aus Register-Gegenstand + Kundenabgleich.
- KI-Offenlegung Chatbot (EU AI Act Art. 50), DSGVO-Hinweis im Widget.

## PRÜFVERFAHREN (Zusammenfassung)
Binäre Akzeptanzkriterien je Phase (✅/❌), dokumentiert in `docs/QA-PROTOKOLL.md`; jeder Eintrag mit Timestamp, Input, Output, Statuscode; E2E-Gegentest §5.4 als Abschlussbedingung; Qualitätsgates §5.3 vollständig.

## ANNAHMEN
1. Kunde bestätigt Kontaktdaten (Tel/E-Mail/Öffnungszeiten) und liefert USt-IdNr., HWK-Daten, echte Referenzprojekte, Logo-SVG.
2. VP/Kunde akzeptiert Staging-Abnahme vor DNS-Umzug.
3. Bewertungslage (11880 5/5, Google 3/5, PE 1/5) wird offen im Kundenbericht adressiert; Rezensionsmanagement = Kundenempfehlung, kein verstecktes Entfernen.
4. Rechtstexte werden vor Go-Live anwaltlich geprüft (Kunde übernimmt Freigabe; NeXify liefert vollständige Entwürfe).
5. Hosting dauerhaft auf NeXify-VPS (DE, Frankfurt) — Kunde erhält Betriebshandbuch; monatliche Wartung optional.

## RISIKEN & MITIGATION
| Risiko | W'keit/Ausw. | Mitigation |
|---|---|---|
| Fehlende USt-IdNr./HWK → Impressum unvollständig | M/H | P0-Klärung; Entwurf mit Platzhalter-Kennzeichnung, Go-Live nur mit Werten |
| ProvenExpert 1/5 sichtbar | H/M | Transparenz + Rezensionsmanagement-Empfehlung; neue Bewertungen aktivieren |
| DNS-/Zugriffskontrolle beim Kunden (IONOS) | M/H | Staging zuerst; klare Übergabe-Anleitung |
| Chatbot-Halluzination/Injection | M/M | RAG-only-Prompt, Quellenpflicht, Injection-Test, Fallback |
| Agent-Zeit/Scope-Drift | M/M | Phasen-Gates, AUSSCHLUSS-Liste, Kanban-Tracking |

## GESCHÄTZTER UMFANG
- 2–4 Agenten-Arbeitstage (Build+Chatbot+QA+Deploy) — Abrechnung über Kundenprojekt-Angebot (Kundenkonto-Prozess, GDOK §10; kein Preis hier im Plan).
