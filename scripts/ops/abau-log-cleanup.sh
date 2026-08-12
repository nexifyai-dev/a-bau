#!/bin/bash
# A-Bau Log-Aufbewahrung (DSGVO: Zugriffs-/Fehler-Logs max. 7 Tage).
# Aufgerufen vom Hermes-Cron-Job "abau-log-cleanup" (taeglich 03:00, no_agent).
# Kein PII: /tmp/abau-server.log enthaelt nur Zugriffszeilen + Fehlerdetails (ohne Nutzerdaten).
find /tmp -maxdepth 1 -name "abau-server*.log" -mtime +7 -delete
find /tmp -maxdepth 1 -name "abau-watchdog.log" -mtime +7 -delete
# Kurzer Erfolgs-/Leerlauf-Eintrag (kein Log-Wachstum: nur wenn geloescht wurde)
