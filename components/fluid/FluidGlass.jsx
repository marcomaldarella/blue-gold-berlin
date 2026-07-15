"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Geometry, Texture, RenderTarget, Flowmap } from "ogl";
import {
  default_vert,
  advection_frag,
  backgroundClock_frag,
  displayTexture_frag,
  fluidVelocity_frag,
  glassShading_frag,
  initializePressure_frag,
  reactionDiffusion_frag,
  velocityCorrection_frag,
  velocityToPressure_frag,
} from "./glsl";

/* palette b/n chrome del sito (era via URL param nella repo originale) */
const CONFIG = {
  glassColor: [1, 1, 1],
  shadow: 0.07,
  bright: 0.09,
  bgcolor: [0.04, 0.04, 0.04],
  color1: [0.18, 0.18, 0.18],
  color2: [0.063, 0.063, 0.063],
  color3: [0.85, 0.85, 0.85],
  feed: 0.054,
  kill: 0.0616,
  iterations: 10,
};

/**
 * Porting React del "fluidglass" di chiuhans111 (Vue+OGL):
 * reaction-diffusion + Navier-Stokes + glass shader. La mask della
 * reaction-diffusion è un canvas 2D su cui disegnamo marchio e
 * wordmark "bluegold": il vetro fluido cresce attorno al segno.
 */
export default function FluidGlass() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer;
    try {
      renderer = new Renderer({ alpha: false });
    } catch {
      return; /* niente WebGL: resta il fallback statico */
    }
    const gl = renderer.gl;
    root.appendChild(gl.canvas);

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });
    const mesh = new Mesh(gl, { geometry });

    function makeShader(fragment, uniforms = {}) {
      const program = new Program(gl, { vertex: default_vert, fragment, uniforms });
      return (target, u) => {
        mesh.program = program;
        for (const k in u) program.uniforms[k].value = u[k];
        renderer.render(target ? { scene: mesh, target } : { scene: mesh });
      };
    }

    /* ---- passes (uniforms iniziali come nella repo) ---- */
    const initializePressure = makeShader(initializePressure_frag);
    const displayTexture = makeShader(displayTexture_frag, {
      textureMap: { value: 0 },
      showAlpha: { value: false },
    });
    const advection = makeShader(advection_frag, {
      inputMap: { value: 0 },
      velocityMap: { value: 0 },
      uSize: { value: [0, 0] },
    });
    const velocityToPressure = makeShader(velocityToPressure_frag, {
      velocityMap: { value: 0 },
      uSize: { value: [0, 0] },
    });
    const velocityCorrection = makeShader(velocityCorrection_frag, {
      pressureMap: { value: 0 },
      velocityMap: { value: 0 },
      uSize: { value: [0, 0] },
    });
    const fluidVelocity = makeShader(fluidVelocity_frag, {
      pressureMap: { value: 0 },
      velocityMap: { value: 0 },
      flowMap: { value: 0 },
      uSize: { value: [0, 0] },
    });
    const reactionDiffusion = makeShader(reactionDiffusion_frag, {
      pressureMap: { value: 0 },
      maskTexture: { value: 0 },
      uSize: { value: [0, 0] },
      feed0: { value: CONFIG.feed },
      kill0: { value: CONFIG.kill },
    });
    const backgroundClock = makeShader(backgroundClock_frag, {
      uSize: { value: [0, 0] },
      parallax: { value: [0, 0] },
      clockHands: { value: [0, 0, 0] },
      bgcolor: { value: CONFIG.bgcolor },
      circlecolor1: { value: CONFIG.color1 },
      circlecolor2: { value: CONFIG.color2 },
      circlecolor3: { value: CONFIG.color3 },
    });
    const glassShading = makeShader(glassShading_frag, {
      pressureMap: { value: 0 },
      backgroundMap: { value: 0 },
      uSize: { value: [0, 0] },
      glassColor: { value: CONFIG.glassColor },
      shadowFactor: { value: CONFIG.shadow },
      brightFactor: { value: CONFIG.bright },
      parallax: { value: [0, 0] },
    });

    /* ---- render targets ---- */
    const renderTargets = [];
    const renderTargetsDelayed = [];
    function createRT(delayed = false) {
      const t = new RenderTarget(gl, {
        width: 512,
        height: 512,
        type: gl.HALF_FLOAT,
        format: gl.RGBA,
        internalFormat: gl.RGBA16F,
        depth: false,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      });
      (delayed ? renderTargetsDelayed : renderTargets).push(t);
      return t;
    }
    const pressure = createRT();
    const background = createRT();
    const pressureTemp = createRT(true);
    const velocity = createRT();
    const velocityTemp = createRT(true);

    const flowmap = new Flowmap(gl, {
      size: 512,
      falloff: 0.12,
      alpha: 0.8,
      dissipation: 0.7,
    });

    /* ---- mask: marchio + wordmark disegnati su canvas 2D ---- */
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");
    let maskTexture;
    const mark = new Image();
    mark.src = "/assets/favicon-192.png";
    let markRed = null;
    mark.onload = () => {
      /* tinta il marchio di rosso pieno: la mask legge il canale R */
      const c = document.createElement("canvas");
      c.width = mark.width;
      c.height = mark.height;
      const x = c.getContext("2d");
      x.drawImage(mark, 0, 0);
      x.globalCompositeOperation = "source-in";
      x.fillStyle = "red";
      x.fillRect(0, 0, c.width, c.height);
      markRed = c;
    };

    const fontFamily =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-zalando")
        .split(",")[0]
        .trim() || "sans-serif";

    function renderForeground(canvas, ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const size = Math.min(canvas.width / 7.5, canvas.height / 5);

      if (markRed) {
        const m = size * 1.7;
        ctx.drawImage(markRed, cx - m / 2, cy - size * 0.62 - m / 2, m, m);
      }
      ctx.font = `300 ${Math.round(size)}px ${fontFamily}`;
      ctx.fillText("bluegold", cx, cy + size * 0.85);
    }

    function canvasTexture(target) {
      maskCanvas.width = target.width;
      maskCanvas.height = target.height;
      renderForeground(maskCanvas, maskCtx);
      if (!maskTexture) {
        maskTexture = new Texture(gl);
        maskTexture.image = maskCanvas;
      }
      maskTexture.needsUpdate = true;
      return maskTexture;
    }

    /* ---- parallax (versione senza Vue) ---- */
    const parallax = { x: 0, y: 0 };
    const motion = { x: 0, y: 0 };
    function parallaxMove(e) {
      motion.x += e.movementX * 0.001;
      motion.y -= e.movementY * 0.001;
    }

    /* ---- listeners ---- */
    let simulationSize = [512, 512];
    let setSizeNeeded = true;

    function resize() {
      const rect = root.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      setSizeNeeded = true;
    }
    function mousemove(e) {
      parallaxMove(e);
      const rect = root.getBoundingClientRect();
      flowmap.mouse.set((e.x - 0) / rect.width, (rect.bottom - e.y) / rect.height);
      flowmap.velocity.set(
        (e.movementX / rect.width) * simulationSize[0],
        (e.movementY / rect.width) * simulationSize[1]
      );
    }
    let prevTouch = null;
    function touchmove(e) {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = root.getBoundingClientRect();
      flowmap.mouse.set(
        touch.clientX / rect.width,
        (rect.bottom - touch.clientY) / rect.height
      );
      if (!prevTouch) prevTouch = { x: touch.clientX, y: touch.clientY };
      flowmap.velocity.set(
        ((touch.clientX - prevTouch.x) / rect.width) * simulationSize[0],
        ((touch.clientY - prevTouch.y) / rect.width) * simulationSize[1]
      );
      prevTouch = { x: touch.clientX, y: touch.clientY };
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("touchmove", touchmove, { passive: true });
    resize();

    initializePressure(pressure);

    /* ---- loop ---- */
    let alive = true;
    function update() {
      if (!alive) return;
      requestAnimationFrame(update);

      flowmap.update();
      flowmap.velocity.set(0, 0);

      parallax.x += motion.x * 0.1;
      parallax.y += motion.y * 0.1;
      parallax.x *= 0.99;
      parallax.y *= 0.99;
      motion.x *= 0.8;
      motion.y *= 0.8;

      if (setSizeNeeded) {
        setSizeNeeded = false;
        displayTexture(pressureTemp, { textureMap: pressure.texture, showAlpha: false });
        displayTexture(velocityTemp, { textureMap: velocity.texture, showAlpha: false });

        const scale = Math.max(
          0.4,
          Math.min(
            0.8,
            (1024 / Math.min(renderer.width, renderer.height)) * window.devicePixelRatio
          )
        );
        const width = Math.round((renderer.width * scale) / 4) * 4;
        const height = Math.round((renderer.height * scale) / 4) * 4;
        simulationSize = [width, height];

        for (const t of renderTargets) t.setSize(width, height);
        displayTexture(pressure, { textureMap: pressureTemp.texture, showAlpha: false });
        displayTexture(velocity, { textureMap: velocityTemp.texture, showAlpha: false });
        for (const t of renderTargetsDelayed) t.setSize(width, height);
      }

      fluidVelocity(velocityTemp, {
        pressureMap: pressure.texture,
        velocityMap: velocity.texture,
        flowMap: flowmap.mask.read.texture,
        uSize: [pressure.texture.width, pressure.texture.height],
      });

      const mask = canvasTexture(pressure);

      for (let i = 0; i < CONFIG.iterations; i++) {
        velocityToPressure(pressureTemp, {
          velocityMap: velocityTemp.texture,
          uSize: [pressureTemp.width, pressureTemp.height],
        });
        velocityCorrection(velocity, {
          pressureMap: pressureTemp.texture,
          velocityMap: velocityTemp.texture,
          uSize: [velocity.width, velocity.height],
        });
        advection(velocityTemp, {
          inputMap: velocity.texture,
          velocityMap: velocity.texture,
          uSize: [velocityTemp.width, velocityTemp.height],
        });
        advection(pressureTemp, {
          inputMap: pressure.texture,
          velocityMap: velocity.texture,
          uSize: [pressureTemp.width, pressureTemp.height],
        });
        reactionDiffusion(pressure, {
          pressureMap: pressureTemp.texture,
          maskTexture: mask,
          uSize: [pressure.width, pressure.height],
        });
      }

      displayTexture(velocity, { textureMap: velocityTemp.texture, showAlpha: false });

      const now = new Date();
      backgroundClock(background, {
        parallax: [parallax.x, parallax.y],
        uSize: [background.width, background.height],
        clockHands: [
          now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600,
          now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000,
          now.getSeconds() + now.getMilliseconds() / 1000,
        ],
      });
      glassShading(null, {
        pressureMap: pressure.texture,
        backgroundMap: background.texture,
        uSize: [pressure.texture.width, pressure.texture.height],
        parallax: [parallax.x, parallax.y],
      });
    }
    requestAnimationFrame(update);

    return () => {
      alive = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("touchmove", touchmove);
      if (gl.canvas.parentNode === root) root.removeChild(gl.canvas);
    };
  }, []);

  return <div ref={rootRef} className="fluid-root" aria-hidden="true" />;
}
