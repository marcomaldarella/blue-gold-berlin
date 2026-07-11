import Image from "next/image";
import type { Release } from "@/lib/releases";

export default function ReleaseCard({
  release,
  priority = false,
}: {
  release: Release;
  priority?: boolean;
}) {
  return (
    <a
      className="release-card"
      href={release.url}
      target="_blank"
      rel="noopener noreferrer"
      data-enter
    >
      <figure>
        <Image
          src={release.cover}
          alt={`${release.title} — ${release.artist}, cover`}
          width={600}
          height={600}
          priority={priority}
          sizes="(max-width: 720px) 50vw, 280px"
        />
      </figure>
      <span className="release-caption">
        {release.title} <span>— {release.artist}</span>
      </span>
      <span className="release-meta">
        <span className="cat">{release.catalog}</span>
        <span>{release.label}</span>
        <span className="buy">buy on bandcamp ↗</span>
      </span>
    </a>
  );
}
