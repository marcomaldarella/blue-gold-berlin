export type Track = {
  title: string;
  artist: string;
  /* nome file audio (senza estensione) sull'host esterno */
  file: string;
};

export type Release = {
  slug: string;
  title: string;
  artist: string;
  catalog: string;
  cover: string;
  url: string;
  tracks: Track[];
};

/* base esterna per gli mp3 (Cloudflare Pages: banda illimitata,
   niente audio sul piano free di Vercel) */
export const AUDIO_BASE = "https://bluegold-audio.pages.dev";

export const RELEASES: Release[] = [
  {
    slug: "theom",
    title: "Theom",
    artist: "Mruda & Archypness",
    catalog: "bg001",
    cover: "/assets/theom.jpg",
    url: "https://mruda.bandcamp.com/album/theom?label=447749523",
    tracks: [
      { title: "Kalevet", artist: "Mruda", file: "bg001-a1-kalevet" },
      { title: "Theom", artist: "Mruda", file: "bg001-a2-theom" },
      { title: "Rog", artist: "Archypness", file: "bg001-b1-rog" },
      { title: "Pudja", artist: "Archypness", file: "bg001-b2-pudja" },
    ],
  },
  {
    slug: "shape-shifting",
    title: "Shape Shifting",
    artist: "Mruda",
    catalog: "bg002",
    cover: "/assets/shape-shifting.jpg",
    url: "https://mruda.bandcamp.com/album/shape-shifting?label=447749523",
    tracks: [
      { title: "Womb", artist: "Mruda", file: "bg002-a1-womb" },
      { title: "Colours", artist: "Mruda", file: "bg002-a2-colours" },
      { title: "Shape Shifting", artist: "Mruda", file: "bg002-b1-shape-shifting" },
      { title: "Womb Reimagined", artist: "Mruda", file: "bg002-b2-womb-reimagined" },
    ],
  },
  {
    slug: "sequor",
    title: "Sequor",
    artist: "Staktic",
    catalog: "bg003",
    cover: "/assets/sequor.jpg",
    url: "https://bluegold1.bandcamp.com/album/sequor",
    tracks: [
      { title: "Ardósia", artist: "Staktic", file: "bg003-01-ardosia" },
      { title: "Corallus", artist: "Staktic", file: "bg003-02-corallus" },
      { title: "Criptocromo", artist: "Staktic", file: "bg003-03-criptocromo" },
      { title: "Halo Nuclei", artist: "Staktic", file: "bg003-04-halo-nuclei" },
      { title: "Hidrólise", artist: "Staktic", file: "bg003-05-hidrolise" },
      { title: "Iara", artist: "Staktic", file: "bg003-06-iara" },
      { title: "Quetiapina", artist: "Staktic", file: "bg003-07-quetiapina" },
      { title: "Sequor", artist: "Staktic", file: "bg003-08-sequor" },
    ],
  },
];

/* playlist piatta per il player: tutto il catalogo in fila */
export type PlaylistItem = Track & {
  cover: string;
  catalog: string;
  releaseTitle: string;
  url: string;
};

export const PLAYLIST: PlaylistItem[] = RELEASES.flatMap((r) =>
  r.tracks.map((t) => ({
    ...t,
    cover: r.cover,
    catalog: r.catalog,
    releaseTitle: r.title,
    url: r.url,
  }))
);
