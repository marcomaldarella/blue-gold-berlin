"use client";

import { useState } from "react";

const ENDPOINT = "https://bluegold-subscribe.bluegold.workers.dev";

/* iscrizione mail: salvata su Cloudflare KV via worker */
export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending" || state === "done") return;
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <form className="subscribe" onSubmit={submit} data-enter>
      <span className="subscribe-label">stay updated on the next events</span>
      {state === "done" ? (
        <span className="subscribe-done">you&apos;re in. see you on the floor.</span>
      ) : (
        <div className="subscribe-row">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="email address"
          />
          <button type="submit" disabled={state === "sending"}>
            {state === "sending" ? "…" : "subscribe"}
          </button>
        </div>
      )}
      {state === "error" && (
        <span className="subscribe-error">something broke — try again.</span>
      )}
    </form>
  );
}
