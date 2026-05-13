import {ApiRespone, HoldSeatsResult as ConfirmBookingResult} from "./hold-seats";

export const confirmBooking = async (bookingId: string): Promise<ConfirmBookingResult> => {
    const url = `${process.env.NEXT_PUBLIC_BOOKING_URL}/${bookingId}/confirm`;

    if (!process.env.NEXT_PUBLIC_BOOKING_URL) {
        return {
            ok: false,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
            data: null,
        };
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
    
        const data: ApiRespone = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                message: data?.message || "Xác nhận đặt vé thất bại.",
                data: null,
            };
        }

        return {
            ok: true,
            message: data.message,
            data: data,
        };
    } catch (err) {
        return {
            ok: false,
            message: "Không thể kết nối tới server. Vui lòng thử lại sau.",
            data: null,
        };
    }
};