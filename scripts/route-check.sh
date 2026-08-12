#!/bin/bash
# A-Bau Route-Smoke-Test (Regression Prevention, ADR/QA)
# Nutzung: bash scripts/route-check.sh [BASE]
set -u
BASE="${1:-https://a-bau.nexifyai.cloud}"
FAIL=0
check() {
  local code
  code=$(curl -s -m 20 -o /dev/null -w "%{http_code}" "$BASE$1")
  if [ "$code" != "200" ]; then
    echo "FAIL $code $1"
    FAIL=1
  else
    echo "OK   $1"
  fi
}
check "/"
check "/leistungen/"
check "/leistungen/denkmalrestaurierung/"
check "/leistungen/innenausbau/"
check "/leistungen/krankenhausbau/"
check "/leistungen/schluesselfertigbau/"
check "/leistungen/sanierung/"
check "/leistungen/installationen/"
check "/leistungen/transport/"
check "/referenzen/"
check "/stadtteile/"
check "/stadtteile/geistenbeck/"
check "/stadtteile/moenchengladbach-city-nordstadt-suedstadt/"
check "/stadtteile/eicken-wickrath/"
check "/stadtteile/rheydt/"
check "/stadtteile/odenkirchen-wickrathberg-hardt/"
check "/stadtteile/niers-volksgarten-umfeld/"
check "/ueber-uns/"
check "/faq/"
check "/kontakt/"
check "/angebot/"
check "/impressum/"
check "/datenschutz/"
check "/cookie-richtlinie/"
check "/sitemap.xml"
check "/robots.txt"
# Negativ-Gegentest: unbekannte Route MUSS 404 sein
code=$(curl -s -m 20 -o /dev/null -w "%{http_code}" "$BASE/gibt-es-nicht-xyz/")
if [ "$code" != "404" ]; then echo "FAIL (Negativ): unbekannte Route = $code (erwartet 404)"; FAIL=1; else echo "OK   Negativ-404"; fi
if [ "$FAIL" = "0" ]; then echo "ROUTE-CHECK: ALLE OK"; else echo "ROUTE-CHECK: FEHLER"; exit 1; fi
