"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, RefreshCcw, Sparkles } from "lucide-react";

import GlassCard from "@/features/admin/components/ui/glass-card";
import { setSpotlightEvent } from "@/features/admin/services/set-spotlight-event";
import { getSpotlightEvent } from "@/features/events/services/get-spotlight-event";
import type { Event } from "@/features/events/types";

function formatDateTimeShort(value: string) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function AdminSpotlight() {
  const queryClient = useQueryClient();
  const [eventIdInput, setEventIdInput] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const spotlightQuery = useQuery({
    queryKey: ["spotlight-event"] as const,
    queryFn: getSpotlightEvent,
    refetchInterval: 5_000,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  });

  const spotlightEvent: Event | null = useMemo(() => {
    const candidate = spotlightQuery.data?.result ?? null;
    if (!candidate || typeof candidate !== "object") return null;
    if (!("id" in candidate)) return null;
    const id = (candidate as { id?: unknown }).id;
    if (typeof id !== "number" || !Number.isFinite(id) || id <= 0) return null;
    return candidate as Event;
  }, [spotlightQuery.data?.result]);

  const setMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return setSpotlightEvent(eventId, true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spotlight-event"] as const });
      setEventIdInput("");
      setLocalError(null);
    },
  });

  const handleSetSpotlight = async () => {
    setLocalError(null);
    const value = Number(eventIdInput.trim());
    if (!Number.isFinite(value) || value <= 0) {
      setLocalError("Vui lòng nhập eventId hợp lệ.");
      return;
    }

    try {
      await setMutation.mutateAsync(value);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Không thể đặt spotlight.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-[var(--font-display)] text-xl font-semibold tracking-tight">
            Spotlight
          </div>
          <div className="mt-1 text-sm text-white/55">
            Chọn sự kiện để hiện thị lên hero của trang chủ.
          </div>
        </div>

        <button
          type="button"
          onClick={() => void spotlightQuery.refetch()}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/7 hover:text-white/90"
        >
          <RefreshCcw className="h-4 w-4" />
          Làm mới
        </button>
      </div>

      {spotlightQuery.isError ? (
        <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
          {(spotlightQuery.error as Error | null)?.message || "Không thể tải spotlight event."}
        </div>
      ) : null}

      {localError ? (
        <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
          {localError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="font-[var(--font-display)] text-lg font-semibold tracking-tight">
              Sự kiện đang hiển thị trên Hero
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
              <Sparkles className="h-4 w-4 text-primary" />
              Spotlight
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div className="aspect-video bg-[#0E0E15]/35">
              {spotlightEvent?.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={spotlightEvent.posterUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm text-white/45">
                  {spotlightQuery.isLoading ? "Đang tải..." : "Chưa có spotlight event"}
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="truncate font-[var(--font-display)] text-lg font-semibold text-white/90">
                {spotlightEvent?.title ?? "—"}
              </div>
              <div className="mt-1 truncate text-sm text-white/55">
                {spotlightEvent?.venue ?? "—"}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/55">
                {spotlightEvent?.startTime ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                    {formatDateTimeShort(spotlightEvent.startTime)}
                  </span>
                ) : null}
              </div>

              {typeof spotlightEvent?.id === "number" ? (
                <div className="mt-5">
                  <Link
                    href={`/events/${spotlightEvent.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/7 hover:text-white/90"
                  >
                    Xem bên user
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="font-[var(--font-display)] text-lg font-semibold tracking-tight">
            Đổi spotlight event
          </div>
          <div className="mt-1 text-sm text-white/55">
            Đưa sự kiện hot lên trang đầu.
          </div>

          <div className="mt-5 space-y-3">
            <label className="space-y-2">
              <div className="text-xs font-semibold tracking-wide text-white/60">Event ID</div>
              <input
                inputMode="numeric"
                value={eventIdInput}
                onChange={(e) => setEventIdInput(e.target.value)}
                placeholder="Nhập ID của sự kiện"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/90 outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <button
              type="button"
              onClick={() => void handleSetSpotlight()}
              disabled={setMutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-background shadow-[0_0_28px_rgba(124,58,237,0.35)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {setMutation.isPending ? "Đang cập nhật..." : "Đặt làm spotlight"}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
