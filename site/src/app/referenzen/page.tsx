import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { referenzen } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/referenzen/", languages: { de: "https://a-bau.nexifyai.cloud/referenzen/", "x-default": "https://a-bau.nexifyai.cloud/referenzen/" } },
  title: "Referenzen – A-Bau Bauunternehmen Mönchengladbach",
  description:
    "Referenzen der A-Bau Meisterbetrieb GmbH: Altbau-Erhaltung, Gesundheitsbau, Raumgestaltung, Schlüsselfertigbau, Badezimmer und Handwerkskunst im Detail.",
};

export default function Referenzen() {
  return (
    <>
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
            <div className="section" key={r.slug} id={r.slug} style={{ paddingTop: 0 }}>
              <div className="section-head">
                <span className="kicker">Referenz</span>
                <h2>{r.titel}</h2>
                <p className="text-2">{r.text}</p>
              </div>
              <div className="gallery">
                {r.bilder.map((b: string) => (
                  <figure className="gallery-item" key={b}>
                    <Image
                      src={`/assets/${b}`}
                      alt={`${r.titel} – A-Bau Meisterbetrieb Mönchengladbach`}
                      width={640}
                      height={480}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      sizes="(max-width: 720px) 50vw, 25vw"
                    />
                    <figcaption>
                      {r.titel}
                      {(r.ort || r.jahr) && (
                        <span className="gallery-meta">
                          {[r.ort, r.jahr, r.umfang].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
              {r.video && (
                <video
                  controls
                  preload="metadata"
                  poster="/assets/krankenhaus/IMG_1414.webp"
                  style={{ width: "100%", maxWidth: 560, borderRadius: "var(--r-md)", marginTop: 16 }}
                  title={`Projektvideo ${r.titel}`}
                >
                  <source src={`/assets/videos/${r.video}?v=20260812`} type="video/mp4" />
                  Das Projektvideo kann in Ihrem Browser nicht abgespielt werden – wir zeigen Ihnen
                  die Arbeiten gern persönlich: <Link href="/kontakt/">Kontakt aufnehmen</Link>.
                </video>
              )}
            </div>
          ))}

          <div className="notice mt-7">
            <strong>Hinweis:</strong> Konkrete Projektdaten (Ort, Jahr, Umfang) werden nach Freigabe durch den Kunden ergänzt. Die gezeigten Bilder stammen aus dem Projektbestand der A-Bau Meisterbetrieb GmbH.
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <span className="kicker kicker-gold">Kontakt</span>
          <h2>Ihr Projekt in guten Händen</h2>
          <p>Beschreiben Sie uns kurz Ihr Vorhaben – wir melden uns zeitnah.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" href="/kontakt/">Projekt anfragen</Link>
          </div>
        </div>
      </section>
    </>
  );
}
