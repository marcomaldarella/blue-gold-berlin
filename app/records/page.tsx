import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import PageEntrance from "@/components/PageEntrance";
import ReleaseCard from "@/components/ReleaseCard";
import { RELEASES } from "@/lib/releases";

export const metadata: Metadata = {
  title: "records",
  description:
    "Bluegold catalogue — vinyl and digital releases from Bluegold and Acid Reflux, Berlin. Buy on Bandcamp.",
};

export default function RecordsPage() {
  const bluegold = RELEASES.filter((r) => r.label === "bluegold");
  const acidReflux = RELEASES.filter((r) => r.label === "acid reflux");

  return (
    <main className="page js-entrance">
      <div className="page-inner">
        <NavBar />

        <h1 className="display" data-enter>
          records <span className="dim">— vinyl &amp; digital</span>
        </h1>

        <section aria-labelledby="bg-heading">
          <div className="section-header" data-enter>
            <span className="eyebrow" id="bg-heading">
              bluegold — {bluegold.length} releases
            </span>
          </div>
          <div className="release-grid">
            {bluegold.map((r, i) => (
              <ReleaseCard key={r.slug} release={r} priority={i === 0} />
            ))}
          </div>
        </section>

        <section aria-labelledby="ar-heading">
          <div className="section-header" data-enter>
            <span className="eyebrow" id="ar-heading">
              acid reflux — {acidReflux.length} releases
            </span>
          </div>
          <div className="release-grid">
            {acidReflux.map((r) => (
              <ReleaseCard key={r.slug} release={r} />
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
