# A-BAU WEBSITE – ABSCHLUSSBERICHT (Final, Runde 39 / 2026-08-12)

**Live:** https://a-bau.nexifyai.cloud · **Repo main:** 121 Commits (Runden 1–39) · **Kunde:** A-Bau Meisterbetrieb GmbH

## 1. STATUS
**PASS MIT RESTPUNKTEN** — alle Auftrags-Gates (A.42/1–7, D.13, C.19) erfüllt soweit im Container prüfbar; Restpunkte ausschließlich extern (Host-Zugriff, Google-Key, Kundendaten). Keine bekannten P0/P1-Fehler.

## 2. Gates (A.42 + D.13 + C.19)
| Gate | Ergebnis | Beleg |
|---|---|---|
| 1 Funktional | ✅ | /angebot 301→/kontakt/#angebot; FAQ 165 SSR; Formulare (202+Queue); Navigation; keine 500er; Route-Smoke 22 Routen + Negativ-404 |
| 2 UI | ✅ | Token-System, konsistente Cards/Buttons/Typo, keine Überlappungen (z-Skala), keine Browser-Fallbacks |
| 3 Mobile | ✅ | 320–768 Code-Audit, Drawer (Fokus-Trap/Escape/aria-current), Floating konfliktfrei (--z-chat 70, safe-area), Touch ≥44px |
| 4 SEO | ✅ | Titles ≤60 je Seite, Descriptions, H1, Canonical+hreflang, Sitemap 22, robots, JSON-LD (LocalBusiness/Organization/Service/FAQPage/Breadcrumb/ContactPage), kein Keyword-Stuffing |
| 5 Accessibility | ✅ | W3C 0 Fehler (25/25 + 404), Kontraste AA, focus-visible, aria-live-Chat, skip-link, reduced-motion, Tastatur (Drawer/Lightbox/Dropdown) |
| 6 Performance | ✅/⚠️ | TTFB 37–413 ms, Assets immutable-Cache, br/gzip, LCP-Bild 214 KB, Videos 480p preload=none; **echte CWV (LCP/CLS/INP) via PSI nur mit Google-Key** (key-lose API 429) |
| 7 Production | ✅ | Build ok, Live == Repo byte-identisch (nur CF-Mail-Obfuscation), no-store auf HTML, noindex bis Go-Live-Freigabe |
| D.13 Mobile-Gate | ✅/⚠️ | Code-Ebene komplett; reale Gerätematrix + Lighthouse offen (kein Browser-Tooling im Container, 20 System-Libs fehlen) |
| C.19 Doku-Gate | ✅/⚠️ | README, Betriebs-/Nutzer-/Agent-Handbuch, ADR 1–4, Design, Routing, SEO, A11y, Troubleshooting, Deployment — alles synchron; **Brain NXDOMAIN** (Ersatz: Repo-Doku + AgentMemory) |

## 3. P0/P1 (behoben, Auswahl)
- Header-CTA-Kaskaden-Root-Cause (`.nav-desktop > a` überschrieb `.nav-cta`; Spezifität 0,2,1/0,3,1 — Button jetzt dauerhaft Markengrün #009A44, Hover dezent #007A36) — R20
- Chat: 401-Saga (Key-Selektion), Event-Loop-Blocking (to_thread/WAL), Error-Leaks (detail-Felder), Markdown-Artefakte (DIN-5008-Klartext), kaltes „Hallo"-Fallback (deterministische Begrüßung), Client-Timeout 35 s, z-Skala/safe-area/aria-live, Quellen-Anzeige — R2–R36
- Formular: CRLF-Header-Injection (P0), 202+queued ehrlich, Queue-Nachversand, maxLength 500 — R19–R28
- FAQ: 14→165 Fragen (10 Kategorien, Sprunganker, KB 71 Chunks) — R20–R31
- SEO: Titel-System (Template-Dopplung, absolute ≤60), og:title je Seite, Stadtteil-JSON-LD, ContactPage, AGB/Nutzungsbedingungen, Sitemap 22 — R14–R35
- Security: CSP/nosniff/no-store/immutable-Cache, HSTS (CF), Injection-/Boundary-/Rate-Limit-E2E — R13–R38

## 4. P2/P3
Spacing-/Token-System, Typografie, Footer, Navigation, Terminologie (Denkmal-Restaurierung), Borussia-Content raus, Stadtteil-Content, Hero-Positionierung, Gründung belegt, W3C 0 Fehler, 25-Seiten-Scans.

## 5. DESIGN
Token-System (--color/--space/--z), Lora/Inter, einheitliche Cards/Container/Buttons, CTA-System (Primary „Projekt anfragen"), zentrierte CTA-Bänder, PWA-Icons (apple-touch-icon/192/512).

## 6. RESPONSIVE
Getestet 320/375/390/768/1024/1440 (Code + SSR-HTML); kein horizontaler Overflow; Formulare 1-spaltig; Drawer tastaturfähig.

## 7. ACCESSIBILITY
W3C 0 Fehler 25/25; WCAG 2.2 AA-Kontraste; focus-visible; Skip-Link; ARIA (Drawer, Lightbox, Chat aria-live, FAQ-Sprunganker); reduced-motion + reduced-transparency; Screenreader-Struktur (h1→h2-Hierarchie).

## 8. SEO
Titles/Descriptions je Seite, Canonical+hreflang, Sitemap 22/22, robots (CF-Managed AI-Signals + eigene), JSON-LD validiert (Vollparse 25/25), OG je Seite, Local-SEO-Stadtteile, kein Duplicate/Thin-Content.

## 9. PERFORMANCE
TTFB 37–413 ms (Container); br/gzip (Edge); immutable-Cache für hashed Assets; preload=none-Videos (480p); LCP-WebP 214 KB; no-store-HTML. **Offen: CWV via PSI-Key.**

## 10. SECURITY
CSP, nosniff, XFO, Referrer-/Permissions-Policy, HSTS, noindex (Staging); CRLF-Injection zu; Rate-Limit 20/min (E3: 18×200→429); Honeypot; Prompt-Injection abgewehrt; Secrets-Scan 0; Logs 7-Tage-Auto-Cleanup (Cron); keine Error-Leaks.

## 11. TESTS
5 Auto-Checks (Quality-Cron täglich 04:10): Route-Smoke, CHAT-CHECK (Fakten+Quellen+Fake-Preis-Boundary), CONTENT-SYNC, Öffnungszeiten (12 Fälle), Health — alle grün; W3C 25/25; Crawl 22 URLs/42 Assets; Chat-10-Fragen-Protokoll; 3 parallele Chats.

## 12. LIVE
a-bau.nexifyai.cloud: alle Routen 200/301, Live == Repo (E3), /health ok, Chat live (9Router ds/deepseek-v4-flash, Think high, KB 71 Chunks).

## 13. RESTRISIKEN (ehrlich, extern)
1. **SMTP-Spiegelung:** Creds nur auf Host — Formular-Mails in Queue (0 Einträge, 202+queued, flush-Skript bereit). Aktion: Werte in `/home/hermeswebui/.hermes/.env` spiegeln + `flush_contact_queue.py`.
2. **a-bau.info Go-Live:** Zone bei Cloudflare (brynne.ns.cloudflare.com, E3); **Tunnel-Route fehlt (2-min-Dashboard-Schritt: Zero Trust → Tunnels → Public Hostnames: www.a-bau.info + a-bau.info → 127.0.0.1:8095)**; danach SITE_URL (`src/lib/site.ts`) auf Produktions-URL + `X-Robots-Tag: noindex` entfernen. Anleitung: `docs/ABAU-INFO-TUNNEL-HOST-SCHRITT.md`.
3. **CWV-Messung:** PSI-API-Key (Google) für LCP/CLS/INP + Lighthouse; reale Gerätematrix (kein Browser-Tooling im Container — 20 System-Libs, kein Root).
4. **Kundendaten:** verbindliche Tel-Nr.-Variante, Referenz-Metadaten (Ort/Jahr), Logo-SVG, Google-Business, Social-Profile; anwaltliche Rechtstext-Endprüfung (Launch-Checkliste 2.1–2.5); Feiertags-Logik Öffnungsstatus; 9Router-Anbieter-Standort (Drittland-Garantie final).
5. **Brain NXDOMAIN** (Infra): Wissenssicherung läuft über Repo-Doku (ADR/QA/Matrix), AGENTS.md + Hermes-Skills (gepflegt bis R36).

## 14. BRAIN
brain.nexifyai.cloud nicht erreichbar (NXDOMAIN) — Ersatz dokumentiert: Repo (ADR-001..004, QA Runden 1–39, AUDIT-MATRIX-RUNDE14.md mit Nachträgen, BETRIEBSHANDBUCH, NUTZERHANDBUCH, AGENTS.md) + Hermes-Skill `embedded-ai-chat-server-ops` (bis R36 gepflegt).

## 15. PROAKTIV ERKANNTE UND BEHOBENE PROBLEME (B.50, Auswahl)
1. Header-CTA war im Browser NIE grün (Kaskaden-Override) — 8-Runden-Saga, Root-Cause R20.
2. Chat-KB-Doppel-Ingest (46 statt 25 Chunks, doppelte Quellen) — R17.
3. FAQ-JSON-LD 8 Fragen vs. 4 sichtbar (A.7) — R19.
4. Formular-502 mit `detail`-Leak + „fehlgeschlagen"-Lüge bei gesicherten Daten (202+queued) — R14/R20.
5. CRLF-Header-Injection im E-Mail-Versand + Nachversand — R19/R28.
6. Log-Aufbewahrung dokumentiert, aber nie automatisiert (DSGVO) — R23.
7. `/_next/static` mit no-store (Chunks bei jeder Navigation neu) — R30.
8. og:title global statt je Seite (B.25) — R35.
9. Datenschutz: „Rechenzentrum EU"- und SCC-Behauptungen unbelegt (Drittland ehrlich) — R17/R38.
10. Öffnungsstatus: SSR immer „Geschlossen", Browser-Lokalzeit, weekday-Mapping — R15 (12-Fälle-Test).
11. Titel-Template-Dopplung („…– A-Bau – A-Bau") — R18.
12. FAQ 165 ohne Struktur (Kategorien + Sprunganker) — R31/R32.
13. „Hallo" → kalter Fallback (Begrüßungs-Root-Cause im Code) — R36.

## Mobile-Optimierung (D.13)
Getestet: 320/375/390/768 (Code), kein Overflow, Drawer (Fokus/Trap/Escape/aria-current), Floating konfliktfrei (--z-chat 70, safe-area env), Touch ≥44px, Formulare 1-spaltig (inputmode/autocomplete), tel:-CTA, Videos preload=none, reduced-motion. **Offen:** reale Gerätematrix + Lighthouse (extern, s. o.).
