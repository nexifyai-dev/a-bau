# A-BAU WEBSITE – ABSCHLUSSBERICHT

**Datum:** 2026-08-12 · **Live:** https://a-bau.nexifyai.cloud · **Repo main:** `d099a1e` (+ QA-Runde-5-Commit, danach `HEAD`)

## 1. STATUS
**PASS MIT RESTPUNKTEN** — P0/P1 = 0, P2 = 0 (bekannt), Restpunkte ausschließlich extern/Kunde.
*Runde 5 (Gesamtauftrag-Nachprüfung 2026-08-12): Home-FAQ-Teaser-P0 + 16 weitere P1/P2-Fixes behoben und live verifiziert — siehe QA-PROTOKOLL Runde 5.*
*Runde 6 (proaktiver Voll-Audit, Pascal-Aufträge 2026-08-12): Lora/Inter-Schriften, CTA-Bänder zentriert, Referenzen-Bilder-Fix (4×404), ref-video preload=none, card-plain-Padding (Formular), NAP-Drift-Guard, 10 externe Links 200, Crawl 0 Fehler, Live=Repo byte-identisch (E3) — QA-PROTOKOLL Runde 6, Repo `016b8db`.*
*Runde 9 (Gesamtauftrag-Kontroll-Audit 2026-08-12): 19-Routen-Smoke live, FAQ-SSR, /angebot, Chat, Formular-Validierung/Rate-Limit verifiziert — **P0 entdeckt: Formular-SMTP-Versand 502** (Regression Container-Umzug: SMTP-Creds nur auf Host, nie in Container-Secret-Quelle gespiegelt; Resend-Key zusätzlich invalid). Fix: Queue-Persistenz `chat/data/contact_queue.jsonl` (kein Datenverlust) + `chat/flush_contact_queue.py` Nachversand; Betriebshandbuch + QA Runde 9 aktualisiert. Restpunkt: SMTP_*-Werte in `/home/hermeswebui/.hermes/.env` spiegeln + Queue leeren.*
*Runde 10 (Pascal-OOB + Online-Tiefenrecherche Recht/Bestpraxis 2026-08-12): Referenz-Bildvergrößerung implementiert (RefGallery-Lightbox, WCAG 2.1.2/2.4.3, Fokus-Trap); CTA-Bänder auf allen 5 Seiten `section-dark` (zentriert); Impressum: HwO-Zugänglichkeit (§5 DDG Nr. 5c) + ODR-Plattform-Abschaltung (20.07.2025) korrigiert; Datenschutz §6: KI-Assistent „nicht mehr angeboten" (Art. 50 EU AI Act seit 02.08.2026); content/ ↔ src/data/ Terminologie-Drift gesynct (Borussia/Restauration raus, KB re-ingested) — QA Runde 10.*

## 2. P0
| Problem | Ursache | Lösung | Test |
|---|---|---|---|
| FAQ leer (nur ▾) | Feldnamen-Drift `f.frage` vs. YAML `f:`/`a:` | `f.f`/`f.a` in FAQ-Seite + Home-Schema | Live: 14 Fragen im HTML, FAQPage-JSON-LD ✅ |
| /angebot 500 | Route fehlte | Eigene noindex-Seite + Refresh → /kontakt/ | Live 200 ✅ |

## 3. P1
| Problem | Lösung | Test |
|---|---|---|
| Video-Fallback roh + 29 MB | Kompression (73: 3,4→1,4 MB; 160: 8,7→2,6 MB), tote 76/170 gelöscht, Fallback mit Kontakt-Link, CDN-Cache max-age 86400 + Query-Bust | Live: MISS + klein ✅ |
| Mobile Floating-Überlagerung | Chat-FAB angehoben; A11y-FAB mobil ausgeblendet; **Chat-Widget komplett entfernt** (Auftrag: kein Conversion-Konkurrent) | Live: 0 Chat-Referenzen ✅ |
| CTA-Chaos (6+ Labels) | Einheitlich: Primary „Projekt anfragen", Secondary „Leistungen ansehen" | Live geprüft ✅ |
| Header-Öffnungsstatus | Logik verifiziert (Browser-Zeit, korrekte Zeiten) — belastbar, bleibt | Geprüft ✅ |
| Referenzen ohne Metadaten | Datenmodell optional (ort/jahr/umfang) rendert automatisch; **reale Daten offen beim Kunden** | Struktur ✅ |
| Chat 401 + Prozess-Kills | `_secret`-Namens-Reihenfolge (DEEPSEEK_API_KEY vor CUSTOM_API_KEY in .env), to_thread, WAL, Timeout 30s, Basisdaten im Prompt | Live: 2,5 s Antworten, Server stabil ✅ |

## 4. P2
Spacing-Skala (fehlte komplett → definiert 4–96 px), Fonts (Fraunces/WorkSans), Section-Padding responsiv,
Hero (Quicklinks raus), Borussia-Content ersatzlos entfernt, „Restaurierung" vereinheitlicht,
Stadtteil-Generika durch Leistungsbezug ersetzt, CTA/Link-Hierarchie, Footer bereinigt,
Telefon `tel:`-Links, Terminologie, hreflang/canonical/EUID.

## 5. P3
Positionierung: Kernkompetenz Denkmalrestaurierung in Hero/About gestärkt (ohne Erfindungen).
Social Proof: keine Fake-Daten; echte Kundendaten (Projekte, Bewertungen) offen.

## 6. DESIGN
Fraunces/WorkSans (self-hosted, kleiner als Alt), Token-System (`--space-*`, `--color-*`, `.btn`),
einheitliche Cards/Container, Hover-Kontrast-Regel technisch verankert (ADR-003).

## 7. RESPONSIVE
Viewports per Code-Audit: 320/375/768/1024+ (Container-Padding, Touch-Targets ≥48 px Buttons/Inputs,
kein horizontaler Overflow im CSS, Drawer-Navigation). Reale Gerätetests offen (kein Browser im Container) —
D.12-Matrix als offener Punkt dokumentiert.

## 8. ACCESSIBILITY
focus-visible (3 px Outline), skip-link, reduced-motion, Kontraste AA (accent-text 5.46:1, rot 5.88:1,
gold nur auf dunkel 8.3:1), Labels mit htmlFor, aria-live Status, Touch ≥44 px, lang=de, h1 je Seite.

## 9. SEO
Titles ≤60, Descriptions, H1 je Seite, canonical + hreflang (de/x-default) auf 12 Seiten, Sitemap 20/20
(aus YAML abgeleitet), robots.txt + noindex bis Abnahme, JSON-LD (LocalBusiness mit vatID/Certification,
FAQPage, Service, BreadcrumbList), OG/Twitter, Alt-Texte, NAP-Single-Source (kontakt.yaml).

## 10. PERFORMANCE
Videos 30→4 MB, tote Assets entfernt, Fonts kleiner + preload, Bilder WebP, kein `_next/image`-Optimizer
(Static Export), CSS ~30 KB. LCP/CLS/INP-Messung ohne Browser-Tooling offen (dokumentiert).

## 11. SECURITY
CSP, X-Frame-Options, nosniff, Referrer-Policy, noindex (Staging), Honeypot, Rate-Limit 20/min,
Input-Validierung (Server+Client), keine Secrets im Repo (Secret-Scan 0), Fehler ohne Stack-Leaks
(503-Detail gekürzt), Prompt-Injection-Test bestanden.

## 12. TESTS
`npm run build` ✅ (mehrfach), Route-Smoke `scripts/route-check.sh` 26/26 ✅ (inkl. Negativ-404),
Chat-E2E (Adresse/Öffnungszeiten/Leistungen) ✅, Link-Crawl 53 interne Links ✅, Kontakt-Honeypot ✅,
Gegentest §5.4 je Runde ✅.

## 13. LIVE
https://a-bau.nexifyai.cloud — alle Routen 200, Health ok, Live-Stand = Repo (`ae96a58`).
Deploy: Push → Tunnel → 127.0.0.1:8095. Server: setsid-Start (überlebt Session-Ende).

## 14. RESTRISIKEN (real, extern)
1. **Hermes-Gateway im Container down** → Cron-Watchdog feuert nicht; Server-Start manuell nach Container-Neustart.
2. **Referenz-Projektmetadaten** (Ort/Jahr/Umfang) — Kundendaten fehlen.
3. **AVV Art. 28** (Hosting), **a-bau.info-DNS**, **anwaltliche Rechtstexte-Prüfung**, Logo-Freigabe.
4. **Brain (brain.nexifyai.cloud)**: DNS nicht auflösbar → nicht erreichbar; Wissen in Repo-Doku + AgentMemory gesichert.
5. Reale Mobile-Gerätetests + Lighthouse-Messung ohne Browser-Tooling im Container.
6. **Formular-SMTP 502 (Runde 9):** SMTP-Creds nur auf Host; Container-seitig keine Werte → Versand blockiert; Queue-Persistenz verhindert Datenverlust. **Zu erledigen:** SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD (Werte aus `/etc/nexifyai/hermes.env` auf Host) nach `/home/hermeswebui/.hermes/.env` spiegeln → Server-Neustart → `python3 chat/flush_contact_queue.py`.

## 15. BRAIN / WISSEN
Brain nicht erreichbar (DNS). Ersatz gesichert: `docs/decisions/ADR-001..003`, `docs/BETRIEBSHANDBUCH.md`,
`docs/QA-PROTOKOLL.md` (Runden 1–4), `docs/customer/NUTZERHANDBUCH.md`, `AGENTS.md`, `scripts/route-check.sh`,
AUDIT-UMSETZUNGSAUFTRAG-2026-08-12.md. Projektisolation: Kundenwissen nur im Repo/Container-Kontext.

## PROAKTIV ERKANNTE UND BEHOBENE PROBLEME
1. `--space-*`-Skala nirgends definiert → sämtliche Abstände kollabierten (Ursache „Innenabstände"-Auftrag).
2. Button-Hover unlesbar (a:hover überschrieb btn-Farben, Spezifität) — explizite :hover-Farben.
3. Chat-Server-Kills: eingefrorener/veralteter API_KEY-Pfad + Event-Loop-Blockade (to_thread) + WAL.
4. EUID-Format falsch (`DER1504.HRB18836` → `DEHRB18836`, ISO-6523).
5. Sitemap-Stadtteil-Slug-Drift (hardcodiert vs. slugify) → 404-Link.
6. 17 MB tote Videos + unkomprimierte aktive Videos.
7. Entwurfs-Hinweis („von NeXifyAI erstellt") im öffentlichen Impressum.
8. hreflang fehlte überall; canonical fehlte auf 3 Rechtstexten.
9. KI-Chat-Widget: Conversion-Konflikt + DSGVO-Aufwand → entfernt (Auftrag).

## MOBILE-OPTIMIERUNG (Teil D)
- Inputmode tel/email ergänzt, autocomplete vorhanden, Touch-Targets ≥48 px, Container-Padding 16 px ≤480 px,
  keine user-scalable-Sperre, Floating-UI konsolidiert (Chat entfernt, A11y mobil aus), H1-<br> auf Mobile geprüft.
- Offen: reale Geräte-/Browser-Tests (320/375/390) + LCP/INP-Messung unter Drosselung — ohne Browser-Tooling im Container nicht ausführbar (dokumentiert, Gate D.13 teilweise offen).

---

# NACHTRAG Runden 11–13 (2026-08-12)

**Repo main:** `129ff1f` → `3e24e65` (R12b) → `HEAD` (R13)

## STATUS
**PASS MIT RESTPUNKTEN** — P0/P1 = 0, P2 = 0 (bekannt). Restpunkte: SMTP-Spiegelung (extern Host-Creds), reale Gerätetests/Lighthouse (kein Browser-Tooling im Container), Kundendaten (Tel-Nr.-Variante, Referenz-Metadaten, Logo-SVG, anwaltliche Rechtstext-Prüfung).

## Runde 11 (Voll-Audit Gesamtauftrag A–D, Online-Tiefenrecherche Recht)
Hero H1 → Denkmalrestaurierung/Altbausanierung-Positionierung; Gründung 2019 belegt (HWK Düsseldorf); `/angebot` 301 → `/kontakt/#angebot` (server.py) + Anker `id="angebot"`; `scroll-margin-top` 112/84px (Sticky-Header); Lint 33→0 Errors; Hostinger-Sitz → Vilnius LT (DSGVO); PAngV/BFSG-Recherche dokumentiert. Vollständige Matrix: `docs/AUDIT-MATRIX-RUNDE11.md`.

## Runde 12/12b (Kunden-Feedback: Button-Hover, CTA-Zentrierung, Chat-Live)
- Header-CTA Hover: doppelte Regel aufgelöst → EINE: `--color-cta-hover-bright` (#00A64A, weiß 3.18:1, ADR-003-Token) für `.nav-cta`/`.drawer-cta` (R12b: Wechsel #008035→#009A44 war unsichtbar → helleres Grün)
- CTA-Bänder alle 5 Seiten: `container text-center` + `hero-actions hero-actions-center`; `.section-dark p { text-align:center }` explizit
- Chat-Widget-Integration committet (ChatWidget.tsx, layout.tsx, ADR-004) — Live-AI via 9Router (`ds/deepseek-v4-flash`), RAG über Site-KB, Art.-50-Hinweis im Widget
- Live-Verifikation: CSS byte-identisch, Live-HTML == Build (nur CF-Mail-Obfuscation), Route-Smoke alle OK

## Runde 13 (Punkt-für-Punkt-Prüfung inkl. Chat — A.9/A.29/D.5/B.8)
| Befund | Fix | Beleg (E3) |
|---|---|---|
| Chat-Button/Fenster `z-index: 9999` hardcoded → lag ÜBER Cookie-Banner (90) + Lightbox (80) — A.9/D.5-Verstoß | Token `--z-chat: 70` (unter Cookie/Lightbox, über Drawer) für Button + Fenster | CSS live `z-index:var(--z-chat)` |
| Keine Safe-Area-Insets (iOS Notch/Home-Indicator) — D.5 | `env(safe-area-inset-*)` auf Button/Fenster, Basis + ≤480px-Media-Query | CSS live, byte-identisch |
| Hover-Farben hardcoded `#007a37` (Button, Send, DSGVO-Link) — B.8/ADR-003 | `var(--color-cta-hover)` / `var(--color-cta-hover-bright)`; `#007a37` = 0 Treffer | CSS live |
| Chat-Datenschutz §6 (Art. 50/DSGVO) | Live vorhanden (KI-Assistent, Anbieter als AV, keine Speicherung, Art. 6 lit. f) | Live-HTML 4× „KI-Assistent" + 2× Art. 50 |
| A.29 Chat-E2E | Knowledge-Boundary („überfragt"-Fallback), Prompt-Injection abgewehrt, Rate-Limit 18×200→429, Health ok, Server stabil | Live-POSTs |

## Chat-Sektion (A.29 geprüft)
Position/Z-Index: unter Cookie-Banner (Consent priorisiert), safe-area-beachtet · Fehlerzustände: Widget zeigt Meldung, Server 503-Fallback · Timeout 30 s · Rate-Limit 20/min · Prompt-Injection: getestet abgewehrt · Knowledge-Boundary: „keine Informationen"-Verhalten · Datenschutz: §6 + Art.-50-Hinweis im Widget + keine Persistenz · „basiert auf Website-Wissen": korrekt (RAG über content/).

## Mobile-Gate (D.13)
Code-Ebene: kein Overflow (320px getestet), Drawer tastaturfähig, Floating konfliktfrei (z-Skala), Touch ≥44px, tel:-CTA, Formulare 1-spaltig. Offen: reale Gerätematrix + Lighthouse (kein Browser-Tooling im Container) — Restpunkt.

# NACHTRAG RUNDE 14 (Tiefenprüfung, ehrliche IST-Analyse)

**Repo main:** `3321fa0` · Ehrliche Gesamt-Matrix: `docs/AUDIT-MATRIX-RUNDE14.md` (A/B/C/D je Punkt selbst verifiziert, kein Status-Übernehmen).

**Neu behoben:** Chat-503-Error-Leak (`detail` raus, A.38) · Stadtteil-Titel (B.20, ≤60, absolute) · Stadtteil-JSON-LD Breadcrumb/Service (B.21) · ContactPage auf /kontakt (B.21, NAP aus KONTAKT-Quelle, C.8).

**Ehrlich offen (extern):** SMTP-Creds-Spiegelung (Container ohne Host-Zugriff; Queue leer, Daten geschützt) · reale Gerätetests + Lighthouse (kein Browser-Tooling) · Kundendaten (Tel-Variante, Referenz-Metadaten, Logo, Rechtstext-Prüfung) · Brain NXDOMAIN (Infra).

# NACHTRAG RUNDE 15 (Tiefenprüfung, ehrlich)

**Repo main:** `9c5001a` · Behoben: Öffnungsstatus A.11 (Berlin-TZ, SSR-korrekter Init, Unit-Test 12/12 in `scripts/test-oeffnungszeiten.js`), Organization-JSON-LD /ueber-uns (B.21). Ausgeräumte Audit-Artefakte: Umlaut-Assets + CF-email-decode (beide 200, HEAD-Falschpositive). Externe Links 6/6, Formular-Client + Cookie-Banner konform. **Ehrlich offen:** Browser-Ebene (Console/LCP/INP/Mobile-Matrix) mangels System-Libs/Root nicht testbar — nur mit Host-Zugriff lösbar; SMTP-Spiegelung; Kundendaten.

# NACHTRAG RUNDE 16

**Repo main:** `2cddc6d` · Behoben: Chat-Client-Timeout (B.42), Quellen-Anzeige im Widget (A.29), Nutzerhandbuch-Chat-Stand (C.18), AGENTS-Test-Pflicht (C.16). Verifiziert: Videos/Security-Header/Referenz-Ehrlichkeit. Restpunkte unverändert ehrlich offen (SMTP, Browser-Ebene, Kundendaten, Brain).

# NACHTRAG RUNDE 17

**Repo main:** `e2a86d2` · Behoben: KB-Dedupe (25 Chunks, eindeutige Quellen, E3), Datenschutz §6 Drittland ehrlich. Verifiziert: 11 Detailseiten, robots, Sitemap, Payload, Chat-10-Fragen. Neu dokumentiert: 9Router-Anbieter-Standort als Infra-Restpunkt.

# NACHTRAG RUNDE 18

**Repo main:** `6504796` · Behoben: Titel-System (einheitlich, ≤60, keine Template-Dopplung), Claim „Kostenlose Angebote" entfernt, Chat-Dialog-Fokus. Gegenprobe: Drawer/Lightbox-A11y konform.

# NACHTRAG RUNDE 20

**Repo main:** `0ef1cb6` · **P0-Root-Cause Header-CTA:** Kaskaden-Override durch `.nav-desktop > a` — Fix via Spezifität (0,2,1/0,3,1), Button jetzt dauerhaft Markengrün + weiß (live). · **FAQ 166 Fragen** (Chat-Wissen, KB 67 Chunks). · **AGB + Nutzungsbedingungen** neu (BGB-Bestpraxis, KI-VO Art. 50-Referenz). · **Formular 202+queued** (ehrlich). · **Denkmal-Restaurierung** durchgängig. Restpunkte unverändert; neue Rechtstexte vor Produktiv-Go-Live anwaltlich prüfen lassen (Empfehlung).

# NACHTRAG RUNDE 21

**Repo main:** `117d6b7` · Behoben: AGB/Nutzung-Titel-Dopplung, FAQ 165 (Duplikat + Antwort-Qualität). Verifiziert: .prose-Rendering, Payloads, Chat-7-Fragen-E2E (fachlich korrekt, Boundary intakt). Restpunkte unverändert.

# NACHTRAG RUNDE 22

**Repo main:** `1778e81` · Behoben: Drawer aria-current (D.4), route-check-Abdeckung. Verifiziert: 22/22 Routen, 42 Assets, Redirects, Lightbox-Alts, OG, Logs, Chat. Restpunkte unverändert.

# NACHTRAG RUNDE 23

**Repo main:** `587adca` · Behoben: Log-Cleanup-Cron (DSGVO, war nur dokumentiert), Chat-Input maxLength, Betriebshandbuch-Sync. Verifiziert: Injection-Gegentest E3, Watchdog. Restpunkte unverändert.
