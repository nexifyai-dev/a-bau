import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A-Bau Meisterbetrieb GmbH",
    short_name: "A-Bau",
    description:
      "Bauunternehmen Mönchengladbach: Denkmal-Restaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung & Installationen.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F1EA",
    theme_color: "#009A44",
    lang: "de",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
