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
                <strong>bluegold</strong> is a record label and studio based in{" "}
                <strong>berlin</strong>, founded by mruda. straight from the
                sleeve: sound design for altered states of mind.
              </p>
              <p>
                deep, introspective electronics in small runs, at a slow pace —
                everything purchasable on bandcamp. off record: listening
                sessions, club nights and open-airs around berlin.
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
      </div>
      <SiteFooter />
      <PageEntrance />
    </main>
  );
}
