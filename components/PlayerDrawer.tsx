"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RADIO_TRACKS } from "@/lib/releases";
import { SITE } from "@/lib/site";

/* embed Bandcamp come su bgwax.com, ricolorato per il redesign */
const embedSrc = (albumId: number) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=231f20/linkcol=00aa4e/tracklist=false/artwork=small/transparent=true/`;

/**
 * Player reale della home:
 * - desktop: click sul box nero "(player)" → pannello scuro sopra
 *   il box con lista bluegold radio (01-05) + iframe Bandcamp;
 * - mobile: lista + iframe dentro il pannello del drawer esistente.
 * REGOLA PERFORMANCE: l'iframe si monta solo alla prima apertura
 * (mai al load); dopo resta montato così l'audio prosegue anche a
 * pannello chiuso. Supporta /?track=N (dalle righe radio in about).
 */
export default function PlayerDrawer() {
  const drawerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false); // desktop
  /* lazy: ogni superficie monta il proprio iframe solo alla
     prima apertura, così non esistono embed doppi */
  const [mountedPanel, setMountedPanel] = useState(false);
  const [mountedDrawer, setMountedDrawer] = useState(false);
  const [current, setCurrent] = useState(0);

  const reduce = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const panelHeight = () => panelRef.current?.offsetHeight ?? 87;

  const setDrawer = (isOpen: boolean, animate: boolean) => {
    const el = drawerRef.current;
    if (!el) return;
    openRef.current = isOpen;
    setOpen(isOpen);
    if (isOpen) setMountedDrawer(true);
    const apply = () => {
      const y = isOpen ? 0 : panelHeight();
      if (!animate || reduce()) {
        gsap.set(el, { y });
      } else {
        gsap.to(el, { y, duration: 0.45, ease: "power3.out", overwrite: true });
      }
    };
    /* il mount della lista/iframe cambia l'altezza: misura al frame dopo */
    requestAnimationFrame(apply);
  };

  const togglePanel = (next?: boolean) => {
    const v = next ?? !panelOpen;
    setPanelOpen(v);
    if (v) setMountedPanel(true);
  };

  /* stato iniziale: drawer chiuso; /?track=N apre il player */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("track");
    const idx = t === null ? -1 : parseInt(t, 10);
    const valid = idx >= 0 && idx < RADIO_TRACKS.length;
    if (valid) setCurrent(idx);

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    if (valid && !isMobile) togglePanel(true);
    setDrawer(Boolean(valid && isMobile), false);

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
      setDrawer(!wasOpen, true);
    } else {
      setDrawer(delta < 0, true);
    }
  };

  const trackList = (
    <ul className="pp-list">
      {RADIO_TRACKS.map((t, i) => (
        <li key={t.catalog}>
          <button
            className={`pp-item${i === current ? " is-current" : ""}`}
            onClick={() => setCurrent(i)}
          >
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <span className="title">{t.title}</span>
            <span className="cat">{t.catalog}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  const embed = (
    <div className="pp-embed">
      <iframe
        src={embedSrc(RADIO_TRACKS[current].albumId)}
        title={`bluegold radio — ${RADIO_TRACKS[current].title}`}
        seamless
        allow="autoplay"
      />
    </div>
  );

  return (
    <>
      {/* desktop: pannello sopra il box */}
      <div className={`player-panel${panelOpen ? " is-open" : ""}`}>
        <div className="pp-header">
          <span>bluegold radio · {RADIO_TRACKS.length} tracks</span>
          <button
            className="pp-close"
            aria-label="close player"
            onClick={() => togglePanel(false)}
            tabIndex={panelOpen ? 0 : -1}
          >
            ×
          </button>
        </div>
        {trackList}
        {mountedPanel && embed}
      </div>

      {/* desktop: box nero bottom-left, identico da chiuso */}
      <button
        className="player-box"
        aria-expanded={panelOpen}
        aria-label={panelOpen ? "close player" : "open player"}
        onClick={() => togglePanel()}
      >
        <span className="player-label">(player)</span>
      </button>

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
          {mountedDrawer ? (
            <div className="drawer-player">
              {trackList}
              {embed}
            </div>
          ) : (
            <span className="player-label">(player)</span>
          )}
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
