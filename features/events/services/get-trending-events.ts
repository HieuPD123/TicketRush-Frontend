import type { Event } from "@/features/events/types";

type TrendingEventResponse = {
  code: number;
  message: string;
  result: Event[];
};

export async function getTrendingEvents(): Promise<TrendingEventResponse> {
  const url = process.env.NEXT_PUBLIC_TRENDING_EVENTS_URL;

  if (!url) {
        return {
            code: 500,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
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

    const data: TrendingEventResponse = await res.json();

    if (!res.ok) {
      return {
        code: data.code || res.status,
        message: data.message || "Đã xảy ra lỗi khi lấy sự kiện thịnh hành.",
        result: [],
      };
    }

    return {
      code: data.code,
      message: data.message,
      result: data.result,
    };

  } catch {
    return {
      code: 500,
      message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
      result: [],
    };
  }
}
