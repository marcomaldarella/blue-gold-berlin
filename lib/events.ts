export type Event = {
  id: string;
  host: "bluegold" | "bluegold + acid reflux";
  title: string;
  line: string;
  venue: string;
  time?: string;
  date: string;
  /* data ISO per la classificazione upcoming/past */
  iso: string;
  /* flyer in public/assets/events */
  flyer: string;
  /* link esterno: Stripe per i ticket, RA come fallback */
  link: string;
};

export const RA_PROMOTER = "https://ra.co/promoters/170601";

/* solo gli eventi con bluegold, dai flyer ufficiali */
export const EVENTS: Event[] = [
  {
    id: "ev-double-release",
    host: "bluegold + acid reflux",
    title: "Acid Reflux ✕ Blue Gold — Release Party",
    line: "Derive · Jeena · Monosym · Kop32 (live) · Marco Maldarella (live) · Medlock · Kā · Staktic · Delta Division · Silvers",
    venue: "Secret Location, Berlin · open air + indoor",
    time: "13:00–06:00",
    date: "18 jul 2026",
    iso: "2026-07-18",
    flyer: "/assets/events/acid-reflux-x-bluegold.jpg",
    link: "https://buy.stripe.com/7sYcMYaRP3mp88ngL72wU00",
  },
  {
    id: "ev-amphibian",
    host: "bluegold",
    title: "Amphibian ✕ Bluegold ✕ Techlab",
    line: "A StranGe Wedding · Madeleine b2b Inger · Kontinum · atch22 b2b A++ · Mia Lund · Monosym · SLYM · Mruda · ISA · N ska",
    venue: "Secret Location, Berlin · open air + indoor",
    time: "10:00",
    date: "21 jun 2026",
    iso: "2026-06-21",
    flyer: "/assets/events/amphibian-x-bluegold.jpg",
    link: RA_PROMOTER,
  },
  {
    id: "ev-bg001-release",
    host: "bluegold",
    title: "Blue Gold Release Party — w/ Format Wars Records",
    line: "Andriy K. · Archypness · BLUME · King Softy · Mruda · Raär · Sean H · Trois-Quarts Taxi System",
    venue: "Secret Location, Berlin · open air, daytime",
    date: "6 sep 2025",
    iso: "2025-09-06",
    flyer: "/assets/events/bg001-release-party.jpg",
    link: RA_PROMOTER,
  },
];

export const HOST_ORDER: Event["host"][] = ["bluegold + acid reflux", "bluegold"];
