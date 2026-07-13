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
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage non disponibile: mostra comunque la splash */
    }

    const finish = () => {
      el.style.display = "none";
      setGone(true);
      window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduce) {
      finish();
      return;
    }

    const mark = el.querySelector(".wordmark");
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(
      mark,
      { opacity: 0, y: 10, scaleX: 1.33 },
      { opacity: 1, y: 0, scaleX: 1.33, duration: 0.45, ease: "power2.out" }
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
        <span className="wordmark">BlueGold</span>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("${KEY}")==="1"){var s=document.getElementById("bg-splash");if(s)s.style.display="none"}}catch(e){}`,
        }}
      />
    </>
  );
}
