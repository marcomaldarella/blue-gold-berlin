import LiveClock from "@/components/LiveClock";
import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="footer-stamp">
        ©2026 · berlin · <LiveClock />
      </span>
      <nav className="footer-links" aria-label="social links">
        <a
          href={SITE.bandcamp}
          target="_blank"
          rel="noopener noreferrer"
        >
          bandcamp
        </a>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          instagram
        </a>
        <a href={SITE.ra} target="_blank" rel="noopener noreferrer">
          resident advisor
        </a>
      </nav>
    </footer>
  );
}
