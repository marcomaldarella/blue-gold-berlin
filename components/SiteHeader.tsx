"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/records", label: "records" },
  { href: "/events", label: "events" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

/**
 * Header dal PDF: wordmark "BlueGold" su barra grigia a filo
 * dell'angolo (0,0); nav desktop evidenziata a filo del bordo
 * destro; su mobile hamburger in box grigio che apre l'overlay
 * menu (pagina 4). Overlay smontato dal DOM quando chiuso
 * (regola iOS).
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /* chiudi il menu quando cambia rotta */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* blocca lo scroll sotto l'overlay */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="BlueGold — home">
          BlueGold
        </Link>

        <nav className="main-nav" aria-label="main navigation">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "is-active" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "close menu" : "open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="46" height="14" viewBox="0 0 46 14" aria-hidden="true">
              <line x1="2" y1="1" x2="44" y2="13" />
              <line x1="44" y1="1" x2="2" y2="13" />
            </svg>
          ) : (
            <svg width="46" height="14" viewBox="0 0 46 14" aria-hidden="true">
              <line x1="0" y1="2" x2="46" y2="2" />
              <line x1="0" y1="7" x2="46" y2="7" />
              <line x1="0" y1="12" x2="46" y2="12" />
            </svg>
          )}
        </button>
      </header>

      {menuOpen && (
        <div className="menu-overlay" role="dialog" aria-label="menu">
          <nav aria-label="mobile navigation">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="menu-overlay-footer">
            <span className="copyright">©2026</span>
            <span className="socials">
              <a href={SITE.bandcamp} target="_blank" rel="noopener noreferrer">
                bandcamp
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
                instagram
              </a>
              <a href={SITE.ra} target="_blank" rel="noopener noreferrer">
                resident advisor
              </a>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
