import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import SiteHeader from "@/components/SiteHeader";
import PlayerDrawer from "@/components/PlayerDrawer";
import FluidHero from "@/components/fluid/FluidHero";
import { SITE } from "@/lib/site";
import "./globals.css";

// Zalando Sans (regular e Expanded): troppo recenti per il manifest
// di next/font/google → self-hosted (variabili, wght 200-900, latin).
// Dal PDF: il testo corrente usa la larghezza normale, i display
// (wordmark, nav, voci menu) usano l'Expanded.
const zalandoSans = localFont({
  src: "./fonts/ZalandoSans-Variable.woff2",
  weight: "200 900",
  variable: "--font-zalando-sans",
  display: "swap",
});

const zalando = localFont({
  src: "./fonts/ZalandoSansExpanded-Variable.woff2",
  weight: "200 900",
  variable: "--font-zalando",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Berlin`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Bluegold",
    "Berlin",
    "record label",
    "vinyl",
    "electronic music",
    "ambient",
    "techno",
    "sound design",
    "Mruda",
    "Acid Reflux",
  ],
  openGraph: {
    title: `${SITE.name} — Berlin`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: "/assets/bluegold-blue.png", width: 928, height: 928 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Berlin`,
    description: SITE.description,
    images: ["/assets/bluegold-blue.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/assets/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  foundingLocation: { "@type": "Place", name: "Berlin, Germany" },
  sameAs: [SITE.bandcamp, SITE.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${zalandoSans.variable} ${zalando.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        {/* sfondo fluid glass globale, mai smontato tra le pagine */}
        <FluidHero />
        {children}
        {/* player globale: persiste tra le pagine, la musica non si
            interrompe navigando */}
        <PlayerDrawer />
      </body>
    </html>
  );
}
