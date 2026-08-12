# FINALES KONZEPT v2 — A-Bau Website (Referenz: GAG Köln 1:1, Next.js, exakte Farbcodes)

**Datum:** 2026-08-11 · **Basis:** GAG-Köln visuell analysiert (10 Original-Screenshots) + exakte Farbcodes (Borussia, Stadt Mönchengladbach) · **Stack:** Next.js 16 + React 19 + TypeScript (statisch exportierbar) · **Ziel:** professionell, vertrauensvoll, suchmaschinenoptimiert, lokal verankert

---

## 1. EXAKTE FARBCODES (recherchiert, offizielle Quellen)

| Farbe | Zweck | HEX | Quelle |
|---|---|---|---|
| **Borussia-Grün** | Vereins-Akzent, CTA-Hover, Stadtzugehörigkeit | `#009A44` | sportscolorcodes.com (Borussia offiziell: schwarz/weiß/grün) |
| **Borussia-Schwarz** | Header-Utility, Footer, Text | `#000000` | Borussia-Standard |
| **Borussia-Weiß** | Hintergründe, Kontrast | `#FFFFFF` | Borussia-Standard |
| **MG-Rot (St. Vitus)** | Stadt-Akzent, Warnung, Baustellen | `#C8102E` | Stadtwappen MG (Wikipedia/Wikimedia, heraldisch: Rot für Hl. Vitus) |
| **MG-Gold (Jülich)** | Stadt-Akzent, Premium, Trust | `#F5B800` | Stadtwappen MG (Gold für Herzogtum Jülich) |
| **MG-Blau (Gladbach)** | Info, Links, Geographie | `#1A5F9E` | Stadtwappen MG (Blauer Wellenbalken = Gladbach) |
| **Neutral Dark** | Body-Text | `#1F1D1B` | A-Bau (warmes Dunkel) |
| **Neutral Light** | Hintergrund | `#FAF9F7` | A-Bau (warmes Hell) |
| **Neutral Border** | Linien | `#E5E1DA` | A-Bau |

**Markenrecht:** Borussia-Grün/-Schwarz/-Weiß = Farb-Referenz (Farben sind nicht schutzfähig); **kein Borussia-Logo, -Wappen oder „Die Fohlen"-Branding**. Stadt-MG: Farben als Inspiration, kein Stadtwappen als Logo.

---

## 2. GAG-STRUKTUR 1:1 (aus 10 Original-Screenshots)

| GAG-Element | A-Bau-Übertragung |
|---|---|
| Utility-Bar (dunkel, oben): Wohnungsformen-Links, Sprache, „Meine GAG" | **Utility-Bar:** Leistungs-Kurzlinks (Restaurierung, Innenausbau, Krankenhaus, Schlüsselfertig), Sprache (DE), „Kundenbereich"-CTA → /kontakt/ |
| Header: Logo + Dropdown-Nav + Suche | **Header:** A-Bau-Logo + Dropdown-Nav (Leistungen ▾, Referenzen ▾, Stadtteile ▾, Über uns ▾) + Suche (Client, /suche/) |
| Hero: Vollbild + Overlay-Text + 2 Karten („Ich möchte mieten" / „Ich miete bereits") | **Hero:** Vollbild (Mönchengladbach-Stadtbild) + Overlay-Text „Mit Vertrauen bauen – mit Qualität leben" + **2 Karten:** „Ich plane ein Bauprojekt" / „Ich bin Kunde" (je 4 Links) |
| „Unser Portfolio" (3 Cards: Neubau, Frei finanziert, WBS) | **„Unsere Leistungen"** (7 Cards mit Bildern): Denkmal, Innenausbau, Krankenhaus, Schlüsselfertig, Sanierung, Installation, Transport |
| „Weitere Wohnformen" (5 Cards mit Icons) | **„Weitere Leistungen"** (7 Cards mit hochwertigen Foto-Icons): Trockenbau, Estrich, Steinmetz, Fassade, GaLaBau, Elektro, Wasser/Heizung |
| „Quartiere" (narrativ: Warum → Wo) | **„Stadtteile & Quartiere"** (narrativ: „Mönchengladbach ist unsere Heimat — die Stadt von Borussia" → 6 Quartiere mit Fokus) |
| „Was wir sonst noch bieten" (Split: Bild links, Text rechts) | **„Über uns"-Teaser** (Split: Foto links, Text rechts) + Prozess (01–04) |
| Footer: umfangreich, 4 Spalten | **Footer:** 4 Spalten (Leistungen, Stadtteile, Recht, Kontakt) + Borussia-/Stadt-Note |
| Floating Buttons rechts (A11y, Kontakt, Up) | **Floating:** A11y-Button (Textgröße/Kontrast), Chat („A"), Up-Button |
| 404 „Hier wird gebaut" (Baustellen-Metapher) | **404:** „Hier wird gebaut" + Mönchengladbach-Motiv |

---

## 3. STADT-INFOS (Mönchengladbach + Borussia, SEO-optimiert)

- **Neue Seite `/stadt/`** („Mönchengladbach"): Geschichte (Abtei 974, Vitus, Jülich), Stadtteile, Borussia (1900, Raute 1906 — nur Text, kein Logo), aktuelle Baustellen (6 offizielle Links), Veranstaltungen.
- **`/stadtteile/`** erweitert: je Quartier Historie + Projekte + Links.
- **Borussia-Seite** nicht nötig (Markenrecht); stattdessen im Footer: „Mönchengladbach — die Stadt von Borussia. Seit 1900." (Text-Bezug, kein Logo).
- **Schema.org:** LocalBusiness + areaServed (Stadtteile als Place-Objekte), FAQPage, BreadcrumbList, ItemList (Leistungen, Stadtteile), Event (Borussia-Heimspiele nicht — Markenrecht).

---

## 4. SEO (lokal + technisch)
- **Title-Pattern:** „{Leistung} {Stadtteil} – A-Bau Meisterbetrieb Mönchengladbach" (z. B. „Denkmalrestaurierung Geistenbeck").
- **H1:** je Seite eindeutig + Stadt + Leistung.
- **Meta-Description:** 150–160 Zeichen, Call-to-Action, lokale Keywords.
- **Interne Verlinkung:** Leistungen ↔ Stadtteile ↔ Referenzen (Menge: je Leistung 3 Stadtteil-Links, je Stadtteil 3 Leistungs-Links).
- **Sitemap:** alle Seiten + `/stadt/`, `/stadtteile/[slug]/`, `/leistungen/[slug]/`, `/referenzen/`, `/faq/`, `/kontakt/`.
- **Bild-Alt-Texte:** „A-Bau {Leistung} {Stadtteil} Mönchengladbach" (lokal + semantisch).
- **Core Web Vitals:** LCP < 2,5 s, INP < 200 ms, CLS < 0,1 — Next.js Image + Font-Preload + kritische CSS inline.

---

## 5. DESIGN-TOKEN-SYSTEM (sauber, zentral)

```css
/* globals.css — einzige Wahrheitsquelle */
:root {
  /* Farben */
  --color-borussia-green: #009A44;
  --color-borussia-black: #000000;
  --color-borussia-white: #FFFFFF;
  --color-mg-red: #C8102E;
  --color-mg-gold: #F5B800;
  --color-mg-blue: #1A5F9E;
  --color-neutral-dark: #1F1D1B;
  --color-neutral-light: #FAF9F7;
  --color-neutral-border: #E5E1DA;
  /* Semantic */
  --color-bg: var(--color-neutral-light);
  --color-bg-soft: #F1EDE6;
  --color-surface: #FFFFFF;
  --color-text: var(--color-neutral-dark);
  --color-text-2: #4E4A44;
  --color-text-inv: var(--color-borussia-white);
  --color-accent: var(--color-borussia-green);
  --color-accent-city: var(--color-mg-red);
  --color-accent-premium: var(--color-mg-gold);
  --color-accent-info: var(--color-mg-blue);
  --color-cta: var(--color-borussia-green);
  --color-cta-hover: #007a36;
  /* Typography */
  --font-head: 'Playfair Display', Georgia, serif;
  --font-body: 'Manrope', system-ui, sans-serif;
  /* Spacing */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px; --space-9: 96px;
  /* Radius */
  --radius-sm: 8px; --radius-md: 16px; --radius-lg: 24px; --radius-full: 999px;
  /* Shadow */
  --shadow-1: 0 1px 2px rgba(31,29,27,.06), 0 4px 12px rgba(31,29,27,.06);
  --shadow-2: 0 4px 12px rgba(31,29,27,.10), 0 14px 34px rgba(31,29,27,.14);
}
```

## 6. PAGES (Next.js App Router, alle SSG)

| Route | Inhalt | SEO-Fokus |
|---|---|---|
| `/` | GAG-Home 1:1 (Hero + Portfolio + Weitere Leistungen + Stadtteile + Über uns + FAQ-Teaser + CTA) | „Bauunternehmen Mönchengladbach", „Restaurierung Mönchengladbach" |
| `/leistungen/` | 7 Leistungs-Cards (mit Bildern) | „{Leistung} Mönchengladbach" |
| `/leistungen/[slug]/` | Leistungs-Detail (7×) | „{Leistung} {Stadtteil}", „Denkmalrestaurierung Kosten" |
| `/referenzen/` | Galerie + Kategorien | „Referenzen Bauunternehmen Mönchengladbach" |
| `/stadtteile/` | 6 Quartiere + Borussia-Note + Baustellen-Links | „Bauunternehmen Geistenbeck", „Sanierung Rheydt" |
| `/stadtteile/[slug]/` | Stadtteil-Detail (6×) | „{Stadtteil} Bauunternehmen", „{Stadtteil} Sanierung" |
| `/stadt/` | Mönchengladbach-Seite (Geschichte, Borussia, Baustellen) | „Mönchengladbach Geschichte", „Borussia Mönchengladbach", „Baustellen Mönchengladbach" |
| `/ueber-uns/` | Über uns + Prozess + Team | „A-Bau Meisterbetrieb", „Albert Pfeiffer" |
| `/faq/` | 14 FAQ + Schema | „Bauunternehmen Kosten", „Angebot Bau" |
| `/kontakt/` | Formular + Karte + Kontaktdaten | „Kontakt Bauunternehmen Mönchengladbach" |
| `/impressum/`, `/datenschutz/`, `/cookie-richtlinie/` | Recht | — (noindex) |
| `/404/` | Baustellen-Metapher | — |

## 7. FEATURES
- Suche (Client, alle Inhalte indexiert), Consent (TDDDG), Chat-Widget (9Router + FTS5, angepasst an neue Struktur), Formular (Hostinger-SMTP), A11y-Button (Textgröße, Kontrast), PWA-ready (Manifest, Favicon), Print-CSS.
- **Favicon:** Logo als SVG/PNG (32/180/192/512) + Manifest.
- **i18n-ready:** de-DE (einzige Sprache, wie Vorgabe).

## 8. RISIKEN & MITIGATION
- Markenrecht: keine Borussia-Logos, nur Farben + Text-Bezug. Stadt-Wappen nur als Text-Referenz.
- Performance: alle Bilder WebP, lazy, `next/image`; Fonts self-hosted + preload.
- Recht: Rechtstexte bleiben vollständig, anwaltliche Prüfung vor Go-Live.

**Gesamt-Architektur:** sauber, tokenisiert, GAG-getreu, lokal verankert, suchmaschinenoptimiert, markenrechtlich sauber.
