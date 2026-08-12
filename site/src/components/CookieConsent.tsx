"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("abau_consent")) {
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);
  if (!show) return null;
  return (
    <div className="cookie-banner show" role="dialog" aria-label="Cookie-Hinweis">
      <p>
        <strong>Hinweis zu Cookies:</strong> Diese Website setzt nur technisch notwendige Cookies und
        keine Tracking-Cookies. Details in der <a href="/datenschutz/">Datenschutzerklärung</a> und{" "}
        <a href="/cookie-richtlinie/">Cookie-Richtlinie</a>.
      </p>
      <div className="cookie-actions">
        <button className="btn btn-primary" onClick={() => { localStorage.setItem("abau_consent", "necessary"); setShow(false); }}>
          Verstanden
        </button>
      </div>
    </div>
  );
}
