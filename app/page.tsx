import PageEntrance from "@/components/PageEntrance";
import SplashScreen from "@/components/SplashScreen";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="home js-entrance">
      <SplashScreen />

      <p className="tagline">
        <span data-enter>Sound design for altered states of mind</span>
        <span data-enter>Record label &amp; studio based in berlin,</span>
        <span data-enter>Founded by mruda</span>
      </p>

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
