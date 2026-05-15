export type QueueDescription = {
    position: number;
    totalInQueue: number;
    message: string;
};

type ApiResponse = {
    code: number;
    message: string;
    result: QueueDescription | null;
};

type JoinQueueResult = {
    ok: boolean;
    message: string;
    status: QueueDescription | null;
};

export async function joinQueue(eventId: number): Promise<JoinQueueResult> {
    const url = `${process.env.NEXT_PUBLIC_QUEUE_JOIN_URL}/${eventId}`;

    if (!process.env.NEXT_PUBLIC_QUEUE_JOIN_URL) {
        return {
            ok: false,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
            status: null,
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

        const result: ApiResponse = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                message: result.message || "Tham gia hàng đợi không thành công",
                status: null,
            };
        }

        return {
            ok: result.code === 200,
            message: result.message,
            status: result.result,
        };
    } catch (error) {
        return {
            ok: false,
            message: "Có lỗi xảy ra khi tham gia hàng đợi",
            status: null,
        };
    }
}
