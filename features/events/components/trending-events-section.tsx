"use client";

import { motion } from "framer-motion";

import EventCard from "@/features/events/components/event-card";
import type { TrendingEvent } from "@/features/events/types";

export default function TrendingEventsSection({
  events,
}: {
  events: TrendingEvent[];
}) {
  return (
    <section id="trending" className="pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Sự kiện nổi bật
            </h2>
            <p className="mt-1 text-sm text-muted">
              Những sự kiện hot nhất không thể bỏ qua tuần này.
            </p>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-primary/90 transition hover:text-primary"
          >
            Xem tất cả →
          </a>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {events.map((event) => (
            <motion.div
              key={event.title}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <EventCard data={event} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
