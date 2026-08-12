# A-Bau Agent-Regeln (projektspezifisch, ergänzt die Next.js-Regeln in site/AGENTS.md)

## Pflicht vor Änderungen
1. `docs/BETRIEBSHANDBUCH.md` + `docs/QA-PROTOKOLL.md` + `docs/decisions/*.md` lesen
   (bekannte Fallen: Chat-401-Key-Reihenfolge, setsid-Start, Video-Cache).
2. Datenquelle ist YAML (`site/src/data/*.yaml`) — NIE Unternehmensdaten hartcoden.
3. FAQ-Felder heißen `f`/`a` (nicht frage/antwort). Leistungs-Slugs: `l.slug || l.id`.
4. Stadtteil-Slugs werden aus `name` via slugify abgeleitet — sitemap liest YAML (keine Hardcodes).

## Pflicht nach Änderungen
1. `npm run build` (site/) — Fehler = nicht pushen.
2. Bei Content-Änderungen: `chat/ingest.py` neu ausführen + `chat/data/kb.db` committen.
3. Route-Smoke: `bash scripts/route-check.sh https://a-bau.nexifyai.cloud` (oder lokal 127.0.0.1:8095).
4. Chat-Änderungen: Server-Neustart `setsid /app/venv/bin/python3 chat/server.py` + Live-Test
   `curl -X POST https://a-bau.nexifyai.cloud/api/chat -d '{"message":"test"}'`.
5. **Öffnungszeiten-Logik (`site/src/lib/kontakt.ts`, A.11): NIE ohne Test ändern** —
   `node scripts/test-oeffnungszeiten.js` (12 Fälle, Berlin-Zeitzone) muss grün bleiben.
6. **Nach Content-/Chat-Änderungen:** `bash scripts/content-sync-check.sh` (Drift content/↔src/data) +
   `bash scripts/chat-check.sh` (Health + Faktenfrage + Fake-Preis-Boundary) — beide müssen OK sein.
7. **Vor Abschluss: `bash /home/hermeswebui/.hermes/scripts/abau-quality-check.sh`** (alle 5 Checks; Cron täglich 04:10) — Exit 0 Pflicht.
8. QA-Protokoll + ggf. ADR aktualisieren (Code+Doku = ein Change, C.18).

## Verboten
- Kein neuer Font/keine neue Farbe ohne `--font-*`/`--color-*`-Token (ADR-003).
- Kein Button ohne explizite `:hover`-Farbe (Hover-Lesbarkeits-Regel, ADR-003).
- **Formular-Spacing-Regel (merken):** `.form-grid` gap = `--space-5`, `.form-field` gap = 8px,
  Inputs min-height 48px / padding 12px 14px — NICHT pro Feld individuell ändern (Auftrag B.3).
- CTA-Bänder: **zentriert** (Pascal-Direktive 2026-08-12: `.section-dark` text-align center, `.hero-actions`/`.hero-actions-center` margin-top `--space-7` + justify-content center) — NICHT linksbündig.
- Keine Preise/Referenzdaten/Fakten erfinden — fehlende Kundendaten als offen dokumentieren.
- Keine Secrets in Code/Logs/Doku; Keys nur via `_secret()` (hermes.env), nie ausgeben.
- Chat-KI-Widget nicht ohne Datenschutz-Abschnitt + ADR wieder einbauen.
