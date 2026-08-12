#!/bin/bash
# A-Bau taeglicher Qualitaets-Check (B.46/C.12, §15a): Route-Smoke + Chat + Content-Sync + Oeffnungszeiten.
# Aufgerufen vom Hermes-Cron-Job "abau-quality-check" (taeglich 04:10, no_agent).
# Bei Fehler: Exit 1 + klare Meldung (stdout wird vom Cron-Job geliefert).
cd /workspace/nexifyai/repos/a-bau || exit 1
fail=0
out() { echo "$1"; }
R=$(bash scripts/route-check.sh https://a-bau.nexifyai.cloud 2>&1 | tail -1)
echo "ROUTE: $R"; [[ "$R" == *"ALLE OK"* ]] || fail=1
C=$(bash scripts/chat-check.sh 2>&1 | tail -1)
echo "CHAT: $C"; [[ "$C" == "CHAT-CHECK OK"* ]] || fail=1
S=$(bash scripts/content-sync-check.sh 2>&1 | tail -1)
echo "SYNC: $S"; [[ "$S" == "CONTENT-SYNC OK"* ]] || fail=1
NODE_BIN="${NODE_BIN:-/home/hermeswebui/.hermes/home/.nvm/versions/node/v22.23.2/bin/node}"
[ -x "$NODE_BIN" ] || NODE_BIN="$(command -v node || echo node)"
O=$("$NODE_BIN" scripts/test-oeffnungszeiten.js 2>&1 | tail -1)
echo "OEFFNUNGSZEITEN: $O"; [[ "$O" == *"PASS"* ]] || fail=1
H=$(curl -s -m 10 https://a-bau.nexifyai.cloud/health)
echo "HEALTH: $H"; echo "$H" | grep -q '"status":"ok"' || fail=1
if [ "$fail" -eq 0 ]; then echo "QUALITY-CHECK OK"; else echo "QUALITY-CHECK FEHLGESCHLAGEN"; fi
exit $fail
