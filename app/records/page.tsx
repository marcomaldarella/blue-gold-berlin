import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import PageEntrance from "@/components/PageEntrance";
import ReleaseCard from "@/components/ReleaseCard";
import { RELEASES } from "@/lib/releases";

export const metadata: Metadata = {
  title: "records",
  description:
    "Bluegold catalogue — vinyl and digital releases from Berlin. Buy on Bandcamp.",
};

export default function RecordsPage() {
  return (
    <main className="page js-entrance">
      <div className="page-inner">

        <h1 className="display" data-enter>
          records <span className="dim">—</span>
          <br />
          <span className="dim">vinyl &amp; digital</span>
        </h1>

        <section aria-labelledby="bg-heading">
          <div className="section-header" data-enter>
            <span className="eyebrow" id="bg-heading">
              bluegold — {RELEASES.length} releases
            </span>
          </div>
          <div className="release-grid">
            {RELEASES.map((r, i) => (
              <ReleaseCard key={r.slug} release={r} priority={i === 0} />
            ))}
          </div>
        </section>

        <p className="eyebrow" style={{ marginTop: "32px" }} data-enter>
          all purchases go through bandcamp — no custom checkout, no middlemen.
        </p>
      </div>
      <SiteFooter />
      <PageEntrance />
    </main>
  );
}
