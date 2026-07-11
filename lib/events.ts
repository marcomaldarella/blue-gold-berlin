export type Event = {
  id: string;
  host: "bluegold" | "acid reflux" | "bluegold + acid reflux";
  title: string;
  line: string;
  venue: string;
  time: string;
  date: string;
  price: number;
  fee: number;
  link: string;
  soldOut?: boolean;
};

export const EVENTS: Event[] = [
  {
    id: "ev-refx-011",
    host: "acid reflux",
    title: "Acid Reflux 011 — Warehouse",
    line: "Delta Division · Mruda",
    venue: "RSO, Berlin",
    time: "23:59–10:00",
    date: "18 jul",
    price: 15,
    fee: 1.5,
    link: "",
  },
  {
    id: "ev-bg-listen",
    host: "bluegold",
    title: "Bluegold Listening Session",
    line: "Ambient / deep · Mruda · Staktic",
    venue: "Studio Halle, Berlin",
    time: "20:00–01:00",
    date: "25 jul",
    price: 12,
    fee: 1.5,
    link: "",
  },
  {
    id: "ev-joint-forest",
    host: "bluegold + acid reflux",
    title: "A Gate To The Forest",
    line: "Mariel Loah · Marijn S · BB. angel · Ayū · Staktic",
    venue: "Wilde Renate, Berlin",
    time: "23:00–08:00",
    date: "8 aug",
    price: 18,
    fee: 2,
    link: "",
  },
  {
    id: "ev-bg-theom",
    host: "bluegold",
    title: "Bluegold — Theom Release",
    line: "Mruda (live) · special guest",
    venue: "Trauma Bar, Berlin",
    time: "22:00–06:00",
    date: "22 aug",
    price: 16,
    fee: 2,
    link: "",
  },
  {
    id: "ev-refx-open",
    host: "acid reflux",
    title: "Acid Reflux Open-Air",
    line: "All-day · full crew",
    venue: "Else, Berlin",
    time: "14:00–02:00",
    date: "5 sep",
    price: 20,
    fee: 2,
    link: "",
    soldOut: true,
  },
];

export const HOST_ORDER: Event["host"][] = [
  "bluegold",
  "acid reflux",
  "bluegold + acid reflux",
];
