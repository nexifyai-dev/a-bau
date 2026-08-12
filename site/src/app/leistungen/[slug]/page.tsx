import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { leistungen } from "@/lib/data";
import { stadtteile } from "@/lib/data";
import { KONTAKT, telHref } from "@/lib/kontakt";
import { ld } from "@/lib/schema";
import { LEISTUNGS_BILDER } from "@/lib/leistungs-bilder";

function slugifyName(name: string) {
  return name.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return leistungen.leistungen.map((l: any) => ({ slug: l.slug || l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = leistungen.leistungen.find((x: any) => (x.slug || x.id) === slug);
  if (!l) return {};
  return {
    alternates: { canonical: `/leistungen/${slug}/`, languages: { de: `https://a-bau.nexifyai.cloud/leistungen/${slug}/`, "x-default": `https://a-bau.nexifyai.cloud/leistungen/${slug}/` } },
    title: `${l.titel} Mönchengladbach`,
    description: `${l.kurz} – A-Bau Meisterbetrieb GmbH, Mönchengladbach. Meisterbetrieb seit 2019 (HRB 18836). Kontakt für ein Angebot.`,
  };
}

export default async function LeistungPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = leistungen.leistungen.find((x: any) => (x.slug || x.id) === slug);
  if (!l) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: l.titel,
    description: l.kurz,
    provider: {
      "@type": "LocalBusiness",
      name: KONTAKT.firma,
      address: { "@type": "PostalAddress", streetAddress: KONTAKT.strasse, postalCode: KONTAKT.plz, addressLocality: KONTAKT.ort, addressCountry: "DE" },
    },
    areaServed: "Mönchengladbach & NRW",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(schema) }} />
      <section className="section">
        <div className="container split">
          <div>
            <span className="kicker">Leistung</span>
            <h1>{l.titel}</h1>
            <p className="lead">{l.kurz || l.subtitel}</p>
            <p>{l.beschreibung || l.text}</p>
            <ul className="leistung-punkte">
              {l.punkte.map((p: string) => <li key={p}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7"/></svg>{p}</li>)}
            </ul>
            <p className="einsatzgebiete">
              <strong>Einsatzgebiete:</strong>{" "}
              {stadtteile.stadt.quartiere.slice(0, 3).map((q: any, i: number) => (
                <span key={q.name}>
                  {i > 0 && " · "}
                  <Link href={`/stadtteile/${slugifyName(q.name)}/`}>{q.name.split(" (")[0]}</Link>
                </span>
              ))}
            </p>
            <div className="hero-actions mt-5">
              <Link className="btn btn-primary" href="/kontakt/">Unverbindlich anfragen</Link>
              <Link className="btn btn-ghost" href="/leistungen/">Alle Leistungen</Link>
            </div>
          </div>
          <div className="media-frame">
            <Image
              src={LEISTUNGS_BILDER[(l.slug || l.id)] ?? "/assets/sonstiges/FB_IMG_1731877209147.webp"}
              alt={`${l.titel} – Projektbeispiel A-Bau Meisterbetrieb Mönchengladbach`}
              width={900}
              height={675}
              priority
              style={{ objectFit: "cover", width: "100%" }}
            />
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="notice">
            <strong>Hinweis zu Referenzprojekten:</strong> Konkrete Projektdaten (Ort, Jahr, Umfang)
            werden nach Freigabe durch den Kunden ergänzt. Die gezeigten Bilder stammen aus dem
            Projektbestand der A-Bau Meisterbetrieb GmbH.
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <span className="kicker">Kontakt</span>
          <h2>Ihr Projekt in guten Händen</h2>
          <p>Beschreiben Sie uns kurz Ihr Vorhaben – wir melden uns zeitnah.</p>
          <div className="hero-actions hero-actions-center">
            <Link className="btn btn-primary btn-lg" href="/kontakt/">Projekt anfragen</Link>
            <a className="btn btn-ghost btn-lg" href={telHref(KONTAKT.tel)}>Rufen Sie an: {KONTAKT.tel}</a>
          </div>
        </div>
      </section>
    </>
  );
}
