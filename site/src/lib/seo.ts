/** Kürzt Texte für Meta-Descriptions (SEO: ≤ ~160 Zeichen, B.20). */
export const clip = (s: string, n: number) =>
  s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
