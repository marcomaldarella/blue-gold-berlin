"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/records", label: "records" },
  { href: "/events", label: "events" },
  { href: "/about", label: "about" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="site-header" data-enter>
      <Link href="/" className="brand-box" aria-label="Bluegold — home">
        <span>bluegold</span>
        <em>berlin</em>
      </Link>
      <nav className="main-menu" aria-label="main navigation">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${pathname === href ? " is-active" : ""}`}
          >
            {label}
          </Link>
        ))}
        <a
          href={SITE.bandcamp}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link is-external"
        >
          bandcamp ↗
        </a>
      </nav>
    </header>
  );
}
