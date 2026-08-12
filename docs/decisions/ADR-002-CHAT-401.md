# ADR-002: Chat-Server — Secrets-Reihenfolge, async-Handler, WAL

## Kontext
Chat (FastAPI `chat/server.py`) lieferte 401 + Prozess-Kills bei LLM-Calls (9Router).

## Problem
1. `_secret()` iterierte Dateien und gab die **erste passende Zeile** zurück — in
   `/home/hermeswebui/.hermes/.env` steht `DEEPSEEK_API_KEY` VOR `CUSTOM_API_KEY` → Server
   nutzte den Direkt-Key → 401 vom 9Router.
2. Synchrones `urllib`/`sqlite3` im `async`-Handler blockierte den Event-Loop → Requests
   hingen; Folge-Kills (Session-/Timeout-Kontext) wirkten wie Server-Crashs.

## Entscheidung
- `_secret`: **Namens-Reihenfolge** (`for n in names` → erste Datei mit Treffer). `CUSTOM_API_KEY`
  gewinnt vor `DEEPSEEK_API_KEY` (9Router-tauglich).
- retrieve/LLM/SMTP via `asyncio.to_thread` (Loop bleibt bedienbar).
- SQLite `WAL` + `busy_timeout=10000`, `connect(timeout=10)`.
- LLM-Timeout 30 s, `reasoning_effort: high` (max = Tunnel-502-Falle).
- Firmen-Basisdaten (Adresse, Tel, Öffnungszeiten, HRB, USt) im System-Prompt —
  Kontaktfragen ohne Retrieval-Treffer zuverlässig.

## Begründung
Kanonische Key-Quelle = `.env`-Datei; env nur Fallback (Rotation-Drift in Session-Env).

## Alternativen
Key aus env bevorzugen — verworfen (alter Key in Session-Env). Synonym-Retrieval-Erweiterung —
verworfen (Hänger im Server-Kontext, Rollback 2026-08-12).

## Konsequenzen
- Start: `setsid /app/venv/bin/python3 chat/server.py` (überlebt Session-Ende).
- Key-Rotation: `.env` aktualisieren + Server-Neustart.

## Datum
2026-08-12
