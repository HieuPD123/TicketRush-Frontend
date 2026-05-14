"use client";

import { useEffect, useMemo, useState } from "react";
import { getEventSeats } from "@/features/booking/services/get-event-seats";
import type { Seat, SeatStatus } from "@/features/events/types";
import { websocketService } from "@/features/websocket/services/websocket-services";

type SeatStatusMessage = {
  eventId: number;
  seatId: number;
  status: SeatStatus;
};

type UseSeatSocketResult = {
  seats: Seat[];
  loading: boolean;
  error: string | null;
};

function parseEventId(eventId?: string | number): number | null {
  if (typeof eventId === "number" && Number.isFinite(eventId)) return eventId;

  if (typeof eventId === "string") {
    const parsed = Number.parseInt(eventId, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function applySeatStatus(current: Seat[], message: SeatStatusMessage) {
  return current.map((seat) =>
    seat.id === message.seatId ? { ...seat, status: message.status } : seat,
  );
}

export function useSeatSocket(eventId?: string | number): UseSeatSocketResult {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericEventId = useMemo(() => parseEventId(eventId), [eventId]);

  useEffect(() => {
    if (numericEventId === null) {
      setSeats([]);
      setError(null);
      setLoading(false);
      return;
    }

    let alive = true;

    const loadSeats = async () => {
      setLoading(true);
      try {
        const result = await getEventSeats(numericEventId);

        if (!alive) return;

        if (result.ok) {
          setSeats(result.data);
          setError(null);
        } else {
          setSeats([]);
          setError(result.message);
        }
      } catch {
        if (alive) {
          setSeats([]);
          setError("Không tải được danh sách ghế.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    const unsubscribeConnect = websocketService.onConnect((isReconnect) => {
      if (isReconnect && alive) {
        void loadSeats();
      }
    });

    const unsubscribeMessage = websocketService.subscribe(
      `/topic/events/${numericEventId}/seats`,
      (body) => {
        if (!alive) return;

        try {
          const message = JSON.parse(body) as SeatStatusMessage;
          if (message.eventId !== numericEventId) return;

          setSeats((current) => applySeatStatus(current, message));
        } catch {
          // bỏ qua message lỗi
        }
      },
    );

    websocketService.connect();
    void loadSeats();

    return () => {
      alive = false;
      unsubscribeMessage();
      unsubscribeConnect();
    };
  }, [numericEventId]);

  return { seats, loading, error };
}