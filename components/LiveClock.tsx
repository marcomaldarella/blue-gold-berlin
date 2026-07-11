"use client";

import { useEffect, useState } from "react";

function berlinTime() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Europe/Berlin",
  }).format(new Date());
}

export default function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(berlinTime());
    const id = setInterval(() => setTime(berlinTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time ?? "--:--:--"} cet</span>;
}
