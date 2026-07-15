import type { Metadata } from "next";
import PageEntrance from "@/components/PageEntrance";
import SiteFooter from "@/components/SiteFooter";
import SubscribeForm from "@/components/SubscribeForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "contact",
  description:
    "Get in touch with Bluegold — Berlin record label and studio. Email, Instagram, Bandcamp.",
};

export default function ContactPage() {
  return (
    <main className="page js-entrance">
      <div className="page-inner">
        <h1 className="display" data-enter>
          contact <span className="dim">—</span>
          <br />
          <span className="dim">get in touch</span>
        </h1>

        <div className="section-header" data-enter>
          <span className="eyebrow">write us, follow us</span>
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
            <span className="key">resident advisor</span>
            <a
              href={SITE.ra}
              target="_blank"
              rel="noopener noreferrer"
              className="u-link"
            >
              ra.co
            </a>
          </li>
          <li>
            <span className="key">based in</span>
            <span>berlin, germany</span>
          </li>
        </ul>

        <SubscribeForm />
      </div>
      <SiteFooter />
      <PageEntrance />
    </main>
  );
}
