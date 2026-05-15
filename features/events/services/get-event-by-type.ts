import { Event, Category } from "../types";

export type GetEventByTypeResponse = {
    code: number;
    message: string;
    result: Event[];
};

export const getEventByType = async (type: Category): Promise<GetEventByTypeResponse> => {
    const url = `${process.env.NEXT_PUBLIC_EVENT_BY_TYPE_URL}?type=${type}`;

    if (!process.env.NEXT_PUBLIC_EVENT_BY_TYPE_URL) {
        return {
            code: 500,
            message: "",
            result: [],
        };
    }

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data: GetEventByTypeResponse = await res.json();

        if (!res.ok) {
            return {
                code: data.code || res.status,
                message: data.message || "Đã xảy ra lỗi khi lấy sự kiện theo loại.",
                result: [],
            };
        }

        return {
            code: data.code,
            message: data.message,
            result: data.result,
        };
    }

    catch (error) {
        return {
            code: 500,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
            result: [],
        };
    }
}