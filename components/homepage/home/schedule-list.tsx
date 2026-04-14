export type ScheduleItem = {
  id: string;
  timeLabel: string;
  title: string;
  venue: string;
  meta: string;
};

export default function ScheduleList({
  query = "",
  items,
}: {
  query?: string;
  items?: ScheduleItem[] | null;
}) {
  const normalized = query.trim().toLowerCase();
  const schedule = items ?? [];
  const filtered = normalized
    ? schedule.filter((s) =>
        `${s.title} ${s.venue} ${s.meta}`.toLowerCase().includes(normalized),
      )
    : schedule;

  const hasData = schedule.length > 0;
  const hasMatches = filtered.length > 0;

  return (
    <section id="schedule" aria-label="The Schedule">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          The Schedule
        </h2>
        <p className="mt-1 text-sm text-muted">
          A compact list view for what’s happening next.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
        {hasMatches ? (
          <ul className="divide-y divide-border">
            {filtered.map((item) => (
              <li key={item.id} className="flex gap-4 p-5">
                <div className="w-24 shrink-0">
                  <div className="inline-flex rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-border">
                    {item.timeLabel}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <span className="text-xs font-medium text-muted">
                      {item.venue}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              {hasData ? "No matching schedule items" : "Schedule coming soon"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {hasData
                ? "Try a different search term."
                : "Once events are published, they’ll show up here."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
