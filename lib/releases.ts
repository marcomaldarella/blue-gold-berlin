export type Release = {
  slug: string;
  title: string;
  artist: string;
  catalog: string;
  label: "bluegold" | "acid reflux";
  cover: string;
  url: string;
  bandcampAlbumId: number;
};

export const RELEASES: Release[] = [
  {
    slug: "sequor",
    title: "Sequor",
    artist: "Staktic",
    catalog: "bg003",
    label: "bluegold",
    cover: "/assets/sequor.jpg",
    url: "https://bluegold1.bandcamp.com/album/sequor",
    bandcampAlbumId: 3720175905,
  },
  {
    slug: "shape-shifting",
    title: "Shape Shifting",
    artist: "Mruda",
    catalog: "bg002",
    label: "bluegold",
    cover: "/assets/shape-shifting.jpg",
    url: "https://mruda.bandcamp.com/album/shape-shifting?label=447749523",
    bandcampAlbumId: 1658586204,
  },
  {
    slug: "theom",
    title: "Theom",
    artist: "Mruda",
    catalog: "bg001",
    label: "bluegold",
    cover: "/assets/theom.jpg",
    url: "https://mruda.bandcamp.com/album/theom?label=447749523",
    bandcampAlbumId: 1993218674,
  },
  {
    slug: "a-gate-to-the-forest",
    title: "A Gate To The Forest",
    artist: "Mariel Loah, Marijn S, BB. angel, Ayū",
    catalog: "ar001",
    label: "acid reflux",
    cover: "/assets/a-gate-to-the-forest.jpg",
    url: "https://acidrefluxrecs.bandcamp.com/album/a-gate-to-the-forest",
    bandcampAlbumId: 3236638117,
  },
  {
    slug: "dead-channels-ritual",
    title: "Dead Channels Ritual",
    artist: "Delta Division",
    catalog: "ar004",
    label: "acid reflux",
    cover: "/assets/dead-channels-ritual.jpg",
    url: "https://acidrefluxrecs.bandcamp.com/album/dead-channels-ritual",
    bandcampAlbumId: 3288299294,
  },
];

export const RADIO_TRACKS = [
  { title: "mruda — theom", catalog: "bg001", albumId: 1993218674 },
  { title: "mruda — shape shifting", catalog: "bg002", albumId: 1658586204 },
  { title: "staktic — sequor", catalog: "bg003", albumId: 3720175905 },
  { title: "mariel loah — a gate to the forest", catalog: "ar001", albumId: 3236638117 },
  { title: "delta division — dead channel rituals", catalog: "ar004", albumId: 3288299294 },
];
