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
  quellen?: string[];
}

/** Interne Quell-Namen (content/leistungen …) in verständliche Labels wandeln */
function quellenLabel(q: string): string {
  const part = q.split("/").pop() || q;
  return part.charAt(0).toUpperCase() + part.slice(1);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hallo! Ich bin der KI-Assistent von A-Bau – wie kann ich Ihnen bei Ihrem Bau- oder Sanierungsvorhaben helfen?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, open]);

  // A.28/D.4: Dialog-Fokus — beim Öffnen in den Input, Escape schließt global,
  // beim Schließen Fokus zurück zum Trigger-Button.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    btnRef.current?.focus();
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setError("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 35000); // B.42: Client-Timeout, sonst Busy-State ewig
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Fehler bei der Kommunikation.");
      }
      setMsgs((m) => [...m, { role: "assistant", text: data?.answer || "", quellen: data?.quellen || [] }]);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Zeitüberschreitung – bitte erneut versuchen.");
      } else {
        setError(err instanceof Error ? err.message : "Verbindungsproblem – bitte später erneut versuchen.");
      }
    } finally {
      clearTimeout(timer);
      setBusy(false);
      inputRef.current?.focus();
    }
  }, [input, busy]);

  return (
    <>
      <button
        ref={btnRef}
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
          {/* R63: Live-Region erst ab erster dynamischer Nachricht aktiv (Begrüßung nicht ansagen, ARIA22) */}
          <div className="abau-chat-msgs" ref={listRef} aria-live={msgs.length > 1 ? "polite" : "off"} aria-relevant="additions text">
            {msgs.map((m, i) => (
              <div key={i} className={`abau-msg ${m.role === "user" ? "abau-msg-user" : "abau-msg-assistant"}`}>
                {m.text}
                {m.role === "assistant" && m.quellen && m.quellen.length > 0 && (
                  <div className="abau-chat-quellen">
                    Quelle: {m.quellen.map(quellenLabel).join(" · ")}
                  </div>
                )}
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
                maxLength={500}
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
