"use client";

import { useState } from "react";

export default function A11yWidget() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState(false);

  const apply = (size: number, hc: boolean) => {
    document.documentElement.style.fontSize = size + "%";
    document.documentElement.classList.toggle("high-contrast", hc);
  };

  return (
    <>
      <button className="a11y-fab" aria-label="Barrierefreiheit" onClick={() => setOpen(!open)} title="Barrierefreiheit">
        A
      </button>
      <div className={`a11y-panel ${open ? "open" : ""}`}>
        <h3>Barrierefreiheit</h3>
        <button onClick={() => { const s = Math.min(fontSize + 10, 130); setFontSize(s); apply(s, contrast); }}>
          Schrift größer
        </button>
        <button onClick={() => { const s = Math.max(fontSize - 10, 90); setFontSize(s); apply(s, contrast); }}>
          Schrift kleiner
        </button>
        <button onClick={() => { const c = !contrast; setContrast(c); apply(fontSize, c); }}>
          {contrast ? "Normaler Kontrast" : "Hoher Kontrast"}
        </button>
        <button onClick={() => { setFontSize(100); setContrast(false); apply(100, false); }}>
          Zurücksetzen
        </button>
      </div>
    </>
  );
}
