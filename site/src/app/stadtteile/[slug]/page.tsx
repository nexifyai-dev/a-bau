import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { stadtteile } from "@/lib/data";
import { KONTAKT, telHref } from "@/lib/kontakt";

export function generateStaticParams() {
  return stadtteile.stadt.quartiere.map((q: any) => ({
    slug: q.name.toLowerCase().replace(/[^a-zäöüß0-9]+/g, "-").replace(/^-|-$/g, ""),
  }));
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-zäöüß0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = stadtteile.stadt.quartiere.find((x: any) => slugify(x.name) === slug);
  if (!q) return {};
  return {
    title: `Bauunternehmen ${q.name} – A-Bau Meisterbetrieb Mönchengladbach`,
    description: `${q.text} A-Bau Meisterbetrieb in ${q.name}, Mönchengladbach. ${q.schwerpunkt}. Kostenloses Angebot.`,
  };
}

export default async function StadtteilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = stadtteile.stadt.quartiere.find((x: any) => slugify(x.name) === slug);
  if (!q) notFound();

  return (
    <>
      <section className="section">
        <div className="container split">
          <div>
            <span className="kicker">Stadtteil</span>
            <h1>{q.name}</h1>
            <p className="lead">{q.text}</p>
            <p><strong>Schwerpunkt:</strong> {q.schwerpunkt}</p>
            <div className="hero-actions mt-5">
              <Link className="btn btn-primary" href="/kontakt/">Projekt in {q.name} anfragen</Link>
              <Link className="btn btn-ghost" href="/stadtteile/">Alle Stadtteile</Link>
            </div>
          </div>
          <div className="media-frame">
            <Image
              src="/assets/denkmal/d11ef292-0817-42b3-8eaa-e60171cd3e74.webp"
              alt={`${q.name} – A-Bau Meisterbetrieb Mönchengladbach`}
              width={900}
              height={675}
              priority
              style={{ objectFit: "cover", width: "100%" }}
            />
          </div>
        </div>
      </section>

      <section className="section section-soft">
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
