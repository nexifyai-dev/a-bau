import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden – A-Bau Meisterbetrieb Mönchengladbach",
  description: "Die angeforderte Seite existiert nicht. Zur Startseite von A-Bau Meisterbetrieb in Mönchengladbach.",
  robots: { index: false, follow: false },
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
