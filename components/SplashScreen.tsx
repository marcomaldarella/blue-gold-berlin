"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const SPLASH_DONE_EVENT = "bg:splash-done";

/**
 * Splash d'ingresso: solo il marchio Bluegold centrato sul fondo
 * base, appare e svanisce (~1.6s), poi display:none e smontaggio
 * dal DOM (regola iOS). Esce a ogni caricamento della home; con
 * prefers-reduced-motion sparisce subito.
 */
export default function SplashScreen() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const finish = () => {
      el.style.display = "none";
      setGone(true);
      window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
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
    </>
  );
}
