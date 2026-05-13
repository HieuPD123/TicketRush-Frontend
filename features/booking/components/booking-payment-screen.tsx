"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ShieldCheck, Wallet } from "lucide-react";

import BookingSteps from "@/features/booking/components/booking-steps";
import { readBookingDraft, saveBookingDraft, type BookingDraft } from "@/features/booking/utils/booking-storage";
import { useGetEventById } from "@/features/events/services/get-event-by-id";
import { formatIsoToDobDisplay } from "@/features/auth/utils/date-of-birth";
import { formatPriceVND } from "@/features/events/utils/format-price";

const SERVICE_FEE_RATE = 0.05;

type BookingPaymentScreenProps = {
  eventId: string;
};

const PAYMENT_METHODS = [
  { id: "card", label: "The tin dung", icon: CreditCard },
  { id: "wallet", label: "Vi dien tu", icon: Wallet },
  { id: "bank", label: "Chuyen khoan", icon: ShieldCheck },
] as const;

export default function BookingPaymentScreen({ eventId }: BookingPaymentScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]["id"]>("card");

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
    router.push(`/events/${eventId}/booking/details`);
  };

  const handlePay = () => {
    if (selectedSeats.length === 0 || !Number.isFinite(numericEventId)) {
      return;
    }

    saveBookingDraft({
      eventId: numericEventId,
      seats: selectedSeats,
      contact: draft?.contact,
    });
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
            <BookingSteps currentStep={3} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-3xl border border-border bg-surface/55 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Thanh toan
              </h1>
              <p className="mt-2 text-sm text-muted">
                Chon phuong thuc thanh toan yeu thich cua ban.
              </p>

              {!draft ? (
                <div className="mt-6 rounded-2xl border border-border bg-surface/40 px-4 py-6 text-sm text-muted">
                  Chua co ghe da chon. Vui long quay lai buoc chon ghe.
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {PAYMENT_METHODS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = method === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMethod(item.id)}
                        className={
                          "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition " +
                          (isSelected
                            ? "border-primary/70 bg-primary/10 text-foreground"
                            : "border-border bg-surface/60 text-foreground/70 hover:text-foreground")
                        }
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={
                              "grid h-10 w-10 place-items-center rounded-full border " +
                              (isSelected
                                ? "border-primary/60 bg-primary/20 text-primary"
                                : "border-border bg-surface/60 text-foreground/70")
                            }
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="text-sm font-semibold">
                            {item.label}
                          </div>
                        </div>
                        <span
                          className={
                            "h-4 w-4 rounded-full border " +
                            (isSelected ? "border-primary bg-primary" : "border-border")
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={handlePay}
                disabled={!draft || selectedSeats.length === 0}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-linear-to-r from-primary to-secondary text-sm font-bold text-foreground shadow-[0_0_30px_rgba(124,58,237,0.35)] transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Thanh toan ngay
              </button>
            </section>

            <aside className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-border bg-surface/60 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="text-sm text-foreground/70">
                  {eventDateLabel} • {eventTimeLabel}
                </div>
                <h2 className="mt-3 text-lg font-extrabold tracking-tight">
                  {event?.title ?? (eventLoading ? "Dang tai su kien..." : "Su kien")}
                </h2>

                <div className="mt-5 space-y-2 text-sm text-foreground/75">
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

                {draft?.contact ? (
                  <div className="mt-5 rounded-2xl border border-border bg-surface/40 px-4 py-4 text-sm text-foreground/80">
                    <div className="font-semibold text-foreground">Thong tin khach hang</div>
                    <div className="mt-2 space-y-1 text-xs text-muted">
                      <div>{draft.contact.fullName || "Chua co ten"}</div>
                      <div>{draft.contact.email || "Chua co email"}</div>
                      <div>{draft.contact.phone || "Chua co so dien thoai"}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
