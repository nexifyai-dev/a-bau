# Kundenprojekt: A-Bau Meisterbetrieb GmbH — a-bau.info

**Kunde:** A-Bau Meisterbetrieb GmbH · Luisental 69 · 41199 Mönchengladbach (Geistenbeck)
**Register:** AG Mönchengladbach HRB 18836 · EUID DER1504.HRB18836 · GF: Albert Pfeiffer
**Status:** Umsetzung — Staging live auf `a-bau.nexifyai.cloud` (2026-08-12). Design-Referenz: **GAG Köln 1:1 mit Borussia/MG-Farben** (`docs/DESIGN-ABAU-v2-2026-08-11.md`), Stack: Next.js 16 (static export), Chat-Service FastAPI+FTS5-RAG.
**Ausgangslage:** Vollanalyse 2026-08-10 (Audit-PDF an mail@nexifyai.cloud) — Alt-Site WordPress/IONOS mit Rechts-, SEO- und Qualitätsdefiziten.

## Inhalt
| Datei | Zweck |
|---|---|
| `docs/PLAN-ABAU-WEBSITE-2026-08-10.md` | Queen-Mode-Umsetzungsplan (verbindlich) |
| `docs/RECHERCHE-FIRMENDATEN.md` | Recherchierte Firmendaten mit Quellen + offene Punkte |
| `docs/ASSETS.md` | Bild-/Video-Inventar (86 Medien) + Zuordnung |
| `site/` | Website — Next.js 16, GAG-1:1-Design (Borussia/MG-Farben), static export → `site/out/` |
| `chat/` | AI-Chatbot-Service 9Router+RAG — **live** (Chat-Widget auf allen Seiten, 165-Fragen-FAQ als Wissensbasis, DSGVO §6) |
| `assets/` | Heruntergeladene Originalmedien (bei Umsetzung) |

## Kernziele
1. Vollumfängliche Neugestaltung — hochwertig, umfangreich, vertrauensvoll, Deutsch
2. Recht/DSGVO/DIN/ISO vollständig (Impressum, Datenschutz, Consent, Barrierefreiheit WCAG 2.2 AA / EN 301 549)
3. AI-Chatbot über 9Router (deepseek-v4-flash, Think-Max), antwortet aus Website-Wissen (RAG: FTS5-Retrieval, lokal — kein externer Embedding-Provider; Upstage final entfernt)
4. Vorhandene Bilder nutzen, fehlende Daten recherchiert (siehe Recherche-Doku), Rest via Kunden-Klärung
5. Deploy: **`a-bau.nexifyai.cloud`** (Staging = aktuelles Ziel, Pascal 2026-08-10) — spätere eigene Domain nach Kundenentscheid, kein IONOS-Umzug jetzt.

**Vorgaben-Konformität:** Arbeitsvorgaben v3.3 (§3 Queen-Mode, §5 Test-Pyramide + E2E-Gegentest, §7 Doku, §11 Abweichungs-Null-Toleranz, §12 Betriebshandbuch), DSGVO/TDDDG, BFSG/EN 301 549, DIN 5008/ISO-Formate.
