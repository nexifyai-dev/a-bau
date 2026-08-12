// Unit-Check istGeoeffnet (A.11) — Regression-Schutz: Öffnungszeiten-Logik
// extrahiert aus site/src/lib/kontakt.ts und gegen Tabelle geprüft.
// Aufruf: node scripts/test-oeffnungszeiten.js (aus Repo-Root)
const path = require("path");
const t = require("fs").readFileSync(path.join(__dirname, "../site/src/lib/kontakt.ts"), "utf8");
let m = t.match(/export function ostersonntag[\s\S]*?\n}\n\nexport function istFeiertag[\s\S]*?\n}\n\nexport function istGeoeffnet[\s\S]*?\n}/)[0];
m = m
  .replace(/export function /g, "function ")
  .replace(/: boolean/g, "")
  .replace(/: Date/g, "")
  .replace(/: number/g, "")
  .replace(/as Record<string, number>/, "");
eval(m);
// Wochentage 2026: Mi=12.08, Do=13.08, Fr=14.08, Sa=15.08, So=16.08
const tests = [
  ["2026-08-12T17:30:00+02:00", false],
  ["2026-08-12T16:30:00+02:00", true],
  ["2026-08-14T18:00:00+02:00", false],
  ["2026-08-14T08:00:00+02:00", true],
  ["2026-08-14T06:59:00+02:00", false],
  ["2026-08-15T12:59:00+02:00", true],
  ["2026-08-15T13:00:00+02:00", false],
  ["2026-08-15T10:00:00+02:00", true],
  ["2026-08-16T12:00:00+02:00", false],
  ["2026-08-12T23:00:00Z", false], // = Mi 01:00 MESZ -> zu
  ["2026-08-12T14:30:00Z", true], // = 16:30 MESZ -> offen
  ["2026-08-12T12:30:00Z", true], // = 14:30 MESZ -> offen
  // R61 Feiertage NRW (beweglich 2026: Ostern 05.04.; 2027: Ostern 28.03.)
  ["2027-01-01T10:00:00+01:00", false], // Neujahr (Fr)
  ["2027-03-26T10:00:00+01:00", false], // Karfreitag
  ["2027-03-29T10:00:00+02:00", false], // Ostermontag
  ["2027-05-01T10:00:00+02:00", false], // 1. Mai (Sa — Feiertag schlägt Samstag-Öffnung)
  ["2027-05-06T10:00:00+02:00", false], // Christi Himmelfahrt (Do)
  ["2027-05-17T10:00:00+02:00", false], // Pfingstmontag
  ["2027-05-27T10:00:00+02:00", false], // Fronleichnam (Do, NRW)
  ["2027-11-01T10:00:00+01:00", false], // Allerheiligen (Mo)
  ["2026-12-25T10:00:00+01:00", false], // 1. Weihnachtstag (Fr)
  ["2027-06-15T10:00:00+02:00", true],  // normaler Dienstag -> offen
  ["2027-06-18T08:00:00+02:00", true],  // normaler Freitag 08:00 -> offen
];
let ok = 0;
for (const [iso, exp] of tests) {
  const got = istGeoeffnet(new Date(iso));
  if (got === exp) ok++;
  else console.log("FAIL", iso, "->", got, "erwartet", exp);
}
console.log(ok === tests.length ? "ALLE " + ok + " PASS" : "FEHLER: " + ok + "/" + tests.length);
process.exit(ok === tests.length ? 0 : 1);
