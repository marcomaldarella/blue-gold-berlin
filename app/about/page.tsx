import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import PageEntrance from "@/components/PageEntrance";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "about",
  description:
    "Bluegold — Berlin record label and studio founded by Mruda. Sound design for altered states of mind. Contact and links.",
};

export default function AboutPage() {
  return (
    <main className="page js-entrance">
      <div className="page-inner">

        <h1 className="display" data-enter>
          about <span className="dim">— the label</span>
        </h1>

        <div className="about-grid">
          <section className="about-bio" aria-labelledby="bio-heading">
            <div className="section-header" data-enter>
              <span className="eyebrow" id="bio-heading">
                the label
              </span>
            </div>
            <div data-enter>
              <p>
                <strong>bluegold</strong> is a music label and trance-inducing
                ritual, grounded in techno but unbound by genre — run by{" "}
                <strong>mariel loah aka mruda</strong>, berlin. sound design
                for altered states of mind.
              </p>
              <p>
                its core is psychedelic, euphoric and hallucinatory: a ceremony
                through sound, guiding the crowd through a collective journey —
                descending into shadow, learning to surrender, dancing with our
                demons.
              </p>
              <p>
                a temple of shimmer in the mud. the pulse of a forest rite,
                stitched with silver dreams and golden chaos.
              </p>
            </div>
          </section>

          <section aria-labelledby="contact-heading">
            <div className="section-header" data-enter>
              <span className="eyebrow" id="contact-heading">
                contact
              </span>
            </div>
            <ul className="contact-list" data-enter>
              <li>
                <span className="key">email</span>
                <a href={`mailto:${SITE.email}`} className="u-link">
                  {SITE.email}
                </a>
              </li>
              <li>
                <span className="key">instagram</span>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-link"
                >
                  {SITE.instagramHandle}
                </a>
              </li>
              <li>
                <span className="key">bandcamp</span>
                <a
                  href={SITE.bandcamp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-link"
                >
                  bluegold1.bandcamp.com
                </a>
              </li>
              <li>
                <span className="key">based in</span>
                <span>berlin, germany</span>
              </li>
            </ul>

          </section>
        </div>

        {/* elemento grafico di chiusura: wide su mobile,
            a destra sopra il footer su desktop */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="about-mark"
          src="/assets/logo-title.svg"
          alt=""
          width={1044}
          height={655}
          data-enter
        />
      </div>
      <SiteFooter />
      <PageEntrance />
    </main>
  );
}
