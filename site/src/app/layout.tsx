import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./fonts.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const fraunces = localFont({
  src: "./fonts/Fraunces-var.woff2",
  variable: "--font-fraunces",
  weight: "300 900",
  display: "swap",
});

const worksans = localFont({
  src: "./fonts/WorkSans-var.woff2",
  variable: "--font-worksans",
  weight: "300 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "A-Bau Meisterbetrieb GmbH – Bauunternehmen Mönchengladbach",
    template: "%s – A-Bau",
  },
  description:
    "A-Bau Meisterbetrieb GmbH: Denkmalrestaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen in Mönchengladbach & NRW. Meisterbetrieb seit 2019.",
  applicationName: "A-Bau Meisterbetrieb",
  authors: [{ name: "A-Bau Meisterbetrieb GmbH", url: "https://a-bau.nexifyai.cloud" }],
  metadataBase: new URL("https://a-bau.nexifyai.cloud"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "A-Bau Meisterbetrieb GmbH",
    title: "A-Bau Meisterbetrieb GmbH – Bauunternehmen Mönchengladbach",
    description:
      "Denkmalrestaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen in Mönchengladbach & NRW. Meisterbetrieb seit 2019.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "A-Bau Meisterbetrieb GmbH" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#009A44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`h-full ${fraunces.variable} ${worksans.variable}`}>
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main">Zum Inhalt springen</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
