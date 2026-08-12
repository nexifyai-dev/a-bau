# ADR-004: Chat-Widget (Floating) — DSGVO-konformer Wieder-Einbau

Status: angenommen · Datum: 2026-08-12

## Kontext
Kundenauftrag (KI-Chatbot-Integration a-bau.nexifyai.cloud): Floating Chat-Widget für
Erstkontakt, Beantwortung von Kundenfragen und Qualifizierung von Anfragen auf Basis des
Seitenwissens. Das zuvor entfernte Chat-Widget (Datenschutz-Bedenken) wird wieder
eingebaut — jetzt mit DSGVO-Abschnitt (AGENTS.md-Vorgabe: „nicht ohne Datenschutz-Abschnitt
+ ADR wieder einbauen").

## Architektur (kein neuer Dienst nötig)
- Backend-Proxy existiert bereits: `chat/server.py` (FastAPI, Port 8095, Container teilt
  Host-Netz; Tunnel-Ingress → 127.0.0.1:8095). `POST /api/chat {message}` → `{answer, quellen}`,
  RAG über `chat/data/kb.db` (FTS5), LLM `ds/deepseek-v4-flash` via 9Router (Think-Max,
  `reasoning_effort: high`), Rate-Limit + Längen-Limit serverseitig.
- KEIN zusätzlicher Express/Docker-Proxy (Projektspezifikations-Template): Endpoint existiert,
  Port 3000 ist durch die WhatsApp-Bridge belegt; ein zweiter Proxy wäre Duplikat.
- Key-Versorgung: `_secret()` liest `/home/hermeswebui/.hermes/.env` (CUSTOM_API_KEY =
  aktiver 9Router-Key, E3-verifiziert 2026-08-12). Key niemals im Browser/Client.
- Frontend: `site/src/components/ChatWidget.tsx` (Client-Komponente, in layout.tsx), API-Call
  relativ `/api/chat` (gleicher Origin, kein Key im Client). Static Export kompatibel
  (kein next/image, keine Server-Features).

## DSGVO
- Verarbeitung nur zur Beantwortung; keine Speicherung von Chat-Verläufen serverseitig
  (stateless, kein Session-/Log-Persist der Nachrichteninhalte).
- Widget zeigt dauerhaft Hinweis + Link `/datenschutz/`.
- Keine Tracking-Drittanbieter, keine Cookies durch das Widget.

## CI (Corporate Identity)
- Farben ausschließlich Brand-Tokens (`--color-brand-green`, `--color-neutral-*`,
  `--color-mg-gold` Fokus), Font `--font-inter` — ADR-003 eingehalten, keine Fremdfarben.
- Icons als Inline-SVG (keine Emoji-Icons), A11y: aria-label, focus-visible, Esc schließt.

## Konsequenzen
- Build: `cd site && npm run build` (Static Export), Push = Deploy (Repo-Deploy-Modus).
- Betriebshandbuch: Chat-Widget-Sektion ergänzt.
