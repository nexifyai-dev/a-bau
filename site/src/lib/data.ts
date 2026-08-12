// YAML-Loader (Build-Zeit, SSG). Quelle bleibt YAML (zentrale Wahrheitsquelle).
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CONTENT_DIR = path.join(process.cwd(), "..", "content");

function loadData<T = any>(file: string): T {
  return yaml.load(fs.readFileSync(path.join(DATA_DIR, file), "utf8")) as T;
}

export const kontakt = loadData<any>("kontakt.yaml");
export const leistungen = loadData<any>("leistungen.yaml");
export const faq = loadData<any>("faq.yaml");
export const referenzen = loadData<any>("referenzen.yaml");
export const stadtteile = loadData<any>("stadtteile.yaml");
export const siteMeta = loadData<any>("site.yaml");
