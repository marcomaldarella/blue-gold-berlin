"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SubscribeForm from "@/components/SubscribeForm";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/records", label: "records" },
  { href: "/events", label: "events" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

/**
 * Header dal PDF: wordmark "Bluegold" su barra grigia a filo
 * dell'angolo (0,0); nav desktop evidenziata a filo del bordo
 * destro; su mobile hamburger in box grigio che apre l'overlay
 * menu (pagina 4). Overlay smontato dal DOM quando chiuso
 * (regola iOS).
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  /* chiusura animata: fade-out CSS, poi smontaggio (regola iOS) */
  const closeMenu = () => {
    setClosing(true);
    window.setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 280);
  };

  const toggleMenu = () => {
    if (menuOpen && !closing) closeMenu();
    else if (!menuOpen) setMenuOpen(true);
  };

  /* chiudi il menu quando cambia rotta (senza animazione) */
  useEffect(() => {
    setMenuOpen(false);
    setClosing(false);
  }, [pathname]);

  /* blocca lo scroll sotto l'overlay + Esc per chiudere */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="Bluegold — home">
          Bluegold
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
          className={`menu-toggle${menuOpen && !closing ? " is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "close menu" : "open menu"}
          onClick={toggleMenu}
        >
          {/* un solo hamburger: le linee si morfano in X via CSS */}
          <svg width="46" height="14" viewBox="0 0 46 14" aria-hidden="true">
            <line className="l1" x1="0" y1="2" x2="46" y2="2" />
            <line className="l2" x1="0" y1="7" x2="46" y2="7" />
            <line className="l3" x1="0" y1="12" x2="46" y2="12" />
          </svg>
        </button>
      </header>

      {menuOpen && (
        <div
          className={`menu-overlay${closing ? " is-closing" : ""}`}
          role="dialog"
          aria-label="menu"
        >
          <nav aria-label="mobile navigation">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={closeMenu}>
                {label}
              </Link>
            ))}
          </nav>

          {/* loghetto centrato subito sotto le voci */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="menu-mark"
            src="/assets/logo-little.svg"
            alt=""
            width={52}
            height={54}
          />

          {/* stay updated: subito dopo contact */}
          <div className="menu-subscribe">
            <SubscribeForm />
          </div>
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
