// Zentrale Kontaktdaten (NAP-Disziplin) — aus YAML, Fallbacks für Build-Sicherheit
export const KONTAKT = {
  firma: "A-Bau Meisterbetrieb GmbH",
  strasse: "Luisental 69",
  plz: "41199",
  ort: "Mönchengladbach",
  stadtteil: "Geistenbeck",
  tel: "+49 2166 9925056",
  telMobil: "+49 162 1815229",
  email: "kontakt@a-bau.info",
  hrb: "HRB 18836",
  registergericht: "Amtsgericht Mönchengladbach",
  gf: "Albert Pfeiffer",
  gegruendet: "2019",
  oeffnungszeiten: [
    { tag: "Montag–Donnerstag", zeit: "08:00–17:00" },
    { tag: "Freitag", zeit: "07:00–17:00" },
    { tag: "Samstag", zeit: "08:00–13:00" },
  ],
  servicegebiet: "Mönchengladbach & NRW",
  ustIdnr: "DE327030612",
  handwerkskammer: "Handwerkskammer Düsseldorf",
  handwerkskammerBetriebsnummer: "1841351",
} as const;

export function telHref(t: string): string {
  return "tel:" + t.replace(/[^+\d]/g, "").replace("+", "00");
}

export function istGeoeffnet(date = new Date()): boolean {
  const w = date.getDay();
  const h = date.getHours();
  if (w === 0) return false;
  if (w === 6) return h >= 8 && h < 13;
  if (w === 5) return h >= 7 && h < 17;
  return h >= 8 && h < 17;
}
