import type { TrendingEvent } from "@/features/events/types";
import { TRENDING_EVENTS } from "@/features/events/mock-data";

export async function getTrendingEvents(): Promise<TrendingEvent[]> {
  // Frontend-only: call your Spring Boot backend directly.
  // Set this in `.env.local` (example):
  // NEXT_PUBLIC_TRENDING_EVENTS_URL=http://localhost:8080/api/events/trending
  const url = process.env.NEXT_PUBLIC_TRENDING_EVENTS_URL;
  if (!url) return TRENDING_EVENTS;

  const res = await fetch(url, {
    // Always hit the backend in development; adjust if you want caching.
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch trending events: ${res.status} ${res.statusText}`,
    );
  }

  return (await res.json()) as TrendingEvent[];
}
