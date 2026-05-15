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
    const url = `${process.env.NEXT_PUBLIC_QUEUE_STATUS_URL}/${eventId}`;

    if (!process.env.NEXT_PUBLIC_QUEUE_STATUS_URL) {
        return {
            code: 500,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
        };
    }

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
    catch (error) {
        return {
            code: 500,
            message: "Đã xảy ra lỗi khi lấy thông tin hàng chờ. Xin vui lòng thử lại sau.",
        };
    }
}