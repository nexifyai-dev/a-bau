import type { Metadata } from "next";
import Link from "next/link";
import { faq } from "@/lib/data";
import { ld } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/faq/", languages: { de: `${SITE_URL}/faq/`, "x-default": `${SITE_URL}/faq/` } },
  title: { absolute: "FAQ – A-Bau Meisterbetrieb Mönchengladbach" },
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

// Anzeige-Reihenfolge der Kategorien (stabil; Daten: faq.faq[].kategorie)
const KAT_REIHENFOLGE = [
  "Leistungen",
  "Denkmal & Restaurierung",
  "Sanierung & Renovierung",
  "Ablauf & Angebot",
  "Termine & Zeiten",
  "Recht & Gewährleistung",
  "Region & Einsatzgebiet",
  "Unternehmen",
  "Pflege & Nachbetreuung",
  "Kontakt & Service",
];

// Anker-Slug mit Umlaut-Transliteration (ä→ae …), damit IDs stabil und sprechend sind
// (R40: `replace(/\W+/g,"-")` warf Umlaute weg → "#recht-gew-hrleistung")
function ankerSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Faq() {
  const gruppen = KAT_REIHENFOLGE
    .map((kat) => ({ kat, fragen: faq.faq.filter((f: any) => (f.kategorie || "Sonstiges") === kat) }))
    .filter((g) => g.fragen.length > 0);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Startseite", "item": `${SITE_URL}/`}, {"@type": "ListItem", "position": 2, "name": "FAQ", "item": `${SITE_URL}/faq/`}]}) }} />
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
          <nav className="faq-nav" aria-label="FAQ-Kategorien">
            {gruppen.map((g) => (
              <a key={g.kat} href={`#${ankerSlug(g.kat)}`}>{g.kat} ({g.fragen.length})</a>
            ))}
          </nav>
          {gruppen.map((g) => (
            <div key={g.kat} className="faq-gruppe">
              <h2 className="faq-gruppen-titel" id={ankerSlug(g.kat)}>{g.kat}</h2>
              <div className="faq accordion">
                {g.fragen.map((f: any) => (
                  <details key={f.f} className="acc-item">
                    <summary className="acc-btn">{f.f}<span className="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg></span></summary>
                    <div className="acc-panel"><div className="acc-panel-inner">{f.a}</div></div>
                  </details>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-6"><Link className="btn btn-primary" href="/kontakt/">Projekt anfragen</Link></p>
        </div>
      </section>
    </>
  );
}
