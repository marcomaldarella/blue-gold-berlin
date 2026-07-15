import PageEntrance from "@/components/PageEntrance";
import SplashScreen from "@/components/SplashScreen";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="home js-entrance">
      <SplashScreen />

      {/* sfondo chrome b/n blurred, dietro a tutto */}
      <div className="home-bg" aria-hidden="true" />

      <div className="home-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="home-mark"
          src="/assets/favicon-192.png"
          alt=""
          width={192}
          height={192}
          data-enter
        />
        <p className="home-word" data-enter>
          bluegold
        </p>
      </div>

      <nav className="home-socials" aria-label="social links">
        <a href={SITE.bandcamp} target="_blank" rel="noopener noreferrer" data-enter>
          bandcamp
        </a>
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" data-enter>
          instagram
        </a>
        <a href={SITE.ra} target="_blank" rel="noopener noreferrer" data-enter>
          resident advisor
        </a>
      </nav>

      <PageEntrance />
    </main>
  );
}
