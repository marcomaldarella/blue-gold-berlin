import PageEntrance from "@/components/PageEntrance";
import PlayerDrawer from "@/components/PlayerDrawer";
import SplashScreen from "@/components/SplashScreen";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="home js-entrance">
      <SplashScreen />

      <p className="tagline" data-enter>
        Sound design for altered states of mind
        <br />
        Record label &amp; studio based in berlin,
        <br />
        Founded by mruda
      </p>

      <PlayerDrawer />

      <nav className="home-socials" aria-label="social links" data-enter>
        <a href={SITE.bandcamp} target="_blank" rel="noopener noreferrer">
          bandcamp
        </a>
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
          instagram
        </a>
        <a href={SITE.ra} target="_blank" rel="noopener noreferrer">
          resident advisor
        </a>
      </nav>

      <PageEntrance />
    </main>
  );
}
