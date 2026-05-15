type HeartBeatResult = {
    code: number;
    message: string;
}

export async function sendHeartBeat(eventId: number): Promise<HeartBeatResult> {
    const url = `${process.env.NEXT_PUBLIC_QUEUE_HEARTBEAT_URL}/${eventId}`;

    if (!process.env.NEXT_PUBLIC_QUEUE_HEARTBEAT_URL) {
        return {
            code: 500,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
        };
    }

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
    } catch (error) {
        return {
            code: 500,
            message: "Đã xảy ra lỗi khi giữ vị trí hàng chờ. Xin vui lòng thử lại sau.",
        };
    }
}