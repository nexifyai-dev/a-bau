# Ops-Skripte (versioniert, R68)

Live-Betriebs-Skripte — Kopien des Container-Stands (12.08.2026). Bei Änderungen IMMER beide
Stellen pflegen (Repo + Einsatzort) und zurückspielen:

| Skript | Einsatzort | Zweck |
|---|---|---|
| `start-abau.sh` | `/tmp/start-abau.sh` | Server-Start (setsid, Port 8095) — R55-Verfahren: erst Kill (pkill -f 'chat/server.py'), dann Start |
| `abau-watchdog.sh` | `~/.hermes/scripts/` | 5-min-Cron: startet Server bei Down (loggt /tmp/abau-watchdog.log) |
| `abau-quality-check.sh` | `~/.hermes/scripts/` | Täglich 04:10: Route + Chat + Sync + Öffnungszeiten (NODE_BIN-Absolutpfad!) + Health |
| `abau-log-cleanup.sh` | `~/.hermes/scripts/` | Täglich 03:00: Logs > 7 Tage löschen (DSGVO §12) |

Wiederanlauf-Notiz: `import chat.server` dauert 20–30 s (Container-FS-I/O) — Health erst nach ~30 s prüfen.
