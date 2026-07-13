"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SPLASH_DONE_EVENT } from "@/components/SplashScreen";

/**
 * Entrance staggerata in stile portfolio: gli elementi marcati
 * con [data-enter] partono nascosti (via .js-entrance in CSS)
 * e vengono rivelati con power3.out. Se in pagina c'è la splash
 * ancora visibile, aspetta il suo evento di fine.
 */
export default function PageEntrance() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const root = document.querySelector(".js-entrance");
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = gsap.utils.toArray<HTMLElement>("[data-enter]");

    if (reduce || targets.length === 0) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let fallback: ReturnType<typeof setTimeout> | null = null;

    const play = () => {
      if (tl) return;
      tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      /* niente clearProps: il transform inline y:0 deve restare,
         altrimenti torna il translateY(14px) dello stato iniziale */
      tl.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.15,
      });
    };

    const splash = document.getElementById("bg-splash");
    const splashVisible =
      splash !== null && getComputedStyle(splash).display !== "none";

    if (splashVisible) {
      window.addEventListener(SPLASH_DONE_EVENT, play, { once: true });
      fallback = setTimeout(play, 2600);
    } else {
      play();
    }

    return () => {
      window.removeEventListener(SPLASH_DONE_EVENT, play);
      if (fallback) clearTimeout(fallback);
      if (tl) tl.kill();
    };
  }, []);

  return null;
}
