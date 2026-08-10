# Kundenprojekt: A-Bau Meisterbetrieb GmbH — a-bau.info

**Repo:** https://github.com/nexifyai-dev/a-bau (eigenes Kundenprojekt-Repo)
**Deployment:** VPS 72.62.152.47, Container-Pfad `/workspace/nexifyai/clients/abau` (Spiegel: `/opt/nexifyai/repos/a-bau`), Service Port 8095, Live: https://a-bau.nexifyai.cloud
**Kunde:** A-Bau Meisterbetrieb GmbH · Luisental 69 · 41199 Mönchengladbach (Geistenbeck)
**Register:** AG Mönchengladbach HRB 18836 · EUID DER1504.HRB18836 · GF: Albert Pfeiffer
**Status:** Planung (2026-08-10) → Umsetzung (Kanban `nexify`, Task siehe Board)
**Ausgangslage:** Vollanalyse 2026-08-10 (Audit-PDF an mail@nexifyai.cloud) — Alt-Site WordPress/IONOS mit Rechts-, SEO- und Qualitätsdefiziten.

## Inhalt
| Datei | Zweck |
|---|---|
| `docs/PLAN-ABAU-WEBSITE-2026-08-10.md` | Queen-Mode-Umsetzungsplan (verbindlich) |
| `docs/RECHERCHE-FIRMENDATEN.md` | Recherchierte Firmendaten mit Quellen + offene Punkte |
| `docs/ASSETS.md` | Bild-/Video-Inventar (86 Medien) + Zuordnung |
| `site/` | Neue Website (Astro, bei Umsetzung) |
| `chat/` | AI-Chatbot-Service 9Router+RAG (bei Umsetzung) |
| `assets/` | Heruntergeladene Originalmedien (bei Umsetzung) |

## Kernziele
1. Vollumfängliche Neugestaltung — hochwertig, umfangreich, vertrauensvoll, Deutsch
2. Recht/DSGVO/DIN/ISO vollständig (Impressum, Datenschutz, Consent, Barrierefreiheit WCAG 2.2 AA / EN 301 549)
3. AI-Chatbot über 9Router (deepseek-v4-flash, Think-Max), antwortet aus Website-Wissen (RAG: FTS5-Retrieval, lokal — kein externer Embedding-Provider; Upstage final entfernt)
4. Vorhandene Bilder nutzen, fehlende Daten recherchiert (siehe Recherche-Doku), Rest via Kunden-Klärung
5. Deploy: **`a-bau.nexifyai.cloud`** (Staging = aktuelles Ziel, Pascal 2026-08-10) — spätere eigene Domain nach Kundenentscheid, kein IONOS-Umzug jetzt.

**Vorgaben-Konformität:** Arbeitsvorgaben v3.3 (§3 Queen-Mode, §5 Test-Pyramide + E2E-Gegentest, §7 Doku, §11 Abweichungs-Null-Toleranz, §12 Betriebshandbuch), DSGVO/TDDDG, BFSG/EN 301 549, DIN 5008/ISO-Formate.
