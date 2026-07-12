"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const KEY = "bg-splash-seen";
export const SPLASH_DONE_EVENT = "bg:splash-done";

/**
 * Splash d'ingresso: logo centrato su fondo ink, fade/scale out
 * (~1.4s totali), poi smontata dal DOM (display:none + unmount,
 * regola iOS). Appare solo al primo caricamento della sessione
 * (sessionStorage); con prefers-reduced-motion sparisce subito.
 *
 * Lo script inline nasconde l'overlay prima del paint se la
 * splash è già stata vista, così le navigazioni interne non
 * mostrano alcun flash.
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

    const logo = el.querySelector("img");
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(logo, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" })
      .to(logo, { scale: 1.05, duration: 0.35, ease: "power1.inOut" }, "+=0.25")
      .to(el, { opacity: 0, duration: 0.45, ease: "power2.inOut" }, "<");

    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <>
      <div className="splash" id="bg-splash" ref={rootRef} aria-hidden="true">
        <Image
          src="/assets/bluegold-blue.png"
          alt=""
          width={928}
          height={928}
          priority
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
