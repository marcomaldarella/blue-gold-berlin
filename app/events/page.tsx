import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import PageEntrance from "@/components/PageEntrance";
import { EVENTS, HOST_ORDER, RA_PROMOTER, type Event } from "@/lib/events";

export const metadata: Metadata = {
  title: "events",
  description:
    "Bluegold and Acid Reflux events in Berlin — listening sessions, club nights and open-airs. Full history on Resident Advisor.",
};

/* la pagina si rigenera ogni ora: la classificazione
   upcoming/past resta corretta nel tempo senza JS client */
export const revalidate = 3600;

function berlinToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
  }).format(new Date());
}

/* niente prezzi: solo data, lineup, venue e link RA */
function EventRowBody({ e, past }: { e: Event; past: boolean }) {
  return (
    <>
      <div className="event-date">{e.date}</div>
      <div>
        <div className="event-title">{e.title}</div>
        <div className="event-line">{e.line}</div>
        <div className="event-venue">
          {e.venue}
          {e.time ? ` · ${e.time}` : ""}
          {e.raPick ? " · ra pick" : ""}
        </div>
      </div>
      <div className="event-buy">{past ? "on ra ↗" : "tickets ↗"}</div>
    </>
  );
}

export default function EventsPage() {
  const today = berlinToday();
  const isPast = (e: Event) => e.iso < today;

  return (
    <main className="page js-entrance">
      <div className="page-inner">
        <h1 className="display" data-enter>
          events <span className="dim">—</span>
          <br />
          <span className="dim">berlin</span>
        </h1>

        {HOST_ORDER.map((host) => {
          const events = EVENTS.filter((e) => e.host === host);
          if (events.length === 0) return null;
          return (
            <section key={host} aria-label={`${host} events`}>
              <div className="section-header" data-enter>
                <span className="eyebrow">{host}</span>
              </div>
              {events.map((e) => {
                const past = isPast(e);
                return (
                  <a
                    key={e.id}
                    className={`event-row${past ? " is-past" : ""}`}
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-enter
                  >
                    <EventRowBody e={e} past={past} />
                  </a>
                );
              })}
            </section>
          );
        })}

        <p className="eyebrow" style={{ marginTop: "32px" }} data-enter>
          full history and tickets on{" "}
          <a
            href={RA_PROMOTER}
            target="_blank"
            rel="noopener noreferrer"
            className="u-link"
          >
            resident advisor ↗
          </a>
        </p>
      </div>
      <SiteFooter />
      <PageEntrance />
    </main>
  );
}
