// YAML-Data-Loader: liest data/*.yaml zur Build-Zeit (Vite/Rolldown in Astro 7
// unterstützt keinen nativen .yaml-Import mehr). Quelle bleibt YAML (zentrale
// Wahrheitsquelle, Plan §Ziel 7).
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';

// Build-Zeit-Pfad: Astro prerendert aus dist/.prerender — daher Datenpfad
// relativ zum Projekt-Root (process.cwd() = site/ während `pnpm build`).
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CONTENT_DIR = path.join(process.cwd(), '..', 'content');

function load<T = any>(file: string): T {
  const full = path.join(DATA_DIR, file);
  return yaml.load(fs.readFileSync(full, 'utf8')) as T;
}

function loadContent<T = any>(file: string): T {
  const full = path.join(CONTENT_DIR, file);
  return yaml.load(fs.readFileSync(full, 'utf8')) as T;
}

export const kontakt = load('kontakt.yaml');
export const leistungen = load('leistungen.yaml');
export const faq = load('faq.yaml');
export const referenzen = load('referenzen.yaml');
export const stadtteile = loadContent('stadtteile.yaml');
export const siteMeta = loadContent('site.yaml');
