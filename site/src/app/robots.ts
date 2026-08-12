import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/impressum/", "/datenschutz/", "/cookie-richtlinie/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
