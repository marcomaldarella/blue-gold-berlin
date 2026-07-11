"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Entrance staggerata in stile portfolio: gli elementi marcati
 * con [data-enter] partono nascosti (via .js-entrance in CSS)
 * e vengono rivelati con power3.out / power4.out.
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

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      stagger: 0.09,
      ease: "power3.out",
      delay: 0.15,
      clearProps: "transform",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return null;
}
