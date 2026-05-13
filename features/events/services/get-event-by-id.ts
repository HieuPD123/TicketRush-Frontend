import type { Event } from "../types";

export type GetEventByIdResponse = {
	code: number;
	message: string;
	result: Event;
};

export type GetEventByIdResult = {
	ok: boolean;
	message: string;
	data: GetEventByIdResponse | null;
};

export const getEventById = async (id: number): Promise<GetEventByIdResult> => {
	const url = process.env.NEXT_PUBLIC_EVENTS_URL;

	if (!url) {
		return {
			ok: false,
			message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
			data: null,
		};
	}

	const endpoint = `${url}/${id}`;

	try {
		const res = await fetch(endpoint, {
			method: "GET",
			cache: "no-store",
			headers: {
				Accept: "application/json",
			},
		});

		const data: GetEventByIdResponse = await res.json();

		if (!res.ok) {
			return {
				ok: false,
				message: data?.message || "Không thể tải thông tin sự kiện.",
				data: null,
			};
		}

		return {
			ok: true,
			message: data.message,
			data,
		};
	} catch (err) {
		return {
			ok: false,
			message: "Không thể kết nối tới server. Vui lòng thử lại sau.",
			data: null,
		};
	}
};

// A small client hook for usage in client components.
import { useEffect, useState } from "react";

export function useGetEventById(id?: string | number) {
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const numericId = typeof id === "string" ? Number.parseInt(id, 10) : id;
		if (!numericId || Number.isNaN(Number(numericId))) {
			setEvent(null);
			setError("Invalid id");
			setLoading(false);
			return;
		}

		let mounted = true;

		(async () => {
			setLoading(true);
			setError(null);
			const res = await getEventById(Number(numericId));
			if (!mounted) return;
			if (!res.ok || !res.data) {
				setError(res.message || "Không thể tải sự kiện");
				setEvent(null);
			} else {
				setEvent(res.data.result);
			}
			setLoading(false);
		})();

		return () => {
			mounted = false;
		};
	}, [id]);

	return { event, loading, error } as const;
}

