import { API_ENDPOINTS } from "@/lib/api-config";

type HeartBeatResult = {
    code: number;
    message: string;
}

export async function sendHeartBeat(eventId: number): Promise<HeartBeatResult> {
    const url = `${API_ENDPOINTS.queue.heartbeat}/${eventId}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
    const result: HeartBeatResult = await res.json();
        return result;
    } catch {
        return {
            code: 500,
            message: "Đã xảy ra lỗi khi giữ vị trí hàng chờ. Xin vui lòng thử lại sau.",
        };
    }
}