import type { Seat } from "../../events/types";

export type GetEventSeatsResponse = {
    code: number;
    message: string;
    result: Seat[];
};

export type GetEventSeatsResult = {
    ok: boolean;
    message: string;
    data: Seat[];
};

export const getEventSeats = async (eventId: number): Promise<GetEventSeatsResult> => {
    const url = process.env.NEXT_PUBLIC_EVENTS_URL;

    if (!url) {
        return {
            ok: false,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
            data: [],
        };
    }

    const endpoint = `${url}/${eventId}/seats`;

    try {
        const res = await fetch(endpoint, {
            method: "GET",
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        const payload: GetEventSeatsResponse = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                message: payload?.message || "Không thể tải danh sách ghế.",
                data: [],
            };
        }

        return {
            ok: true,
            message: payload.message,
            data: payload.result,
        };
    } catch {
        return {
            ok: false,
            message: "Không thể kết nối tới server. Vui lòng thử lại sau.",
            data: [],
        };
    }
};

// A small client hook for usage in client components.
import { useEffect, useState } from "react";

export function useEventSeats(eventId?: string | number) {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const numericId = typeof eventId === "string" ? Number.parseInt(eventId, 10) : eventId;
        if (!numericId || Number.isNaN(Number(numericId))) {
            setSeats([]);
            setError("Invalid id");
            setLoading(false);
            return;
        }

        let mounted = true;

        (async () => {
            setLoading(true);
            setError(null);
            const res = await getEventSeats(Number(numericId));
            if (!mounted) return;
            if (!res.ok) {
                setError(res.message || "Không thể tải ghế");
                setSeats([]);
            } else {
                setSeats(res.data);
            }
            setLoading(false);
        })();

        return () => {
            mounted = false;
        };
    }, [eventId]);

    return { seats, loading, error } as const;
}
