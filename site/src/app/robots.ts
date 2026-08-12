import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/impressum/", "/datenschutz/", "/cookie-richtlinie/"] },
    sitemap: "https://a-bau.nexifyai.cloud/sitemap.xml",
  };
}
