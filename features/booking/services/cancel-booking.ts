
type ApiResponse = {
    code: boolean;
    message: string;
    data: null;
}

export type CancelBookingResult = {
    ok: boolean;
    message: string;
    data: ApiResponse | null;
};

export async function cancelBooking(bookingId: number): Promise<CancelBookingResult> {
    const url = `${process.env.NEXT_PUBLIC_BOOKING_URL}/${bookingId}`;

    if (!process.env.NEXT_PUBLIC_BOOKING_URL) {
        return {
            ok: false,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
            data: null,
        };
    }

    try {
        const res = await fetch(url, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result: ApiResponse = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                message: result.message || "Hủy booking không thành công",
                data: result,
            };
        }

        return {
            ok: result.code,
            message: result.message,
            data: result,
        };
    } catch {
        return {
            ok: false,
            message: "Có lỗi xảy ra khi hủy booking",
            data: null,
        };
    }
}