#!/usr/bin/env python3
"""A-Bau Website-Build: Templates + Inhalte -> statisches dist/ (stdlib + markdown).
Design-Entscheidung (Pascal 2026-08-10, ponytail): bewusst KEIN Framework-Build —
Python-Template-Generator, 0 Node-Deps, gleiche Gates. Upgrade-Pfad: Astro/CMS,
wenn Kunde redaktionellen Workflow braucht."""
import json, os, re, string, sys, datetime
import yaml
import markdown as md

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "site")
SRC = os.path.join(SITE, "src")
DIST = os.path.join(SITE, "dist")
PUB = os.path.join(SITE, "public")
NOW = datetime.date.today().isoformat()

def load(p):
    with open(p, encoding="utf-8") as f:
        return yaml.safe_load(f)

kontakt = load(os.path.join(ROOT, "data/kontakt.yaml"))
site_cfg = load(os.path.join(ROOT, "content/site.yaml"))
leistungen = load(os.path.join(ROOT, "content/leistungen.yaml"))["leistungen"]
referenzen = load(os.path.join(ROOT, "content/referenzen.yaml"))["referenzen"]
faq = load(os.path.join(ROOT, "content/faq.yaml"))["faq"]
def md_file(name):
    return md.markdown(open(os.path.join(ROOT, "content", name), encoding="utf-8").read(),
                       extensions=["tables", "sane_lists"])

k = kontakt
NAV = site_cfg["nav"]
SITE_META = site_cfg["site"]
DOMAIN = SITE_META["domain"]
TEL = k["telefon_festnetz"].replace(" ", "")
TEL_DISPLAY = k["telefon_festnetz"]

def tel_href(t): return "tel:" + t.replace(" ", "").replace("+", "00").replace("-", "")

def esc(s): return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

def nav_html(current):
    out = []
    for n in NAV:
        cls = ' aria-current="page"' if n["url"] == current else ""
        out.append(f'<a href="{n["url"]}"{cls}>{n["titel"]}</a>')
    return "\n".join(out)

def footer_html():
    oeff = "".join(f'<div><span>{esc(r["tag"])}</span><b>{esc(r["zeit"])}</b></div>' for r in k["oeffnungszeiten"])
    return f"""
<div class="footer-grid">
  <div>
    <h3>A-Bau Meisterbetrieb GmbH</h3>
    <p style="color:rgba(242,239,233,.7);font-size:.92rem">Restaurierung denkmalgeschützter Bauten, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen in Mönchengladbach &amp; NRW.</p>
  </div>
  <div>
    <h3>Navigation</h3>
    <nav class="footer-nav" aria-label="Footer">{nav_html("/")}</nav>
  </div>
  <div>
    <h3>Kontakt</h3>
    <nav class="footer-nav">
      <a href="{tel_href(TEL)}">{esc(k["firma"])}, {esc(k["adresse"]["strasse"])}, {esc(k["adresse"]["plz"])} {esc(k["adresse"]["ort"])}</a>
      <a href="{tel_href(TEL)}">Tel: {esc(TEL_DISPLAY)}</a>
      <a href="mailto:{k['email']}">{k['email']}</a>
    </nav>
  </div>
  <div>
    <h3>Öffnungszeiten</h3>
    <div class="oeff">{oeff}</div>
  </div>
</div>
<div class="footer-meta">
  <span>© {datetime.date.today().year} {esc(k["firma"])} · {k["hrb"]} · AG Mönchengladbach</span>
  <a href="/impressum/">Impressum</a>
  <a href="/datenschutz/">Datenschutz</a>
</div>"""

def local_schema():
    op = ["Mo-Th 08:00-17:00", "Fr 07:00-17:00", "Sa 08:00-13:00"]
    s = {
        "@context": "https://schema.org", "@type": "LocalBusiness",
        "@id": f"https://{DOMAIN}/#business",
        "name": k["firma"], "description": SITE_META["beschreibung"],
        "url": f"https://{DOMAIN}/", "telephone": TEL, "email": k["email"],
        "image": f"https://{DOMAIN}{SITE_META['og_bild']}",
        "address": {"@type": "PostalAddress", "streetAddress": k["adresse"]["strasse"],
                    "postalCode": k["adresse"]["plz"], "addressLocality": k["adresse"]["ort"],
                    "addressRegion": k["adresse"]["bundesland"], "addressCountry": "DE"},
        "geo": {"@type": "GeoCoordinates", "latitude": 51.146391, "longitude": 6.446307},
        "openingHours": op, "areaServed": {"@type": "Place", "name": k["servicegebiet"]},
        "founder": {"@type": "Person", "name": k["geschaeftsfuehrer"]},
        "priceRange": "$$",
    }
    return json.dumps(s, ensure_ascii=False)

def breadcrumb_schema(path):
    items = [{"@type": "ListItem", "position": 1, "name": "Start", "item": f"https://{DOMAIN}/"}]
    name = dict((n["url"], n["titel"]) for n in NAV).get(path)
    if name:
        items.append({"@type": "ListItem", "position": 2, "name": name, "item": f"https://{DOMAIN}{path}"})
    return json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}, ensure_ascii=False)

def faq_schema():
    return json.dumps({"@context": "https://schema.org", "@type": "FAQPage",
                       "mainEntity": [{"@type": "Question", "name": f["f"],
                                       "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in faq]},
                      ensure_ascii=False)

def page(title, desc, body, path, schema=None, og_img=None):
    canonical = f"https://{DOMAIN}{path}"
    schemas = [breadcrumb_schema(path)] if path != "/" else []
    if schema: schemas.append(schema)
    schema_html = '<script type="application/ld+json">' + "</script>\n<script type=\"application/ld+json\">".join(schemas) + "</script>" if schemas else ""
    og = og_img or SITE_META["og_bild"]
    tpl = string.Template(open(os.path.join(SRC, "layout.html"), encoding="utf-8").read())
    html = tpl.substitute(
        TITLE=esc(title), DESC=esc(desc), CANONICAL=canonical,
        OG=f"https://{DOMAIN}{og}", NAV=nav_html(path), FOOTER=footer_html(),
        BODY=body, SCHEMA=schema_html, CSS="/assets/style.css",
    )
    out_dir = os.path.join(DIST, path.strip("/"))
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, "index.html") if path != "/" else os.path.join(DIST, "index.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    return path

def img_tag(src, alt, cls="", width=None, height=None, loading="lazy", full=None, cap=None):
    attrs = f'class="{cls}" ' if cls else ""
    if width: attrs += f'width="{width}" '
    if height: attrs += f'height="{height}" '
    data = f' data-full="{full}" data-cap="{esc(cap) if cap else ""}"' if full else ""
    return f'<img {attrs}src="{src}" alt="{esc(alt)}" loading="{loading}"{data}>'

# ---------- Seiten ----------
def hero(imgs):
    return f"""
<section class="hero">
  <div class="hero-media">{img_tag(SITE_META['og_bild'], "Restaurierung eines denkmalgeschützten Gebäudes durch A-Bau Meisterbetrieb Mönchengladbach", loading="eager", width=1600)}</div>
  <div class="hero-content container">
    <span class="eyebrow">Meisterbetrieb · Mönchengladbach &amp; NRW</span>
    <h1>Mit Vertrauen bauen –<br>mit Qualität leben</h1>
    <p class="lead">Wir bauen nicht nur – wir bewahren, gestalten und entwickeln. Vom denkmalgeschützten Gebäude bis zum schlüsselfertigen Neubau: Qualität, Verlässlichkeit und echte Handwerkskunst.</p>
    <div class="btn-row">
      <a class="btn btn-primary btn-lg" href="/leistungen/">Leistungen entdecken</a>
      <a class="btn btn-ghost btn-lg" style="color:#fff;border-color:rgba(255,255,255,.4)" href="/kontakt/">Kostenloses Angebot</a>
    </div>
    <div class="trust-line">
      <span><strong>HRB 18836</strong> AG Mönchengladbach</span>
      <span><strong>Meisterbetrieb</strong> seit 2019</span>
      <span><strong>{esc(k['servicegebiet'])}</strong></span>
      <span>Bewertung <strong>5/5</strong> auf 11880.com</span>
    </div>
  </div>
</section>
<section class="trustbar" aria-label="Vertrauensmerkmale">
  <div class="container">
    <div class="t-item"><span class="t-ico">🏛️</span><div><div class="t-title">Denkmalpflege</div><div class="t-sub">Substanzschonende Restaurierung historischer Bauten</div></div></div>
    <div class="t-item"><span class="t-ico">🏥</span><div><div class="t-title">Gesundheitsbau</div><div class="t-sub">Komplexe Krankenhausprojekte, schlüsselfertig</div></div></div>
    <div class="t-item"><span class="t-ico">🔧</span><div><div class="t-title">Alles aus einer Hand</div><div class="t-sub">Bau, Ausbau, Installationen, Transport</div></div></div>
    <div class="t-item"><span class="t-ico">📞</span><div><div class="t-title">Persönlich &amp; transparent</div><div class="t-sub">Feste Preise, klare Termine, direkter Draht</div></div></div>
  </div>
</section>"""

def leistungen_teaser():
    cards = "".join(f"""
    <a class="card" href="/leistungen/#{l['id']}">
      <div class="card-img">{img_tag(l['bild'], l['titel'] + ' – A-Bau Meisterbetrieb Mönchengladbach', width=800)}</div>
      <div class="card-body"><h3>{esc(l['titel'])}</h3><p>{esc(l['kurz'])}</p><span class="card-link">Mehr erfahren →</span></div>
    </a>""" for l in leistungen[:6])
    return f"""
<section id="leistungen">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Leistungen</span><h2>Fachgerechte Bauleistungen von A-Bau</h2>
    <p>Unser moderner Baubetrieb bietet ein Spektrum von sensiblen Restaurationen bis hin zum schlüsselfertigen Neubau – mit hoher Zuverlässigkeit, Qualität und handwerklichem Können.</p></div>
    <div class="grid grid-3">{cards}
      <a class="card" href="/leistungen/#transport" style="align-items:center;justify-content:center;text-align:center;padding:20px">
        <span style="font-size:2rem">🚚</span><h3>Europaweite Transporte</h3><p class="card-link">Alle 7 Leistungen →</p>
      </a>
    </div>
  </div>
</section>"""

def referenzen_teaser():
    items = "".join(f"""
    <a class="card" href="/referenzen/#{r['id']}">
      <div class="card-img">{img_tag('/assets/' + r['bilder'][0], r['titel'] + ' – A-Bau Meisterbetrieb', width=800)}</div>
      <div class="card-body"><h3>{esc(r['titel'])}</h3><p>{esc(r['text'])}</p><span class="card-link">Projekte ansehen →</span></div>
    </a>""" for r in referenzen[:3])
    return f"""
<section id="referenzen" style="background:var(--bg-soft)">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Referenzen</span><h2>Projekte, die für sich sprechen</h2>
    <p>Einblicke in unsere Arbeit: Restaurierung, Gesundheitsbau, Innenausbau und Neubau.</p></div>
    <div class="grid grid-3">{items}</div>
    <p class="mt-3"><a class="btn btn-ghost" href="/referenzen/">Alle Referenzen ansehen</a></p>
  </div>
</section>"""

def warum():
    return f"""
<section id="warum">
  <div class="container grid-2" style="display:grid;align-items:center;gap:48px">
    <div class="section-head" style="margin:0">
      <span class="eyebrow">Über uns</span>
      <h2>Handwerk mit Verantwortung</h2>
      <p>A-Bau Meisterbetrieb GmbH ist ein eingetragenes Bauunternehmen (AG Mönchengladbach, HRB 18836) mit Sitz in Mönchengladbach-Geistenbeck. Unsere Priorität: Erhaltung und Restaurierung historischer Bauwerke – mit Qualität, die den langfristigen Wert Ihrer Projekte sicherstellt.</p>
      <ul style="display:grid;gap:10px;list-style:none;padding:0">
        <li>✓ Eigene Gewerke &amp; geprüfte Partner</li>
        <li>✓ Transparente Angebote – feste Preise</li>
        <li>✓ Persönliche Betreuung durch Geschäftsführer Albert Pfeiffer</li>
        <li>✓ Gewährleistung &amp; saubere Übergabe</li>
      </ul>
      <p class="mt-2"><a class="btn btn-dark" href="/ueber-uns/">Mehr über uns</a></p>
    </div>
    <div class="leistung-img">{img_tag('/assets/sanierung/f344eb61-0eff-4ae1-bd94-0d1a0bc4fec1.webp', "Sanierung und Restaurierung – A-Bau Meisterbetrieb Mönchengladbach", width=900)}</div>
  </div>
</section>"""

def faq_teaser():
    items = "".join(f'<details><summary>{esc(f["f"])}<span class="chev">▾</span></summary><div class="faq-a">{esc(f["a"])}</div></details>' for f in faq[:5])
    return f"""
<section id="faq" style="background:var(--bg-soft)">
  <div class="container">
    <div class="section-head"><span class="eyebrow">FAQ</span><h2>Häufige Fragen</h2></div>
    <div class="faq" style="max-width:760px">{items}</div>
    <p class="mt-2"><a href="/faq/">Alle Fragen &amp; Antworten</a></p>
  </div>
</section>"""

def cta_band():
    return f"""
<section class="cta-band">
  <div class="container">
    <span class="eyebrow">Kontakt</span>
    <h2>Ihr Projekt in guten Händen</h2>
    <p>Beschreiben Sie uns kurz Ihr Vorhaben – wir melden uns zeitnah mit einer ehrlichen Einschätzung.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn-primary btn-lg" href="/kontakt/">Angebot anfordern</a>
      <a class="btn btn-ghost btn-lg" style="color:#fff;border-color:rgba(255,255,255,.4)" href="{tel_href(TEL)}">Rufen Sie an: {esc(TEL_DISPLAY)}</a>
    </div>
  </div>
</section>"""

def kontakt_body():
    oeff = "".join(f'<div><span>{esc(r["tag"])}</span><b>{esc(r["zeit"])}</b></div>' for r in k["oeffnungszeiten"])
    return f"""
<section>
  <div class="container">
    <div class="section-head"><span class="eyebrow">Kontakt</span><h2>Sprechen wir über Ihr Bauvorhaben</h2>
    <p>Ob Denkmalrestaurierung, Umbau oder Neubau: Beschreiben Sie Ihr Anliegen – wir melden uns zeitnah mit einer ersten Einschätzung.</p></div>
    <div class="kontakt-grid">
      <form class="form" id="kontaktform" novalidate>
        <div class="honeypot" aria-hidden="true"><label>Firma<input type="text" name="firma" tabindex="-1" autocomplete="off"></label></div>
        <div><label for="k-name">Name *</label><input id="k-name" name="name" required autocomplete="name" maxlength="120"></div>
        <div><label for="k-email">E-Mail *</label><input id="k-email" name="email" type="email" required autocomplete="email" maxlength="160"></div>
        <div><label for="k-tel">Telefon</label><input id="k-tel" name="telefon" type="tel" autocomplete="tel" maxlength="40"></div>
        <div><label for="k-msg">Ihr Anliegen *</label><textarea id="k-msg" name="nachricht" required maxlength="4000" placeholder="Kurze Beschreibung Ihres Projekts, Ort und Zeitrahmen …"></textarea></div>
        <label style="font-size:.9rem;display:flex;gap:10px;align-items:flex-start"><input type="checkbox" name="einwilligung" required style="min-height:auto;width:auto;margin-top:3px"> Ich willige ein, dass meine Angaben zur Bearbeitung der Anfrage verarbeitet werden. (<a href="/datenschutz/">Datenschutz</a>) *</label>
        <p class="status" id="k-status" role="status" aria-live="polite" hidden></p>
        <button class="btn btn-primary btn-lg" type="submit" id="k-submit">Nachricht senden</button>
        <p class="form-note">* Pflichtfelder. Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.</p>
      </form>
      <div style="display:grid;gap:20px;align-content:start">
        <div class="nap-card">
          <h3 style="color:#fff;margin:0">{esc(k["firma"])}</h3>
          <p style="margin:0;color:rgba(242,239,233,.85)">{esc(k["adresse"]["strasse"])}<br>{esc(k["adresse"]["plz"])} {esc(k["adresse"]["ort"])} ({esc(k["adresse"]["stadtteil"])})</p>
          <p style="margin:0"><a href="{tel_href(TEL)}">Tel: {esc(TEL_DISPLAY)}</a><br><a href="{tel_href(k['telefon_mobil'])}">Mobil: {esc(k['telefon_mobil'])}</a><br><a href="mailto:{k['email']}">{k['email']}</a></p>
          <p style="margin:0;font-size:.85rem;color:rgba(242,239,233,.65)">{k["hrb"]} · Amtsgericht Mönchengladbach · GF {esc(k["geschaeftsfuehrer"])}</p>
          <div class="oeff"><b>Öffnungszeiten</b>{oeff}</div>
        </div>
        <div class="map-wrap">
          <noscript><iframe title="Karte: Standort A-Bau in Mönchengladbach" src="https://www.openstreetmap.org/export/embed.html?bbox=6.4285%2C51.1365%2C6.4645%2C51.1565&amp;layer=mapnik&amp;marker=51.146391%2C6.446307" loading="lazy"></iframe></noscript>
          <div id="karte-hinweis" style="padding:16px;text-align:center;font-size:.9rem;color:var(--text-mut);display:flex;flex-direction:column;gap:10px;align-items:center">
            <span>Karte von OpenStreetMap – wird erst nach Klick geladen (Datenschutz).</span>
            <button class="btn btn-ghost" id="karte-laden" type="button" style="min-height:44px">Karte laden</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<script>
(function(){{
  var f=document.getElementById('kontaktform'),st=document.getElementById('k-status'),btn=document.getElementById('k-submit');
  f.addEventListener('submit',function(e){{
    e.preventDefault();
    if(!f.checkValidity()){{f.reportValidity();return;}}
    btn.disabled=true;btn.textContent='Wird gesendet …';
    var d=Object.fromEntries(new FormData(f).entries());
    fetch('/api/contact',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify(d)}})
    .then(function(r){{return r.json()}})
    .then(function(j){{
      st.hidden=false;
      if(j.ok){{st.className='status ok';st.textContent='Vielen Dank! Ihre Nachricht ist angekommen – wir melden uns zeitnah.';f.reset();}}
      else{{st.className='status err';st.textContent=j.error||'Versand fehlgeschlagen. Bitte rufen Sie uns an: {esc(TEL_DISPLAY)}';}}
    }}).catch(function(){{st.hidden=false;st.className='status err';st.textContent='Versand fehlgeschlagen. Bitte rufen Sie uns an: {esc(TEL_DISPLAY)}';}})
    .finally(function(){{btn.disabled=false;btn.textContent='Nachricht senden';}});
  }});
  var kl=document.getElementById('karte-laden');
  kl.addEventListener('click',function(){{
    var w=document.getElementById('karte-hinweis');
    w.innerHTML='<iframe title="Karte: Standort A-Bau in Mönchengladbach" src="https://www.openstreetmap.org/export/embed.html?bbox=6.4285%2C51.1365%2C6.4645%2C51.1565&layer=mapnik&marker=51.146391%2C6.446307" loading="lazy"></iframe>';
  }});
}})();
</script>"""

def index_body():
    return hero(None) + leistungen_teaser() + referenzen_teaser() + warum() + faq_teaser() + cta_band()

def leistungen_body():
    sections = "".join(f"""
    <div class="leistung" id="{l['id']}">
      <div class="leistung-img">{img_tag(l['bild'], l['titel'] + ' – A-Bau Meisterbetrieb Mönchengladbach', width=900)}</div>
      <div>
        <span class="eyebrow">Leistung</span>
        <h2>{esc(l['titel'])}</h2>
        <p style="color:var(--text-mut)">{esc(l['text'])}</p>
        <ul>{''.join('<li>' + esc(p) + '</li>' for p in l['punkte'])}</ul>
        <p class="mt-2"><a class="btn btn-dark" href="/kontakt/">Unverbindlich anfragen</a></p>
      </div>
    </div>""" for l in leistungen)
    return f"""
<section style="padding-bottom:0"><div class="container">
  <div class="section-head"><span class="eyebrow">Leistungen</span>
  <h1>Professionelle Bauleistungen von A-Bau</h1>
  <p>Unser moderner Baubetrieb mit langjähriger Erfahrung bietet ein Spektrum von sensiblen Restaurationen bis hin zum schlüsselfertigen Neubau. Unsere Kunden schätzen nicht nur die handwerkliche Qualität, sondern auch persönliche Betreuung und transparente Kommunikation.</p></div>
</div></section>
{sections}
{cta_band()}"""

def referenzen_body():
    blocks = "".join(f"""
    <div class="leistung" id="{r['id']}" style="padding:40px 0">
      <div style="width:100%">
        <span class="eyebrow">Referenz</span><h2>{esc(r['titel'])}</h2>
        <p style="color:var(--text-mut)">{esc(r['text'])}</p>
        <div class="gallery">{''.join(gallery_item('/assets/' + b, r['titel']) for b in r['bilder'])}</div>
        {('<video controls preload="metadata" poster="/assets/krankenhaus/IMG_1414.webp" style="width:100%;max-width:520px;border-radius:12px;margin-top:14px" title="Projektvideo"><source src="/assets/videos/' + r['video'] + '" type="video/mp4">Ihr Browser unterstützt kein Video.</video>') if r.get('video') else ''}
      </div>
    </div>""" for r in referenzen)
    return f"""
<section style="padding-bottom:0"><div class="container">
  <div class="section-head"><span class="eyebrow">Referenzen</span>
  <h1>Projekte, die für sich sprechen</h1>
  <p>Einblicke in unsere Arbeit – Restaurierung, Gesundheitsbau, Innenausbau und Neubau. Konkrete Projekt-Referenzen (Ort, Jahr, Umfang) stellen wir auf Anfrage gern vor.</p></div>
</div></section>
{blocks}
{cta_band()}"""

def gallery_item(src, cap):
    alt = "Projektfoto: " + cap + " – A-Bau Meisterbetrieb Mönchengladbach"
    return f'<figure>{img_tag(src, alt, full=src, cap=cap)}<figcaption>{esc(cap)}</figcaption></figure>'

def faq_body():
    items = "".join(f'<details><summary>{esc(f["f"])}<span class="chev">▾</span></summary><div class="faq-a">{esc(f["a"])}</div></details>' for f in faq)
    return f"""
<section><div class="container" style="max-width:820px">
  <div class="section-head"><span class="eyebrow">FAQ</span><h1>Häufige Fragen &amp; Antworten</h1>
  <p>Antworten auf die häufigsten Fragen zu unseren Leistungen, Abläufen und Konditionen. Ihre Frage ist nicht dabei? <a href="/kontakt/">Kontaktieren Sie uns</a>.</p></div>
  <div class="faq">{items}</div>
  {cta_band().replace('<section class="cta-band">', '<section class="cta-band mt-3">')}
</div></section>"""

def md_page_body(html):
    return f'<section><div class="container" style="max-width:820px">{html}</div></section>'

def kontakt_page_body(): return kontakt_body()
def impressum_page_body(): return md_page_body(md_file("impressum.md"))
def datenschutz_page_body(): return md_page_body(md_file("datenschutz.md"))
def ueber_uns_page_body(): return md_page_body(md_file("ueber-uns.md"))

# ---------- Build ----------
os.makedirs(DIST, exist_ok=True)
import shutil
for d in ("assets",):
    src_d = os.path.join(PUB, d)
    dst_d = os.path.join(DIST, d)
    if os.path.exists(dst_d): shutil.rmtree(dst_d)
    shutil.copytree(src_d, dst_d)
shutil.copy(os.path.join(SRC, "style.css"), os.path.join(DIST, "assets/style.css"))
shutil.copy(os.path.join(SRC, "main.js"), os.path.join(DIST, "assets/main.js"))
shutil.copy(os.path.join(SRC, "chat.js"), os.path.join(DIST, "assets/chat.js"))

pages = [
    ("/", "Start – A-Bau Meisterbetrieb GmbH", SITE_META["beschreibung"], index_body, local_schema()),
    ("/leistungen/", "Leistungen – A-Bau Meisterbetrieb Mönchengladbach", "Restaurierung denkmalgeschützter Bauten, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung, Installationen und Transporte – A-Bau Meisterbetrieb GmbH in Mönchengladbach.", leistungen_body, None),
    ("/referenzen/", "Referenzen – A-Bau Meisterbetrieb Mönchengladbach", "Projekte von A-Bau: Altbau-Erhaltung, Gesundheitsbau, Raumgestaltung, Schlüsselfertigbau, Badezimmer und Handwerkskunst im Detail.", referenzen_body, None),
    ("/ueber-uns/", "Über uns – A-Bau Meisterbetrieb GmbH", "A-Bau Meisterbetrieb GmbH: eingetragenes Bauunternehmen (HRB 18836 AG Mönchengladbach), Geschäftsführer Albert Pfeiffer – Handwerk mit Verantwortung.", ueber_uns_page_body, None),
    ("/faq/", "FAQ – A-Bau Meisterbetrieb Mönchengladbach", "Häufige Fragen zu Leistungen, Ablauf, Region, Angeboten und Öffnungszeiten von A-Bau Meisterbetrieb in Mönchengladbach.", faq_body, faq_schema()),
    ("/kontakt/", "Kontakt – A-Bau Meisterbetrieb GmbH", "Kontakt zu A-Bau Meisterbetrieb GmbH: Luisental 69, 41199 Mönchengladbach, Tel +49 2166 9925056, kontakt@a-bau.info – kostenlose Angebote.", kontakt_page_body, None),
    ("/impressum/", "Impressum – A-Bau Meisterbetrieb GmbH", "Impressum der A-Bau Meisterbetrieb GmbH, Luisental 69, 41199 Mönchengladbach, HRB 18836 AG Mönchengladbach.", impressum_page_body, None),
    ("/datenschutz/", "Datenschutz – A-Bau Meisterbetrieb GmbH", "Datenschutzerklärung der Website a-bau.info – Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.", datenschutz_page_body, None),
]
for path, title, desc, body_fn, schema in pages:
    page(title, desc, body_fn(), path, schema)

# 404
tpl404 = string.Template(open(os.path.join(SRC, "layout.html"), encoding="utf-8").read())
html404 = tpl404.substitute(
    TITLE="Seite nicht gefunden – A-Bau Meisterbetrieb", DESC="404",
    CANONICAL=f"https://{DOMAIN}/404.html", OG=f"https://{DOMAIN}{SITE_META['og_bild']}",
    NAV=nav_html("/"), FOOTER=footer_html(),
    BODY='<section class="err-page"><h1>404</h1><h2>Diese Seite gibt es nicht (mehr).</h2><p>Vielleicht hilft die Navigation oder die <a href="/leistungen/">Leistungsübersicht</a>.</p><p><a class="btn btn-primary" href="/">Zur Startseite</a></p></section>',
    SCHEMA="", CSS="/assets/style.css",
)
open(os.path.join(DIST, "404.html"), "w", encoding="utf-8").write(html404)

# robots + sitemap
with open(os.path.join(DIST, "robots.txt"), "w") as f:
    f.write(f"User-agent: *\nAllow: /\n\nSitemap: https://{DOMAIN}/sitemap.xml\n")
urls = ["", "/leistungen/", "/referenzen/", "/ueber-uns/", "/faq/", "/kontakt/", "/impressum/", "/datenschutz/"]
with open(os.path.join(DIST, "sitemap.xml"), "w") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u in urls:
        f.write(f"  <url><loc>https://{DOMAIN}{u}</loc><lastmod>{NOW}</lastmod></url>\n")
    f.write("</urlset>\n")

# _headers (Statik-Server: Security-Header + noindex bis Abnahme)
with open(os.path.join(DIST, "_headers"), "w") as f:
    f.write("""/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Robots-Tag: noindex, nofollow
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; frame-src https://www.openstreetmap.org; connect-src 'self'; base-uri 'self'; form-action 'self'
/assets/*
  Cache-Control: public, max-age=31536000, immutable
""")

print("BUILD OK:", NOW)
for root, dirs, files in os.walk(DIST):
    for fn in files:
        p = os.path.join(root, fn)
        print(f"  {os.path.relpath(p, DIST)}  {os.path.getsize(p)} B")
