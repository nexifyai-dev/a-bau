import type { Metadata } from "next";
import Link from "next/link";
import { referenzen } from "@/lib/data";
import { ld } from "@/lib/schema";
import RefGallery from "@/components/RefGallery";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/referenzen/", languages: { de: `${SITE_URL}/referenzen/`, "x-default": `${SITE_URL}/referenzen/` } },
  title: { absolute: "Referenzen – A-Bau Meisterbetrieb Mönchengladbach" },
  description:
    "Referenzen der A-Bau Meisterbetrieb GmbH: Altbau-Erhaltung, Gesundheitsbau, Raumgestaltung, Schlüsselfertigbau, Badezimmer und Handwerkskunst im Detail.",
};

export default function Referenzen() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Startseite", "item": `${SITE_URL}/`}, {"@type": "ListItem", "position": 2, "name": "Referenzen", "item": `${SITE_URL}/referenzen/`}]}) }} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Referenzen</span>
            <h1>Projekte, die für Qualität sprechen</h1>
            <p>
              Einblicke in unsere Arbeit – Restaurierung, Gesundheitsbau, Innenausbau und Neubau.
              Konkrete Projekt-Referenzen (Ort, Jahr, Umfang) stellen wir auf Anfrage gern vor.
            </p>
          </div>

          {referenzen.referenzen.map((r: any) => (
            <div className="section section-flat" key={r.slug || r.id} id={r.slug || r.id}>
              <div className="section-head">
                <span className="kicker">Referenz</span>
                <h2>{r.titel}</h2>
                <p className="text-2">{r.text}</p>
              </div>
              <RefGallery titel={r.titel} bilder={r.bilder} altBase={r.titel} />
              {r.video && (
                <figure className="ref-video">
                  <video
                    controls
                    preload="none"
                    poster={r.bilder[0] ? `/assets/${r.bilder[0]}` : "/assets/krankenhaus/IMG_1414.webp"}
                    title={`Projektvideo ${r.titel}`}
                  >
                    <source src={`/assets/videos/${r.video}?v=20260812`} type="video/mp4" />
                    Das Projektvideo kann in Ihrem Browser nicht abgespielt werden – wir zeigen Ihnen
                    die Arbeiten gern persönlich: <Link href="/kontakt/">Kontakt aufnehmen</Link>.
                  </video>
                  <figcaption>Projektvideo: {r.titel}</figcaption>
                </figure>
              )}
            </div>
          ))}

          <div className="notice mt-7">
            <strong>Hinweis:</strong> Konkrete Projektdaten (Ort, Jahr, Umfang) werden nach Freigabe durch den Kunden ergänzt. Die gezeigten Bilder stammen aus dem Projektbestand der A-Bau Meisterbetrieb GmbH.
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container text-center">
          <span className="kicker kicker-gold">Kontakt</span>
          <h2>Ihr Projekt in guten Händen</h2>
          <p>Beschreiben Sie uns kurz Ihr Vorhaben – wir melden uns zeitnah.</p>
          <div className="hero-actions hero-actions-center">
            <Link className="btn btn-primary btn-lg" href="/kontakt/">Projekt anfragen</Link>
          </div>
        </div>
      </section>
    </>
  );
}
