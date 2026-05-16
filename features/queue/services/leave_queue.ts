import { API_ENDPOINTS } from "@/lib/api-config";

type LeaveQueueResponse = {
    code: number;
    message: string;
};

export async function leaveQueue(eventId: number): Promise<LeaveQueueResponse> {
    const url = `${API_ENDPOINTS.queue.leave}/${eventId}`;

    try {
        const res= await fetch(url, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result: LeaveQueueResponse = await res.json();
        return result;
    }
    catch {
        return {
            code: 500,
            message: "Đã xảy ra lỗi khi rời khỏi hàng chờ. Xin vui lòng thử lại sau.",
        };
    }
}