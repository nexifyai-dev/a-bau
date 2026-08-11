# FINALES KONZEPT — A-Bau Website (Referenz: GAG Köln, übertragen auf Mönchengladbach)

**Datum:** 2026-08-10 · **Basis:** Visuelle Analyse GAG-Köln (Home, 404-Pattern) + A-Bau-Ist (alle Seiten, Desktop+Mobile) · **Vorgaben:** markenrechtlich sauber (kein Borussia-Logo/-Wappen), hochwertige Icons (keine billigen SVG), A-Bau-CI

## Design (übernommen von GAG, adaptiert)
1. **Zweistufiger Header:** oben schmale Utility-Leiste (dunkel, „Mönchengladbach" + Telefon + Öffnungszeiten-Indikator), unten Hauptnavigation (weiß, Logo + Links + Suche-Ersatz = „Angebot anfordern"). Sticky, transluzent.
2. **Typografie:** Headline-Serif (Playfair Display, hochwertig, `font-display: swap`) + Manrope/Outfit für Body — wie GAG (Serif-Headline + Sans-Body). Selbst-gehostet.
3. **Hero:** Vollbild-Hero mit halbtransparenten **zwei Karten** („Ich plane einen Umbau/Restaurierung" / „Ich brauche ein Angebot") — je 4 Verlinkungen. Darunter Vertrauens-Leiste.
4. **Farbwelt (Mönchengladbach, NICHT Borussia-Grün):** warmes dunkles Braun/Anthrazit `#2B2724`, Akzent Backstein-Rot-Braun `#A4501F`, warmes Cremeweiß `#F5F1EA` — Wärme, Handwerk, Mönchengladbach-Textur (Backstein, Fachwerk), kein Borussia-Grün (Markenrecht).
5. **Icons:** keine generischen SVG — hochwertige, selbst entworfene Glyphs aus den Foto-Assets (kleine Bild-Tiles in Nav/Karten) + Chevron-Icons aus Manrope-Font; kein Word-Diamant, kein Stock-Emoji.
6. **Abstände:** großzügig (wie GAG: 60–80 px Section-Gaps, 24–32 px Card-Padding), klare Hierarchie.

## Mönchengladbach-Bezug (GAG ↔ A-Bau Übertragung)
| GAG | A-Bau |
|---|---|
| Stadtbezug Köln (Quartiere, Dom, Altstadt) | Stadtbezug Mönchengladbach (Borussia-Stadt, Niers, Geistenbeck, Münster) |
| Stadtbilder (Kölner Architektur, Park) | Mönchengladbach-Stadtbilder (Borussia-Park Umfeld, Münster, Niers, Skulpturen) — von A-Bau-Fotos + offene Stadtbilder |
| „Quartiere"-Sektion | „Stadtteile & Werk" (Mönchengladbach-Borussia-Kultur: Vereinsgeist, Stadtteile, lokale Bauprojekte) |
| Verlinkungen zu Köln-Ressourcen | Verlinkungen zu Mönchengladbach-Stadt-Seiten (Stadt-Portal, Bauaufsicht, Denkmalschutz, aktuelle Baumaßnahmen) |
| 404 „Hier wird gebaut" (Baustellen-Metapher) | Gleiche Baustellen-Metapher, Mönchengladbach-Motiv |

**Markenrechtlich sauber:** „Borussia" als geographischer Bezug der Stadt genannt, kein Vereins-Logo/-Wappen, keine Warenzeichen. Nur Text-Bezug + Stadtbilder.

## Content-Architektur (abgeleitet auf A-Bau)
- **Neue Sektion „Stadtteile & Projekte"** (Home): Mönchengladbach-Bezug (Geistenbeck, Eicken, City), Borussia-Kultur-Nennung („Die Stadt unserer Borussia"), lokale Projekte-Bilder.
- **Neue Seite `/standort/`** (ersetzt generisches Impressum-Fokus): Mönchengladbach-Seite mit Karte, Stadtbildern, aktuellen Bauarbeiten, Links zur Stadt.
- **Rechtlich:** weiterhin Impressum/Datenschutz/Cookie — GAG hat keine separates Cookie-Seite; wir behalten unsere (rechtlich sauberer).

## Technik
- Astro 7, self-hosted Fonts, alle Bilder WebP, responsive, WCAG 2.2 AA, reduced-motion.
- E2E-Gegentest: Desktop + Mobile, alle Seiten, Chat + Formular, Regression.
