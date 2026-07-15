"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/* il motore OGL vive solo nel browser */
const FluidGlass = dynamic(() => import("./FluidGlass"), { ssr: false });

/**
 * Sfondo fluid glass globale: in home disegna il lettering nella
 * mask, sulle pagine interne resta solo il fluido, attenuato per
 * non disturbare la lettura. Montato nel layout: mai smontato.
 */
export default function FluidHero() {
  const pathname = usePathname();
  const home = pathname === "/";
  return <FluidGlass withMask={home} dim={!home} />;
}
