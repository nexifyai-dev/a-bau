"use client";

import { useState } from "react";
import { KONTAKT, telHref } from "@/lib/kontakt";

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
    <section className="section">
      <div className="container">
        <div className="section-head" style={{ maxWidth: 720, marginBottom: 48 }}>
          <span className="kicker">Kontakt</span>
          <h1>Sprechen wir über Ihr Bauvorhaben</h1>
          <p>
            Ob Denkmalrestaurierung, Umbau oder Neubau: Beschreiben Sie Ihr Anliegen – wir melden
            uns zeitnah mit einer ersten Einschätzung.
          </p>
        </div>
        <div className="split" style={{ gridTemplateColumns: "1.1fr .9fr" }}>
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
              <input id="k-email" name="email" type="email" required autoComplete="email" maxLength={160} />
            </div>
            <div className="form-field">
              <label htmlFor="k-tel">Telefon</label>
              <input id="k-tel" name="telefon" type="tel" autoComplete="tel" maxLength={40} />
            </div>
            <div className="form-field">
              <label htmlFor="k-msg">Ihr Anliegen *</label>
              <textarea id="k-msg" name="nachricht" required maxLength={4000} placeholder="Kurze Beschreibung Ihres Projekts, Ort und Zeitrahmen …" />
            </div>
            <label style={{ fontSize: ".9rem", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <input type="checkbox" name="einwilligung" required style={{ marginTop: 3 }} />
              Ich willige ein, dass meine Angaben zur Bearbeitung der Anfrage verarbeitet werden. (<a href="/datenschutz/">Datenschutz</a>) *
            </label>
            {status === "ok" && <p className="form-success" role="status" aria-live="polite">{msg}</p>}
            {status === "err" && <p className="form-error" role="alert">{msg}</p>}
            <button className="btn btn-primary btn-lg" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Wird gesendet …" : "Nachricht senden"}
            </button>
            <p className="form-note">* Pflichtfelder. Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.</p>
          </form>

          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <div className="card" style={{ background: "var(--color-neutral-dark)", color: "var(--color-text-inv)" }}>
              <div className="card-body">
                <h3 style={{ color: "#fff" }}>{KONTAKT.firma}</h3>
                <p style={{ margin: 0, color: "rgba(255,255,255,.85)" }}>
                  {KONTAKT.strasse}<br />
                  {KONTAKT.plz} {KONTAKT.ort} ({KONTAKT.stadtteil})
                </p>
                <p style={{ margin: 0 }}>
                  <a href={telHref(KONTAKT.tel)} style={{ color: "var(--color-mg-gold)" }}>Tel: {KONTAKT.tel}</a><br />
                  <a href={telHref(KONTAKT.telMobil)} style={{ color: "var(--color-mg-gold)" }}>Mobil: {KONTAKT.telMobil}</a><br />
                  <a href={`mailto:${KONTAKT.email}`} style={{ color: "var(--color-mg-gold)" }}>{KONTAKT.email}</a>
                </p>
                <p style={{ margin: 0, fontSize: ".85rem", color: "rgba(255,255,255,.65)" }}>
                  {KONTAKT.hrb} · {KONTAKT.registergericht} · GF {KONTAKT.gf}
                </p>
                <div style={{ marginTop: 10, display: "grid", gap: 6, fontSize: ".95rem" }}>
                  <b>Öffnungszeiten</b>
                  {KONTAKT.oeffnungszeiten.map((o) => (
                    <div key={o.tag} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ color: "rgba(255,255,255,.72)" }}>{o.tag}</span>
                      <b>{o.zeit}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card card-plain" style={{ overflow: "hidden" }}>
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
  );
}
