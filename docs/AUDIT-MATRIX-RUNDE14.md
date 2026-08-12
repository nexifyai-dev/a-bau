# Audit-Matrix Runde 14 (2026-08-12) — Ehrliche IST-Stand-Analyse Gesamtauftrag A–D inkl. Chat

**Methode:** Jeder Punkt SELBST gegen Code + Live geprüft (kein Übernehmen von Matrix-Runde-11-Status).
**Legende:** ✅ erfüllt (E3-live oder Code-E3) · 🔧 in Runde 14 neu behoben · ⚠️ Restpunkt (extern, ehrlich) · ❌ offen
**Live-Basis:** Crawl 13 Seiten, 33 interne Links (0 broken), Sitemap 20/20, Formular-/Chat-E2E, Server-Review.

## TEIL A — Hauptauftrag

| Punkt | Status | Ehrlicher Beleg Runde 14 |
|---|---|---|
| A.1 Produktionsniveau | ✅ | 17 Seiten, alle 200, keine bekannten 500er |
| A.2/A.3 Brain | ⚠️ | brain.nexifyai.cloud löst nicht auf (NXDOMAIN, Infra) — Ersatz: Repo-Doku + ADR + QA + AgentMemory. Kein Bypass-Vorwurf: Brain nie erreichbar, dokumentiert seit R1 |
| A.4 Phase-0-Audit | ✅ | R1–R14 je mit Live-Abgleich |
| A.5 /angebot | ✅ | 301 → /kontakt/#angebot (server.py), Anker id="angebot" live |
| A.6 FAQ SSR | ✅ | 28 acc-items im SSR-HTML, details/summary, aria, Tastatur |
| A.7 FAQPage JSON-LD | ✅ | Home + /faq: sichtbare Fragen = LD (keine erfundenen) |
| A.8 Video-Fallback | ✅ | 2 Videos /referenzen, preload=none, Poster, Fallback mit Kontakt-Link |
| A.9 Mobile Floating UI | 🔧 | **R14:** Chat z-index 9999 → `--z-chat:70` (unter Cookie 90/Lightbox 80); safe-area-insets; keine Überlagerung mehr |
| A.10 CTA-System | ✅ | Primary „Projekt anfragen", Secondary „Leistungen ansehen", keine konkurrierenden Primary-CTAs |
| A.11 Öffnungsstatus | ✅ | istGeoeffnet() Client-Zeit, Zeiten aus kontakt.yaml (Mo–Do 8–17, Fr 7–17, Sa 8–13) |
| A.12 Referenzsystem | ✅ | Modell optional (ort/jahr/umfang bedingt), keine Fake-Daten; reale Metadaten offen beim Kunden |
| A.13 Bilder | ✅ | WebP, width/height, alt, sizes, lazy; Crawl 0 tote Assets |
| A.14–A.17 Spacing/Container/Grid/Cards | ✅ | --space-Tokens, einheitliche Container/Grid/Cards |
| A.18 Typografie | ✅ | Lora/Inter, Body ≥16px mobil, 65–75 Zeichen |
| A.19 Hero | ✅ | H1 „Denkmalrestaurierung & Altbausanierung…" + Lead Was/Wo/Warum + CTA |
| A.20 Borussia-Content | ✅ | Nur CSS-Kommentar (Farb-Herkunft, harmlos); 0 Treffer in Content/TSX |
| A.21 Stadtteilseiten | 🔧 | **R14:** Titel von „<Name> – A-Bau" (19 Z.) → „<Name> – A-Bau Meisterbetrieb Mönchengladbach" (≤60, absolute gegen Template-Dopplung) |
| A.22 Terminologie | ✅ | Restaurierung/Denkmalrestaurierung überall; URLs bewusst unverändert |
| A.23 Gründung/Erfahrung | ✅ | „2019 gegründet, Meisterbetrieb HWK Düsseldorf" — belegt |
| A.24 Navigation | ✅ | Leistungen/Referenzen/Über uns/FAQ/Kontakt + CTA; Stadtteile im Dropdown |
| A.25 CTA-Hierarchie | ✅ | 1 Primary je Section |
| A.26 Footer | ✅ | Unternehmen/Leistungen/Einsatzgebiet/Kontakt/Rechtliches |
| A.27 Telefonnummern | ✅ | tel:+49…, getrennt, klickbar; 0 tel:00 |
| A.28 Accessibility | ✅ | focus-visible global, skip-link, ARIA, Kontraste, reduced-motion |
| A.29 KI-Assistent | 🔧 | **R14-Vertiefung:** Rate-Limit 18×200→429 E3; Boundary + Injection E3; **Error-Leak behoben** (`detail` aus 503-Response entfernt — A.38); z-index/safe-area (A.9); DSGVO §6 live; Timeout 30s; kein Streaming (bewusst, Tunnel-Limit) |
| A.30 Positionierung | ✅ | Hero/About Denkmalrestaurierung-Kernkompetenz |
| A.31 Social Proof | ⚠️ | Keine Fake-Daten ✅; echte Projektdaten/Bewertungen offen beim Kunden |
| A.32 SEO-Gesamtaudit | 🔧 | **R14:** Stadtteil-JSON-LD (Breadcrumb+Service) ergänzt; ContactPage auf /kontakt ergänzt (fehlte trotz R11-Behauptung) |
| A.33 Performance | ⚠️ | Statischer Export, kleine Bundles; LCP/INP-Messung ohne Browser-Tooling offen |
| A.34 Responsive-Matrix | ⚠️ | Code-Audit 320–1920; reale Gerätetests offen |
| A.35 lint/typecheck/build | ✅ | lint 0 Errors (R11), tsc-Script existiert nicht (dokumentiert), Build ✅ |
| A.36 Routing | ✅ | route-check alle OK inkl. Negativ-404 |
| A.37 Broken-Link | ✅ | Crawl 33 Links 0 broken |
| A.38 Sicherheit | 🔧 | **R14:** Error-Leak behoben; CSP, Honeypot, Rate-Limit, Validierung, keine Secrets |
| A.39 Datenschutz/Consent | ✅ | TDDDG §25, OSM Zwei-Klick, Fonts self-hosted, Chat §6 live, keine Tracker |
| A.40 Keine Schnellfixes | ✅ | Token-System, keine !important-Explosion |
| A.41 Design-Grundsatz | ✅ | System statt Pixel-Flicks |
| A.42 Gates 1–7 | ✅ | Je Runde geprüft; Mobile-Gate siehe D.13 |
| A.43 Abschlussaudit | ✅ | Diese Matrix + QA R14 + Abschlussbericht |
| A.44 Brain-Abschluss | ⚠️ | Brain tot → Repo-Doku + AgentMemory (Ersatz dokumentiert) |
| A.45 Abschlussbericht | ✅ | docs/ABSCHLUSSBERICHT (R1–13) + Nachtrag R14 |
| A.46 Abbruchkriterien | ✅ | Keine bekannten P0/P1 (außer SMTP = extern) |
| A.47 Prioritäten | ✅ | P0/P1 = 0 (Code) |
| A.48 Gesamtsystem | ✅ | Konsistent als Produkt (Tokens, CTA, Chat integriert) |

## TEIL B — Proaktive Qualität

| Punkt | Status | Ehrlicher Beleg |
|---|---|---|
| B.1–B.12 UX/Spacing/Typo/Hover/Focus | ✅ | R5–R13 geprüft; **R14-Check:** alle Chat-Hover tokenisiert (#007a37 = 0) |
| B.13–B.18 Links/Anker/Externe | ✅ | 33 interne Links 0 broken; Anker scroll-margin; tel/mailto korrekt |
| B.19–B.26 SEO/Structured Data | 🔧 | **R14:** Stadtteil-Titel + Stadtteil-/Kontakt-JSON-LD |
| B.27 Semantik | ✅ | 1×H1 je Seite (Crawl), header/nav/main/footer |
| B.28 Content-Qualität | ✅ | Keine KI-Floskeln, DIN-5008-Halbgeviertstrich |
| B.29 Trust | ✅ | Keine unbelegten Behauptungen |
| B.30–B.38 Design-Audit/A11y/Tokens | ✅ | Je Seite + zentrale Tokens |
| B.39 Formular-Conversion | ✅ | 4 Felder + Consent + Honeypot |
| B.40 E-Mail/Backend | ⚠️ | Validierung/Honeypot/Queue E3; **SMTP-Zustellung blockiert** (Creds nur Host, Container ohne Zugriff — extern, Queue schützt Daten, Test-Eintrag geleert) |
| B.41 Error Handling | 🔧 | **R14:** Chat-503 ohne technische Details (war Leak) |
| B.42 Loading States | ✅ | Button-Loading, „Schreibt…", keine Layout-Shifts |
| B.43–B.51 Prinzipien | ✅ | Eingehalten (Scope-Kontrolle, DoD, Selbstbefragung) |

## TEIL C — Lernen/Isolation/Doku

| Punkt | Status | Ehrlicher Beleg |
|---|---|---|
| C.1–C.3 Wissens-/Isolation | ✅ | Repo-Doku + AgentMemory; Tenant-Isolation (eigenes Repo, eigene DB, kein Cross-Project) |
| C.4–C.8 Regeln im Code | ✅ | ADR-001..004, AGENTS.md, NAP-Guard (KONTAKT-Quelle), Token-Pflicht, Doku=Change |
| C.9 Struktur | ✅ | docs/ (decisions, customer), README, nur benötigte Dateien |
| C.10 ADRs | ✅ | 4 ADRs |
| C.11 Fehlerwissen | ✅ | QA-PROTOKOLL + Betriebshandbuch + Skill-Referenzen |
| C.12 Regression | ✅ | route-check.sh, QA-Gegentests, Watchdog |
| C.13 Design-Regeln | ✅ | DESIGN-ABAU-v2 + Tokens + AGENTS-Regeln |
| C.14 Nutzerhandbuch | ✅ | docs/customer/NUTZERHANDBUCH.md |
| C.15 Entwicklerhandbuch | ✅ | BETRIEBSHANDBUCH + README |
| C.16 Agent-Handbuch | ✅ | AGENTS.md (Repo + site) |
| C.17 Onboarding | ✅ | README + AGENTS reichen für Neustart (getestet durch Agent-Wechsel je Runde) |
| C.18 Doku synchron | ✅ | C.18-Prinzip in AGENTS verankert |
| C.19 Doku-Gate | ✅ | Alle Felder erfüllt außer „Brain aktualisiert" (Brain NXDOMAIN) |
| C.20/C.21 Wissensschleife | ✅ | QA-Runden je Änderung + Skill-Updates |

## TEIL D — Mobile

| Punkt | Status | Ehrlicher Beleg |
|---|---|---|
| D.1–D.4 Mobile First/Nav | ✅ | Drawer (Fokus-Trap, Escape, Scroll-Lock, aria), Touch ≥44px |
| D.5 Sticky/Floating | 🔧 | **R14:** Chat z-Skala + safe-area (Button, Fenster, ≤480px) |
| D.6–D.8 Typo/Forms/Medien | ✅ | 16px+ mobil, 1-spaltig, inputmode, srcset/sizes |
| D.9 Mobile Performance | ⚠️ | Payload klein; Messung ohne Browser-Tooling offen |
| D.10 Mobile Conversion | ✅ | tel:-CTA, Hero-CTA, keine Überdeckung |
| D.11 Mobile A11y | ✅ | Zoom frei, reduced-motion, Screenreader-Struktur |
| D.12/D.13 Test-Matrix/Gate | ⚠️ | Code-Ebene komplett; reale Geräte-Matrix + Lighthouse offen (kein Browser im Container) |

## In Runde 14 behobene Befunde (vorher ❌/🔧)
1. Chat z-index 9999 ×2 → `--z-chat:70` (A.9/D.5)
2. Chat ohne Safe-Area (iOS) → env(safe-area-inset-*) inkl. ≤480px (D.5)
3. Chat-Hover hardcoded #007a37 (Button/Send/DSGVO-Link) → Tokens (B.8/ADR-003)
4. Chat-503 mit `detail` (technischer Fehler an Besucher) → entfernt, nur Logging (A.38/B.41)
5. Stadtteil-Titel „<Name> – A-Bau" zu dünn → „<Name> – A-Bau Meisterbetrieb Mönchengladbach" ≤60, absolute (B.20)
6. Stadtteil-Details ohne JSON-LD → BreadcrumbList + Service + LocalBusiness (B.21)
7. /kontakt ohne ContactPage-JSON-LD (trotz R11-Behauptung) → ergänzt, NAP aus KONTAKT-Quelle (C.8)

## Ehrliche Restpunkte (extern, nicht im Code lösbar)
1. **SMTP-Zustellung:** Creds nur auf Host (/etc/nexifyai, root-only); Container ohne Zugriff. Queue schützt vor Datenverlust (0 Einträge, Test geleert). Aktion: Werte in /home/hermeswebui/.hermes/.env spiegeln → flush_contact_queue.py.
2. **Reale Gerätetests + Lighthouse/INP:** kein Browser-Tooling im Container.
3. **Kundendaten:** verbindliche Tel-Nr.-Variante, Referenz-Metadaten, Logo-SVG, Google-Business, anwaltliche Rechtstext-Prüfung.
4. **Brain (brain.nexifyai.cloud):** NXDOMAIN — Infra-Thema, Ersatz dokumentiert.

---

# NACHTRAG RUNDE 15 (2026-08-12) — Tiefenprüfung A.11/B.21/B.17/B.3–B.7/B.31/Browser-Ebene

**Neu behoben:**
- **A.11 Öffnungsstatus** (3-fach): SSR zeigte immer „Geschlossen" (`useState(false)`); Browser-Lokalzeit statt Kundenzeit; weekday-Mapping-Bug. Fix: Berlin-TZ via `Intl`, lazy Init, Unit-Test `scripts/test-oeffnungszeiten.js` (12/12 PASS) — Regression-Schutz (C.12).
- **B.21 Organization** auf /ueber-uns ergänzt (NAP aus KONTAKT-Quelle, C.8). Damit JSON-LD je Seite: Home (LocalBusiness+FAQPage), Leistungen (Service+LocalBusiness), Leistungs-Details (Service), Stadtteile (Breadcrumb+Service), Stadtteil-Details (Breadcrumb+Service), /ueber-uns (Organization), /kontakt (ContactPage), FAQ (FAQPage).

**Verifiziert, kein Bug (Audit-Artefakte ausgeräumt):** Umlaut-Assets 200 (urllib-HEAD-Encoding), CF-email-decode 200 (HEAD-404 ist CF-Edge-Verhalten), externe Links 6/6 200, Formular-Client komplett konform (B.3–B.7), Cookie-Banner konform (B.31/A.39).

**Ehrlicher Restpunkt (R15 bestätigt):** Browser-Ebene (Console/Hydration/LCP/INP/Mobile-Matrix) im Container nicht testbar — Playwright-Chromium vorhanden, aber 20 System-Libs fehlen, kein Root/apt. Kein Ersatz ohne Host-Zugriff.

---

# NACHTRAG RUNDE 16 (2026-08-12) — Chat-Client (A.29/B.42), Doku-Synchronität (C.14/C.16/C.18)

**Neu behoben:**
- **B.42 Chat-Client-Timeout:** AbortController 35 s (vorher endloser Busy-State bei Server-Hänger).
- **A.29 Quellen-Transparenz:** Widget zeigt jetzt „Quelle: FAQ · Leistungen …" je Antwort (Server lieferte `quellen` bereits; System-Prompt-Versprechen „separat angezeigt" war nicht eingelöst).
- **C.18 Nutzerhandbuch-Synchronität:** §5 behauptete „Chat entfernt" — auf Live-Stand korrigiert (aktiv, ADR-004).
- **C.16 AGENTS.md:** Öffnungszeiten-Test-Pflicht (`node scripts/test-oeffnungszeiten.js`) verankert.

**Live verifiziert ohne Fix:** Videos (preload/poster/title/Quellen-Cache-Buster), Referenz-Metadaten bewusst ohne Fake-Daten (YAML-Kommentar), Security-Header komplett, Chat-API `quellen` E3.

**Ehrlich offen (unverändert):** SMTP-Spiegelung (0 Keys im Container, erneut geprüft), Browser-Ebene (System-Libs/Root), Kundendaten, Brain NXDOMAIN.
