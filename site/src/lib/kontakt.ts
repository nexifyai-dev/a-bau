// Zentrale Kontaktdaten (NAP-Disziplin) — aus YAML, Fallbacks für Build-Sicherheit
export const KONTAKT = {
  firma: "A-Bau Meisterbetrieb GmbH",
  strasse: "Luisental 69",
  plz: "41199",
  ort: "Mönchengladbach",
  stadtteil: "Geistenbeck",
  tel: "+49 2166 9925056",
  email: "e.pfeiffer@a-bau.info",
  hrb: "HRB 18836",
  registergericht: "Amtsgericht Mönchengladbach",
  gf: "Albert Pfeiffer",
  gegruendet: "2019",
  oeffnungszeiten: [
    { tag: "Montag–Donnerstag", zeit: "08:00–16:00" },
    { tag: "Freitag", zeit: "08:00–14:00" },
    { tag: "Samstag", zeit: "Geschlossen" },
    { tag: "Sonn-/Feiertag", zeit: "Geschlossen" },
  ],
  servicegebiet: "Mönchengladbach & NRW",
  ustIdnr: "DE327030612",
  handwerkskammer: "Handwerkskammer Düsseldorf",
  handwerkskammerBetriebsnummer: "1841351",
} as const;

export function telHref(t: string): string {
  return "tel:" + t.replace(/[^+\d]/g, "");
}

// R61 (A.11): Gesetzliche Feiertage NRW — 11 arbeitsfreie (Quelle: feiertage-deutschland.de NRW):
// Neujahr, Karfreitag, Ostermontag, 1. Mai, Christi Himmelfahrt, Pfingstmontag,
// Fronleichnam, 3. Oktober, Allerheiligen, 1./2. Weihnachtstag.
// Datenquelle A-Bau: „Sonn-/Feiertag: Geschlossen“ — Feiertag => geschlossen.
export function ostersonntag(jahr: number): Date {
  // Meeus/Jones/Butcher (gregorianisch) — identisch für 1900–2099, inkl. 2026/2027.
  const a = jahr % 19, b = Math.floor(jahr / 100), c = jahr % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-basiert
  const tag = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(jahr, monat, tag);
}

export function istFeiertag(date: Date): boolean {
  const y = date.getFullYear();
  const o = ostersonntag(y);
  const jahrFix = (mo: number, tag: number) => new Date(y, mo - 1, tag);
  const oPlus = (t: number) => new Date(y, o.getMonth(), o.getDate() + t);
  const feiertage = [
    jahrFix(1, 1), jahrFix(5, 1), jahrFix(10, 3), jahrFix(11, 1), jahrFix(12, 25), jahrFix(12, 26),
    oPlus(-2),  // Karfreitag
    oPlus(1),   // Ostermontag
    oPlus(39),  // Christi Himmelfahrt
    oPlus(50),  // Pfingstmontag
    oPlus(60),  // Fronleichnam (NRW)
  ];
  return feiertage.some((f) => f.getMonth() === date.getMonth() && f.getDate() === date.getDate());
}

export function istGeoeffnet(date = new Date()): boolean {
  // A.11: Öffnungszeiten in EUROPE/BERLIN rechnen — deterministisch für SSR und
  // Client, unabhängig von Server-UTC und Browser-Lokalzeit des Besuchers.
  if (istFeiertag(date)) return false; // R61: „Sonn-/Feiertag: Geschlossen“ (A.11-Lücke geschlossen)
  const parts = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", hour12: false }).formatToParts(date);
  const wd = (parts.find((p) => p.type === "weekday")?.value ?? "").replace(/\.$/, ""); // "Mo" (ICU ohne Punkt, teils "Mo.")
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? -1);
  const tag = ({ Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6, So: 0 } as Record<string, number>)[wd];
  if (tag === undefined) return false;
  // 2026-08-13 (Europe/Berlin): Neue Zeiten Kundenauftrag — Mo–Do 08–16, Fr 08–14, Sa+So zu.
  if (tag === 0 || tag === 6) return false;
  if (tag === 5) return h >= 8 && h < 14;
  return h >= 8 && h < 16;
}
