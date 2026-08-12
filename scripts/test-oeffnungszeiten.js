// Unit-Check istGeoeffnet (A.11) — Regression-Schutz: Öffnungszeiten-Logik
// extrahiert aus site/src/lib/kontakt.ts und gegen Tabelle geprüft.
// Aufruf: node scripts/test-oeffnungszeiten.js (aus Repo-Root)
const path = require("path");
const t = require("fs").readFileSync(path.join(__dirname, "../site/src/lib/kontakt.ts"), "utf8");
let m = t.match(/export function istGeoeffnet[\s\S]*?\n}/)[0];
m = m
  .replace("export function istGeoeffnet", "function istGeoeffnet")
  .replace(/: boolean/, "")
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
];
let ok = 0;
for (const [iso, exp] of tests) {
  const got = istGeoeffnet(new Date(iso));
  if (got === exp) ok++;
  else console.log("FAIL", iso, "->", got, "erwartet", exp);
}
console.log(ok === tests.length ? "ALLE " + ok + " PASS" : "FEHLER: " + ok + "/" + tests.length);
process.exit(ok === tests.length ? 0 : 1);
