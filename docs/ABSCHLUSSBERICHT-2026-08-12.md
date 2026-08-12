# A-BAU WEBSITE – ABSCHLUSSBERICHT

**Datum:** 2026-08-12 · **Live:** https://a-bau.nexifyai.cloud · **Repo main:** `ae96a58`

## 1. STATUS
**PASS MIT RESTPUNKTEN** — P0/P1 = 0, P2 = 0 (bekannt), Restpunkte ausschließlich extern/Kunde.

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
