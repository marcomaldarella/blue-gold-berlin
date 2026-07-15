"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Event } from "@/lib/events";

/**
 * Card dell'evento in vendita: il click apre un modale sopra la
 * pagina (dettagli + CTA). Il checkout vero apre Stripe: i Payment
 * Link non sono iframabili per policy Stripe.
 */
export default function TicketCard({ e }: { e: Event }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        className="event-card event-card-btn"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <figure>
          <Image
            src={e.flyer}
            alt={`${e.title} — flyer`}
            width={960}
            height={1200}
            sizes="(max-width: 720px) 100vw, 33vw"
          />
        </figure>
        <span className="event-card-meta">
          <span className="event-card-head">
            <span className="event-card-date">{e.date}</span>
            <span className="event-card-buy">upcoming</span>
          </span>
          <span className="event-card-title">{e.title}</span>
          <span className="event-card-line">{e.line}</span>
          <span className="event-card-venue">
            {e.venue}
            {e.time ? ` · ${e.time}` : ""}
          </span>
          <span className="event-card-cta">buy tickets</span>
        </span>
      </button>

      {/* portal: il wrapper [data-enter] ha un transform inline che
          intrappolerebbe il position:fixed */}
      {open &&
        createPortal(
        <div
          className="ticket-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`tickets — ${e.title}`}
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) setOpen(false);
          }}
        >
          <div className="ticket-modal-card">
            <button
              className="ticket-modal-close"
              aria-label="close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <figure>
              <Image
                src={e.flyer}
                alt=""
                width={640}
                height={800}
                sizes="380px"
              />
            </figure>
            <div className="ticket-modal-body">
              <h3>{e.title}</h3>
              <p className="tm-meta">
                {e.date} · {e.venue}
                {e.time ? ` · ${e.time}` : ""}
              </p>
              <p className="tm-line">{e.line}</p>
              <a
                className="tm-buy"
                href={e.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                buy with stripe ↗
              </a>
              <p className="tm-note">
                secure checkout via stripe · cards, apple pay, google pay
              </p>
            </div>
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
