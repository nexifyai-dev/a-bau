import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { stadtteile } from "@/lib/data";
import { leistungen } from "@/lib/data";
import { KONTAKT, telHref } from "@/lib/kontakt";
import { clip } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return stadtteile.stadt.quartiere.map((q: any) => ({ slug: slugify(q.name) }));
}

function slugify(name: string) {
  return name.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = stadtteile.stadt.quartiere.find((x: any) => slugify(x.name) === slug);
  if (!q) return {};
  const name = q.name.split(" (")[0];
  // B.20: eindeutiger, aussagekräftiger Title (≤60 Zeichen); absolute, damit
  // das Layout-Template ("%s – A-Bau") nicht doppelt anhängt
  const title = clip(`${name} – A-Bau Meisterbetrieb Mönchengladbach`, 60);
  return {
    alternates: { canonical: `/stadtteile/${slug}/`, languages: { de: `${SITE_URL}/stadtteile/${slug}/`, "x-default": `${SITE_URL}/stadtteile/${slug}/` } },
    title: { absolute: title },
    description: `${clip(q.text, 45)} A-Bau Meisterbetrieb in ${name}, Mönchengladbach. ${clip(q.schwerpunkt, 15)}. Angebot anfragen.`,
  };
}

export default async function StadtteilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = stadtteile.stadt.quartiere.find((x: any) => slugify(x.name) === slug);
  if (!q) notFound();
  const name = q.name.split(" (")[0];

  return (
    <>
      <section className="section">
        <div className="container split">
          <div>
            <span className="kicker">Stadtteil</span>
            <h1>{q.name}</h1>
            <p className="lead">{q.text}</p>
            <p><strong>Schwerpunkt:</strong> {q.schwerpunkt}</p>
            <p className="einsatzgebiete">
              <strong>Passende Leistungen:</strong>{" "}
              {leistungen.leistungen.slice(0, 3).map((l: any, i: number) => (
                <span key={l.id}>
                  {i > 0 && " · "}
                  <Link href={`/leistungen/${l.slug || l.id}/`}>{l.titel}</Link>
                </span>
              ))}
            </p>
            <div className="hero-actions mt-5">
              <Link className="btn btn-primary" href="/kontakt/">Projekt in {q.name} anfragen</Link>
              <Link className="btn btn-ghost" href="/stadtteile/">Alle Stadtteile</Link>
            </div>
          </div>
          <div className="media-frame">
            <Image
              src="/assets/denkmal/d11ef292-0817-42b3-8eaa-e60171cd3e74.webp"
              alt="Denkmal-Restaurierung – Projektbeispiel A-Bau Meisterbetrieb Mönchengladbach"
              width={900}
              height={675}
              priority
              style={{ objectFit: "cover", width: "100%" }}
            />
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
            <a className="btn btn-ghost btn-lg" href={telHref(KONTAKT.tel)}>Rufen Sie an: {KONTAKT.tel}</a>
          </div>
        </div>
      </section>
      {/* B.21: Strukturierte Daten je Stadtteil-Detailseite (Breadcrumb + Service) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Stadtteile", item: `${SITE_URL}/stadtteile/` },
                { "@type": "ListItem", position: 3, name: name },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: `Bau- und Sanierungsleistungen in ${name}, Mönchengladbach – A-Bau Meisterbetrieb GmbH`,
              provider: { "@type": "LocalBusiness", name: "A-Bau Meisterbetrieb GmbH" },
              areaServed: { "@type": "City", name: name },
              description: clip(q.schwerpunkt, 100),
            },
          ]),
        }}
      />
    </>
  );
}
