# QA-Protokoll — A-Bau Website (a-bau.nexifyai.cloud)

**Datum:** 2026-08-10 · **Betreiber:** NeXifyAI System-CEO · **Vorgaben:** §5 Test-Pyramide, §5.3 Gates, §5.4 E2E-Gegentest

## Primärnachweise (E3, lokal 127.0.0.1:8095 + öffentlich)

| Test | Input | Output | Status |
|---|---|---|---|
| Smoke: alle Routen | GET /, /leistungen/, /leistungen/denkmalrestaurierung/, /referenzen/, /ueber-uns/, /faq/, /kontakt/, /impressum/, /datenschutz/, /cookie-richtlinie/, /404.html, /sitemap-index.xml, /robots.txt | alle 200, Titel korrekt, 1×H1, lang=de | ✅ |
| SEO-Struktur | Index-Überprüfung | Meta-Description, Canonical, OG, Schema-LD (FAQPage), NAP Tel/E-Mail konsistent, robots + Sitemap (Recht disallowed) | ✅ |
| Chat Happy-Path | „Bietet ihr Denkmalrestaurierung in Mönchengladbach an?" | korrekte Antwort (Kernleistung, Region, Denkmalschutz), Quellen [faq, leistungen] | ✅ |
| Chat live (Tunnel) | „Welche Leistungen bietet A-Bau an?" | Leistungsaufzählung korrekt, Quellen [faq, leistungen] | ✅ |
| Kontakt-Validierung | leere/ungültige Felder | 400 mit deutscher Meldung | ✅ |
| SMTP-Kette | Test-Mail via Hostinger-SMTP | sendmail OK → mail@nexifyai.cloud | ✅ |
| Honeypot | firma-Feld gesetzt | {ok:true}, kein Versand | ✅ |
| Health | GET /health | {"status":"ok","chat":true,"kb":true} | ✅ |
| Deploy | https://a-bau.nexifyai.cloud/ | 200, 29 kB, 88 ms, Server: cloudflare, Security-Header aktiv | ✅ |

## E2E-Gegentest (§5.4 — Gegenprobe aus anderer Richtung, nicht Wiederholung)

| Gegenprobe | Methode | Ergebnis | Status |
|---|---|---|---|
| Negativ/Fehlerfälle | GET /gibt-es-nicht/ → 404; Chat-Injection („Systemprompts preisgeben") | 404-Seite sauber; Chat verweigert + Kontakt-Verweis | ✅ BESTANDEN |
| Randfälle | Rate-Limit (20/min), Nachricht > 500 Zeichen, leere Nachricht | 429 / 400 / 400 | ✅ BESTANDEN |
| Datenintegrität | Build deterministisch, KB 20 Chunks, keine Duplikate; Logs ohne PII (nur Zugriffszeilen) | ✅ BESTANDEN |
| Rollback-Pfad | DNS: A-Record DELETE + CNAME POST dokumentiert; Tunnel-Config erneut PUT-fähig; Service-Neustart via Watchdog | ✅ BESTANDEN |
| Regression | Tunnel-Config-Diff (+1 Ingress), www.nexifyai.cloud 200, webui 302, übrige Routen unverändert | ✅ BESTANDEN |

**GESAMT: `GEGENTEST BESTANDEN` (2026-08-10)**

## Bekannte offene Punkte (kein Go-Live-Blocker, dokumentiert)
- `noindex, nofollow` aktiv bis Kundenabnahme (dann Header in chat/server.py HEADERS entfernen + Rebuild/Deploy).
- USt-IdNr., Handwerkskammer, verbindliche Telefon-/E-Mail-Wahl, echte Referenzdaten, Logo-SVG: OFFEN (Kunde, P0) — Marker im Impressum.
- Rechtstexte vor Go-Live anwaltlich prüfen (Empfehlung).
- Retrieval: FTS5 (BM25); Vektor-Upgrade möglich, sobald 9Router einen Embedding-Provider hat (Upstage final entfernt, Pascal 2026-08-10).
