
export type Me = {
    email: string;
    role: "CUSTOMER" | "ADMIN";
};

type ApiResponse = {
  code: number;
  message: string;
    result: Me;
};

export type GetMeResult = {
    ok: boolean;
    message: string;
    result: Me | null;
};

export async function getMe(): Promise<GetMeResult> {
    const url = process.env.NEXT_PUBLIC_AUTH_ME_URL;

    if (!url) {
    return {
            ok: false,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
            result: null,
    };
  }

  try {
    const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "*/*",
            },
    });

    if (!res.ok) {
            return {
                ok: false,
                message: "Không thể lấy thông tin người dùng",
                result: null,
            };
    }
    const data: ApiResponse = await res.json();

    return {
            ok: true,
            message: data.message,
            result: data.result,
    };
  } catch {
    return {
            ok: false,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
            result: null,
    };
  }
}