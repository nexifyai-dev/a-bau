import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { leistungen } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/leistungen/", languages: { de: "https://a-bau.nexifyai.cloud/leistungen/", "x-default": "https://a-bau.nexifyai.cloud/leistungen/" } },
  title: "Leistungen | Bauunternehmen Mönchengladbach – A-Bau",
  description:
    "Alle Leistungen der A-Bau Meisterbetrieb GmbH: Denkmalrestaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen.",
};

const LEISTUNGS_BILDER: Record<string, string> = {
  denkmalrestaurierung: "/assets/denkmal/d11ef292-0817-42b3-8eaa-e60171cd3e74.webp",
  innenausbau: "/assets/innenausbau/b1b9855e-0abd-4906-b9f0-ecec14474c16.webp",
  krankenhausbau: "/assets/krankenhaus/IMG_1414.webp",
  schluesselfertigbau: "/assets/schlüsselfertig/313A5EC4-6A48-4A73-9700-47398D4304B4.webp",
  installationen: "/assets/sanierung/5ae308ff-8eee-4589-bb1b-427ca3aa858a.webp",
  sanierung: "/assets/sanierung/f344eb61-0eff-4ae1-bd94-0d1a0bc4fec1.webp",
  transport: "/assets/sonstiges/PHOTO-2025-02-11-16-15-13.webp",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: leistungen.leistungen.map((l: any, i: number) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: l.titel,
      description: l.kurz,
      provider: { "@type": "LocalBusiness", name: "A-Bau Meisterbetrieb GmbH" },
      areaServed: "Mönchengladbach & NRW",
      url: `https://a-bau.nexifyai.cloud/leistungen/${(l.slug || l.id)}/`,
    },
  })),
};

export default function Leistungen() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://a-bau.nexifyai.cloud/"}, {"@type": "ListItem", "position": 2, "name": "Leistungen", "item": "https://a-bau.nexifyai.cloud/leistungen/"}]}) }} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Leistungen</span>
            <h1>Fachgerechte Bauleistungen von A-Bau</h1>
            <p>
              Unser moderner Baubetrieb — seit 2019 als Meisterbetrieb in Mönchengladbach — bietet ein Spektrum von sensiblen
              Restaurierungen bis zum schlüsselfertigen Neubau. Unsere Kunden schätzen handwerkliche
              Qualität, persönliche Betreuung und transparente Kommunikation.
            </p>
          </div>
          <div className="grid grid-3">
            {leistungen.leistungen.map((l: any) => (
              <Link className="card" href={`/leistungen/${(l.slug || l.id)}/`} key={(l.slug || l.id)}>
                <div className="card-img">
                  <Image
                    src={LEISTUNGS_BILDER[(l.slug || l.id)] ?? "/assets/sonstiges/FB_IMG_1731877209147.webp"}
                    alt={`${l.titel} – A-Bau Meisterbetrieb Mönchengladbach`}
                    width={800}
                    height={600}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    sizes="(max-width: 720px) 100vw, 33vw"
                  />
                </div>
                <div className="card-body">
                  <h3>{l.titel}</h3>
                  <p>{l.kurz}</p>
                  <span className="card-link">Mehr erfahren <span className="arrow">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
