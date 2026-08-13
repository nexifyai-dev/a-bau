/**
 * Leistungs-Bilder — EINE Quelle (ADR-003 Design-System; C.8 Single Source of Truth).
 * Keys = Leistungs-Slugs (l.slug || l.id). Nur Pfade, deren Datei in public/assets existiert.
 */
export const LEISTUNGS_BILDER: Record<string, string> = {
  denkmalrestaurierung: "/assets/denkmal/d11ef292-0817-42b3-8eaa-e60171cd3e74.webp",
  innenausbau: "/assets/innenausbau/b1b9855e-0abd-4906-b9f0-ecec14474c16.webp",
  krankenhausbau: "/assets/krankenhaus/IMG_1414.webp",
  schluesselfertigbau: "/assets/schlüsselfertig/313A5EC4-6A48-4A73-9700-47398D4304B4.webp",
  installationen: "/assets/sanierung/5ae308ff-8eee-4589-bb1b-427ca3aa858a.webp",
  sanierung: "/assets/sanierung/f344eb61-0eff-4ae1-bd94-0d1a0bc4fec1.webp",
};
