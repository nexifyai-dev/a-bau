# Recht-Recherche 2026-08-12 — E-Mail-Versand, Hosting, Drittland (A-Bau + NeXifyAI-Muster)

Belegte Recherche (Online-Pflicht §13) zum neuen Resend-Versand und allen Drittland-/Auftragsverarbeiter-Fragen.
Erstellt: 2026-08-12 (Runde 52). Quellen sind Datum-verifiziert („Last update" bzw. Abrufdatum).

## 1. Resend — Rechtliches (E-Mail-Versand A-Bau)

| Frage | Befund | Quelle |
|---|---|---|
| Rechtsform / Sitz | **Plus Five Five, Inc. (d/b/a Resend), 2261 Market Street #5039, San Francisco, CA 94114, USA** | resend.com/legal/dpa (SCC-Annex: „Data Importer: Plus Five Five, Inc."), Abruf 2026-08-12 |
| EU-US-Datentransfer | **EU-US Data Privacy Framework (DPF) zertifiziert** (inkl. UK Extension) → Art. 45 DSGVO-Angemessenheitsbeschluss | resend.com/changelog/data-privacy-framework-certification + dataprivacyframework.gov, Abruf 2026-08-12 |
| Auftragsverarbeitung | DPA (Data Processing Addendum) mit **Standard Contractual Clauses** als Annex; Art. 28 DSGVO-konform | resend.com/legal/dpa (Last update: December 31st, 2025) |
| Weitere Nachweise | SOC II (Type I/II), GDPR-konforme Verarbeitung | resend.com/security + LinkedIn-Ankündigung (DPF certified, SOC II, GDPR) |
| Datenumfang A-Bau | Nur Formular-Felder (Name, E-Mail, Telefon, Nachricht) für Einzel-Versand an e.pfeiffer@a-bau.info; keine Liste/Kampagnen | Implementierung chat/server.py (R52) |
| Aufbewahrung | Versand-Logs/API-Logs bei Resend (Zustell-Infrastruktur); keine dauerhafte Speicherung der Formularinhalte durch A-Bau (Queue wird nach Versand geleert) | DPA-Doku; Implementierung |

**Konsequenz (umgesetzt):** datenschutz.md §5 Empfänger auf Resend umgestellt (DPF → Art. 45, Art. 28 + DPA), §10-Empfängerliste ergänzt. Formulierung s. commit R52.

**Offen:** Domain `a-bau.info` bei Resend verifizieren (DKIM/SPF-Records; DNS in Cloudflare-Zone a-bau.info); `RESEND_API_KEY` in `/home/hermeswebui/.hermes/.env` spiegeln; dann `python3 chat/flush_contact_queue.py` (2 echte Queue-Einträge).

## 2. Hosting A-Bau (Website + Chat-Server)

- Hetzner Online GmbH, Frankfurt am Main (Rechenzentrum EU, Deutschland) — Auftragsverarbeiter Art. 28 DSGVO (in datenschutz.md §2/§10 genannt). Kein Drittland-Transfer.
- Cloudflare (CDN/WAF/Tunnel/DNS): Auftragsverarbeiter/technischer Dienstleister. Cloudflare bietet DPA mit SCCs an. Datenfluss: HTTP-Anfragen (keine personenbezogenen Inhalte über Website-Formulare hinaus — Formular-POSTs laufen durch CF-Edge).
- **Offen (dokumentiert, kein Befund):** Ob Cloudflare in der Zone a-bau.info technische Cookies (z. B. `__cf_bm` Bot-Management) setzt, hängt von Zone-Einstellungen ab (Bot Fight Mode etc.). CF-Zugang ist wegen Token-Rotation derzeit nicht prüfbar. Wenn belegt → Cookie-Richtlinie (Stand 12.08.2026) ggf. um CF-Hinweis ergänzen (§ 25 Abs. 2 Nr. 2 TDDDG wäre einschlägig). Keine Spekulation eingetragen.

## 3. KI-Assistent (Chat) — bleibt unverändert

- 9Router → DeepSeek (LLM): Drittland möglich → datenschutz.md §6 nennt ehrlich Art. 49 Abs. 1 lit. b DSGVO (R17-Entscheidung, beibehalten). Kein neuer Befund.

## 4. Bekannte Fehler-Vermeidung (aus Skills/Verifikation, R52 angewendet)

| Risiko | Vermeidung | Quelle/Evidenz |
|---|---|---|
| Resend-SMTP-Relay (smtp.resend.com) mit eigener/anderer Domain → `Sender address rejected: Domain not found` (send.* NXDOMAIN) | **API-Weg** (api.resend.com/emails) statt SMTP-Relay; Absender-Domain muss bei Resend verifiziert sein | nexify-mail-delivery-Skill „Resend-Falle" (E3 2026-08-10) |
| 403 von Resend-API (Domain nicht verifiziert / Key falsch) | Fallback-Kette SMTP → Queue; 202 queued statt Fehlermeldung an Besucher; Log `[contact-resend-error]` | Implementierung R52 |
| Header-Injection via Formular-Name | CRLF-Strip (A.38) in server.py + flush | E3 2026-08-10 |
| Datenverlust bei Versandfehler | Queue-Persistenz, indexbasiertes Flush (fehlgeschlagene bleiben) | Implementierung R52 |
| no_agent-Cron findet node nicht | `NODE_BIN`-Absolutpfad in abau-quality-check.sh | P1-Fix R52 (QUALITY-CHECK OK) |
| Secrets in Logs | Key nur via `_secret()`, nie ausgegeben/loggt | Implementierung R52 |

## 5. NeXifyAI-eigene Rechtstexte (Website nexifyai.cloud) — Anleitung

Hauptrepo `nexifyai-dev/nexify-agentur-plattform` ist im Container nicht lokal geklont (GitLab-SSH aus Container nicht erreichbar — ls-remote Timeout, 2026-08-12). Anpassungen für nächste Gelegenheit (Host-Session oder nach GitLab-Zugang):

1. **Datenschutzerklärung nexifyai.cloud**: E-Mail-Versand-Abschnitt — Resend Inc./Plus Five Five, Inc. (Adresse s. §1) als Empfänger/Auftragsverarbeiter ergänzen: EU-US-DPF → Art. 45 DSGVO, Art. 28 + DPA/SCC; sonst Verarbeitung wie A-Bau-Muster.
2. **AGB / Nutzungsbedingungen nexifyai.cloud**: Prüfen, ob E-Mail-/Versandklauseln den Dienst beschreiben (Resend) — sonst neutral lassen (keine Pflichtangabe in AGB für Subdienstleister; DSGVO-relevant, nicht AGB-relevant).
3. **Footer nexifyai.cloud**: „Absender klein ganz unten" — A-Bau-Umsetzung (`.footer-made-by`) als Muster übernehmen.
4. Alle Inhaltsänderungen: Repo-Commit + Deployment wie üblich (nächste Runde mit GitLab-Zugang).

## 6. Dauerauftrag (Pascal, OOB 2026-08-12)

- „Alles dokumentieren" → QA-Protokoll R52, Betriebshandbuch (Resend-Kapitel), dieses Dokument, ZK-Update.
- „Dauerhaft recherchieren (Best-Praxis, Fehlervermeidung, API-Doku als Konfigurationsvorgabe)" → läuft als fortlaufende Runde (Recherche-Pflicht §13); API-Doku-Abgleich Resend send-email: Payload `from/to[]/reply_to/subject/text` (snake_case), Bearer-Auth, Fehler → errors-Referenz — als Konfigurationsvorgabe in server.py umgesetzt.
