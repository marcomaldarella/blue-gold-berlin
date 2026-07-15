"use client";

import { useEffect, useRef, useState } from "react";
/* eslint-disable @next/next/no-img-element */
import { AUDIO_BASE, PLAYLIST, RELEASES } from "@/lib/releases";

const src = (file: string) => `${AUDIO_BASE}/${file}.mp3`;

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/**
 * Player nativo del catalogo: un solo <audio>, playlist completa
 * delle release con artwork. Desktop: box nero in basso a sinistra
 * con transport + lista a pannello; mobile: drawer dal basso.
 * Montato nel layout: la musica continua tra le pagine.
 * Supporta /?track=N (dalle righe radio in about).
 */
export default function PlayerDrawer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [listOpen, setListOpen] = useState(false); // pannello desktop
  const [drawerOpen, setDrawerOpen] = useState(false); // drawer mobile
  const [started, setStarted] = useState(false); // audio montato solo al primo play

  const track = PLAYLIST[current];

  /* /?track=N: seleziona la traccia e apre la lista */
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("track");
    if (t === null) return;
    const idx = parseInt(t, 10);
    if (idx >= 0 && idx < PLAYLIST.length) {
      setCurrent(idx);
      if (window.matchMedia("(max-width: 720px)").matches) setDrawerOpen(true);
      else setListOpen(true);
    }
  }, []);

  /* cambio traccia: aggiorna src e riparte se stava suonando */
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !started) return;
    a.src = src(track.file);
    a.load();
    if (playing) a.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, started]);

  const play = (idx?: number) => {
    if (typeof idx === "number" && idx !== current) {
      setCurrent(idx);
      setPlaying(true);
      setStarted(true);
      return; /* l'effect sopra fa partire il nuovo src */
    }
    const a = audioRef.current;
    setStarted(true);
    if (!a) {
      setPlaying(true);
      return;
    }
    if (a.paused) {
      if (!a.src) a.src = src(track.file);
      a.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  /* primo mount dell'audio: se il play è stato chiesto, parte */
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !started) return;
    if (playing && a.paused) {
      if (!a.src) a.src = src(track.file);
      a.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const step = (d: number) =>
    play((current + d + PLAYLIST.length) % PLAYLIST.length);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    a.currentTime = (parseFloat(e.target.value) / 1000) * dur;
  };

  const transport = (
    <div className="np-transport">
      <button aria-label="previous track" onClick={() => step(-1)}>
        ←
      </button>
      <button
        className="np-play"
        aria-label={playing ? "pause" : "play"}
        onClick={() => play()}
      >
        {playing ? "pause" : "play"}
      </button>
      <button aria-label="next track" onClick={() => step(1)}>
        →
      </button>
    </div>
  );

  const seekbar = (
    <div className="np-seek">
      <span className="np-time">{fmt(time)}</span>
      <input
        type="range"
        min={0}
        max={1000}
        value={dur ? Math.round((time / dur) * 1000) : 0}
        onChange={seek}
        aria-label="seek"
      />
      <span className="np-time">{fmt(dur)}</span>
    </div>
  );

  const list = (
    <ul className="pp-list">
      {RELEASES.map((r) => (
        <li key={r.slug}>
          <div className="np-group">
            <img src={r.cover} alt="" width={28} height={28} />
            <span>
              {r.artist} — {r.title}
            </span>
            <span className="cat">{r.catalog}</span>
          </div>
          <ul className="pp-list">
            {r.tracks.map((t) => {
              const idx = PLAYLIST.findIndex((p) => p.file === t.file);
              return (
                <li key={t.file}>
                  <button
                    className={`pp-item${idx === current ? " is-current" : ""}`}
                    onClick={() => play(idx)}
                  >
                    <span className="num">
                      {idx === current && playing ? "▶" : String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="title">
                      {t.artist} — {t.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {started && (
        <audio
          ref={audioRef}
          preload="none"
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onDurationChange={(e) => setDur(e.currentTarget.duration)}
          onEnded={() => step(1)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />
      )}

      {/* ---- desktop: box in basso a sinistra ---- */}
      <div className="player-box">
        <div className="player-panel-wrap">
          {listOpen && (
            <div className="player-panel is-open">
              <div className="pp-header">
                <span>bluegold radio · {PLAYLIST.length} tracks</span>
                <button className="pp-close" onClick={() => setListOpen(false)}>
                  ×
                </button>
              </div>
              {list}
            </div>
          )}
        </div>

        <button
          className="pb-head"
          onClick={() => setListOpen((v) => !v)}
          aria-expanded={listOpen}
          aria-label="toggle tracklist"
        >
          <span className="pb-handle" />
          <span className="pb-track">
            {String(current + 1).padStart(2, "0")} {track.artist} — {track.title}
          </span>
        </button>

        <div className="np-body">
          <img className="np-art" src={track.cover} alt="" width={54} height={54} />
          <div className="np-main">
            {seekbar}
            {transport}
          </div>
        </div>
      </div>

      {/* ---- mobile: drawer dal basso ---- */}
      <div className={`player-drawer${drawerOpen ? " is-open" : ""}`}>
        <button
          className="drawer-handle"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          aria-label="toggle player"
        />
        <div className="drawer-panel">
          <div className="np-body">
            <img className="np-art" src={track.cover} alt="" width={54} height={54} />
            <div className="np-main">
              <span className="pb-track">
                {track.artist} — {track.title}
              </span>
              {seekbar}
              {transport}
            </div>
          </div>
          {drawerOpen && <div className="drawer-player">{list}</div>}
        </div>
      </div>
    </>
  );
}
