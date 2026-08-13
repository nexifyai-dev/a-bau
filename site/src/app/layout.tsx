import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./fonts.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ChatWidget from "@/components/ChatWidget";
import { kontakt as kontaktYaml } from "@/lib/data";
import { KONTAKT } from "@/lib/kontakt";
import { SITE_URL } from "@/lib/site";

// NAP-Drift-Guard (C.7/C.8): kontakt.yaml (Wahrheitsquelle) vs. lib/kontakt.ts (Client-Sicherung).
// Bei Abweichung bricht der Build — verhindert die FAQ-Fehlerklasse (Feldnamen-Drift) für Kontaktdaten.
if (
  kontaktYaml?.telefon_festnetz !== KONTAKT.tel ||
  kontaktYaml?.telefon_mobil !== KONTAKT.telMobil ||
  kontaktYaml?.email !== KONTAKT.email ||
  kontaktYaml?.ust_idnr !== KONTAKT.ustIdnr ||
  `${kontaktYaml?.register ?? ""} ${kontaktYaml?.hrb ?? ""}` !== `${KONTAKT.registergericht} ${KONTAKT.hrb}`
) {
  throw new Error("NAP-Drift: site/src/data/kontakt.yaml ≠ src/lib/kontakt.ts — EINE Quelle pflegen (C.8).");
}

const lora = localFont({
  src: "./fonts/Lora-var.woff2",
  variable: "--font-lora",
  weight: "400 700",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-var.woff2",
  variable: "--font-inter",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "A-Bau Meisterbetrieb GmbH – Bauunternehmen Mönchengladbach",
    template: "%s – A-Bau",
  },
  description:
    "A-Bau Meisterbetrieb GmbH: Denkmal-Restaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen in Mönchengladbach & NRW. Meisterbetrieb seit 2019.",
  applicationName: "A-Bau Meisterbetrieb",
  authors: [{ name: "A-Bau Meisterbetrieb GmbH", url: `${SITE_URL}` }],
  metadataBase: new URL(`${SITE_URL}`),
  alternates: {
    languages: { de: `${SITE_URL}/`, "x-default": `${SITE_URL}/` },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "A-Bau Meisterbetrieb GmbH",
    // R35: KEIN globales title/description — Next übernimmt je Seite metadata.title/description
    // (sonst hätten alle Detailseiten den Home-Titel als og:title, B.25)
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "A-Bau Meisterbetrieb GmbH \u2013 Denkmal-Restaurierung \u00b7 Sanierung \u00b7 Innenausbau \u00b7 Schl\u00fcsselfertigbau, M\u00f6nchengladbach" }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#009A44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`h-full ${lora.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main">Zum Inhalt springen</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <ChatWidget />
      </body>
    </html>
  );
}
