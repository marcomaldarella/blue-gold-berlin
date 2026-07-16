"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

const API = "https://bluegold-tickets.bluegold.workers.dev";

type Result = {
  ok: boolean;
  status: "valid" | "already_used" | "not_found";
  email?: string;
  qty?: number;
  amount?: number;
  currency?: string;
  usedAt?: string;
};

/* scanner ingresso: camera + jsQR, admin key salvata sul telefono */
export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanningRef = useRef(false);
  const [key, setKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [manual, setManual] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const k = localStorage.getItem("bg-scan-key") || "";
    if (k) {
      setKey(k);
      setKeySaved(true);
    }
  }, []);

  const saveKey = () => {
    localStorage.setItem("bg-scan-key", key.trim());
    setKeySaved(true);
  };

  const check = async (id: string) => {
    scanningRef.current = false;
    try {
      const res = await fetch(`${API}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id.trim().toUpperCase(), key }),
      });
      if (res.status === 401) {
        setErr("admin key sbagliata");
        setKeySaved(false);
        return;
      }
      setResult(await res.json());
    } catch {
      setErr("rete assente — riprova");
    }
  };

  const startCamera = async () => {
    setErr("");
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setCameraOn(true);
      scanningRef.current = true;
      tick();
    } catch {
      setErr("camera non disponibile — usa il codice manuale");
    }
  };

  const tick = () => {
    if (!scanningRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(img.data, img.width, img.height);
      const m = code?.data?.toUpperCase().match(/[A-Z2-9]{8}/);
      if (m) {
        check(m[0]);
        return;
      }
    }
    requestAnimationFrame(tick);
  };

  const again = () => {
    setResult(null);
    setErr("");
    scanningRef.current = true;
    tick();
  };

  return (
    <main className="page">
      <div className="page-inner scan-page">
        <h1 className="display">
          door <span className="dim">scanner</span>
        </h1>

        {!keySaved && (
          <div className="scan-key" data-nosnippet>
            <span className="subscribe-label">admin key</span>
            <div className="subscribe-row">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="admin key"
                aria-label="admin key"
              />
              <button onClick={saveKey}>save</button>
            </div>
          </div>
        )}

        {keySaved && (
          <>
            {!cameraOn && (
              <button className="scan-start" onClick={startCamera}>
                start camera
              </button>
            )}

            <div className={`scan-video${cameraOn ? " is-on" : ""}`}>
              <video ref={videoRef} playsInline muted />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            <div className="scan-manual">
              <span className="subscribe-label">or type the code</span>
              <div className="subscribe-row">
                <input
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  placeholder="ES. 6BBY5CWL"
                  aria-label="ticket code"
                />
                <button onClick={() => manual && check(manual)}>check</button>
              </div>
            </div>

            {err && <p className="scan-err">{err}</p>}

            {result && (
              <div
                className={`scan-result ${
                  result.status === "valid" ? "is-valid" : "is-bad"
                }`}
              >
                <span className="scan-status">
                  {result.status === "valid" && "✓ valid — let them in"}
                  {result.status === "already_used" && "✕ already used"}
                  {result.status === "not_found" && "✕ not found"}
                </span>
                {result.email && <span className="scan-mail">{result.email}</span>}
                {result.amount ? (
                  <span className="scan-mail">
                    paid €{(result.amount / 100).toFixed(2)}
                  </span>
                ) : null}
                {result.usedAt && (
                  <span className="scan-mail">used at {result.usedAt}</span>
                )}
                <button className="scan-next" onClick={again}>
                  scan next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
