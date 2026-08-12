import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie-Richtlinie – A-Bau",
  description:
    "Cookie-Richtlinie der Website www.a-bau.info – TDDDG § 25-konform, keine Tracking-Cookies ohne Einwilligung.",
  alternates: {
    canonical: "/cookie-richtlinie/",
    languages: {
      de: `${SITE_URL}/cookie-richtlinie/`,
      "x-default": `${SITE_URL}/cookie-richtlinie/`,
    },
  },
  robots: { index: false, follow: false },
};

export default function CookieRichtlinie() {
  return (
    <section className="section">
      <div className="container prose">
        <h1>Cookie-Richtlinie</h1>
        <p>
          <strong>Stand:</strong> 12. August 2026
        </p>

        <h2>1. Was sind Cookies und lokale Speicherungen?</h2>
        <p>
          Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Endgerät
          gespeichert werden. Daneben nutzen Websites auch die lokale Speicherung des Browsers
          (LocalStorage), die ähnlich funktioniert, ohne dass Daten an den Server übertragen werden.
          Beides unterliegt in Deutschland dem Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz
          (TDDDG), insbesondere § 25.
        </p>

        <h2>2. Welche Speicherungen setzt diese Website?</h2>
        <p>Diese Website setzt ausschließlich technisch notwendige Speicherungen ein:</p>
        <ul>
          <li>
            <strong>LocalStorage, Schlüssel <code>abau_consent</code>:</strong> speichert, dass Sie
            den Cookie-Hinweis zur Kenntnis genommen haben. Zweck: Der Hinweis soll bei Ihrem
            nächsten Besuch nicht erneut eingeblendet werden. Rechtsgrundlage: § 25 Abs. 2 Nr. 2
            TDDDG (unbedingt erforderlich für den von Ihnen ausdrücklich gewünschten Dienst).
          </li>
        </ul>
        <p>
          Es werden <strong>keine</strong> Tracking-, Analyse-, Marketing- oder sonstige
          Drittanbieter-Cookies gesetzt. Wir nutzen insbesondere keine Dienste wie Google
          Analytics, Google Ads, Facebook Pixel, Hotjar oder vergleichbare Tracking-Technologien.
          Es findet keine personenbezogene Auswertung Ihres Nutzungsverhaltens statt.
        </p>

        <h2>3. Rechtsgrundlage</h2>
        <p>
          § 25 Abs. 2 Nr. 2 TDDDG in Verbindung mit Art. 6 Abs. 1 lit. f DSGVO. Einwilligungspflichtige
          Speicherungen finden nicht statt, weil keine Dienste eingesetzt werden, die eine
          Einwilligung erfordern.
        </p>

        <h2>4. Kartenansicht (OpenStreetMap)</h2>
        <p>
          Die auf der Kontaktseite eingebundene OpenStreetMap-Karte wird erst nach einem bewussten
          Klick auf „Karte laden“ geladen (Zwei-Klick-Lösung). Durch den Klick wird eine Verbindung
          zu den Servern der OpenStreetMap Foundation hergestellt; hierbei wird Ihre IP-Adresse an
          die OSMF übermittelt. Cookies werden dabei nicht gesetzt. Details in der{" "}
          <a href="/datenschutz/">Datenschutzerklärung</a>, Abschnitt 8.
        </p>

        <h2>5. Ihre Rechte und Widerruf</h2>
        <p>
          Da nur technisch notwendige Speicherungen eingesetzt werden, gibt es keine
          Einwilligungen, die Sie widerrufen könnten. Sie können die lokale Speicherung Ihres
          Browsers jederzeit selbst löschen (Browsereinstellungen → Website-Daten bzw. lokale
          Speicherung) oder den privaten Modus verwenden. Dadurch kann der Cookie-Hinweis bei
          Ihrem nächsten Besuch wieder erscheinen.
        </p>

        <h2>6. Kontakt</h2>
        <p>
          Bei Fragen zu dieser Cookie-Richtlinie oder zur Datenverarbeitung auf dieser Website
          erreichen Sie uns unter kontakt@a-bau.info oder über die im{" "}
          <a href="/impressum/">Impressum</a> genannten Kontaktdaten.
        </p>
      </div>
    </section>
  );
}
