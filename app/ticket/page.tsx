"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";

const API = "https://bluegold-tickets.bluegold.workers.dev";

type Ticket = {
  id: string;
  email: string;
  qty: number;
  used: boolean;
  created: string;
};

function TicketInner() {
  const params = useSearchParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [qr, setQr] = useState("");
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const sid = params.get("session_id");
    const id = params.get("id");
    const q = sid ? `session_id=${encodeURIComponent(sid)}` : id ? `id=${encodeURIComponent(id)}` : "";
    if (!q) {
      setState("error");
      return;
    }
    fetch(`${API}/ticket?${q}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(async (t: Ticket) => {
        setTicket(t);
        setQr(
          await QRCode.toDataURL(t.id, {
            margin: 1,
            width: 480,
            color: { dark: "#0a0a0a", light: "#ffffff" },
          })
        );
        setState("ok");
      })
      .catch(() => setState("error"));
  }, [params]);

  return (
    <main className="page">
      <div className="page-inner ticket-page">
        {state === "loading" && <p className="eyebrow">loading your ticket…</p>}

        {state === "error" && (
          <>
            <h1 className="display">
              ticket <span className="dim">not found</span>
            </h1>
            <p className="eyebrow">
              something went wrong — write us at core.bluegold@gmail.com with
              your payment receipt and we will sort it out.
            </p>
          </>
        )}

        {state === "ok" && ticket && (
          <>
            <h1 className="display">
              you&apos;re <span className="dim">in</span>
            </h1>
            <div className="ticket-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {qr && <img className="ticket-qr" src={qr} alt={`QR ${ticket.id}`} />}
              <div className="ticket-info">
                <span className="ticket-code">{ticket.id}</span>
                <span className="ticket-row">acid reflux ✕ blue gold — release party</span>
                <span className="ticket-row">18 jul 2026 · secret location, berlin · 13:00–06:00</span>
                <span className="ticket-row dim2">{ticket.email}</span>
                <span className="ticket-note">
                  screenshot this page — show the qr at the door. one entry per
                  code.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function TicketPage() {
  return (
    <Suspense fallback={null}>
      <TicketInner />
    </Suspense>
  );
}
