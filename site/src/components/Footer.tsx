import Link from "next/link";
import { KONTAKT, telHref } from "@/lib/kontakt";

export default function Footer() {
  const jahr = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>A-Bau Meisterbetrieb GmbH</h3>
            <p>
              Restaurierung denkmalgeschützter Bauten, Innenausbau, Krankenhausbau,
              Schlüsselfertigbau, Sanierung und Installationen in Mönchengladbach &amp; NRW.
            </p>
            <p className="footer-note">
              Mönchengladbach ist die Stadt von Borussia — wir bauen für die Menschen,
              die hier leben, feiern und arbeiten. (Kein Vereins-Logo/-Wappen; geographischer Bezug.)
            </p>
          </div>
          <div>
            <h3>Leistungen</h3>
            <nav>
              <Link href="/leistungen/denkmalrestaurierung/">Denkmalrestaurierung</Link>
              <Link href="/leistungen/innenausbau/">Innenausbau</Link>
              <Link href="/leistungen/krankenhausbau/">Krankenhausbau</Link>
              <Link href="/leistungen/schluesselfertigbau/">Schlüsselfertigbau</Link>
              <Link href="/leistungen/sanierung/">Sanierung</Link>
              <Link href="/leistungen/installationen/">Installationen</Link>
              <Link href="/leistungen/transport/">Transporte</Link>
            </nav>
          </div>
          <div>
            <h3>Stadtteile</h3>
            <nav>
              <Link href="/stadtteile/geistenbeck/">Geistenbeck</Link>
              <Link href="/stadtteile/moenchengladbach-city-nordstadt-suedstadt/">Mönchengladbach City</Link>
              <Link href="/stadtteile/eicken-wickrath/">Eicken / Wickrath</Link>
              <Link href="/stadtteile/rheydt/">Rheydt</Link>
              <Link href="/stadtteile/odenkirchen-wickrathberg-hardt/">Odenkirchen / Hardt</Link>
              <Link href="/stadtteile/niers-volksgarten-umfeld/">Niers / Volksgarten</Link>
              <Link href="/stadtteile/">Alle Stadtteile</Link>
            </nav>
          </div>
          <div>
            <h3>Kontakt</h3>
            <nav>
              <Link href={telHref(KONTAKT.tel)}>Tel: {KONTAKT.tel}</Link>
              <Link href={telHref(KONTAKT.telMobil)}>Mobil: {KONTAKT.telMobil}</Link>
              <Link href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</Link>
              <Link href="/kontakt/">Kontaktformular</Link>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {jahr} {KONTAKT.firma} · {KONTAKT.hrb} · {KONTAKT.registergericht}</span>
          <Link href="/impressum/">Impressum</Link>
          <Link href="/datenschutz/">Datenschutz</Link>
          <Link href="/cookie-richtlinie/">Cookie-Richtlinie</Link>
        </div>
      </div>
    </footer>
  );
}
