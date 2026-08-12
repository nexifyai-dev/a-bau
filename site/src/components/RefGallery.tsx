"use client";

// Referenz-Galerie mit Lightbox (Vergrößerung per Klick/Tap, WCAG 2.1.2/2.4.3).
// Statischer Export: reines Client-State-Modal, keine Library (YAGNI).
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  titel: string;
  bilder: string[];
  altBase: string;
};

export default function RefGallery({ titel, bilder, altBase }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + bilder.length) % bilder.length)),
    [bilder.length]
  );

  useEffect(() => {
    if (open === null) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "Tab") {
        // Fokus-Trap (WCAG 2.1.2): Tab zyklisiert innerhalb der Lightbox
        const f = Array.from(
          document.querySelectorAll<HTMLElement>(".lightbox button")
        ).filter((b) => !b.hasAttribute("disabled"));
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <>
      <div className="gallery">
        {bilder.map((b, i) => (
          <figure className="gallery-item" key={b}>
            <button
              type="button"
              className="gallery-btn"
              aria-label={`${altBase} – Bild ${i + 1} von ${bilder.length} vergrößern`}
              onClick={() => setOpen(i)}
            >
              <Image
                src={`/assets/${b}`}
                alt={`${altBase} – A-Bau Meisterbetrieb Mönchengladbach`}
                width={640}
                height={480}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                sizes="(max-width: 720px) 50vw, 25vw"
              />
            </button>
            <figcaption>
              {titel}
              <span className="gallery-meta">Klick zum Vergrößern</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {open !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${altBase} – Bild ${open + 1} von ${bilder.length}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button ref={closeRef} type="button" className="lightbox-close" aria-label="Vergrößerung schließen" onClick={close}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <button ref={prevRef} type="button" className="lightbox-nav lightbox-prev" aria-label="Vorheriges Bild" onClick={() => step(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 6-6 6 6 6" />
            </svg>
          </button>
          <Image
            src={`/assets/${bilder[open]}`}
            alt={`${altBase} – Bild ${open + 1} von ${bilder.length}`}
            width={1600}
            height={1200}
            style={{ objectFit: "contain", maxWidth: "92vw", maxHeight: "86vh", width: "auto", height: "auto" }}
            className="lightbox-img"
          />
          <button type="button" className="lightbox-nav lightbox-next" aria-label="Nächstes Bild" onClick={() => step(1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
