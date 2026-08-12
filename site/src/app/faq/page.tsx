import type { Metadata } from "next";
import Link from "next/link";
import { faq } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/faq/", languages: { de: "https://a-bau.nexifyai.cloud/faq/", "x-default": "https://a-bau.nexifyai.cloud/faq/" } },
  title: "FAQ | A-Bau Bauunternehmen Mönchengladbach",
  description:
    "Häufige Fragen zu Leistungen, Ablauf, Region, Angeboten und Öffnungszeiten von A-Bau Meisterbetrieb in Mönchengladbach.",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.faq.map((f: any) => ({
    "@type": "Question",
    name: f.f,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Faq() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://a-bau.nexifyai.cloud/"}, {"@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://a-bau.nexifyai.cloud/faq/"}]}) }} />
      <section className="section">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="kicker">FAQ</span>
            <h1>Häufige Fragen &amp; Antworten</h1>
            <p>
              Antworten auf die häufigsten Fragen zu unseren Leistungen, Abläufen und Konditionen.
              Ihre Frage ist nicht dabei? <Link href="/kontakt/">Kontaktieren Sie uns</Link>.
            </p>
          </div>
          <div className="faq accordion">
            {faq.faq.map((f: any) => (
              <details key={f.f} className="acc-item">
                <summary className="acc-btn">{f.f}<span className="chev">▾</span></summary>
                <div className="acc-panel"><div className="acc-panel-inner">{f.a}</div></div>
              </details>
            ))}
          </div>
          <p className="mt-6"><Link className="btn btn-primary" href="/kontakt/">Projekt anfragen</Link></p>
        </div>
      </section>
    </>
  );
}
