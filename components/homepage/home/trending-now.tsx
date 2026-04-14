export type TrendingEvent = {
  id: string;
  badge: string;
  dateLabel: string;
  title: string;
  venue: string;
  priceLabel: string;
};

export default function TrendingNow({
  query = "",
  events,
}: {
  query?: string;
  events?: TrendingEvent[] | null;
}) {
  const normalized = query.trim().toLowerCase();
  const trendingEvents = events ?? [];
  const filtered = normalized
    ? trendingEvents.filter((e) =>
        `${e.title} ${e.venue}`.toLowerCase().includes(normalized),
      )
    : trendingEvents;

  const hasData = trendingEvents.length > 0;
  const hasMatches = filtered.length > 0;

  return (
    <section id="explore" aria-label="Trending Now">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Trending Now
          </h2>
          <p className="mt-1 text-sm text-muted">
            High-demand events with an Electric Emerald glow.
          </p>
        </div>
        <div className="hidden rounded-full bg-surface px-4 py-2 text-sm font-medium text-muted ring-1 ring-border sm:block">
          Updated today
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hasMatches ? (
          filtered.map((event) => (
            <article
              key={event.id}
              className="group rounded-2xl bg-surface p-5 ring-1 ring-border transition hover:ring-primary/30"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                  {event.badge}
                </span>
                <span className="text-xs font-medium text-muted">
                  {event.dateLabel}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-foreground">
                {event.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{event.venue}</p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {event.priceLabel}
                </span>
                <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted ring-1 ring-border">
                  Seats available
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="rounded-2xl bg-surface p-8 text-center ring-1 ring-border">
              <p className="text-sm font-semibold text-foreground">
                {hasData ? "No matching events" : "No trending events yet"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {hasData
                  ? "Try a different search term."
                  : "Check back soon — new events will appear here."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
