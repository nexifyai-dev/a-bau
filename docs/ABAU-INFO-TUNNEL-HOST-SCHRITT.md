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
# E-Mail-Empfang testen (MX unverändert IONOS): Testmail an e.pfeiffer@a-bau.de
```

## 4. Danach (Kunde)
- WordPress-Paket bei IONOS kündigen (A/AAAA @ + _dep_ws_mutex + _domainconnect können dann entfernt werden).
- Launch-Checkliste (anwaltliche Rechtstext-Prüfung) bleibt offen.

---

# UPDATE 2026-08-12 (R36): Zone liegt JETZT bei Cloudflare (brynne.ns.cloudflare.com, E3 via DoH)

Damit entfällt der Custom-Hostname-Weg (Edge-Zertifikate automatisch). Offen ist NUR noch die Tunnel-Route:

## 1. Tunnel-Route — Dashboard-Weg (2 Minuten, kein API-Token nötig)
Cloudflare-Dashboard → Zero Trust → Networks → Tunnels → Tunnel `f0f2b101-ed26-4130-8b04-16c43badf70a` → **Public Hostnames → Add**:
| Hostname | Service |
|---|---|
| `www.a-bau.info` | `http://127.0.0.1:8095` |
| `a-bau.info` | `http://127.0.0.1:8095` |

(API-Alternative: `PUT /accounts/{acc}/cfd_tunnel/{tunnel_id}/configurations` — Ingress-Einträge ergänzen, bestehende MERGEN.)

## 2. Apex vereinfachen (optional, empfohlen)
Zone liegt bei CF → Apex-CNAME-Flattening verfügbar:
- In CF-DNS: `a-bau.info` → **CNAME** `f0f2b101-…cfargotunnel.com` (CF flattet Apex) — ersetzt A 217.160.0.117 + IONOS-Forwarding + _dep_ws_mutex
- `www.a-bau.info` → CNAME Tunnel (existiert bereits)
- Danach bei IONOS: A/AAAA @ + _dep_ws_mutex + _domainconnect löschen (WP-Paket kündigen)

## 3. Nach Route-Setzung testen
```bash
curl -sI https://www.a-bau.info/ | head -3    # erwartet 200 (Site)
curl -sI https://a-bau.info/ | head -3        # erwartet 200 oder 301 → www
curl -s https://a-bau.info/health             # Backend
```

## 4. Danach (Go-Live-Freigabe)
- `site/src/lib/site.ts` → `SITE_URL = "https://www.a-bau.info"` + Rebuild
- `server.py` HEADERS: `X-Robots-Tag: noindex, nofollow` entfernen (bis dahin noindex = korrekt, sonst indexiert Google die Staging-URL)
- E-Mail-Empfang testen (MX unverändert IONOS/CF)

---

# UPDATE 2 (R39): Exakter Dashboard-Schritt — es fehlt NUR die Public-Hostname-Route

**Verifizierter Stand:** DNS in CF vollständig (Zone brynne.ns.cloudflare.com; www + apex → CF-Anycast via Tunnel-Record/A-Record). `https://www.a-bau.info` → **404 vom Edge** (= Tunnel erreicht, aber keine Public-Hostname-Route), `https://a-bau.info` → 302 (IONOS-Forwarding proxied). Server-seitig ist ALLES vorbereitet (noindex nur noch auf Staging-Host, R39).

## Der eine Schritt (Cloudflare-Dashboard, ~2 Minuten)
1. Dashboard → **Zero Trust → Networks → Tunnels**
2. Tunnel **nexifyai-agentur-cloudflare-tunnel** → **Configure** → **Public Hostname** → **Add a public hostname**
3. Zweimal anlegen:
   | Subdomain | Domain | Service |
   |---|---|---|
   | `www` | `a-bau.info` | `HTTP` → `127.0.0.1:8095` |
   | *(leer lassen = Apex)* | `a-bau.info` | `HTTP` → `127.0.0.1:8095` |
4. Speichern → sofort live (Tunnel-CLI liest Remote-Config).

## Danach sofort testbar
```bash
curl -sI https://www.a-bau.info/ | head -3     # erwartet 200
curl -s https://www.a-bau.info/health           # {"status":"ok",...}
```

## Empfohlene DNS-Bereinigung (nach Erfolg)
- `a-bau.info A 217.160.0.117` + `AAAA` → **löschen** (Apex läuft jetzt über Tunnel-Route; IONOS-Forwarding + _dep_ws_mutex entfallen)
- `autodiscover` + `_dmarc` → **Nur DNS** (Proxy kann Mail-Autoconfig/DMARC-Lookups stören; Proxy-Zertifikat für adsredir.ionos.info existiert nicht → 526-Risiko)
- `_domainconnect` → löschen (IONOS-Verwaltung, überflüssig)
- MX ×2 + SPF bleiben „Nur DNS" ✓

## Go-Live-Abschluss (danach, von mir ausgeführt)
1. `site/src/lib/site.ts` → `SITE_URL = "https://www.a-bau.info"` + Rebuild/Deploy (canonicals/sitemap/JSON-LD ziehen mit)
2. noindex ist bereits host-basiert gelöst (Staging noindex, a-bau.info indexierbar) — kein weiterer Eingriff nötig
3. E-Mail-Empfang testen (MX unverändert)
