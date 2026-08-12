import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { leistungen } from "@/lib/data";
import { ld } from "@/lib/schema";
import { LEISTUNGS_BILDER } from "@/lib/leistungs-bilder";

export const metadata: Metadata = {
  alternates: { canonical: "/leistungen/", languages: { de: "https://a-bau.nexifyai.cloud/leistungen/", "x-default": "https://a-bau.nexifyai.cloud/leistungen/" } },
  title: { absolute: "Leistungen – A-Bau Meisterbetrieb Mönchengladbach" },
  description:
    "Alle Leistungen der A-Bau Meisterbetrieb GmbH: Denkmalrestaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://a-bau.nexifyai.cloud/"}, {"@type": "ListItem", "position": 2, "name": "Leistungen", "item": "https://a-bau.nexifyai.cloud/leistungen/"}]}) }} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Leistungen</span>
            <h1>Fachgerechte Bauleistungen von A-Bau</h1>
            <p>
              Unser moderner Baubetrieb – seit 2019 als Meisterbetrieb in Mönchengladbach – bietet ein Spektrum von sensiblen
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
