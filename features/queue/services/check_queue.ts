import { API_ENDPOINTS } from "@/lib/api-config";

type CheckQueueResponse = {
    code: number;
    message: string;
    result?: boolean;
};

export async function checkQueue(eventId: number): Promise<CheckQueueResponse> {
    const url = `${API_ENDPOINTS.queue.check}/${eventId}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        const result: CheckQueueResponse = await res.json();
        return result;
    }
    catch {
        return {
            code: 500,
            message: "Đã xảy ra lỗi khi kiểm tra event. Xin vui lòng thử lại sau.",
        };
    }
}