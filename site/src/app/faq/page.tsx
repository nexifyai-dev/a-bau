import type { Metadata } from "next";
import Link from "next/link";
import { faq } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/faq/" },
  title: "FAQ | A-Bau Bauunternehmen Mönchengladbach",
  description:
    "Häufige Fragen zu Leistungen, Ablauf, Region, Angeboten und Öffnungszeiten von A-Bau Meisterbetrieb in Mönchengladbach.",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.faq.map((f: any) => ({
    "@type": "Question",
    name: f.frage,
    acceptedAnswer: { "@type": "Answer", text: f.antwort },
  })),
};

export default function Faq() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="section">
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="section-head" style={{ marginBottom: 40 }}>
            <span className="kicker">FAQ</span>
            <h1>Häufige Fragen &amp; Antworten</h1>
            <p>
              Antworten auf die häufigsten Fragen zu unseren Leistungen, Abläufen und Konditionen.
              Ihre Frage ist nicht dabei? <Link href="/kontakt/">Kontaktieren Sie uns</Link>.
            </p>
          </div>
          <div className="faq accordion">
            {faq.faq.map((f: any) => (
              <details key={f.frage} className="acc-item">
                <summary className="acc-btn">{f.frage}<span className="chev">▾</span></summary>
                <div className="acc-panel"><div className="acc-panel-inner">{f.antwort}</div></div>
              </details>
            ))}
          </div>
          <p className="mt-6"><Link className="btn btn-primary" href="/kontakt/">Angebot anfordern</Link></p>
        </div>
      </section>
    </>
  );
}
