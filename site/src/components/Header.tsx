"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { KONTAKT, telHref, istGeoeffnet } from "@/lib/kontakt";

const LEISTUNGEN = [
  { href: "/leistungen/denkmalrestaurierung/", title: "Denkmalrestaurierung", sub: "Historische Bausubstanz erhalten" },
  { href: "/leistungen/innenausbau/", title: "Innenausbau", sub: "Wohnung, Gewerbe, Büro" },
  { href: "/leistungen/krankenhausbau/", title: "Krankenhausbau", sub: "Komplexe Gesundheitsbauten" },
  { href: "/leistungen/schluesselfertigbau/", title: "Schlüsselfertigbau", sub: "Neubau aus einer Hand" },
  { href: "/leistungen/sanierung/", title: "Sanierung & Restaurierung", sub: "Altbau auf neuestem Stand" },
  { href: "/leistungen/installationen/", title: "Installationen", sub: "Strom & Wasser" },
  { href: "/leistungen/transport/", title: "Transporte", sub: "Europaweite Direkttransporte" },
];
const STADTTEILE = [
  { href: "/stadtteile/geistenbeck/", title: "Geistenbeck", sub: "Unser Heimat-Stadtteil" },
  { href: "/stadtteile/moenchengladbach-city-nordstadt-suedstadt/", title: "Mönchengladbach City", sub: "Münster, Abteiberg, Markt" },
  { href: "/stadtteile/eicken-wickrath/", title: "Eicken / Wickrath", sub: "Wohnen & Familienhäuser" },
  { href: "/stadtteile/rheydt/", title: "Rheydt", sub: "Industriegeschichte, neue Quartiere" },
  { href: "/stadtteile/odenkirchen-wickrathberg-hardt/", title: "Odenkirchen / Hardt", sub: "Grüne Randlagen" },
  { href: "/stadtteile/niers-volksgarten-umfeld/", title: "Niers / Volksgarten", sub: "Naherholung & Wohnqualität" },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [offen, setOffen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ddOpen, setDdOpen] = useState<"" | "leistungen" | "stadtteile">("");
  const ddLeistungenRef = useRef<HTMLDivElement>(null);
  const ddStadtteileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bind = (ref: React.RefObject<HTMLDivElement | null>, name: "leistungen" | "stadtteile") => {
      const el = ref.current;
      if (!el) return;
      const onFocusIn = () => setDdOpen(name);
      const onFocusOut = (e: FocusEvent) => {
        if (!el.contains(e.relatedTarget as Node)) setDdOpen("");
      };
      el.addEventListener("focusin", onFocusIn);
      el.addEventListener("focusout", onFocusOut);
      return () => {
        el.removeEventListener("focusin", onFocusIn);
        el.removeEventListener("focusout", onFocusOut);
      };
    };
    const c1 = bind(ddLeistungenRef, "leistungen");
    const c2 = bind(ddStadtteileRef, "stadtteile");
    return () => { c1?.(); c2?.(); };
  }, []);

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
      <div className="utility-bar">
        <div className="container utility-inner">
          <div className="utility-left">
            <Link href="/leistungen/denkmalrestaurierung/">Restaurierung</Link>
            <Link href="/leistungen/innenausbau/">Innenausbau</Link>
            <Link href="/leistungen/krankenhausbau/">Krankenhausbau</Link>
            <Link href="/leistungen/schluesselfertigbau/">Schlüsselfertigbau</Link>
            <Link href="/stadtteile/">Stadtteile</Link>
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
            <div className="nav-dropdown" ref={ddLeistungenRef}>
              <button type="button" aria-haspopup="true" aria-expanded={ddOpen === "leistungen"} aria-controls="dd-leistungen">Leistungen <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg></button>
              <div className="nav-dropdown-menu" id="dd-leistungen">
                {LEISTUNGEN.map((l) => (
                  <Link key={l.href} href={l.href}>
                    <span className="dd-title">{l.title}</span>
                    <span className="dd-sub">{l.sub}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="nav-dropdown" ref={ddStadtteileRef}>
              <button type="button" aria-haspopup="true" aria-expanded={ddOpen === "stadtteile"} aria-controls="dd-stadtteile">Stadtteile <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg></button>
              <div className="nav-dropdown-menu" id="dd-stadtteile">
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
            <Link className="btn btn-primary nav-cta" href="/kontakt/">Projekt anfragen</Link>
          </nav>

          <button
            className="nav-toggle"
            aria-label={drawerOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(!drawerOpen)}
          ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg></button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`drawer-scrim ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <nav className={`drawer ${drawerOpen ? "open" : ""}`} aria-label="Mobile Navigation" aria-hidden={!drawerOpen}>
        <button className="drawer-close" aria-label="Menü schließen" onClick={() => setDrawerOpen(false)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/></svg></button>
        <Link href="/" onClick={() => setDrawerOpen(false)}>Start</Link>
        <Link href="/leistungen/" onClick={() => setDrawerOpen(false)}>Leistungen</Link>
        <Link href="/referenzen/" onClick={() => setDrawerOpen(false)}>Referenzen</Link>
        <Link href="/stadtteile/" onClick={() => setDrawerOpen(false)}>Stadtteile</Link>
        <Link href="/ueber-uns/" onClick={() => setDrawerOpen(false)}>Über uns</Link>
        <Link href="/faq/" onClick={() => setDrawerOpen(false)}>FAQ</Link>
        <Link className="btn btn-primary drawer-cta" href="/kontakt/" onClick={() => setDrawerOpen(false)}>Projekt anfragen</Link>
      </nav>
    </>
  );
}
