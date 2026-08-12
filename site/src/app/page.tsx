import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { KONTAKT, telHref } from "@/lib/kontakt";
import { leistungen, faq, referenzen, stadtteile } from "@/lib/data";

export const metadata: Metadata = {
  title: "A-Bau Meisterbetrieb GmbH – Bauunternehmen Mönchengladbach | Denkmalrestaurierung, Innenausbau",
  description:
    "A-Bau Meisterbetrieb GmbH in Mönchengladbach: Denkmalrestaurierung, Innenausbau, Krankenhausbau, Schlüsselfertigbau, Sanierung und Installationen. Meisterbetrieb seit 2019 (HRB 18836). Kostenloses Angebot.",
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
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.faq.slice(0, 8).map((f: any) => ({
    "@type": "Question",
    name: f.frage,
    acceptedAnswer: { "@type": "Answer", text: f.antwort },
  })),
};

const LEISTUNGS_BILDER: Record<string, string> = {
  denkmalrestaurierung: "/assets/denkmal/d11ef292-0817-42b3-8eaa-e60171cd3e74.webp",
  innenausbau: "/assets/innenausbau/b1b9855e-0abd-4906-b9f0-ecec14474c16.webp",
  krankenhausbau: "/assets/krankenhaus/IMG_1414.webp",
  schluesselfertigbau: "/assets/schlüsselfertig/313A5EC4-6A48-4A73-9700-47398D4304B4.webp",
  installationen: "/assets/sanierung/5ae308ff-8eee-4589-bb1b-427ca3aa858a.webp",
  sanierung: "/assets/sanierung/f344eb61-0eff-4ae1-bd94-0d1a0bc4fec1.webp",
  transport: "/assets/sonstiges/IMG_1415.webp",
};

const STADTTEILE_TEASER = stadtteile.stadt.quartiere.slice(0, 3);

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
            <h1>Mit Vertrauen bauen –<br />mit Qualität leben</h1>
            <p className="lead">
              Wir bauen nicht nur – wir bewahren, gestalten und entwickeln. Von der Restaurierung
              denkmalgeschützter Bauten bis zum schlüsselfertigen Neubau: Qualität, Verlässlichkeit
              und echte Handwerkskunst – seit 2019 in Mönchengladbach.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/kontakt/">Projekt unverbindlich anfragen</Link>
              <Link className="btn btn-ghost btn-lg" href="/leistungen/">Leistungen entdecken</Link>
            </div>

            <div className="hero-cards">
              <div className="hero-card">
                <h3>Ich plane ein Bauprojekt</h3>
                <ul>
                  <li><Link href="/leistungen/denkmalrestaurierung/">Denkmalrestaurierung <span className="arrow">›</span></Link></li>
                  <li><Link href="/leistungen/schluesselfertigbau/">Schlüsselfertigbau <span className="arrow">›</span></Link></li>
                  <li><Link href="/leistungen/sanierung/">Sanierung &amp; Restauration <span className="arrow">›</span></Link></li>
                  <li><Link href="/kontakt/">Kostenloses Angebot <span className="arrow">›</span></Link></li>
                </ul>
              </div>
              <div className="hero-card">
                <h3>Ich bin Kunde</h3>
                <ul>
                  <li><Link href="/referenzen/">Referenzen ansehen <span className="arrow">›</span></Link></li>
                  <li><Link href="/stadtteile/">Stadtteile &amp; Quartiere <span className="arrow">›</span></Link></li>
                  <li><Link href="/faq/">Häufige Fragen <span className="arrow">›</span></Link></li>
                  <li><a href={telHref(KONTAKT.tel)}>Anrufen: {KONTAKT.tel} <span className="arrow">›</span></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST-BAR */}
      <section className="trust-bar" aria-label="Vertrauensmerkmale">
        <div className="container">
          <div className="trust-item"><span className="t-ico">🏛️</span><div><div className="t-title">Denkmalpflege</div><div className="t-sub">Substanzschonende Restaurierung</div></div></div>
          <div className="trust-item"><span className="t-ico">🏥</span><div><div className="t-title">Gesundheitsbau</div><div className="t-sub">Komplexe Krankenhausprojekte</div></div></div>
          <div className="trust-item"><span className="t-ico">🔧</span><div><div className="t-title">Alles aus einer Hand</div><div className="t-sub">Bau, Ausbau, Installation, Transport</div></div></div>
          <div className="trust-item"><span className="t-ico">📞</span><div><div className="t-title">Persönlich &amp; transparent</div><div className="t-sub">Feste Preise, klare Termine</div></div></div>
        </div>
      </section>

      {/* LEISTUNGEN (GAG: Portfolio-Cards) */}
      <section className="section" aria-labelledby="leistungen-heading">
        <div className="container">
          <div className="section-head" style={{ maxWidth: 680, marginBottom: 48 }}>
            <span className="kicker">Leistungen</span>
            <h2 id="leistungen-heading">Fachgerechte Bauleistungen von A-Bau</h2>
            <p>
              Unser moderner Baubetrieb bietet ein Spektrum von sensiblen Restaurationen bis zum
              schlüsselfertigen Neubau. Unsere Kunden schätzen handwerkliche Qualität, persönliche
              Betreuung und transparente Kommunikation.
            </p>
          </div>
          <div className="grid grid-3">
            {leistungen.leistungen.map((l: any) => (
              <Link className="card" href={`/leistungen/${(l.slug || l.id)}/`} key={(l.slug || l.id)}>
                <div className="card-img">
                  <Image
                    src={LEISTUNGS_BILDER[(l.slug || l.id)] ?? "/assets/sonstiges/IMG_1416.webp"}
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
          <div className="section-head" style={{ maxWidth: 680, marginBottom: 48 }}>
            <span className="kicker">Stadtteile &amp; Quartiere</span>
            <h2 id="stadtteile-heading">A-Bau in Mönchengladbach</h2>
            <p>
              Mönchengladbach ist die Stadt von Borussia — und wir bauen hier für die Menschen, die leben,
              feiern und arbeiten. Von Geistenbeck bis Rheydt: Denkmalrestaurierung, Sanierung, Neubau
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
            <div className="card card-plain" style={{ background: "var(--color-accent-city)", color: "#fff" }}>
              <div className="card-body">
                <h3 style={{ color: "#fff" }}>Baustellen in Mönchengladbach</h3>
                <p style={{ color: "rgba(255,255,255,.85)" }}>Aktuelle Baumaßnahmen der Stadt, mags und NEW — verlinkt zu den offiziellen Quellen.</p>
                <Link className="card-link" href="/stadtteile/#baustellen" style={{ color: "#fff" }}>Aktuelle Baustellen <span className="arrow">→</span></Link>
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
            <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "grid", gap: 10 }}>
              <li>✓ Eigene Gewerke &amp; geprüfte Partner</li>
              <li>✓ Transparente Angebote – feste Preise</li>
              <li>✓ Persönliche Betreuung durch Geschäftsführer Albert Pfeiffer</li>
              <li>✓ Gewährleistung &amp; saubere Übergabe</li>
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
          <div className="section-head" style={{ maxWidth: 680, marginBottom: 48 }}>
            <span className="kicker">Referenzen</span>
            <h2 id="referenzen-heading">Projekte, die für sich sprechen</h2>
            <p>Einblicke in unsere Arbeit: Restaurierung, Gesundheitsbau, Innenausbau und Neubau.</p>
          </div>
          <div className="grid grid-3">
            {referenzen.referenzen.slice(0, 3).map((r: any) => (
              <Link className="card" href="/referenzen/" key={r.slug}>
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
              <details key={f.frage} className="acc-item">
                <summary className="acc-btn">{f.frage}<span className="chev">▾</span></summary>
                <div className="acc-panel"><div className="acc-panel-inner">{f.antwort}</div></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA-BAND */}
      <section className="section-dark section" aria-labelledby="cta-heading">
        <div className="container text-center">
          <span className="kicker" style={{ color: "var(--color-mg-gold)" }}>Kontakt</span>
          <h2 id="cta-heading">Ihr Projekt in guten Händen</h2>
          <p>Beschreiben Sie uns kurz Ihr Vorhaben – wir melden uns zeitnah mit einer ehrlichen Einschätzung.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary btn-lg" href="/kontakt/">Angebot anfordern</Link>
            <a className="btn btn-ghost btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,.6)", background: "rgba(255,255,255,.12)" }} href={telHref(KONTAKT.tel)}>
              Rufen Sie an: {KONTAKT.tel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
