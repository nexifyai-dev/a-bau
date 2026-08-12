"use client";

import { useState } from "react";

const TEL = "+49 2166 9925056";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ role: string; text: string; quellen?: string[] }[]>([
    { role: "bot", text: "Guten Tag! Ich beantworte Fragen zu den Leistungen von A-Bau Meisterbetrieb – Restaurierung, Innenausbau, Krankenhausbau, Neubau und mehr. Wie kann ich helfen?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const d = await r.json();
      setMsgs((m) => [...m, { role: "bot", text: d.answer || `Bitte nutzen Sie das Kontaktformular oder rufen Sie uns an: ${TEL}.`, quellen: d.quellen }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: `Der Chat ist kurz nicht erreichbar. Bitte nutzen Sie das Kontaktformular oder rufen Sie uns an: ${TEL}.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="chat-fab"
        aria-label={open ? "KI-Assistent schließen" : "KI-Assistent öffnen"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >{open ? "✕" : "A"}</button>

      <div className={`chat-panel ${open ? "open" : ""}`} role="dialog" aria-label="KI-Assistent A-Bau">
        <div className="chat-head">
          <div>
            <div className="chat-title">A-Bau KI-Assistent</div>
            <div className="chat-sub">Antwortet aus dem Wissen dieser Website</div>
          </div>
          <button className="chat-close" aria-label="Chat schließen" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="chat-msgs">
          {msgs.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role === "user" ? "user" : "bot"}`}>
              {m.text}
              {m.quellen && m.quellen.length > 0 && (
                <span className="chat-src">Quelle: {m.quellen.join(", ")}</span>
              )}
            </div>
          ))}
          {loading && <div className="chat-msg bot">…</div>}
        </div>
        <div className="chat-input-row">
          <input
            type="text"
            maxLength={500}
            placeholder="Ihre Frage …"
            aria-label="Ihre Frage an den KI-Assistenten"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="chat-send" aria-label="Nachricht senden" onClick={send} disabled={loading}>➤</button>
        </div>
        <div className="chat-hint">
          KI-Assistent – Antworten basieren ausschließlich auf Website-Inhalten. <a href="/datenschutz/">Datenschutzerklärung</a>.
        </div>
      </div>
    </>
  );
}
