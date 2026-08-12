# a-bau.info online — Host-Schritt (NUR vom Host ausführbar, root/Pascal)

**Stand 2026-08-12:** Kunde hat IONOS-DNS korrekt umgestellt (www-CNAME → Tunnel, Apex → IONOS-Webforwarding auf www, Mail-Records unangetastet). Es fehlt NUR die Tunnel-Route + SSL-Zertifikat. Im Container nicht ausführbar (kein CF-Token, kein cloudflared, kein Host-Zugriff — E3).

## 1. Tunnel-Ingress erweitern (Route + Zertifikat)

```bash
# Tunnel-ID (aus CNAME): f0f2b101-ed26-4130-8b04-16c43badf70a
# Account-ID (öffentlich): a112f895c19e0d65f6f64b3e89f747f8
# Token: CLOUDFLARE_API_TOKEN aus /etc/nexifyai/hermes.env (Host)

# 1a) AKTUELLE Config lesen (NIEMALS blind ersetzen — Tunnel kann weitere Hostnames routen)
curl -s "https://api.cloudflare.com/client/v4/accounts/a112f895c19e0d65f6f64b3e89f747f8/cfd_tunnel/f0f2b101-ed26-4130-8b04-16c43badf70a/configurations" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | python3 -m json.tool

# 1b) Bestehende Ingress-Liste MERGEN, dann PUT (Beispiel-Payload — bestehende Einträge behalten!):
# {"config":{"ingress":[
#   {"hostname":"a-bau.nexifyai.cloud","service":"http://127.0.0.1:8095"},
#   {"hostname":"www.a-bau.info","service":"http://127.0.0.1:8095"},
#   {"hostname":"a-bau.info","service":"http://127.0.0.1:8095"},
#   {"service":"http_status:404"}   # Catch-All aus Schritt 1a übernehmen
# ]}}

# 1c) TLS am Tunnel braucht ein Zertifikat für die Hostnames. Zwei Wege:
# Weg A (empfohlen, automatisch): Hostnames in eine Cloudflare-Zone aufnehmen
#   → Custom Hostname (Cloudflare for SaaS) — siehe 2.
# Weg B: DNS der Domain komplett zu Cloudflare umziehen (Nameserver-Wechsel) —
#   dann vergibt CF Edge-Zertifikate automatisch; MX/SPF/DKIM/DMARC-Einträge
#   aus der IONOS-Liste in der CF-Zone nachbauen (unbedingt vor Wechsel!).

## 2. Custom Hostname (Zertifikat bei externem DNS — Weg A)

```bash
# Zone der nexifyai.cloud ermitteln:
curl -s "https://api.cloudflare.com/client/v4/zones?name=nexifyai.cloud" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# Custom Hostname anlegen (je Hostname):
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/custom_hostnames" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"hostname":"www.a-bau.info","ssl":{"method":"txt","type":"dv"},"custom_origin_server":"a-bau.nexifyai.cloud"}'
# → Antwort enthält TXT-Validierungs-Record (z. B. _cf-custom-hostname.www.a-bau.info TXT ...)

# TXT-Record bei IONOS eintragen (Kunde), dann:
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/custom_hostnames/<CH_ID>/" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -X PATCH -d '{}'  # Re-verify
# oder warten bis SSL-Status "active" (automatische Re-Validierung)
```

## 3. Test nach Host-Schritt
```bash
curl -sI https://www.a-bau.info/ | head -3          # erwartet 200
curl -sI https://a-bau.info/ | head -3              # erwartet 301 → https://www.a-bau.info
curl -s https://a-bau.nexifyai.cloud/health         # Backend lebt
# E-Mail-Empfang testen (MX unverändert IONOS): Testmail an kontakt@a-bau.info
```

## 4. Danach (Kunde)
- WordPress-Paket bei IONOS kündigen (A/AAAA @ + _dep_ws_mutex + _domainconnect können dann entfernt werden).
- Launch-Checkliste (anwaltliche Rechtstext-Prüfung) bleibt offen.
