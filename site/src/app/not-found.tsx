import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden – A-Bau Meisterbetrieb Mönchengladbach",
  description: "Die angeforderte Seite existiert nicht. Zur Startseite von A-Bau Meisterbetrieb in Mönchengladbach.",
  // R76: KEIN eigenes robots-Meta — Next setzt bei 404 automatisch `noindex`;
  // das eigene Tag erzeugte ein Doppel (<meta noindex> + <meta noindex, nofollow>).
  // Interne Links der 404-Seite bleiben crawlbar (kein nofollow erwünscht).
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="container err-page">
        <h1>404</h1>
        <h2>Hier wird gebaut</h2>
        <p>
          Diese Seite ist leider nicht erreichbar. Vielleicht hilft die Navigation oder die{" "}
          <Link href="/leistungen/">Leistungsübersicht</Link>.
        </p>
        <p className="mt-5">
          <Link className="btn btn-primary" href="/">Zurück zur Startseite</Link>
        </p>
      </div>
    </section>
  );
}
