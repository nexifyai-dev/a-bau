"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { KONTAKT, telHref, istGeoeffnet } from "@/lib/kontakt";

const LEISTUNGEN = [
  { href: "/leistungen/denkmalrestaurierung/", title: "Denkmalrestaurierung", sub: "Historische Bausubstanz erhalten" },
  { href: "/leistungen/innenausbau/", title: "Innenausbau", sub: "Wohnung, Gewerbe, Büro" },
  { href: "/leistungen/krankenhausbau/", title: "Krankenhausbau", sub: "Komplexe Gesundheitsbauten" },
  { href: "/leistungen/schluesselfertigbau/", title: "Schlüsselfertigbau", sub: "Neubau aus einer Hand" },
  { href: "/leistungen/sanierung/", title: "Sanierung & Restauration", sub: "Altbau auf neuestem Stand" },
  { href: "/leistungen/installationen/", title: "Installationen", sub: "Strom & Wasser" },
  { href: "/leistungen/transport/", title: "Transporte", sub: "Europaweite Direkttransporte" },
];
const STADTTEILE = [
  { href: "/stadtteile/geistenbeck/", title: "Geistenbeck", sub: "Unser Heimat-Stadtteil" },
  { href: "/stadtteile/city/", title: "Mönchengladbach City", sub: "Münster, Abteiberg, Markt" },
  { href: "/stadtteile/eicken-wickrath/", title: "Eicken / Wickrath", sub: "Wohnen & Familienhäuser" },
  { href: "/stadtteile/rheydt/", title: "Rheydt", sub: "Industriegeschichte, neue Quartiere" },
  { href: "/stadtteile/odenkirchen-hardt/", title: "Odenkirchen / Hardt", sub: "Grüne Randlagen" },
  { href: "/stadtteile/niers-volksgarten/", title: "Niers / Volksgarten", sub: "Naherholung & Wohnqualität" },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [offen, setOffen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOffen(istGeoeffnet());
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const isCurrent = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Utility-Bar (GAG: dünn, dunkel) */}
      <div className="utility-bar" role="banner">
        <div className="container utility-inner">
          <div className="utility-left">
            <a href="/leistungen/denkmalrestaurierung/">Restaurierung</a>
            <a href="/leistungen/innenausbau/">Innenausbau</a>
            <a href="/leistungen/krankenhausbau/">Krankenhausbau</a>
            <a href="/leistungen/schluesselfertigbau/">Schlüsselfertigbau</a>
            <a href="/stadtteile/">Stadtteile</a>
          </div>
          <div className="utility-right">
            <span className={`utility-status ${offen ? "open" : "closed"}`}>{offen ? "Geöffnet" : "Geschlossen"}</span>
            <a className="utility-phone" href={telHref(KONTAKT.tel)}>{KONTAKT.tel}</a>
          </div>
        </div>
      </div>

      {/* Haupt-Header (weiß, transluzent) */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="A-Bau Meisterbetrieb – Startseite">
            <img className="brand-logo" src="/logo.png" alt="A-Bau Meisterbetrieb GmbH" width={48} height={48} />
            <span className="brand-text">
              <span className="brand-name">A-Bau Meisterbetrieb</span>
              <span className="brand-sub">Bauen · Restaurieren · Gestalten</span>
            </span>
          </Link>

          <nav className="nav-desktop" aria-label="Hauptnavigation">
            <Link href="/" aria-current={isCurrent("/") ? "page" : undefined}>Start</Link>
            <div className="nav-dropdown">
              <button type="button" aria-haspopup="true">Leistungen <span aria-hidden="true">▾</span></button>
              <div className="nav-dropdown-menu">
                {LEISTUNGEN.map((l) => (
                  <Link key={l.href} href={l.href}>
                    <span className="dd-title">{l.title}</span>
                    <span className="dd-sub">{l.sub}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="nav-dropdown">
              <button type="button" aria-haspopup="true">Stadtteile <span aria-hidden="true">▾</span></button>
              <div className="nav-dropdown-menu">
                <Link href="/stadtteile/"><span className="dd-title">Alle Stadtteile</span><span className="dd-sub">Überblick & Schwerpunkte</span></Link>
                {STADTTEILE.map((s) => (
                  <Link key={s.href} href={s.href}>
                    <span className="dd-title">{s.title}</span>
                    <span className="dd-sub">{s.sub}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/referenzen/" aria-current={isCurrent("/referenzen/") ? "page" : undefined}>Referenzen</Link>
            <Link href="/ueber-uns/" aria-current={isCurrent("/ueber-uns/") ? "page" : undefined}>Über uns</Link>
            <Link href="/faq/" aria-current={isCurrent("/faq/") ? "page" : undefined}>FAQ</Link>
            <Link className="btn btn-primary nav-cta" href="/kontakt/">Angebot anfordern</Link>
          </nav>

          <button
            className="nav-toggle"
            aria-label={drawerOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >☰</button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`drawer-scrim ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <nav className={`drawer ${drawerOpen ? "open" : ""}`} aria-label="Mobile Navigation" aria-hidden={!drawerOpen}>
        <button className="drawer-close" aria-label="Menü schließen" onClick={() => setDrawerOpen(false)}>✕</button>
        <Link href="/" onClick={() => setDrawerOpen(false)}>Start</Link>
        <Link href="/leistungen/" onClick={() => setDrawerOpen(false)}>Leistungen</Link>
        <Link href="/referenzen/" onClick={() => setDrawerOpen(false)}>Referenzen</Link>
        <Link href="/stadtteile/" onClick={() => setDrawerOpen(false)}>Stadtteile</Link>
        <Link href="/ueber-uns/" onClick={() => setDrawerOpen(false)}>Über uns</Link>
        <Link href="/faq/" onClick={() => setDrawerOpen(false)}>FAQ</Link>
        <Link className="btn btn-primary drawer-cta" href="/kontakt/" onClick={() => setDrawerOpen(false)}>Angebot anfordern</Link>
      </nav>
    </>
  );
}
