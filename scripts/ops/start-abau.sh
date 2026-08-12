#!/bin/bash
# A-Bau-Server dauerhaft starten (Port 8095), setsid gegen Turn-Ende-Kill
cd /workspace/nexifyai/repos/a-bau || exit 1
PORT=8095 setsid /app/venv/bin/python3 chat/server.py >> /tmp/abau-server.log 2>&1 < /dev/null &
exit 0
