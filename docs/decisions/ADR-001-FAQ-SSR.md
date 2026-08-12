# ADR-001: FAQ — SSG statt Client-Rendering

## Kontext
FAQ-Seite zeigte leere Accordions (nur ▾) — Feldnamen-Drift: Code las `f.frage`/`f.antwort`,
YAML-Quelle (`site/src/data/faq.yaml`) definiert `f:`/`a:`.

## Problem
Alle 14 FAQ-Einträge waren im gerenderten HTML leer → SEO-/UX-Totalausfall, FAQPage-JSON-LD ohne Inhalte.

## Entscheidung
- Rendering nutzt die tatsächlichen YAML-Felder `f.f` / `f.a` (SSG, initiales HTML vollständig).
- Semantik: `<details>/<summary>` (nativer Accordion, ohne JS bedienbar, Tastatur-nativ).
- FAQPage-JSON-LD spiegelt exakt die sichtbaren Inhalte (Home: Top-8; /faq: alle 14).

## Begründung
SSG > Client-only (Auftrag A.6); native `<details>` braucht kein JS, keine ARIA-Accordion-Logik.

## Alternativen
Client-Accordion mit Daten-Fetch — verworfen (leerer Erst-Render war der Fehler).

## Konsequenzen
- Datenquelle bleibt `faq.yaml` (Single Source of Truth).
- Änderungen an FAQ = YAML editieren → Build (kein Redesign).

## Datum
2026-08-12
