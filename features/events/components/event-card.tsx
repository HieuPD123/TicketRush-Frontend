"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import type { TrendingEvent } from "@/features/events/types";

export type EventCardData = TrendingEvent;

export default function EventCard({ data }: { data: EventCardData }) {
  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-surface/55 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={data.imageSrc}
          alt={data.title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.05]"
          priority={false}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent"
        />
      </div>

      <div className="relative p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground">
          {data.title}
        </h3>

        <div className="mt-3 space-y-2 text-sm text-foreground/75">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary/85" />
            <span>{data.datetime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary/85" />
            <span className="line-clamp-1">{data.location}</span>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="text-sm font-semibold text-foreground">
            {data.priceFrom}
          </div>
          <a
            href="#"
            aria-label={`Xem chi tiết: ${data.title}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2/50 text-foreground/80 transition group-hover:border-primary/45 group-hover:bg-surface-2/70 group-hover:text-foreground group-hover:shadow-[0_0_20px_rgba(124,58,237,0.22)]"
          >
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            boxShadow:
              "0 0 0 1px rgba(124, 58, 237, 0.25), 0 0 38px rgba(124, 58, 237, 0.10)",
          }}
        />
      </div>
    </motion.article>
  );
}
