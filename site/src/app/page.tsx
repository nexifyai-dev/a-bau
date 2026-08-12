import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { KONTAKT, telHref } from "@/lib/kontakt";
import { leistungen, faq, referenzen, stadtteile } from "@/lib/data";
import { ld } from "@/lib/schema";
import { LEISTUNGS_BILDER } from "@/lib/leistungs-bilder";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { de: "https://a-bau.nexifyai.cloud/", "x-default": "https://a-bau.nexifyai.cloud/" } },
  title: "A-Bau Meisterbetrieb GmbH – Bauunternehmen Mönchengladbach",
  description:
    "A-Bau Meisterbetrieb GmbH in Mönchengladbach: Denkmalrestaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen. Seit 2019.",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": "https://a-bau.nexifyai.cloud/#business",
  name: "A-Bau Meisterbetrieb GmbH",
  description:
    "Bauunternehmen und Meisterbetrieb in Mönchengladbach: Denkmalrestaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung, Installationen und europaweite Transporte.",
  url: "https://a-bau.nexifyai.cloud",
  telephone: KONTAKT.tel,
  email: KONTAKT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: KONTAKT.strasse,
    postalCode: KONTAKT.plz,
    addressLocality: KONTAKT.ort,
    addressRegion: "Nordrhein-Westfalen",
    addressCountry: "DE",
  },
  geo: { "@type": "GeoCoordinates", latitude: 51.178, longitude: 6.396 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "07:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
  ],
  areaServed: ["Mönchengladbach", "Viersen", "Krefeld", "Düsseldorf", "Köln", "NRW"],
  legalIdentifier: "Amtsgericht Mönchengladbach HRB 18836",
  foundingDate: "2019",
  founder: { "@type": "Person", name: "Albert Pfeiffer" },
  priceRange: "Auf Anfrage",
  vatID: "DE327030612",
  hasCertification: { "@type": "Certification", name: "Handwerkskammer Düsseldorf", identifier: "1841351" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.faq.slice(0, 8).map((f: any) => ({
    "@type": "Question",
    name: f.f,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const STADTTEILE_TEASER = stadtteile.stadt.quartiere.slice(0, 3);

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(faqSchema) }} />

      {/* HERO (GAG: Vollbild + Overlay + 2 Karten) */}
      <section className="hero" aria-label="Einführung">
        <div className="hero-media" aria-hidden="true">
          <Image
            src="/assets/denkmal/d11ef292-0817-42b3-8eaa-e60171cd3e74.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", opacity: 0.5 }}
          />
        </div>
        <div className="hero-inner">
          <div className="container">
            <span className="hero-kicker">Meisterbetrieb · Mönchengladbach &amp; NRW</span>
            <h1>Denkmalrestaurierung &amp; Altbausanierung – Meisterhandwerk aus Mönchengladbach</h1>
            <p className="lead">
              A-Bau Meisterbetrieb GmbH: substanzschonende Restaurierung denkmalgeschützter Bauten,
              Sanierung und Ausbau – persönlich, termintreu, mit geprüften Materialien. Von der
              ersten Besichtigung bis zur Übergabe: alles aus einer Hand, seit 2019 in Mönchengladbach.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/kontakt/">Projekt anfragen</Link>
              <Link className="btn btn-ghost btn-lg" href="/leistungen/">Leistungen ansehen</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST-BAR */}
      <section className="trust-bar" aria-label="Vertrauensmerkmale">
        <div className="container">
          <div className="trust-item"><svg className="t-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg><div><div className="t-title">Denkmalpflege</div><div className="t-sub">Substanzschonende Restaurierung</div></div></div>
          <div className="trust-item"><svg className="t-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><div><div className="t-title">Gesundheitsbau</div><div className="t-sub">Komplexe Krankenhausprojekte</div></div></div>
          <div className="trust-item"><svg className="t-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" /></svg><div><div className="t-title">Alles aus einer Hand</div><div className="t-sub">Bau, Ausbau, Installation, Transport</div></div></div>
          <div className="trust-item"><svg className="t-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg><div><div className="t-title">Persönlich &amp; transparent</div><div className="t-sub">Feste Preise, klare Termine</div></div></div>
        </div>
      </section>

      {/* LEISTUNGEN (GAG: Portfolio-Cards) */}
      <section className="section" aria-labelledby="leistungen-heading">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Leistungen</span>
            <h2 id="leistungen-heading">Fachgerechte Bauleistungen von A-Bau</h2>
            <p>
              Unser moderner Baubetrieb bietet ein Spektrum von sensiblen Restaurierungen bis zum
              schlüsselfertigen Neubau. Unsere Kunden schätzen handwerkliche Qualität, persönliche
              Betreuung und transparente Kommunikation.
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

      {/* STADTTEILE (GAG: Quartiere) */}
      <section className="section section-soft" aria-labelledby="stadtteile-heading">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Stadtteile &amp; Quartiere</span>
            <h2 id="stadtteile-heading">A-Bau in Mönchengladbach</h2>
            <p>
              Wir bauen hier für die Menschen, die in Mönchengladbach leben, feiern und arbeiten. Von Geistenbeck bis Rheydt: Denkmalrestaurierung, Sanierung, Neubau
              und Innenausbau in allen Quartieren.
            </p>
          </div>
          <div className="grid grid-3">
            {STADTTEILE_TEASER.map((q: any) => (
              <div className="card card-plain" key={q.name}>
                <div className="card-body">
                  <h3>{q.name}</h3>
                  <p>{q.text}</p>
                  <p className="text-3"><strong>Schwerpunkt:</strong> {q.schwerpunkt}</p>
                  <Link className="card-link" href="/stadtteile/">Mehr erfahren <span className="arrow">→</span></Link>
                </div>
              </div>
            ))}
            <div className="card card-city">
              <div className="card-body">
                <h3 >Baustellen in Mönchengladbach</h3>
                <p >Aktuelle Baumaßnahmen der Stadt, mags und NEW — verlinkt zu den offiziellen Quellen.</p>
                <Link className="card-link" href="/stadtteile/#baustellen" >Aktuelle Baustellen <span className="arrow">→</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÜBER UNS TEASER (GAG: Split) */}
      <section className="section" aria-labelledby="about-heading">
        <div className="container split">
          <div>
            <span className="kicker">Über uns</span>
            <h2 id="about-heading">Handwerk mit Verantwortung</h2>
            <p>
              A-Bau Meisterbetrieb GmbH ist ein eingetragenes Bauunternehmen (Amtsgericht Mönchengladbach,
              HRB 18836) mit Sitz in Mönchengladbach-Geistenbeck. Unsere Priorität: Erhaltung und
              Restaurierung historischer Bauwerke – mit Qualität, die den langfristigen Wert Ihrer
              Projekte sicherstellt.
            </p>
            <ul className="checkliste">
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>Eigene Gewerke &amp; geprüfte Partner</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>Transparente Angebote – feste Preise</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>Persönliche Betreuung durch Geschäftsführer Albert Pfeiffer</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>Gewährleistung &amp; saubere Übergabe</li>
            </ul>
            <p className="mt-5"><Link className="btn btn-dark" href="/ueber-uns/">Mehr über uns</Link></p>
          </div>
          <div className="media-frame">
            <Image
              src="/assets/sanierung/f344eb61-0eff-4ae1-bd94-0d1a0bc4fec1.webp"
              alt="Sanierung und Restaurierung – A-Bau Meisterbetrieb Mönchengladbach"
              width={900}
              height={675}
              style={{ objectFit: "cover", width: "100%" }}
            />
          </div>
        </div>
      </section>

      {/* REFERENZEN TEASER */}
      <section className="section section-soft" aria-labelledby="referenzen-heading">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Referenzen</span>
            <h2 id="referenzen-heading">Projekte, die für sich sprechen</h2>
            <p>Einblicke in unsere Arbeit: Restaurierung, Gesundheitsbau, Innenausbau und Neubau.</p>
          </div>
          <div className="grid grid-3">
            {referenzen.referenzen.slice(0, 3).map((r: any) => (
              <Link className="card" href="/referenzen/" key={r.slug || r.id}>
                <div className="card-img">
                  <Image
                    src={`/assets/${r.bilder[0]}`}
                    alt={`${r.titel} – A-Bau Meisterbetrieb`}
                    width={800}
                    height={600}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    sizes="(max-width: 720px) 100vw, 33vw"
                  />
                </div>
                <div className="card-body">
                  <h3>{r.titel}</h3>
                  <p>{r.text}</p>
                  <span className="card-link">Projekte ansehen <span className="arrow">→</span></span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-5"><Link className="btn btn-ghost" href="/referenzen/">Alle Referenzen ansehen</Link></p>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="section" aria-labelledby="faq-heading">
        <div className="container split">
          <div>
            <span className="kicker">FAQ</span>
            <h2 id="faq-heading">Häufige Fragen – kurz beantwortet</h2>
            <p>
              Ob Ablauf, Gewährleistung oder Einsatzgebiet: hier finden Sie die wichtigsten Antworten.
              Ihre Frage ist nicht dabei? Sprechen Sie uns direkt an.
            </p>
            <p className="mt-5"><Link className="btn btn-ghost" href="/faq/">Alle Fragen ansehen</Link></p>
          </div>
          <div className="accordion">
            {faq.faq.slice(0, 4).map((f: any) => (
              <details key={f.f} className="acc-item">
                <summary className="acc-btn">{f.f}<span className="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg></span></summary>
                <div className="acc-panel"><div className="acc-panel-inner">{f.a}</div></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA-BAND */}
      <section className="section-dark section" aria-labelledby="cta-heading">
        <div className="container">
          <span className="kicker kicker-gold">Kontakt</span>
          <h2 id="cta-heading">Ihr Projekt in guten Händen</h2>
          <p>Beschreiben Sie uns kurz Ihr Vorhaben – wir melden uns zeitnah mit einer ehrlichen Einschätzung.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" href="/kontakt/">Projekt anfragen</Link>
            <a className="btn btn-ghost btn-lg btn-ghost-dark" href={telHref(KONTAKT.tel)}>
              Rufen Sie an: {KONTAKT.tel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
