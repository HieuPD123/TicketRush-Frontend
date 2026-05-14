"use client";

import { useCallback, useState } from "react";

import { readBookingDraft, saveBookingDraft, type BookingDraft } from "@/features/booking/utils/booking-storage";

export function useSeatSelection(eventId: string) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [localSeats, setLocalSeats] = useState<
    Array<{ id: number; price: number; label: string; status: "AVAILABLE" | "LOCKED" | "SOLD" }>
  >([]);

  const numericEventId = Number.parseInt(eventId, 10);

  // Load draft on init
  const loadDraft = useCallback(() => {
    const draft = readBookingDraft();
    if (draft && draft.eventId === numericEventId) {
      setSelectedSeats(draft.seats.map((s) => s.id));
    }
  }, [numericEventId]);

  const toggleSeat = useCallback((seatId: number, price: number, label: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      return [...prev, seatId];
    });
  }, []);

  const handleSeatStatusChange = useCallback((seatId: number, newStatus: "AVAILABLE" | "LOCKED" | "SOLD") => {
    if (newStatus !== "AVAILABLE") {
      setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
    }
  }, []);

  // Save to draft
  const saveDraft = useCallback(
    (seats: Array<{ id: number; price: number; label: string; zoneName: string; rowNumber: number; colNumber: number }>) => {
      if (selectedSeats.length === 0) {
        return;
      }

      const selectedData = seats
        .filter((s) => selectedSeats.includes(s.id))
        .map((s) => ({
          id: s.id,
          zoneName: s.zoneName,
          label: s.label,
          price: s.price,
          rowNumber: s.rowNumber,
          colNumber: s.colNumber,
        }));

      const draft = {
        eventId: numericEventId,
        seats: selectedData,
      };

      saveBookingDraft(draft);
    },
    [numericEventId, selectedSeats],
  );

  const selectedCount = selectedSeats.length;

  return {
    selectedSeats,
    selectedCount,
    toggleSeat,
    handleSeatStatusChange,
    saveDraft,
    loadDraft,
  };
}
