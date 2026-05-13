
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

export async function cancelBooking(bookingId: string): Promise<CancelBookingResult> {
    const url = `${process.env.NEXT_PUBLIC_BOOKING_URL}/${bookingId}`;

    if (!process.env.NEXT_PUBLIC_BOOKING_URL) {
        return {
            ok: false,
            message: "Booking API URL is not configured",
            data: null,
        };
    }

    try {
        const res = await fetch(url, {
            method: "DELETE",
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
    } catch (error) {
        return {
            ok: false,
            message: "An error occurred while cancelling the booking",
            data: null,
        };
    }
}