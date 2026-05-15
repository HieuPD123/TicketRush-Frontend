type CheckQueueResponse = {
    code: number;
    message: string;
    result?: boolean;
};

export async function checkQueue(eventId: number): Promise<CheckQueueResponse> {
    const url = `${process.env.NEXT_PUBLIC_CHECK_QUEUE_URL}/${eventId}`;

    if (!process.env.NEXT_PUBLIC_CHECK_QUEUE_URL) {
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