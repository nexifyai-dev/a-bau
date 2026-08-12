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
5. QA-Protokoll + ggf. ADR aktualisieren (Code+Doku = ein Change, C.18).

## Verboten
- Kein neuer Font/neue Farbe ohne `--font-*`/`--color-*`-Token (ADR-003).
- Kein Button ohne explizite `:hover`-Farbe (Hover-Lesbarkeits-Regel, ADR-003).
- Keine Preise/Referenzdaten/Fakten erfinden — fehlende Kundendaten als offen dokumentieren.
- Keine Secrets in Code/Logs/Doku; Keys nur via `_secret()` (hermes.env), nie ausgeben.
- Chat-KI-Widget nicht ohne Datenschutz-Abschnitt + ADR wieder einbauen.
