import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { leistungen } from "@/lib/data";
import { stadtteile } from "@/lib/data";
import { KONTAKT, telHref } from "@/lib/kontakt";

function slugifyName(name: string) {
  return name.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const LEISTUNGS_BILDER: Record<string, string> = {
  denkmalrestaurierung: "/assets/denkmal/d11ef292-0817-42b3-8eaa-e60171cd3e74.webp",
  innenausbau: "/assets/innenausbau/b1b9855e-0abd-4906-b9f0-ecec14474c16.webp",
  krankenhausbau: "/assets/krankenhaus/IMG_1414.webp",
  schluesselfertigbau: "/assets/schlüsselfertig/313A5EC4-6A48-4A73-9700-47398D4304B4.webp",
  installationen: "/assets/sanierung/5ae308ff-8eee-4589-bb1b-427ca3aa858a.webp",
  sanierung: "/assets/sanierung/f344eb61-0eff-4ae1-bd94-0d1a0bc4fec1.webp",
  transport: "/assets/sonstiges/IMG_1415.webp",
};

export function generateStaticParams() {
  return leistungen.leistungen.map((l: any) => ({ slug: l.slug || l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = leistungen.leistungen.find((x: any) => (x.slug || x.id) === slug);
  if (!l) return {};
  return {
    alternates: { canonical: `/leistungen/${slug}/` },
    title: `${l.titel} Mönchengladbach | A-Bau Meisterbetrieb GmbH`,
    description: `${l.kurz} – A-Bau Meisterbetrieb GmbH, Mönchengladbach. Meisterbetrieb seit 2019 (HRB 18836). Kostenloses Angebot.`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="section">
        <div className="container split">
          <div>
            <span className="kicker">Leistung</span>
            <h1>{l.titel}</h1>
            <p className="lead">{l.subtitel}</p>
            <p>{l.beschreibung}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "grid", gap: 10 }}>
              {l.punkte.map((p: string) => <li key={p}>✓ {p}</li>)}
            </ul>
            <p style={{ marginTop: 16, fontSize: ".95rem" }}>
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
              src={LEISTUNGS_BILDER[l.slug] ?? "/assets/sonstiges/FB_IMG_1731877209147.webp"}
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
          <div className="notice" style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-soft)", borderRadius: "var(--r-md)", padding: "var(--space-4) var(--space-5)" }}>
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
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary btn-lg" href="/kontakt/">Angebot anfordern</Link>
            <a className="btn btn-ghost btn-lg" href={telHref(KONTAKT.tel)}>Rufen Sie an: {KONTAKT.tel}</a>
          </div>
        </div>
      </section>
    </>
  );
}
