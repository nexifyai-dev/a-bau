import { MetadataRoute } from "next";

export const dynamic = "force-static";
const BASE = "https://a-bau.nexifyai.cloud";

export default function sitemap(): MetadataRoute.Sitemap {
  const leistungen = ["denkmalrestaurierung", "innenausbau", "krankenhausbau", "schluesselfertigbau", "sanierung", "installationen", "transport"];
  const stadtteile = ["geistenbeck", "moenchengladbach-city", "eicken-wickrath", "rheydt", "odenkirchen-wickrathberg-hardt", "niers-volksgarten-umfeld"];
  const staticPages = ["", "/leistungen/", "/referenzen/", "/stadtteile/", "/ueber-uns/", "/faq/", "/kontakt/"];
  const routes: MetadataRoute.Sitemap = [
    ...staticPages.map((p) => ({ url: `${BASE}${p}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...leistungen.map((s) => ({ url: `${BASE}/leistungen/${s}/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...stadtteile.map((s) => ({ url: `${BASE}/stadtteile/${s}/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
  return routes;
}
