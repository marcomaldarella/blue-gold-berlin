import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/lib/site";
import "./globals.css";

// Zalando Sans Expanded: troppo recente per il manifest di next/font/google
// in Next 16.2.10 → self-hosted (variabile, wght 200-900, subset latin)
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
  themeColor: "#0a0a08",
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
    <html lang="en" className={zalando.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grain-layer" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
