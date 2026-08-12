import { MetadataRoute } from "next";
import { leistungen, stadtteile } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
const BASE = `${SITE_URL}`;

function slugify(name: string) {
  return name.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const leistungsSlugs = leistungen.leistungen.map((l: any) => l.slug || l.id);
  const stadtteilSlugs = stadtteile.stadt.quartiere.map((q: any) => slugify(q.name));
  const staticPages = ["/", "/leistungen/", "/referenzen/", "/stadtteile/", "/ueber-uns/", "/faq/", "/kontakt/", "/agb/", "/nutzungsbedingungen/"];
  const hreflang = (url: string) => ({ languages: { de: url, "x-default": url } });
  const routes: MetadataRoute.Sitemap = [
    ...staticPages.map((p) => ({ url: `${BASE}${p}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8, alternates: hreflang(`${BASE}${p}`) })),
    ...leistungsSlugs.map((s: string) => ({ url: `${BASE}/leistungen/${s}/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7, alternates: hreflang(`${BASE}/leistungen/${s}/`) })),
    ...stadtteilSlugs.map((s: string) => ({ url: `${BASE}/stadtteile/${s}/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6, alternates: hreflang(`${BASE}/stadtteile/${s}/`) })),
  ];
  return routes;
}
