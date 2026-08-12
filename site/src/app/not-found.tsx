import Link from "next/link";

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
