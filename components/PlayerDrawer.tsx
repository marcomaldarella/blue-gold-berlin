"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RADIO_TRACKS } from "@/lib/releases";
import { SITE } from "@/lib/site";

/* embed Bandcamp in toni bianchi su fondo ink */
const largeSrc = (albumId: number) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=0c0c0c/linkcol=e8e8e6/tracklist=false/artwork=small/transparent=true/`;

/**
 * Player della home:
 * - desktop: il box nero in basso a sinistra contiene direttamente
 *   la barra Bandcamp small (42px) già attiva, montata a idle dopo
 *   il first paint (niente click, niente peso sull'LCP). Il click
 *   sulla testata del box apre il pannello con la lista dei 5
 *   brani per cambiare traccia — un solo iframe su desktop;
 * - mobile: pattern del drawer dal PDF, lista + embed large dentro
 *   il pannello, montati alla prima apertura.
 * Supporta /?track=N (dalle righe radio in about).
 */
export default function PlayerDrawer() {
  const drawerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false); // lista desktop
  const [mountedBox, setMountedBox] = useState(false); // barra small
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

  /* stato iniziale: drawer chiuso; /?track=N apre lista/drawer */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("track");
    const idx = t === null ? -1 : parseInt(t, 10);
    const valid = idx >= 0 && idx < RADIO_TRACKS.length;
    if (valid) setCurrent(idx);

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    if (valid && !isMobile) setPanelOpen(true);
    setDrawer(Boolean(valid && isMobile), false);

    const onResize = () => setDrawer(openRef.current, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* desktop: la barra small appare da sola subito dopo il first
     paint (requestIdleCallback, fallback timeout) */
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    if (isMobile) return;
    const cb = () => setMountedBox(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(cb, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(cb, 300);
    return () => clearTimeout(t);
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

  /* desktop: lista "tirabile" — pointer drag sul bordo del box */
  const deskDrag = useRef<{ y: number; moved: boolean } | null>(null);

  const onBoxPointerDown = (e: React.PointerEvent) => {
    deskDrag.current = { y: e.clientY, moved: false };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onBoxPointerMove = (e: React.PointerEvent) => {
    if (!deskDrag.current) return;
    const delta = e.clientY - deskDrag.current.y;
    if (delta < -16 && !panelOpen) {
      setPanelOpen(true);
      deskDrag.current.moved = true;
    } else if (delta > 16 && panelOpen) {
      setPanelOpen(false);
      deskDrag.current.moved = true;
    }
  };

  const onBoxPointerUp = (e: React.PointerEvent) => {
    const d = deskDrag.current;
    deskDrag.current = null;
    /* tap secco senza drag = toggle (sostituisce il click) */
    if (d && !d.moved && Math.abs(e.clientY - d.y) < 8) {
      setPanelOpen((v) => !v);
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

  return (
    <>
      {/* desktop: box nero col player attivo; il pannello-lista vive
          DENTRO il box, ancorato sopra (bottom: 100%) */}
      <div className="player-box">
        <div className={`player-panel${panelOpen ? " is-open" : ""}`}>
        <div className="pp-header">
          <span>bluegold radio · {RADIO_TRACKS.length} tracks</span>
          <button
            className="pp-close"
            aria-label="close track list"
            onClick={() => setPanelOpen(false)}
            tabIndex={panelOpen ? 0 : -1}
          >
            ×
          </button>
        </div>
          {trackList}
        </div>
        <button
          className="pb-head"
          aria-expanded={panelOpen}
          aria-label={panelOpen ? "close track list" : "open track list"}
          onPointerDown={onBoxPointerDown}
          onPointerMove={onBoxPointerMove}
          onPointerUp={onBoxPointerUp}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setPanelOpen((v) => !v);
          }}
        >
          <span className="pb-handle" aria-hidden="true" />
          <span className="pb-track">
            {String(current + 1).padStart(2, "0")}{" "}
            {RADIO_TRACKS[current].title}
          </span>
        </button>
        {mountedBox && (
          <div className="pb-embed">
            <iframe
              src={largeSrc(RADIO_TRACKS[current].albumId)}
              title={`bluegold radio — ${RADIO_TRACKS[current].title}`}
              seamless
              allow="autoplay"
            />
          </div>
        )}
      </div>

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
              <div className="pp-embed">
                <iframe
                  src={largeSrc(RADIO_TRACKS[current].albumId)}
                  title={`bluegold radio — ${RADIO_TRACKS[current].title}`}
                  seamless
                  allow="autoplay"
                />
              </div>
            </div>
          ) : (
            <span className="player-label">
              {String(current + 1).padStart(2, "0")}{" "}
              {RADIO_TRACKS[current].title}
            </span>
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
