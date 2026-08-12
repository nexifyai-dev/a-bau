#!/bin/bash
# A-Bau-Watchdog: startet chat/server.py (Port 8095) falls down.
# Aufgerufen vom Hermes-Cron-Job "abau-server-watchdog" (every 5m, no_agent).
LOG=/tmp/abau-watchdog.log
if curl -s -m 5 http://127.0.0.1:8095/health | grep -q '"status":"ok"'; then
  exit 0
fi
echo "$(date -Is) A-Bau down -> Start" >> "$LOG"
cd /workspace/nexifyai/repos/a-bau || exit 1
PORT=8095 nohup /app/venv/bin/python3 chat/server.py >> /tmp/abau-server.log 2>&1 &
sleep 3
curl -s -m 5 http://127.0.0.1:8095/health >> "$LOG" 2>&1 || echo "START FEHLGESCHLAGEN" >> "$LOG"
