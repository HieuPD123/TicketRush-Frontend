import { API_ENDPOINTS } from "@/lib/api-config";

type QueueStatus = {
    status: "WAITING" | "GRANTED" | "EXPIRED";
    position: number;
    totalInQueue: number;
    estimatedWaitSeconds: number;
}

type QueueStatusResponse = {
    code: number;
    message: string;
    data?: QueueStatus;
}

export async function getQueueStatus(eventId: number): Promise<QueueStatusResponse> {
    const url = `${API_ENDPOINTS.queue.status}/${eventId}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result: QueueStatusResponse = await res.json();
        return result;
    }
    catch {
        return {
            code: 500,
            message: "Đã xảy ra lỗi khi lấy thông tin hàng chờ. Xin vui lòng thử lại sau.",
        };
    }
}