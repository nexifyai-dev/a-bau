"use client";

import { useState } from "react";
import { KONTAKT, telHref } from "@/lib/kontakt";
import { ld } from "@/lib/schema";

export default function KontaktClient() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    setStatus("loading");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await r.json();
      if (j.ok) {
        setStatus("ok");
        setMsg("Vielen Dank! Ihre Nachricht ist angekommen – wir melden uns zeitnah.");
        form.reset();
      } else {
        setStatus("err");
        setMsg(j.error || `Versand fehlgeschlagen. Bitte rufen Sie uns an: ${KONTAKT.tel}`);
      }
    } catch {
      setStatus("err");
      setMsg(`Versand fehlgeschlagen. Bitte rufen Sie uns an: ${KONTAKT.tel}`);
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://a-bau.nexifyai.cloud/"}, {"@type": "ListItem", "position": 2, "name": "Kontakt", "item": "https://a-bau.nexifyai.cloud/kontakt/"}]}) }} />
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Kontakt</span>
          <h1>Sprechen wir über Ihr Bauvorhaben</h1>
          <p>
            Ob Denkmalrestaurierung, Umbau oder Neubau: Beschreiben Sie Ihr Anliegen – wir melden
            uns zeitnah mit einer ersten Einschätzung.
          </p>
        </div>
        <div className="split">
          <form className="card card-plain form-grid" onSubmit={submit} noValidate>
            <div className="hp-field" aria-hidden="true">
              <label>Firma<input type="text" name="firma" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <div className="form-field">
              <label htmlFor="k-name">Name *</label>
              <input id="k-name" name="name" required autoComplete="name" maxLength={120} />
            </div>
            <div className="form-field">
              <label htmlFor="k-email">E-Mail *</label>
              <input id="k-email" name="email" type="email" inputMode="email" required autoComplete="email" maxLength={160} />
            </div>
            <div className="form-field">
              <label htmlFor="k-tel">Telefon</label>
              <input id="k-tel" name="telefon" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} />
            </div>
            <div className="form-field">
              <label htmlFor="k-msg">Ihr Anliegen *</label>
              <textarea id="k-msg" name="nachricht" required maxLength={4000} placeholder="Kurze Beschreibung Ihres Projekts, Ort und Zeitrahmen …" />
            </div>
            <label className="consent-label">
              <input type="checkbox" name="einwilligung" required />
              Ich willige ein, dass meine Angaben zur Bearbeitung der Anfrage verarbeitet werden. (<a href="/datenschutz/">Datenschutz</a>) *
            </label>
            {status === "ok" && <p className="form-success" role="status" aria-live="polite">{msg}</p>}
            {status === "err" && <p className="form-error" role="alert">{msg}</p>}
            <button className="btn btn-primary btn-lg" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Wird gesendet …" : "Nachricht senden"}
            </button>
            <p className="form-note">* Pflichtfelder. Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.</p>
          </form>

          <div className="contact-info-grid">
            <div className="card card-dark">
              <div className="card-body">
                <h3>{KONTAKT.firma}</h3>
                <p>
                  {KONTAKT.strasse}<br />
                  {KONTAKT.plz} {KONTAKT.ort} ({KONTAKT.stadtteil})
                </p>
                <p>
                  <a href={telHref(KONTAKT.tel)}>Tel. {KONTAKT.tel}</a><br />
                  <a href={telHref(KONTAKT.telMobil)}>Mobil: {KONTAKT.telMobil}</a><br />
                  <a href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
                </p>
                <p className="text-3 text-inv-muted">
                  {KONTAKT.hrb} · {KONTAKT.registergericht} · GF {KONTAKT.gf}
                </p>
                <div className="oeffnungszeiten-list">
                  <b>Öffnungszeiten</b>
                  {KONTAKT.oeffnungszeiten.map((o) => (
                    <div key={o.tag} className="oeffnungszeiten-row">
                      <span className="oz-tag">{o.tag}</span>
                      <b>{o.zeit}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card card-plain media-clip">
              <iframe
                title="Karte: Standort A-Bau in Mönchengladbach"
                src="https://www.openstreetmap.org/export/embed.html?bbox=6.4285%2C51.1365%2C6.4645%2C51.1565&layer=mapnik&marker=51.146391%2C6.446307"
                style={{ width: "100%", height: 320, border: 0, display: "block" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
