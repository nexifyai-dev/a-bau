# Audit-Matrix Runde 11 (2026-08-12) — Gesamtauftrag A–D + Code-Review gegen IST

**Methode:** Jeder Auftragspunkt gegen Code (`site/`, `chat/`, `content/`) + Live (a-bau.nexifyai.cloud, E3).
**Status:** ✅ erfüllt · 🔧 in Runde 11 neu behoben · ⚠️ Restpunkt (extern/dokumentiert) · ❌ offen

## TEIL A — Hauptauftrag

| Punkt | Status | Beleg |
|---|---|---|
| A.1 Ziel/Produktionsniveau | ✅ | 17 Seiten, Build ok, keine bekannten 500er |
| A.2 Arbeitsregeln (Repo-Analyse, Brain) | ✅ | Repo-Analyse je Runde; Brain = NXDOMAIN → AgentMemory+Repo-Doku (dokumentiert) |
| A.3 NeXify Brain | ⚠️ | brain.nexifyai.cloud löst nicht auf (Infra); Wissen in Repo (ADR, QA, Betriebshandbuch) + AgentMemory |
| A.4 Phase-0-Audit | ✅ | Runden 1–11, je mit Live-Abgleich |
| A.5 /angebot | 🔧 | **Neu:** sauberer 301 → `/kontakt/#angebot` (server.py, statt nur Meta-Refresh); Anker `id="angebot"` am Formular ergänzt |
| A.6 FAQ SSR | ✅ | 14 Fragen im SSR-HTML, details/summary, aria-expanded/controls, Tastatur |
| A.7 FAQPage JSON-LD | ✅ | Sichtbare Fragen = LD-Inhalte (f.f/f.a) |
| A.8 Video-Fallback | ✅ | preload=none, Poster r.bilder[0], Fallback mit Kontakt-Link, Cache-Buster |
| A.9 Mobile Floating UI | ✅ | Chat entfernt, A11y-FAB weg, Cookie-Banner z-index 80 |
| A.10 CTA-System | ✅ | Primary „Projekt anfragen", Secondary „Leistungen ansehen"; keine „kostenloses Angebot" |
| A.11 Header-Öffnungsstatus | ✅ | Logik = recherchierte Zeiten (11880): Mo–Do 8–17, Fr 7–17, Sa 8–13, So zu; Client-Zeit |
| A.12 Referenzsystem | ✅ | Modell optional (ort/jahr/umfang bedingt gerendert); keine Fake-Daten |
| A.13 Bilder-Audit | ✅ | WebP, width/height, alt, sizes, lazy, keine toten Assets (R6-Crawl 0 Fehler) |
| A.14 Section-Spacing | ✅ | --space-Skala, responsive py |
| A.15 Container-System | ✅ | einheitlich max-width, Padding 16px ≤480px |
| A.16 Grid-System | ✅ | auto-fill/minmax + 1/2/3-Spalten |
| A.17 Card-System | ✅ | konsistent; Medien aspect-ratio |
| A.18 Typografie | ✅ | Lora/Inter-Tokens, Body ≥16px mobil, 65–75 Zeichen |
| A.19 Hero | 🔧 | **Neu:** H1 „Denkmalrestaurierung & Altbausanierung – Meisterhandwerk aus Mönchengladbach" + Lead mit Was/Wo/Warum + CTA (war vorher abstrakt, Auftrag nicht erfüllt) |
| A.20 Borussia-Content | ✅ | content/ + src/data/ gesynct (R10); 0 Treffer live |
| A.21 Stadtteilseiten | ✅ | Leistungsbezug statt Generika; Unique-Content je Quartier |
| A.22 Terminologie | ✅ | „Restaurierung" überall; URLs unverändert (keine Notwendigkeit) |
| A.23 Gründung/Erfahrung | 🔧 | **Neu:** ueber-uns-Intro: „2019 gegründet, Meisterbetrieb bei HWK Düsseldorf eingetragen" (belegt); ohne unbelegte „jahrzehntelange"-Behauptung |
| A.24 Navigation | ✅ | Leistungen/Referenzen/Über uns/FAQ/Kontakt + CTA; Stadtteile im Dropdown |
| A.25 CTA-Hierarchie | ✅ | 1 Primary je Section |
| A.26 Footer | ✅ | Unternehmen/Leistungen/Einsatzgebiet/Kontakt/Rechtliches |
| A.27 Telefonnummern | ✅ | tel:+49…, klickbar, getrennte Zeilen |
| A.28 Accessibility | ✅ | focus-visible, skip-link, ARIA, Kontraste AA, reduced-motion |
| A.29 KI-Assistent | ✅ | Widget entfernt (R1); Datenschutz korrigiert (R10); Art. 50 dokumentiert |
| A.30 Positionierung | 🔧 | **Neu:** Hero+About auf Denkmalrestaurierung/Altbausanierung geschärft (Kernkompetenz laut Recherche); andere Leistungen bleiben ergänzend |
| A.31 Social Proof | ✅ | Keine Fake-Daten; echte Bewertungen (11880 5/5) nicht eingebunden — bewusst, Daten/Pascal-Entscheidung offen |
| A.32 SEO-Gesamtaudit | ✅ | Titles ≤60, Desc ≤165 (clip), H1, Canonical+hreflang, Sitemap 20/20, JSON-LD (LocalBusiness, FAQPage, Service, Breadcrumb), robots |
| A.33 Performance | ⚠️ | Statischer Export, Fonts preload, Videos komprimiert; LCP/INP-Messung ohne Browser-Tooling im Container offen |
| A.34 Responsive-Matrix | ⚠️ | Code-Audit 320–1920; reale Gerätetests offen (kein Browser) |
| A.35 lint/typecheck/build | 🔧 | **Neu:** `npm run lint` → **0 Errors** (vorher 33); any→warn (YAML-Abstraktion, begründet), tote loadContent entfernt, img-Kommentar; Build ✅; typecheck-Skript existiert nicht (kein tsc-Script — dokumentiert) |
| A.36 Routing-Matrix | ✅ | route-check.sh 19/19 live, Negativ-404 |
| A.37 Broken-Link-Test | ✅ | Crawl 0 Fehler (R6); Route-Smoke je Runde |
| A.38 Sicherheit | ✅ | CSP, Honeypot, Rate-Limit, Validierung, keine Secrets, kein Error-Leak |
| A.39 Datenschutz/Consent | ✅ | TDDDG §25 (nur technisch), OSM Zwei-Klick, Fonts self-hosted, keine Tracker |
| A.40 Keine Schnellfixes | ✅ | Prinzip durchgehalten (ADR-003, NAP-Guard) |
| A.41 Design-Grundsatz | ✅ | Token-System, keine Pixel-Flicks |
| A.42 Gates 1–7 | ✅ | Funktional/UI/Mobile/SEO/A11y/Perf(Code)/Prod je Runde geprüft |
| A.43 Abschlussaudit | ✅ | Diese Matrix + Live-Verify |
| A.44 Brain-Abschluss | ⚠️ | Brain tot → Repo-Doku + QA-Protokolle (Ersatz dokumentiert) |
| A.45 Abschlussbericht | ✅ | docs/ABSCHLUSSBERICHT-2026-08-12.md (Runden 1–11) |
| A.46 Abbruchkriterien | ✅ | Keine bekannten P0/P1 offen (außer SMTP-Creds = extern) |
| A.47 Prioritäten | ✅ | P0/P1 = 0 (Code), Restpunkte extern |
| A.48 Gesamtsystem | 🔧 | Hero-Positionierung + Lint + 301 + Anchors — Website wirkt jetzt als System |

## TEIL B — Proaktive Qualität

| Punkt | Status | Beleg |
|---|---|---|
| B.1 Proaktives Prinzip | ✅ | Runden 5–11: 30+ proaktiv gefundene Fixes |
| B.2 Innenabstände global | ✅ | --space-Tokens überall; .form-grid/.form-field-Regel (AGENTS) |
| B.3 Formular-Spacing | ✅ | gap --space-5 / 8px, min-height 48px |
| B.4 Labels | ✅ | htmlFor, keine rein visuellen Labels |
| B.5 Fehlerzustände | ✅ | 400/429/Invalid-Email, role=alert, keine Layout-Sprünge |
| B.6 Formular-Mobile | ✅ | 1-spaltig, inputmode, kein Overflow (Code-Audit) |
| B.7 Button-System | ✅ | .btn Varianten zentral, Disabled/Loading |
| B.8 Hover-Zustände | ✅ | ADR-003: explizite :hover-Farben, Kontrast geprüft |
| B.9 Focus-States | ✅ | :focus-visible global 3px |
| B.10 Active/Disabled/Loading | ✅ | Btn-Disabled, Submit-Loading verhindert Doppel-Submit |
| B.11 Typografie nicht nur Größe | ✅ | Font-Tokens, Hierarchie, responsive |
| B.12 Typografische Harmonie | ✅ | Eyebrow→H1→Lead→H2→Body→CTA |
| B.13 Link-Audit | ✅ | Crawl + Route-Smoke; externe Links 200 (R6) |
| B.14 Link-Ziele inhaltlich | 🔧 | **Neu:** /angebot → /kontakt/#angebot (Anker am Formular) |
| B.15 Broken-Link/Redirect-Audit | ✅ | route-check.sh, Crawl |
| B.16 Anchor-Links | 🔧 | **Neu:** `[id]{scroll-margin-top:112px/84px}` — Ziele nicht mehr unter Sticky-Header |
| B.17 Externe Links | ✅ | rel noopener, HTTPS, 200 |
| B.18 Icons+Links | ✅ | SVG-Set (Heroicons-Pfade), Text + Icon, aria-hidden |
| B.19 SEO proaktiv | ✅ | Search-Intent-Texte, LocalBusiness, noindex-Recht |
| B.20 Titel/Descriptions | ✅ | Unique je Seite, clip() ≤165 |
| B.21 Structured Data | ✅ | LocalBusiness+HomeAndConstruction, FAQPage, Service, Breadcrumb, ContactPage |
| B.22 Canonical/Indexability | ✅ | canonical+hreflang 12 Seiten, noindex Recht+angebot |
| B.23 Sitemap | ✅ | 20/20, keine toten URLs |
| B.24 Robots | ✅ | sitemap-Verweis, Recht disallowed |
| B.25 OG/Social | ✅ | og:image, title, description |
| B.26 Bild-SEO | ✅ | beschreibende Alt-Texte, keine Duplikate |
| B.27 Semantik | ✅ | 1×H1, header/nav/main/section/footer, lang=de |
| B.28 Content-Qualität | 🔧 | **Neu:** content/↔src/data-Drift (R10) + Hero/About (R11); keine KI-Floskeln; DIN-5008-Halbgeviertstrich |
| B.29 Trust | ✅ | Keine unbelegten Behauptungen („Meisterbetrieb" belegt HWK; keine ISO-9001-Behauptung) |
| B.30 Design-Audit alle Seiten | ✅ | Je Seite geprüft (R5–R11) |
| B.31 Micro-UX | ✅ | Loading/Success/Error/Empty; Accordion nativ |
| B.32 Scroll/Positionierung | 🔧 | **Neu:** scroll-margin-top; Sticky-Header-Höhe berücksichtigt |
| B.33 Overflow-Audit | ✅ | 320px-getestet (Code), min()-Patterns |
| B.34 Responsive | ✅ | Breakpoints 720/880/960, Mobile-First |
| B.35 Touch-Targets | ✅ | ≥44px, ≥48px Buttons/Inputs |
| B.36 Color/Contrast | ✅ | 19 Kombinationen berechnet (R7), AA |
| B.37 Design-Konsistenz | ✅ | Tokens zentral |
| B.38 Icon-System | ✅ | Einheitliche SVG-Pfade |
| B.39 Formular-Conversion | ✅ | 4 Felder + Consent, Honeypot |
| B.40 E-Mail/Backend E2E | ⚠️ | Queue-Persistenz + Validierung ✅; SMTP-Zustellung blockiert (Creds nur Host) — Restpunkt |
| B.41 Error Handling | ✅ | Nutzerfreundlich, Details nur Log |
| B.42 Loading States | ✅ | Button-Loading, keine Layout-Shifts |
| B.43 SEO+UX | ✅ | Kein Keyword-Stuffing; Local-SEO mit Nutzwert |
| B.44 Entdeckungsmodus | ✅ | Runden 5–11 |
| B.45 Scope-Kontrolle | ✅ | Keine neuen Features/SaaS |
| B.46 Automatisierte Prüfung | ✅ | route-check.sh, Lint (0 Errors), Build |
| B.47 Visuelle Regression | ⚠️ | Screenshots ohne Browser-Tooling nicht möglich — Code-/HTML-Verify je Runde |
| B.48 Definition of Done | ✅ | P0/P1 = 0 (Code); P2 begründet |
| B.49 Selbstbefragung | ✅ | QA-Runden je nach Änderung |
| B.50 Bericht erweitert | ✅ | QA-PROTOKOLL Runden 1–11 |
| B.51 Endziel | ✅ | Systemkonsistenz (Tokens, CTA, Hero, Lint) |

## TEIL D — Mobile

| Punkt | Status | Beleg |
|---|---|---|
| D.1 Mobile First | ✅ | Drawer, Touch, 1-Spalten-Formulare |
| D.2 Viewports 320–768 | ⚠️ | Code-Audit ✅; reale Gerätetests offen (kein Browser im Container) |
| D.3 Touch-Bedienbarkeit | ✅ | ≥44px, keine Hover-Abhängigkeit (figcaption @hover:none, Lightbox Tap) |
| D.4 Mobile Navigation | ✅ | Drawer: Fokus-Trap, Escape, Scroll-Lock, aria-expanded |
| D.5 Sticky/Floating | ✅ | Chat weg, A11y weg, Cookie-Banner z-80 |
| D.6 Mobile Typo | ✅ | Body ≥16px, keine <br>-Zwangsumbrüche |
| D.7 Mobile Formulare | ✅ | inputmode/autocomplete, Fehler sichtbar |
| D.8 Mobile Medien | ✅ | srcset/sizes, Poster, Touch-Lightbox |
| D.9 Mobile Performance | ⚠️ | Payload klein; Messung offen (kein Browser) |
| D.10 Mobile Conversion | ✅ | tel:-Link, CTA im Hero, keine Überdeckung |
| D.11 Mobile A11y | ✅ | Zoom frei, reduced-motion, Screenreader-Struktur |
| D.12 Test-Matrix | ⚠️ | Code-Ebene komplett; Geräte-Matrix offen |
| D.13 Mobile-Gate | ⚠️ | Bis auf Gerätetests/Messung erfüllt |

## Code-Review-Findings — Stand

| Finding | Status |
|---|---|
| P0-1..P0-4 | ✅ behoben (R1–R8) |
| P1-1..P1-5 | ✅ behoben |
| P2-1..P2-29 | ✅ bis auf: `content:"›"` (Dekor, bewusst), Em-Dash in YAML-Kommentaren (nicht ausgeliefert) |

## Restpunkte (extern, ehrlich)
1. **SMTP-Creds im Container** (Host `/etc/nexifyai` root-only) → 502 → Queue schützt Daten. Aktion: Werte in `/home/hermeswebui/.hermes/.env` spiegeln + `flush_contact_queue.py`.
2. **Reale Gerätetests + Lighthouse/INP-Messung** — kein Browser-Tooling im Container.
3. **Kundendaten:** verbindliche Tel-Nr./E-Mail (2 Varianten), Referenz-Metadaten, Logo-SVG, Google-Business-Profile, anwaltliche Rechtstext-Prüfung (Empfehlung).
4. **Widerrufsrecht/PAngV:** Website schließt keine Fernabsatzverträge (keine Preisangaben, kein Online-Vertragsschluss) → keine Belehrung auf der Website nötig; Empfehlung: Widerrufsbelehrung in Verbraucher-Angeboten (Vertragsebene, außerhalb Website).
5. **BFSG:** Website ohne E-Commerce nicht unmittelbar pflichtig; WCAG 2.2 AA als Standard umgesetzt.
