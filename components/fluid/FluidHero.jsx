"use client";

import dynamic from "next/dynamic";

/* il motore OGL vive solo nel browser */
const FluidGlass = dynamic(() => import("./FluidGlass"), { ssr: false });

export default function FluidHero() {
  return <FluidGlass />;
}
