import Link from "next/link";
import { KONTAKT, telHref } from "@/lib/kontakt";

export default function Footer() {
  const jahr = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2 className="footer-title">A-Bau Meisterbetrieb GmbH</h2>
            <p>
              Restaurierung denkmalgeschützter Bauten, Innenausbau, Krankenhausbau,
              Schlüsselfertigbau, Sanierung und Installationen in Mönchengladbach &amp; NRW.
            </p>
          </div>
          <div>
            <h2 className="footer-title">Leistungen</h2>
            <nav>
              <Link href="/leistungen/denkmalrestaurierung/">Denkmal-Restaurierung</Link>
              <Link href="/leistungen/innenausbau/">Innenausbau</Link>
              <Link href="/leistungen/krankenhausbau/">Krankenhausbau</Link>
              <Link href="/leistungen/schluesselfertigbau/">Schlüsselfertigbau</Link>
              <Link href="/leistungen/sanierung/">Sanierung</Link>
              <Link href="/leistungen/installationen/">Installationen</Link>
            </nav>
          </div>
          <div>
            <h2 className="footer-title">Stadtteile</h2>
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
            <h2 className="footer-title">Kontakt</h2>
            <nav>
              <Link href={telHref(KONTAKT.tel)}>Tel. {KONTAKT.tel}</Link>
              <Link href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</Link>
              <Link href="/kontakt/">Kontaktformular</Link>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {jahr} {KONTAKT.firma} · {KONTAKT.hrb} · {KONTAKT.registergericht}</span>
          <Link href="/impressum/">Impressum</Link>
          <Link href="/datenschutz/">Datenschutz</Link>
          <Link href="/agb/">AGB</Link>
          <Link href="/nutzungsbedingungen/">Nutzungsbedingungen</Link>
          <Link href="/cookie-richtlinie/">Cookie-Richtlinie</Link>
        </div>
        <p className="footer-made-by">
          Diese Website wurde erstellt von{" "}
          <a href="https://www.nexifyai.cloud" target="_blank" rel="noopener noreferrer">NeXifyAI</a>
        </p>
      </div>
    </footer>
  );
}
