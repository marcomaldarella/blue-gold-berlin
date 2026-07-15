"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Geometry, Texture, RenderTarget, Flowmap } from "ogl";
import {
  default_vert,
  advection_frag,
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
  grain: 0.13,
};

/* post-process: grana fine + campo stelle nei neri (space) */
const GRAIN_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D inputMap;
uniform float uTime;
uniform float uAmount;
varying vec2 vUv;

float hashT(vec2 p) {
  return fract(sin(dot(p + fract(uTime), vec2(127.1, 311.7))) * 43758.5453);
}
float hashS(vec2 p) {
  return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
}

void main() {
  vec3 col = texture2D(inputMap, vUv).rgb;
  float lum = dot(col, vec3(0.3333));

  /* grit fine e definito, morde i mezzitoni */
  float g = hashT(gl_FragCoord.xy) - 0.5;
  col += g * uAmount * (0.3 + 0.7 * smoothstep(0.0, 0.5, lum));

  /* stelle: puntini fissi che scintillano piano, solo nel buio */
  float s = hashS(floor(gl_FragCoord.xy));
  float tw = 0.55 + 0.45 * sin(uTime * 2.0 + s * 60.0);
  float star = smoothstep(0.9992, 0.9999, s) * tw * (1.0 - smoothstep(0.0, 0.4, lum));
  col += star * 0.85;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* sfondo custom: via l'orologio della reference — orbite lente di
   fasci di luce larghi e soffusi, con la stessa rifrazione */
const BACKGROUND_FRAG = /* glsl */ `
precision highp float;
#define PI 3.14159265358979

varying vec2 vUv;
uniform vec2 uSize;
uniform float uTime;
uniform vec3 bgcolor;
uniform vec3 circlecolor1;
uniform vec3 circlecolor2;
uniform vec3 circlecolor3;
uniform vec2 parallax;

vec3 drawCircle(vec2 coord, float t, float widthCore, float widthHalo) {
  float radius = max(uSize.x, uSize.y) * 0.5;
  vec2 origin = vec2(sin(t * PI * 2.0), cos(t * PI * 2.0)) * radius;
  coord -= origin;

  float r = length(coord) / radius;
  float f = 1.0 / (abs(r - 1.0) * widthCore + 1.0);

  vec2 displacement = -coord / (sqrt(max(0.0, 1.0 - r * r)) + 0.01) * f * step(r, 1.0);

  /* fascio largo + alone blurrato attorno */
  f = 1.0 / (abs(r - 1.0) * widthCore + 1.0);
  f += 0.5 / (abs(r - 1.0) * widthHalo + 1.0);
  f += step(r, 1.0) * 0.05 * (r + 1.0);

  return vec3(displacement, f);
}

void main() {
  vec2 coord = (vUv - 0.5) * uSize + parallax * 2.0;

  /* tre orbite lente, slegate dall'orologio */
  vec3 circle3 = drawCircle(coord, uTime * 0.017, 34.0, 7.0);
  coord += circle3.xy * 0.12 + parallax * 10.0;
  vec3 circle2 = drawCircle(coord, 0.62 - uTime * 0.006, 26.0, 6.0);
  coord += circle2.xy * 0.12 + parallax * 20.0;
  vec3 circle1 = drawCircle(coord, 0.31 + uTime * 0.0023, 18.0, 5.0);

  vec3 color = bgcolor;
  color = mix(color, circlecolor1, circle1.z);
  color = mix(color, circlecolor2, circle2.z);
  color = mix(color, circlecolor3, circle3.z);

  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Porting React del "fluidglass" di chiuhans111 (Vue+OGL):
 * reaction-diffusion + Navier-Stokes + glass shader. La mask della
 * reaction-diffusion è un canvas 2D su cui disegnamo marchio e
 * wordmark "bluegold": il vetro fluido cresce attorno al segno.
 */
export default function FluidGlass({ withMask = true, dim = false }) {
  const rootRef = useRef(null);
  const maskRef = useRef(withMask);

  useEffect(() => {
    maskRef.current = withMask;
  }, [withMask]);

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
    const backgroundPass = makeShader(BACKGROUND_FRAG, {
      uSize: { value: [0, 0] },
      parallax: { value: [0, 0] },
      uTime: { value: 0 },
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
    const grainPass = makeShader(GRAIN_FRAG, {
      inputMap: { value: 0 },
      uTime: { value: 0 },
      uAmount: { value: CONFIG.grain },
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

    /* composite a piena risoluzione: il vetro ci renderizza dentro,
       la grana lo porta a schermo */
    const composite = new RenderTarget(gl, {
      width: 512,
      height: 512,
      depth: false,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });

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

    /* tinta un'immagine di rosso pieno: la mask legge il canale R */
    function loadRed(src) {
      const holder = { canvas: null, ratio: 1 };
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const x = c.getContext("2d");
        x.drawImage(img, 0, 0);
        x.globalCompositeOperation = "source-in";
        x.fillStyle = "red";
        x.fillRect(0, 0, c.width, c.height);
        holder.canvas = c;
        holder.ratio = c.width / c.height;
      };
      return holder;
    }

    /* mask: SOLO il lettering ufficiale, niente marchio sopra */
    const type = loadRed("/assets/bluegold-type.svg");

    function renderForeground(canvas, ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      /* lettering solo dove richiesto (home) */
      if (!maskRef.current || !type.canvas) return;

      const portrait = canvas.width < canvas.height;
      const w = canvas.width * (portrait ? 0.76 : 0.56);
      const h = w / type.ratio;
      ctx.drawImage(type.canvas, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
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
      composite.setSize(Math.max(4, Math.round(rect.width)), Math.max(4, Math.round(rect.height)));
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

      backgroundPass(background, {
        parallax: [parallax.x, parallax.y],
        uSize: [background.width, background.height],
        uTime: (performance.now() % 10000000) / 1000,
      });
      glassShading(composite, {
        pressureMap: pressure.texture,
        backgroundMap: background.texture,
        uSize: [pressure.texture.width, pressure.texture.height],
        parallax: [parallax.x, parallax.y],
      });
      grainPass(null, {
        inputMap: composite.texture,
        uTime: (performance.now() % 100000) / 1000,
        uAmount: CONFIG.grain,
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

  return (
    <div
      ref={rootRef}
      className={`fluid-root${dim ? " is-dim" : ""}`}
      aria-hidden="true"
    />
  );
}
