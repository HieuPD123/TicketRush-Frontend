"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Ban,
  Calendar,
  Lock,
  Minus,
  Plus,
  LocateFixed,
  X,
} from "lucide-react";

import BookingSteps from "@/features/booking/components/booking-steps";
import { formatIsoToDobDisplay } from "@/features/auth/utils/date-of-birth";
import { useGetEventById } from "@/features/events/services/get-event-by-id";
import { useEventSeats } from "@/features/booking/services/get-event-seats";
import { readBookingDraft, saveBookingDraft } from "@/features/booking/utils/booking-storage";
import { formatPriceVND } from "@/features/events/utils/format-price";
import type { Seat, SeatStatus, Zone } from "@/features/events/types";

type SeatSelectionScreenProps = {
  eventId: string;
};

const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.8;
const ZOOM_MAX = 1.4;
const SERVICE_FEE_RATE = 0.05;
const DEFAULT_SEAT_COLOR = "#7C3AED";

function rowToLabel(rowNumber: number): string {
  if (rowNumber >= 1 && rowNumber <= 26) {
    return String.fromCharCode(64 + rowNumber);
  }

  return `R${rowNumber}`;
}

function buildSeatLabel(seat: Seat): string {
  if (seat.label?.trim()) return seat.label;
  return `${rowToLabel(seat.rowNumber)}${seat.colNumber}`;
}

function buildFallbackSeats(zones: Zone[]): Seat[] {
  let autoId = 1;
  const seats: Seat[] = [];

  zones.forEach((zone) => {
    for (let row = 1; row <= zone.totalRows; row += 1) {
      for (let col = 1; col <= zone.totalCols; col += 1) {
        const label = `${rowToLabel(row)}${col}`;
        seats.push({
          id: autoId,
          zoneId: zone.id,
          zoneName: zone.name,
          colorHex: zone.colorHex || DEFAULT_SEAT_COLOR,
          price: zone.price,
          rowNumber: row,
          colNumber: col,
          label,
          status: "AVAILABLE",
        });
        autoId += 1;
      }
    }
  });

  return seats;
}

function sortSeat(a: Seat, b: Seat): number {
  if (a.rowNumber !== b.rowNumber) return a.rowNumber - b.rowNumber;
  return a.colNumber - b.colNumber;
}

function formatSeatPosition(seat: Seat): string {
  const rowLabel = rowToLabel(seat.rowNumber);
  return `Hàng ${rowLabel}, Ghế ${seat.colNumber}`;
}

function getSeatStatusLabel(status: SeatStatus): string {
  switch (status) {
    case "LOCKED":
      return "Đang giữ";
    case "SOLD":
      return "Đã bán";
    default:
      return "Trống";
  }
}

export default function SeatSelectionScreen({ eventId }: SeatSelectionScreenProps) {
  const router = useRouter();
  const { event, loading: eventLoading } = useGetEventById(eventId);
  const { seats, loading: seatsLoading, error: seatsError } = useEventSeats(eventId);
  const zones = event?.zones ?? [];
  const numericEventId = Number.parseInt(eventId, 10);

  const fallbackSeats = useMemo(() => buildFallbackSeats(zones), [zones]);
  const seatInventory = seats.length > 0 ? seats : fallbackSeats;

  const zoneBlocks = useMemo(() => {
    if (zones.length === 0) return [];

    const seatMap = new Map<number, Seat[]>();
    seatInventory.forEach((seat) => {
      if (!seatMap.has(seat.zoneId)) {
        seatMap.set(seat.zoneId, []);
      }
      seatMap.get(seat.zoneId)?.push(seat);
    });

    return zones.map((zone) => {
      const zoneSeats = seatMap.get(zone.id) ?? [];
      zoneSeats.sort(sortSeat);
      return {
        zone,
        seats: zoneSeats,
      };
    });
  }, [seatInventory, zones]);

  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [zoom, setZoom] = useState(1);

  const selectedSeats = useMemo(() => {
    const selected = new Set(selectedSeatIds);
    return seatInventory.filter((seat) => selected.has(seat.id));
  }, [seatInventory, selectedSeatIds]);

  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = subtotal > 0 ? Math.round(subtotal * SERVICE_FEE_RATE) : 0;
  const total = subtotal + serviceFee;

  const eventDateLabel = event?.startTime
    ? formatIsoToDobDisplay(new Date(event.startTime).toISOString().slice(0, 10))
    : "--";
  const eventTimeLabel = event?.startTime
    ? new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--";

  const isLoading = eventLoading || seatsLoading;

  const handleToggleSeat = (seat: Seat) => {
    const isSelected = selectedSeatIds.includes(seat.id);

    if (seat.status !== "AVAILABLE" && !isSelected) {
      return;
    }

    setSelectedSeatIds((current) => {
      if (isSelected) {
        return current.filter((id) => id !== seat.id);
      }

      return [...current, seat.id];
    });
  };

  const handleRemoveSeat = (seatId: number) => {
    setSelectedSeatIds((current) => current.filter((id) => id !== seatId));
  };

  const handleZoomIn = () => setZoom((current) => Math.min(ZOOM_MAX, current + ZOOM_STEP));
  const handleZoomOut = () => setZoom((current) => Math.max(ZOOM_MIN, current - ZOOM_STEP));
  const handleRecenter = () => setZoom(1);

  const handleBack = () => {
    router.push(`/events/${eventId}`);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0 || !Number.isFinite(numericEventId)) {
      return;
    }

    const existingDraft = readBookingDraft();
    const contact = existingDraft?.eventId === numericEventId ? existingDraft.contact : undefined;

    saveBookingDraft({
      eventId: numericEventId,
      seats: selectedSeats.map((seat) => ({
        id: seat.id,
        zoneName: seat.zoneName,
        label: buildSeatLabel(seat),
        price: seat.price,
        rowNumber: seat.rowNumber,
        colNumber: seat.colNumber,
      })),
      contact,
    });

    router.push(`/events/${eventId}/booking/details`);
  };

  return (
    <div className="min-h-dvh">
      <main className="pt-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <BookingSteps currentStep={1} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/50 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.35em] text-muted">
                <span className="h-1 w-12 rounded-full bg-linear-to-r from-primary/20 via-primary/60 to-secondary/50" />
                STAGE
                <span className="h-1 w-12 rounded-full bg-linear-to-r from-secondary/50 via-primary/60 to-primary/20" />
              </div>

              <div className="mt-8 space-y-10" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
                {zoneBlocks.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-surface/40 px-6 py-10 text-center text-sm text-muted">
                    {isLoading ? "Đang tải sơ đồ chỗ ngồi..." : "Sơ đồ chỗ ngồi chưa sẵn sàng."}
                  </div>
                ) : (
                  zoneBlocks.map(({ zone, seats: zoneSeats }) => (
                    <div key={zone.id} className="space-y-4">
                      <div className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-muted">
                        {zone.name} • {formatPriceVND(zone.price)}
                      </div>
                      <div className="flex justify-center">
                        <div
                          className="grid gap-2 [--seat-size:1.35rem] sm:[--seat-size:1.55rem] lg:[--seat-size:1.7rem]"
                          style={{
                            gridTemplateColumns: `repeat(${zone.totalCols}, minmax(0, var(--seat-size)))`,
                          }}
                        >
                          {zoneSeats.map((seat) => {
                            const isSelected = selectedSeatIds.includes(seat.id);
                            const isAvailable = seat.status === "AVAILABLE";
                            const isDisabled = !isAvailable && !isSelected;
                            const seatColor = seat.colorHex || DEFAULT_SEAT_COLOR;

                            const seatStyle: CSSProperties = isSelected
                              ? {
                                  backgroundColor: seatColor,
                                  boxShadow: `0 0 18px ${seatColor}88, 0 0 38px ${seatColor}55`,
                                }
                              : isAvailable
                                ? {
                                    borderColor: seatColor,
                                    boxShadow: "0 0 10px rgba(255,255,255,0.08)",
                                  }
                                : {};

                            return (
                              <button
                                key={seat.id}
                                type="button"
                                aria-label={`${seat.zoneName} ${buildSeatLabel(seat)} - ${getSeatStatusLabel(seat.status)}`}
                                aria-pressed={isSelected}
                                disabled={isDisabled}
                                onClick={() => handleToggleSeat(seat)}
                                className={
                                  "relative grid h-(--seat-size) w-(--seat-size) place-items-center rounded-md border text-[0.55rem] transition " +
                                  (isSelected
                                    ? "text-background"
                                    : isAvailable
                                      ? "bg-surface/30 text-foreground/70 hover:scale-110"
                                      : "cursor-not-allowed border-border/60 bg-surface-2/70 text-muted")
                                }
                                style={seatStyle}
                              >
                                {seat.status === "LOCKED" ? (
                                  <Lock className="h-3 w-3" />
                                ) : seat.status === "SOLD" ? (
                                  <Ban className="h-3 w-3" />
                                ) : (
                                  <span className="sr-only">{buildSeatLabel(seat)}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border border-foreground/30 bg-surface/30" />
                  Trống
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(124,58,237,0.7)]" />
                  Đã chọn
                </div>
                <div className="flex items-center gap-2">
                  <span className="grid h-3 w-3 place-items-center rounded-full bg-surface-2/80">
                    <Ban className="h-2.5 w-2.5 text-muted" />
                  </span>
                  Đã bán
                </div>
              </div>

              <div className="absolute bottom-6 right-6 flex flex-col gap-2 rounded-full border border-border bg-surface/70 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition hover:text-foreground"
                  aria-label="Phóng to"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition hover:text-foreground"
                  aria-label="Thu nhỏ"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRecenter}
                  className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition hover:text-foreground"
                  aria-label="Đưa về giữa"
                >
                  <LocateFixed className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-border bg-surface/60 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                <span>Đang mở bán</span>
              </div>

              <h2 className="mt-4 text-lg font-extrabold tracking-tight sm:text-xl">
                {event?.title ?? (eventLoading ? "Đang tải sự kiện..." : "Sự kiện")}
              </h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-foreground/70">
                <Calendar className="h-4 w-4" />
                <span>{eventDateLabel} • {eventTimeLabel}</span>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                  Ghế đã chọn ({selectedSeats.length})
                </div>

                {selectedSeats.length === 0 ? (
                  <div className="mt-3 rounded-2xl border border-border bg-surface/40 px-4 py-6 text-center text-sm text-muted">
                    Chọn ghế trong sơ đồ để bắt đầu.
                  </div>
                ) : (
                  <ul className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {selectedSeats.map((seat) => (
                        <motion.li
                          key={seat.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface/40 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground">
                              {seat.zoneName}
                            </div>
                            <div className="mt-1 text-xs text-muted">
                              {formatSeatPosition(seat)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {formatPriceVND(seat.price)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSeat(seat.id)}
                              aria-label={`Bỏ ghế ${buildSeatLabel(seat)}`}
                              className="grid h-7 w-7 place-items-center rounded-full border border-border text-foreground/70 transition hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}

                {seatsError ? (
                  <div className="mt-4 rounded-2xl border border-border bg-surface/40 px-3 py-2 text-xs text-muted">
                    {seatsError}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 space-y-2 border-t border-border/70 pt-4 text-sm text-foreground/70">
                <div className="flex items-center justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPriceVND(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí dịch vụ</span>
                  <span>{formatPriceVND(serviceFee)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-foreground">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPriceVND(total)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-linear-to-r from-primary to-secondary text-sm font-bold text-foreground shadow-[0_0_30px_rgba(124,58,237,0.35)] transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </aside>
        </div>
        </div>
      </main>
    </div>
  );
}
