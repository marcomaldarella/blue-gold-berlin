"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const KEY = "bg-splash-seen";
export const SPLASH_DONE_EVENT = "bg:splash-done";

/**
 * Splash d'ingresso: fondo bianco, wordmark "BlueGold" su barra
 * grigia che appare e svanisce (~1.4s), poi display:none e
 * smontaggio dal DOM (regola iOS). Solo al primo caricamento
 * della sessione (sessionStorage); con prefers-reduced-motion
 * sparisce subito.
 */
export default function SplashScreen() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* storage non disponibile: mostra comunque la splash */
    }

    const finish = () => {
      /* il flag va scritto QUI, non al mount: con StrictMode il primo
         effect viene subito smontato e un flag già scritto farebbe
         saltare la splash al secondo mount */
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      el.style.display = "none";
      setGone(true);
      window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduce) {
      finish();
      return;
    }

    const mark = el.querySelector(".splash-mark");
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(
      mark,
      { opacity: 0, y: 12, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
    )
      .to(mark, { opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.45")
      .to(el, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, "-=0.15");

    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <>
      <div className="splash" id="bg-splash" ref={rootRef} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="splash-mark"
          src="/assets/favicon-192.png"
          alt=""
          width={192}
          height={192}
        />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("${KEY}")==="1"){var s=document.getElementById("bg-splash");if(s)s.style.display="none"}}catch(e){}`,
        }}
      />
    </>
  );
}
