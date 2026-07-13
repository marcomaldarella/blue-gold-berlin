import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import PageEntrance from "@/components/PageEntrance";
import { EVENTS, HOST_ORDER, type Event } from "@/lib/events";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "events",
  description:
    "Upcoming Bluegold and Acid Reflux events in Berlin — listening sessions, club nights and open-airs.",
};

/* la pagina si rigenera ogni ora: la classificazione
   upcoming/past resta corretta nel tempo senza JS client */
export const revalidate = 3600;

function berlinToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
  }).format(new Date());
}

function EventRowBody({ e, past }: { e: Event; past: boolean }) {
  const total = (e.price + e.fee).toFixed(2);
  return (
    <>
      <div className="event-date">{e.date}</div>
      <div>
        <div className="event-title">{e.title}</div>
        <div className="event-line">{e.line}</div>
        <div className="event-venue">
          {e.venue} · {e.time}
        </div>
      </div>
      {past ? (
        <div className="event-date">past</div>
      ) : e.soldOut ? (
        <div className="event-price">sold out</div>
      ) : (
        <div>
          <div className="event-price">€{total}</div>
          <div className="event-buy">{e.link ? "buy ↗" : "tickets soon"}</div>
        </div>
      )}
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
          events <span className="dim">— berlin</span>
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

                /* passato o sold out: riga statica, niente link ticket */
                if (past || e.soldOut) {
                  return (
                    <div
                      key={e.id}
                      className={`event-row${past ? " is-past" : " sold-out"}`}
                      data-enter
                    >
                      <EventRowBody e={e} past={past} />
                    </div>
                  );
                }

                return (
                  <a
                    key={e.id}
                    className="event-row"
                    href={e.link || SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-enter
                  >
                    <EventRowBody e={e} past={false} />
                  </a>
                );
              })}
            </section>
          );
        })}

        <p className="eyebrow" style={{ marginTop: "32px" }} data-enter>
          tickets via stripe · zero ra fees — payment links land here first,
          updates on{" "}
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="u-link"
          >
            {SITE.instagramHandle}
          </a>
          .
        </p>
      </div>
      <SiteFooter />
      <PageEntrance />
    </main>
  );
}
