import type { Metadata } from "next";
import Link from "next/link";
import { stadtteile } from "@/lib/data";
import { ld } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/stadtteile/", languages: { de: "https://a-bau.nexifyai.cloud/stadtteile/", "x-default": "https://a-bau.nexifyai.cloud/stadtteile/" } },
  title: { absolute: "Stadtteile – A-Bau Meisterbetrieb Mönchengladbach" },
  description:
    "A-Bau in Mönchengladbach: Denkmal-Restaurierung, Sanierung und Neubau in allen Stadtteilen – Geistenbeck, Eicken, Rheydt, City und mehr.",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: stadtteile.stadt.quartiere.map((q: any, i: number) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Place",
      name: q.name,
      description: q.text,
      address: { "@type": "PostalAddress", addressLocality: "Mönchengladbach", addressCountry: "DE" },
    },
  })),
};

export default function Stadtteile() {
  const s = stadtteile.stadt;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://a-bau.nexifyai.cloud/"}, {"@type": "ListItem", "position": 2, "name": "Stadtteile", "item": "https://a-bau.nexifyai.cloud/stadtteile/"}]}) }} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{s.titel}</span>
            <h1>Stadtteile &amp; Quartiere in Mönchengladbach</h1>
            <p>{s.intro}</p>
          </div>

          <div className="quartier-grid">
            {s.quartiere.map((q: any) => (
              <div className="card card-plain" key={q.name}>
                <div className="card-body">
                  <h2 className="card-title">{q.name}</h2>
                  <p>{q.text}</p>
                  <p className="text-3"><strong>Schwerpunkt:</strong> {q.schwerpunkt}</p>
                  <Link className="card-link" href="/kontakt/">Projekt in diesem Stadtteil anfragen <span className="arrow">→</span></Link>
                </div>
              </div>
            ))}
          </div>

          <section className="section section-soft card-plain mt-7 baustellen-card" id="baustellen">
            <span className="kicker">Stadt-Info</span>
            <h2>Aktuelle Baustellen &amp; Baumaßnahmen in Mönchengladbach</h2>
            <p>
              Wir arbeiten im Kontext der Stadt – und verlinken Sie direkt zu den offiziellen Quellen.
              Alle Links sind extern und tagesaktuell.
            </p>
            <ul className="baustellen-links">
              {s.baustellen_links.map((l: any) => (
                <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.titel}</a></li>
              ))}
            </ul>
            <p className="text-3 mt-4">
              A-Bau übernimmt Bauvorhaben in allen Stadtteilen Mönchengladbachs – von Geistenbeck über
              Eicken bis Rheydt. Bei Fragen zu einem konkreten Projekt hilft das{" "}
              <Link href="/kontakt/">Kontaktformular</Link>.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
