import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import PageEntrance from "@/components/PageEntrance";
import SplashScreen from "@/components/SplashScreen";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="page js-entrance">
      <SplashScreen />
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
          <nav className="hero-nav" aria-label="sections" data-enter>
            <Link href="/records">records</Link>
            <Link href="/events">events</Link>
            <Link href="/about">about</Link>
          </nav>
        </section>
      </div>
      <SiteFooter />
      <PageEntrance />
    </main>
  );
}
