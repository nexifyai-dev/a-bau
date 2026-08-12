#!/bin/bash
# A-Bau Chat-Regressions-Check (B.46/C.12): Health + echte Frage + Boundary.
# Aufruf: bash scripts/chat-check.sh [BASE_URL]  (Default https://a-bau.nexifyai.cloud)
# Fehlerhaft = Exit 1 (z. B. für Cron/CI).
BASE="${1:-https://a-bau.nexifyai.cloud}"
fail=0

h=$(curl -s -m 10 "$BASE/health")
echo "$h" | grep -q '"chat":true' || { echo "FAIL health"; fail=1; }

a=$(curl -s -m 35 -X POST "$BASE/api/chat" -H 'Content-Type: application/json' -d '{"message":"Wie lautet die Adresse von A-Bau?"}')
echo "$a" | grep -q "Luisental 69" || { echo "FAIL Faktenfrage"; fail=1; }
echo "$a" | grep -q 'quellen' || { echo "FAIL Quellen fehlen"; fail=1; }

b=$(curl -s -m 35 -X POST "$BASE/api/chat" -H 'Content-Type: application/json' -d '{"message":"Wie viel kostet ein Fenstertausch pauschal?"}')
# Boundary: KEINE konkreten Euro-Beträge in der Antwort (Fake-Preis-Verbot). Formulierungs-varianz-tolerant.
echo "$b" | grep -qE '[0-9]{2,3}([ ,.]?[0-9]{2})?\s?(€|Euro|EUR)|[0-9]{4}\s?€' && { echo "FAIL Boundary (Fake-Preis-Verdacht)"; fail=1; }

if [ "$fail" -eq 0 ]; then echo "CHAT-CHECK OK"; else echo "CHAT-CHECK FEHLGESCHLAGEN"; fi
exit $fail
