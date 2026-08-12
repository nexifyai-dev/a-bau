#!/bin/bash
# A-Bau Go-Live: Tunnel-Route (Public Hostname) per Cloudflare-API ergänzen.
# Voraussetzung: CLOUDFLARE_API_TOKEN in /home/hermeswebui/.hermes/.env (oder hermes.env).
# Der Token wird NIE ausgegeben — nur gelesen und im Authorization-Header genutzt.
# Aufruf: bash scripts/cf-tunnel-route.sh   (aus Repo-Root; erfordert curl + python3)
set -e
ZONE_ID="2449a34346c7614cdcb30476dce8ad6d"
ACCOUNT_ID="a112f895c19e0d65f6f64b3e89f747f8"
TUNNEL_ID="f0f2b101-ed26-4130-8b04-16c43badf70a"
SERVICE="http://127.0.0.1:8095"
HOSTS=("www.a-bau.info" "a-bau.info")

# Token aus Container-Quellen lesen (Namen zuerst, Werte nur intern)
TOKEN=""
for f in /home/hermeswebui/.hermes/.env /home/hermeswebui/.hermes/hermes.env; do
  [ -f "$f" ] || continue
  v=$(grep -m1 -E '^CLOUDFLARE_API_TOKEN=' "$f" | cut -d= -f2- | tr -d '"'"'"'')
  [ -n "$v" ] && TOKEN="$v" && break
done
if [ -z "$TOKEN" ]; then
  echo "FEHLER: CLOUDFLARE_API_TOKEN fehlt in /home/hermeswebui/.hermes/.env — bitte hinterlegen (Dashboard -> Mein Profil -> API-Tokens -> 'Edit zone DNS' + 'Cloudflare Tunnel: Edit')."
  exit 1
fi

API="https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/cfd_tunnel/$TUNNEL_ID/configurations"

echo "== 1) Bestehende Tunnel-Config lesen (MERGE, nichts überschreiben) =="
CFG=$(curl -s -H "Authorization: Bearer $TOKEN" "$API")
echo "$CFG" | python3 -c "import sys,json; d=json.load(sys.stdin); print('API ok, bestehende Ingress-Hostnames:', [i.get('hostname') or 'CATCH-ALL' for i in d.get('result',{}).get('config',{}).get('ingress',[])])" || { echo "API-Fehler: $(echo "$CFG" | head -c 200)"; exit 1; }

echo "== 2) Ingress um Produktions-Hostnames erweitern + PUT =="
python3 - "$TOKEN" "$API" "$SERVICE" "${HOSTS[@]}" << 'PYEOF'
import json, sys, urllib.request

token, api, service = sys.argv[1], sys.argv[2], sys.argv[3]
hosts = sys.argv[4:]
req = urllib.request.Request(api, headers={"Authorization": f"Bearer {token}"})
with urllib.request.urlopen(req, timeout=30) as r:
    d = json.loads(r.read().decode())
ingress = d.get("result", {}).get("config", {}).get("ingress", [])
have = {i.get("hostname") for i in ingress}
for h in hosts:
    if h not in have:
        ingress.insert(0, {"hostname": h, "service": service})
        print(f"  + {h} -> {service}")
    else:
        print(f"  = {h} bereits vorhanden")
body = json.dumps({"config": {"ingress": ingress}}).encode()
req2 = urllib.request.Request(api, data=body, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, method="PUT")
with urllib.request.urlopen(req2, timeout=30) as r:
    d2 = json.loads(r.read().decode())
print("PUT-Status:", d2.get("success"))
print("Ingress jetzt:", [i.get("hostname") or "CATCH-ALL" for i in d2.get("result", {}).get("config", {}).get("ingress", [])])
PYEOF

echo "== 3) Live-Test =="
sleep 3
curl -s -o /dev/null -w "www.a-bau.info: %{http_code}\n" -m 25 --resolve www.a-bau.info:443:104.21.12.190 https://www.a-bau.info/
curl -s -o /dev/null -w "a-bau.info:    %{http_code}\n" -m 25 --resolve a-bau.info:443:104.21.12.190 https://a-bau.info/
curl -s -m 15 --resolve www.a-bau.info:443:104.21.12.190 https://www.a-bau.info/health
echo
