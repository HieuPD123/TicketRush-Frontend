"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react";

import BookingSteps from "@/features/booking/components/booking-steps";
import { readBookingDraft, saveBookingDraft, type BookingDraft } from "@/features/booking/utils/booking-storage";
import { useGetEventById } from "@/features/events/services/get-event-by-id";
import { formatIsoToDobDisplay } from "@/features/auth/utils/date-of-birth";
import { formatPriceVND } from "@/features/events/utils/format-price";

const SERVICE_FEE_RATE = 0.05;

type BookingDetailsScreenProps = {
  eventId: string;
};

function formatSeatPosition(rowNumber: number, colNumber: number): string {
  const rowLabel = rowNumber >= 1 && rowNumber <= 26
    ? String.fromCharCode(64 + rowNumber)
    : `R${rowNumber}`;

  return `Hang ${rowLabel}, Ghe ${colNumber}`;
}

export default function BookingDetailsScreen({ eventId }: BookingDetailsScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  const numericEventId = Number.parseInt(eventId, 10);
  const { event, loading: eventLoading } = useGetEventById(eventId);

  useEffect(() => {
    const stored = readBookingDraft();
    if (!stored || stored.eventId !== numericEventId) {
      setDraft(null);
      return;
    }

    setDraft(stored);
  }, [numericEventId]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!draft?.contact) return;
    setFullName(draft.contact.fullName);
    setEmail(draft.contact.email);
    setPhone(draft.contact.phone);
    setNote(draft.contact.note);
  }, [draft]);

  const selectedSeats = draft?.seats ?? [];
  const subtotal = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
    [selectedSeats],
  );
  const serviceFee = subtotal > 0 ? Math.round(subtotal * SERVICE_FEE_RATE) : 0;
  const total = subtotal + serviceFee;

  const eventDateLabel = event?.startTime
    ? formatIsoToDobDisplay(new Date(event.startTime).toISOString().slice(0, 10))
    : "--";
  const eventTimeLabel = event?.startTime
    ? new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--";

  const handleBack = () => {
    router.push(`/events/${eventId}/booking`);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0 || !Number.isFinite(numericEventId)) {
      return;
    }

    saveBookingDraft({
      eventId: numericEventId,
      seats: selectedSeats,
      contact: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        note: note.trim(),
      },
    });

    router.push(`/events/${eventId}/booking/payment`);
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
              Quay lai
            </button>
            <BookingSteps currentStep={2} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-3xl border border-border bg-surface/55 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Thong tin dat ve
              </h1>
              <p className="mt-2 text-sm text-muted">
                Hoan tat thong tin de tiep tuc thanh toan nhanh hon.
              </p>

              {!draft ? (
                <div className="mt-6 rounded-2xl border border-border bg-surface/40 px-4 py-6 text-sm text-muted">
                  Chua co ghe da chon. Vui long quay lai buoc chon ghe.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-[0.18em] text-foreground/85">
                      Ho va ten
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/55" />
                      <input
                        value={fullName}
                        onChange={(event) => setFullName(event.currentTarget.value)}
                        placeholder="Nhap ho va ten"
                        className="h-11 w-full rounded-full border border-border bg-surface/60 pl-11 pr-4 text-sm text-foreground/90 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-[0.18em] text-foreground/85">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/55" />
                      <input
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                        placeholder="Nhap email"
                        className="h-11 w-full rounded-full border border-border bg-surface/60 pl-11 pr-4 text-sm text-foreground/90 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-[0.18em] text-foreground/85">
                      So dien thoai
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/55" />
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.currentTarget.value)}
                        placeholder="Nhap so dien thoai"
                        className="h-11 w-full rounded-full border border-border bg-surface/60 pl-11 pr-4 text-sm text-foreground/90 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold tracking-[0.18em] text-foreground/85">
                      Ghi chu
                    </label>
                    <textarea
                      rows={4}
                      value={note}
                      onChange={(event) => setNote(event.currentTarget.value)}
                      placeholder="Vi du: Yeu cau ghe gan san khau"
                      className="w-full rounded-3xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground/90 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleContinue}
                disabled={!draft || selectedSeats.length === 0}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-linear-to-r from-primary to-secondary text-sm font-bold text-foreground shadow-[0_0_30px_rgba(124,58,237,0.35)] transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tiep tuc thanh toan
              </button>
            </section>

            <aside className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-border bg-surface/60 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Calendar className="h-4 w-4" />
                  <span>{eventDateLabel} • {eventTimeLabel}</span>
                </div>

                <h2 className="mt-3 text-lg font-extrabold tracking-tight">
                  {event?.title ?? (eventLoading ? "Dang tai su kien..." : "Su kien")}
                </h2>

                <div className="mt-5 space-y-3">
                  {selectedSeats.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-surface/40 px-4 py-6 text-center text-sm text-muted">
                      Chua chon ghe.
                    </div>
                  ) : (
                    selectedSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface/40 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-foreground">
                            {seat.zoneName}
                          </div>
                          <div className="mt-1 text-xs text-muted">
                            {formatSeatPosition(seat.rowNumber, seat.colNumber)}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {formatPriceVND(seat.price)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 space-y-2 border-t border-border/70 pt-4 text-sm text-foreground/70">
                  <div className="flex items-center justify-between">
                    <span>Tam tinh</span>
                    <span>{formatPriceVND(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phi dich vu</span>
                    <span>{formatPriceVND(serviceFee)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-foreground">
                    <span>Tong cong</span>
                    <span className="text-primary">{formatPriceVND(total)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
