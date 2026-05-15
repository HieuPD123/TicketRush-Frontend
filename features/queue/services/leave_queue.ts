type LeaveQueueResponse = {
    code: number;
    message: string;
};

export async function leaveQueue(eventId: number): Promise<LeaveQueueResponse> {
    const url = `${process.env.NEXT_PUBLIC_LEAVE_QUEUE_URL}/${eventId}`;

    if (!process.env.NEXT_PUBLIC_LEAVE_QUEUE_URL) {
        return {
            code: 500,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
        };
    }

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
    catch (error) {
        return {
            code: 500,
            message: "Đã xảy ra lỗi khi rời khỏi hàng chờ. Xin vui lòng thử lại sau.",
        };
    }
}