import LiveClock from "@/components/LiveClock";
import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>
        bluegold studios <span className="dot">·</span> berlin{" "}
        <span className="dot">·</span> <LiveClock />
      </span>
      <nav className="footer-links" aria-label="social links">
        <a href={`mailto:${SITE.email}`} className="u-link">
          {SITE.email}
        </a>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="u-link"
        >
          {SITE.instagramHandle}
        </a>
        <a
          href={SITE.bandcamp}
          target="_blank"
          rel="noopener noreferrer"
          className="u-link"
        >
          bandcamp
        </a>
      </nav>
    </footer>
  );
}
