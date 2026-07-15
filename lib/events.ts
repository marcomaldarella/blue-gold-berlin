export type Event = {
  id: string;
  host: "bluegold" | "acid reflux" | "bluegold + acid reflux";
  title: string;
  line: string;
  venue: string;
  time?: string;
  date: string;
  /* data ISO per la classificazione upcoming/past */
  iso: string;
  /* link RA: evento specifico se noto, altrimenti pagina promoter */
  link: string;
  raPick?: boolean;
};

export const RA_PROMOTER = "https://ra.co/promoters/157649";

/* storico reale dal profilo RA del promoter (157649), dal più recente */
export const EVENTS: Event[] = [
  {
    id: "ev-double-release",
    host: "bluegold + acid reflux",
    title: "Double Release Party",
    line: "Marco Mardarella (live) · Derive · Kop32 (live) · Kā · Medlock · Jeena · Delta Division · Monosym · Staktic · Silvers",
    venue: "Secret Location, Berlin",
    date: "18 jul 2026",
    iso: "2026-07-18",
    /* Stripe payment link live (15€) */
    link: "https://buy.stripe.com/7sYcMYaRP3mp88ngL72wU00",
  },
  {
    id: "ev-refx-elicit-fitzroy",
    host: "acid reflux",
    title: "Acid Reflux x Elicit at Fitzroy",
    line: "Kessler (live) · Delta Division (live) · Mathis Ruffing · N ska aka Gościńska · Prieste5s",
    venue: "Fitzroy, Berlin",
    time: "23:00–07:00",
    date: "11 apr 2026",
    iso: "2026-04-11",
    link: "https://ra.co/events/2390210",
    raPick: true,
  },
  {
    id: "ev-refx-11001",
    host: "acid reflux",
    title: "AcidReflux x 11001 Records",
    line: "Feral · DJ SO · Loek Frey · fleika · Delta Division · Katiusha · Valentin Ginies · Mruda",
    venue: "ÆDEN, Berlin",
    date: "25 oct 2025",
    iso: "2025-10-25",
    link: RA_PROMOTER,
    raPick: true,
  },
  {
    id: "ev-refx-openair-01",
    host: "acid reflux",
    title: "Acid Reflux Open Air — Episode 01",
    line: "BLUME · Olsvangèr · BB. angel · Vaccaro · Fiona (2) · OatMilk · Quolcat",
    venue: "Secret Location, Berlin",
    date: "10 may 2025",
    iso: "2025-05-10",
    link: RA_PROMOTER,
  },
  {
    id: "ev-refx-clubnight",
    host: "acid reflux",
    title: "AcidReflux // ClubNight",
    line: "Fiona (2) · SAGAN · RosieCpt",
    venue: "Lark, Berlin",
    date: "4 apr 2025",
    iso: "2025-04-04",
    link: RA_PROMOTER,
  },
  {
    id: "ev-refx-032025",
    host: "acid reflux",
    title: "AcidReflux",
    line: "Feral · Seta Loto · Mruda · xfira · uvd tsao · Quolcat · Fiona (2) · Peals Wake · B.bby · Living Code",
    venue: "Berlin",
    date: "15 mar 2025",
    iso: "2025-03-15",
    link: RA_PROMOTER,
  },
  {
    id: "ev-refx-emergency-loop",
    host: "acid reflux",
    title: "AcidReflux // Emergency Loop",
    line: "Fiona (2) · SAGAN · Quolcat · BB. angel · Mariel Loah · Alexis Mariano",
    venue: "Block1, Berlin",
    date: "15 feb 2025",
    iso: "2025-02-15",
    link: RA_PROMOTER,
  },
];

export const HOST_ORDER: Event["host"][] = [
  "bluegold + acid reflux",
  "bluegold",
  "acid reflux",
];
