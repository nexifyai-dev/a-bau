import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Angebot anfragen – A-Bau",
  description: "Projekt anfragen bei A-Bau Meisterbetrieb GmbH – Kontaktformular für Ihr Bauvorhaben in Mönchengladbach & NRW.",
  alternates: { canonical: "/angebot/" },
  robots: { index: false, follow: false },
};

export default function Angebot() {
  return (
    <section className="section">
      <meta httpEquiv="refresh" content="0; url=/kontakt/" />
      <div className="container text-center">
        <span className="kicker">Angebot</span>
        <h1>Projekt anfragen</h1>
        <p>
          Für Ihr Bauvorhaben nutzen Sie bitte unser Kontaktformular – wir melden uns
          zeitnah mit einer ehrlichen Einschätzung.
        </p>
        <p className="mt-5">
          <Link className="btn btn-primary btn-lg" href="/kontakt/">Zum Kontaktformular</Link>
        </p>
      </div>
    </section>
  );
}
