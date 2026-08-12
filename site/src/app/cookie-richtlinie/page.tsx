import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie-Richtlinie – A-Bau",
  description: "Cookie-Richtlinie der Website a-bau.nexifyai.cloud – TDDDG §25-konform, keine Tracking-Cookies ohne Einwilligung.",
  alternates: { canonical: "/cookie-richtlinie/", languages: { de: "https://a-bau.nexifyai.cloud/cookie-richtlinie/", "x-default": "https://a-bau.nexifyai.cloud/cookie-richtlinie/" } },
  robots: { index: false, follow: false },
};

export default function CookieRichtlinie() {
  return (
    <section className="section">
      <div className="container prose">
        <h1>Cookie-Richtlinie</h1>
        <p>
          <strong>Stand:</strong> 11. August 2026
        </p>
        <p>
          Diese Website setzt ausschließlich technisch notwendige Cookies bzw. Speicherungen ein
          (z. B. zur Speicherung Ihrer Cookie-Einstellung). Es werden keine Tracking-, Analyse- oder
          Marketing-Cookies gesetzt, solange Sie dem nicht ausdrücklich zustimmen.
        </p>
        <h2>Rechtsgrundlage</h2>
        <p>
          § 25 Abs. 2 Nr. 2 TDDDG / Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
          ordnungsgemäßen Betrieb der Website).
        </p>
        <h2>Ihre Rechte</h2>
        <p>
          Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen
          (Einstellungen im Cookie-Banner). Details zur Datenverarbeitung finden Sie in der{" "}
          <a href="/datenschutz/">Datenschutzerklärung</a>.
        </p>
      </div>
    </section>
  );
}
