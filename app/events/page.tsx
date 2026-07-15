import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/SiteFooter";
import PageEntrance from "@/components/PageEntrance";
import { EVENTS, HOST_ORDER, RA_PROMOTER, type Event } from "@/lib/events";

export const metadata: Metadata = {
  title: "events",
  description:
    "Bluegold events in Berlin — release parties and open-airs. Tickets and full history on Resident Advisor.",
};

/* la pagina si rigenera ogni ora: la classificazione
   upcoming/past resta corretta nel tempo senza JS client */
export const revalidate = 3600;

function berlinToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
  }).format(new Date());
}

function EventCardBody({ e, past }: { e: Event; past: boolean }) {
  return (
    <>
      <figure>
        <Image
          src={e.flyer}
          alt={`${e.title} — flyer`}
          width={960}
          height={1200}
          sizes="(max-width: 720px) 100vw, 33vw"
        />
      </figure>
      <span className="event-card-meta">
        <span className="event-card-head">
          <span className="event-card-date">{e.date}</span>
          <span className="event-card-buy">{past ? "past" : "upcoming"}</span>
        </span>
        <span className="event-card-title">{e.title}</span>
        <span className="event-card-line">{e.line}</span>
        <span className="event-card-venue">
          {e.venue}
          {e.time ? ` · ${e.time}` : ""}
        </span>
        {!past && <span className="event-card-cta">buy tickets ↗</span>}
      </span>
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
              <div className="event-grid">
                {events.map((e) => {
                  const past = isPast(e);

                  /* eventi passati: card statica, link spento */
                  if (past) {
                    return (
                      <div key={e.id} className="event-card is-past" data-enter>
                        <EventCardBody e={e} past />
                      </div>
                    );
                  }

                  return (
                    <a
                      key={e.id}
                      className="event-card"
                      href={e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-enter
                    >
                      <EventCardBody e={e} past={false} />
                    </a>
                  );
                })}
              </div>
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
