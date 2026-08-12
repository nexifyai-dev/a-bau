# ADR-003: Design-System — Tokens, Spacing-Skala, Fonts, Hover-Regel

## Kontext
Design war punktuell (fehlende `--space`-Skala → alle Abstände kollabierten; Hover-Kontrast-Fehler).

## Entscheidung
- **Spacing-Tokens** `--space-1…9` (4/8/12/16/24/32/48/64/96 px) in `:root` — einzige Abstandsquelle.
  Section-Padding responsiv: 48 (mobile) / 64 (tablet) / 96 px (desktop).
- **Fonts**: Fraunces (Headings) + Work Sans (Body), self-hosted via `next/font/local`
  (automatisches Preload, hashed). Keine weiteren Font-Familien.
- **Container**: `--maxw: 1200px`, horizontales Padding 24 px (16 px ≤ 480 px).
- **Buttons**: zentrale `.btn`-Klasse; **Hover-Regel: jede `.btn-*`-Variante setzt `color` im
  `:hover` explizit** — globales `a:hover` (Spezifität 0,1,1) überschrieb sonst die Button-Textfarbe
  (weiß → dunkelgrün auf dunkelgrün = unlesbar).
- **Kontrast-Referenz**: Text auf Weiß ≥ 4.5:1 — `--color-accent-text: #007a36` (5.46:1),
  Gold `#F5B800` NUR auf dunklen Flächen (8.3:1 dort), Grün `#009A44` nur für UI/Großtext (3.68:1).

## Begründung
Ein Token-System statt Einzelkorrekturen (Auftrag B.37/C.13); Hover-Regel verhindert die
wiederkehrende Unleserlichkeits-Klasse.

## Alternativen
Tailwind-Utilities je Stelle — verworfen (Inkonsistenz, keine zentrale Skala).

## Konsequenzen
- Neue Komponenten nutzen ausschließlich die Tokens (`var(--space-N)`, `var(--font-*)`, `.btn`).
- Kein neuer Font ohne ADR.

## Datum
2026-08-12
