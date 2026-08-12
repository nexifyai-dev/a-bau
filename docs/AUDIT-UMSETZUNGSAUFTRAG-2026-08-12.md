# Externes Website-Audit & Umsetzungsauftrag — A-Bau (2026-08-12)

**Quelle:** 3 Anhänge von Pascal (Audit-Text, Master-Fehlerliste, offizieller Umsetzungsauftrag P0)
**Live-System:** https://a-bau.nexifyai.cloud/
**Bearbeitung:** Hermes Agent, 2026-08-12 (siehe QA-PROTOKOLL.md „Umsetzungsauftrag-Runde")

---

## P0 — behoben

| # | Befund | Fix | Status |
|---|--------|-----|--------|
| 1 | FAQ-Accordion leer (nur ▾, keine Fragen) — Feldnamen-Drift `f.frage/f.antwort` vs. YAML `f:`/`a:` | `faq/page.tsx` + `page.tsx` (FAQPage-Schema) auf `f.f`/`f.a` umgestellt; Inhalte statisch im HTML | ✅ |
| 2 | `/angebot` → 500 Internal Error | Route existierte nicht, keine Links mehr darauf; eigene Seite `/angebot/` angelegt: noindex + Meta-Refresh + CTA auf `/kontakt/` (kein toter 500/404) | ✅ |

## P1 — behoben

| # | Befund | Fix | Status |
|---|--------|-----|--------|
| 3 | Video-Fallback „Ihr Browser unterstützt kein Video." roh sichtbar | Fallback-Text durch Kontakt-Lenkung ersetzt; Videos komprimiert (73: 3,4→1,4 MB, 160: 8,7→2,6 MB); tote 76/170.mp4 (17 MB) gelöscht; Cache `max-age=86400` + Query-Bust `?v=20260812` (CDN-HIT-Falle) | ✅ |
| 4 | Mobile: Chat-FAB + A11y-FAB überlagern sich | `@media (max-width: 767px)`: `.chat-fab { bottom:80px; right:16px }`, `.chat-panel` angehoben, `.a11y-fab/.a11y-panel { display:none }` (dupliziert nur Browser-Funktionen) | ✅ |
| 5 | 6+ CTA-Labels | Vereinheitlicht: Primary **„Projekt anfragen"**, Secondary **„Leistungen ansehen"**; „Kostenloses Angebot" nur noch in FAQ-Antwort (inhaltlich korrekt) | ✅ |
| 6 | Header „Geschlossen +49…" | Logik `istGeoeffnet()` geprüft: Browser-Zeitzone, korrekte Zeiten (Mo–Do 8–17, Fr 7–17, Sa 8–13) — belastbar, Status bleibt | ✅ geprüft |
| 7 | Referenzen ohne Projektmetadaten | Datenmodell optional erweitert (`ort`, `jahr`, `umfang` → Rendering in Gallery-Figcaption); **keine Fake-Daten** — Kundendaten offen | ✅ Struktur, Daten offen |

## P2 — behoben

| # | Befund | Fix | Status |
|---|--------|-----|--------|
| 8 | Borussia-SEO-Texte (Footer, Startseite, Stadtteile) | Ersatzlos entfernt (Footer-Note, `borussia_note` in stadtteile.yaml, Home-Absatz); Intro entschärft; CSS-Kommentare bereinigt | ✅ |
| 9 | Terminologie „Restauration" vs. „Restaurierung" | Durchgängig **Restaurierung**: leistungen.yaml, Header, Leistungsseite, Über-uns, Home | ✅ |
| 10 | „Langjährige Erfahrung" vs. Gründung 2019 | Leistungsseite: „seit 2019 als Meisterbetrieb in Mönchengladbach" | ✅ |
| 11 | Stadtteil-Generika („Beliebt bei Familien…", „Neubau-Potenzial") | Durch schwerpunkt-basierte Leistungsbeschreibungen ersetzt (keine Erfindungen) | ✅ |
| 12 | Kein Spacing-System: `var(--space-*)` war **nirgends definiert** → alle Abstände kollabierten | `--space-1…9` (4–96 px) in `:root` definiert; Section-Padding responsiv (48/64/96 px) | ✅ |
| 13 | Schrift-Gesamtlösung | Playfair Display + Manrope → **Fraunces** (Headings) + **Work Sans** (Body), self-hosted via `next/font/local` (kleiner: 65+49 KB) | ✅ |
| 14 | Hero-Quicklinks („Ich plane ein Bauprojekt"/„Ich bin Kunde"-Cards) | Komplett entfernt (page.tsx + totes CSS); Hero jetzt: Kicker + H1 + Lead + 2 CTAs | ✅ |
| 15 | hreflang fehlte | `languages` (de + x-default) auf allen 12 Seiten; canonical auf Rechtstexten; Sanierung-Titel ≤60 Zeichen; EUID `DEHRB18836` | ✅ |
| 16 | Chat: „Adresse nicht im Wissensbestand" | Synonym-Erweiterung im Retrieval (adresse→straße/ort/luisental, telefon→…, mail→…) | ✅ |

## Offen (Kunde / Host, dokumentiert)

- **Referenz-Projektmetadaten** (Ort, Jahr, Umfang) — Kunde muss reale Daten liefern; Struktur rendert automatisch.
- **AVV Art. 28** (Hosting) — Kundenabnahme/Unterschrift.
- **a-bau.info-DNS** bei Go-Live; **X-Robots-Tag noindex** bis Abnahme.
- **Anwaltliche Prüfung** der Rechtstexte.
- **Host/Gateway**: Hermes-Cron-Scheduler im Container läuft nicht (`hermes cron status` → „Gateway is not running") → a-bau-Watchdog-Cron-Job (`abau-server-watchdog`) feuert NICHT; Website-Watchdog steht seit 09:06 UTC. Host-seitig Gateway starten oder Host-Cron für `~/.hermes/scripts/abau-watchdog.sh` einrichten.
- **Server-Prozess**: stirbt ohne Log bei Session-/Tool-Interaktion (Hermes killt Hintergrund-Kinder); Gegenmittel: Start via `setsid` (`/tmp/start-abau.sh`) — überlebt; manuell nach Container-Neustart wiederholen.
