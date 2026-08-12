import type { Metadata } from "next";
import Link from "next/link";
import { KONTAKT } from "@/lib/kontakt";

export const metadata: Metadata = {
  title: "Über uns – A-Bau Meisterbetrieb GmbH | Mönchengladbach",
  description:
    "A-Bau Meisterbetrieb GmbH aus Mönchengladbach: eingetragenes Bauunternehmen (HRB 18836), Geschäftsführer Albert Pfeiffer. Restaurierung, Innenausbau, Neubau – mit Qualität und Verlässlichkeit.",
};

const PROZESS = [
  { nr: "01", titel: "Beratung & Besichtigung", text: "Wir hören zu, schauen genau hin und beraten ehrlich – vor Ort oder nach Unterlagen." },
  { nr: "02", titel: "Transparentes Angebot", text: "Feste Preise, klare Leistungen, kein Kleingedrucktes. Sie wissen, was Sie bekommen." },
  { nr: "03", titel: "Ausführung durch unseren Meisterbetrieb", text: "Eigene Gewerke und geprüfte Partner; bei größeren Vorhaben laufende Projektdokumentation." },
  { nr: "04", titel: "Übergabe & Gewährleistung", text: "Saubere Übergabe, Dokumentation und verlässlicher Service danach. Gesetzliche Gewährleistung." },
];

export default function UeberUns() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head" style={{ maxWidth: 720, marginBottom: 48 }}>
            <span className="kicker">Über uns</span>
            <h1>Fachmännische Restauration denkmalgeschützter Bauten</h1>
            <p>
              Die A-Bau Meisterbetrieb GmbH steht für handwerkliche Qualität, persönliche Betreuung
              und transparente Kommunikation. Unser Schwerpunkt ist die Erhaltung und Restaurierung
              historischer Bauwerke – mit einem professionellen Team, das den langfristigen Wert
              Ihrer Projekte sicherstellt.
            </p>
          </div>

          <div className="split" style={{ marginTop: "var(--space-6)" }}>
            <div>
              <h2>Historische Baukunst, neu belebt</h2>
              <p>
                Unsere Leidenschaft ist die Restaurierung denkmalgeschützter Bauten. Dabei verbinden
                wir traditionelles Handwerk mit modernen Techniken – und arbeiten eng mit
                Denkmalbehörden zusammen, um die Originalsubstanz zu bewahren.
              </p>
              <p>
                Darüber hinaus realisieren wir Innenausbauten, schlüsselfertige Neubauten,
                Krankenhausbau, Sanierungen, Installationen und europaweite Direkttransporte.
                Jedes Projekt – ob groß oder klein – wird mit Sorgfalt und Engagement umgesetzt.
              </p>
            </div>
            <div>
              <h2>Zahlen &amp; Fakten</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                <li><strong>Rechtsform:</strong> GmbH, eingetragen</li>
                <li><strong>Handelsregister:</strong> {KONTAKT.registergericht} {KONTAKT.hrb}</li>
                <li><strong>Geschäftsführer:</strong> {KONTAKT.gf}</li>
                <li><strong>Sitz:</strong> {KONTAKT.strasse}, {KONTAKT.plz} {KONTAKT.ort}</li>
                <li><strong>Gegründet:</strong> {KONTAKT.gegruendet}</li>
                <li><strong>Einsatzgebiet:</strong> {KONTAKT.servicegebiet}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft" aria-labelledby="prozess-heading">
        <div className="container">
          <div className="section-head" style={{ maxWidth: 680, marginBottom: 48 }}>
            <span className="kicker">Prozess</span>
            <h2 id="prozess-heading">So arbeiten wir</h2>
            <p>Vier Schritte – vom ersten Gespräch bis zur Übergabe. Transparent, verlässlich, meisterhaft.</p>
          </div>
          <div className="process-grid">
            {PROZESS.map((p) => (
              <div className="card card-plain process-step" key={p.nr}>
                <span className="badge badge-city process-step-number">{p.nr}</span>
                <h3>{p.titel}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container text-center">
          <span className="kicker" style={{ color: "var(--color-mg-gold)" }}>Kontakt</span>
          <h2>Ihr Projekt in guten Händen</h2>
          <p>Beschreiben Sie uns kurz Ihr Vorhaben – wir melden uns zeitnah.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary btn-lg" href="/kontakt/">Angebot anfordern</Link>
          </div>
        </div>
      </section>
    </>
  );
}
