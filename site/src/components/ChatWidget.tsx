"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A-Bau Chat-Assistent — Floating Chat-Widget.
 * API: POST /api/chat { message } → { answer, quellen } (chat/server.py, RAG über site-KB).
 * CI: Brand-Tokens (--color-brand-green, --font-inter), keine Fremdfarben/-fonts (ADR-003).
 * DSGVO: Hinweis im Widget + Link Datenschutzerklärung (ADR-004).
 */
interface Msg {
  role: "user" | "assistant";
  text: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hallo! Wie kann ich Ihnen bei Ihrem Bau- oder Sanierungsvorhaben helfen?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setError("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Fehler bei der Kommunikation.");
      }
      setMsgs((m) => [...m, { role: "assistant", text: data?.answer || "" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verbindungsproblem – bitte später erneut versuchen.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }, [input, busy]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Chat schließen" : "Chat öffnen"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="abau-chat-btn"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
            <path d="M12 3C6.9 3 3 6.4 3 10.7c0 2.4 1.2 4.6 3.1 6-.2 1.3-.9 2.6-2 3.6-.2.2 0 .6.3.6 2 .1 3.8-.6 5.1-1.6 1 .3 2.1.4 3.3.4 5.1 0 9-3.4 9-7.7S17.1 3 12 3z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="abau-chat-win" role="dialog" aria-label="A-Bau KI-Assistent">
          <div className="abau-chat-head">
            <span>A-Bau KI-Assistent</span>
            <button type="button" aria-label="Chat schließen" className="abau-chat-close" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="abau-chat-msgs" ref={listRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`abau-msg ${m.role === "user" ? "abau-msg-user" : "abau-msg-assistant"}`}>
                {m.text}
              </div>
            ))}
            {busy && <div className="abau-msg abau-msg-assistant">Schreibt…</div>}
            {error && <div className="abau-msg abau-msg-err">{error}</div>}
          </div>
          <div className="abau-chat-foot">
            <div className="abau-chat-inputrow">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Ihre Frage eingeben…"
                aria-label="Ihre Frage"
              />
              <button type="button" aria-label="Nachricht senden" className="abau-chat-send" onClick={send} disabled={busy}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M3 11.5 21 3l-6.2 18-4.1-7.2L3 11.5z" />
                </svg>
              </button>
            </div>
            <p className="abau-chat-dsgvo">
              Sie chatten mit einem KI-Assistenten (Art. 50 EU AI Act). Ihre Nachrichten werden ausschließlich zur Beantwortung verarbeitet und nicht gespeichert.{" "}
              <a href="/datenschutz/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
