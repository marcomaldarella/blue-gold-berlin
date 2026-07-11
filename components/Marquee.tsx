const ITEMS = [
  "bluegold",
  "berlin",
  "sound design for altered states of mind",
  "bg001 — bg003",
  "acid reflux",
  "ar003 — ar004",
  "vinyl · digital · live",
];

export default function Marquee() {
  const sequence = (keyPrefix: string) =>
    ITEMS.map((item, i) => (
      <span key={`${keyPrefix}-${i}`} className={i % 3 === 1 ? "gold" : i % 3 === 2 ? "blue" : undefined}>
        {item}
      </span>
    ));

  return (
    <div className="marquee" aria-hidden="true" data-enter>
      <div className="marquee-track">
        {sequence("a")}
        {sequence("b")}
      </div>
    </div>
  );
}
