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
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "A-Bau Meisterbetrieb GmbH",
    title: "A-Bau Meisterbetrieb GmbH – Bauunternehmen Mönchengladbach",
    description:
      "Denkmal-Restaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen in Mönchengladbach & NRW. Meisterbetrieb seit 2019.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "A-Bau Meisterbetrieb GmbH" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any", type: "image/x-icon" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
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
