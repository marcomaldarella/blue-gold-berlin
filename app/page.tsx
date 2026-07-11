import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import PageEntrance from "@/components/PageEntrance";
import ReleaseCard from "@/components/ReleaseCard";
import { RELEASES } from "@/lib/releases";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const highlights = RELEASES.slice(0, 3);

  return (
    <main className="page js-entrance">
      <div className="bg-photo" aria-hidden="true" />
      <div className="page-inner">
        <NavBar />

        <section className="hero" aria-label="intro">
          <div className="hero-logo-wrap" data-enter>
            <div className="hero-glow" aria-hidden="true" />
            <Image
              className="hero-logo"
              src="/assets/bluegold-blue.png"
              alt="Bluegold"
              width={928}
              height={928}
              priority
            />
          </div>
          <p className="hero-tag" data-enter>
            {SITE.tagline}
          </p>
          <div className="hero-lines" data-enter>
            <p>
              <strong>bluegold studios</strong> — record label &amp; studio,
              berlin
            </p>
            <p>sound design for altered states of mind · founded by mruda</p>
          </div>
        </section>

        <section aria-labelledby="latest-heading" style={{ marginTop: "clamp(48px, 10vh, 120px)" }}>
          <div className="section-header" data-enter>
            <span className="eyebrow" id="latest-heading">
              latest releases
            </span>
            <Link href="/records" className="eyebrow u-link">
              all records →
            </Link>
          </div>
          <div className="release-grid">
            {highlights.map((r, i) => (
              <ReleaseCard key={r.slug} release={r} priority={i === 0} />
            ))}
          </div>
        </section>

        <section aria-labelledby="about-heading">
          <div className="section-header" data-enter>
            <span className="eyebrow" id="about-heading">
              about
            </span>
          </div>
          <div className="about-bio" data-enter>
            <p>
              bluegold is a berlin label moving between deep techno, ambient
              and everything that lives in the space in between. releases on
              vinyl and digital, events around the city, a small catalogue
              built slowly — <strong>touch the mark</strong>.
            </p>
            <p style={{ marginTop: "0.8em" }}>
              <Link href="/about" className="u-link">
                more about the label →
              </Link>
            </p>
          </div>
        </section>
      </div>
      <SiteFooter />
      <PageEntrance />
    </main>
  );
}
