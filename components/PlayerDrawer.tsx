"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SITE } from "@/lib/site";

/**
 * Player della home, dal PDF:
 * - desktop (pagina 1): box nero a filo dell'angolo basso-sinistra
 *   con "(player)" verde — per ora placeholder che apre Bandcamp;
 * - mobile (pagine 2-3): barra nera full-width col trattino bianco
 *   (handler, sempre visibile) che apre col tap o col drag il
 *   pannello grigio scuro con "(player)" e footer ©2026 + social.
 * GSAP per l'apertura; con prefers-reduced-motion nessuna
 * animazione (posizione settata direttamente).
 */
export default function PlayerDrawer() {
  const drawerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);

  const reduce = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const panelHeight = () => panelRef.current?.offsetHeight ?? 87;

  const setDrawer = (isOpen: boolean, animate: boolean) => {
    const el = drawerRef.current;
    if (!el) return;
    openRef.current = isOpen;
    setOpen(isOpen);
    const y = isOpen ? 0 : panelHeight();
    if (!animate || reduce()) {
      gsap.set(el, { y });
    } else {
      gsap.to(el, { y, duration: 0.45, ease: "power3.out", overwrite: true });
    }
  };

  /* stato iniziale: chiuso, solo l'handler visibile */
  useEffect(() => {
    setDrawer(false, false);
    const onResize = () => setDrawer(openRef.current, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* drag dell'handler: segue il dito, poi snap open/closed */
  const dragStart = useRef<{ y: number; base: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = {
      y: e.touches[0].clientY,
      base: openRef.current ? 0 : panelHeight(),
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const el = drawerRef.current;
    if (!el || !dragStart.current) return;
    const delta = e.touches[0].clientY - dragStart.current.y;
    const y = Math.min(
      panelHeight(),
      Math.max(0, dragStart.current.base + delta)
    );
    gsap.set(el, { y });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!dragStart.current) return;
    const delta = e.changedTouches[0].clientY - dragStart.current.y;
    const wasOpen = dragStart.current.base === 0;
    dragStart.current = null;
    if (Math.abs(delta) < 8) {
      /* tap */
      setDrawer(!wasOpen, true);
    } else {
      setDrawer(delta < 0, true);
    }
  };

  return (
    <>
      {/* desktop: box nero bottom-left */}
      <a
        className="player-box"
        href={SITE.bandcamp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="player — listen on bandcamp"
      >
        <span className="player-label">(player)</span>
      </a>

      {/* mobile: drawer col trattino */}
      <div className="player-drawer" ref={drawerRef}>
        <button
          className="drawer-handle"
          aria-expanded={open}
          aria-label={open ? "close player" : "open player"}
          onClick={() => setDrawer(!openRef.current, true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
        <div className="drawer-panel" ref={panelRef}>
          <a
            className="player-label"
            href={SITE.bandcamp}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
          >
            (player)
          </a>
          <div className="drawer-footer">
            <span className="copyright">©2026</span>
            <span className="socials">
              <a
                href={SITE.bandcamp}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
              >
                bandcamp
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
              >
                instagram
              </a>
              <a
                href={SITE.ra}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
              >
                resident advisor
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
