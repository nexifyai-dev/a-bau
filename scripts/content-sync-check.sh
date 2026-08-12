#!/bin/bash
# A-Bau Content-Sync-Check (C.8): content/ == site/src/data/ für alle Zwillinge.
# Bewusste Ausnahmen (kein Zwilling): kontakt.yaml (nur src/data), Rechtstexte (nur content/).
# Aufruf: bash scripts/content-sync-check.sh  (aus Repo-Root)
fail=0
for f in $(ls content/); do
  case "$f" in
    impressum.md|datenschutz.md|agb.md|nutzungsbedingungen.md|ueber-uns.md) continue ;;  # content-only-Quellen (Rechtstexte + Unternehmens-Markdown)
  esac
  if [ -f "site/src/data/$f" ]; then
    diff -q "content/$f" "site/src/data/$f" > /dev/null || { echo "DRIFT: content/$f != site/src/data/$f"; fail=1; }
  else
    echo "HINWEIS: content/$f hat keinen src/data-Zwilling (prüfen: gewollt?)"; fail=1
  fi
done
if [ "$fail" -eq 0 ]; then echo "CONTENT-SYNC OK"; else echo "CONTENT-SYNC FEHLGESCHLAGEN"; fi
exit $fail
