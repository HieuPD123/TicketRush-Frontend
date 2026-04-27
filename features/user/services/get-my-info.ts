export type MyInfo = {
  id: number;
  email: string;
  fullName: string;
  phone?: string | null;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | string;
  role: "CUSTOMER" | "ADMIN" | string;
  createdAt: string;
};

type ApiResponse<T> = {
  code?: number | string;
  message?: string;
  result?: T;
};

export type GetMyInfoResult =
  | {
      ok: true;
      user: MyInfo;
      code?: number | string;
      message?: string;
    }
  | {
      ok: false;
      status?: number;
      code?: number | string;
      message?: string;
    };

export async function getMyInfo(): Promise<GetMyInfoResult> {
  const url = process.env.NEXT_PUBLIC_USER_PROFILE_URL ?? "/api/my-info";

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: "Không thể lấy thông tin người dùng",
      };
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return {
        ok: false,
        status: res.status,
        message: "Phản hồi không hợp lệ",
      };
    }

    const payload = (await res.json().catch(() => undefined)) as unknown;
    if (!payload || typeof payload !== "object") {
      return {
        ok: false,
        status: res.status,
        message: "Phản hồi không hợp lệ",
      };
    }

    const envelope = payload as ApiResponse<MyInfo>;
    if (!envelope.result) {
      return {
        ok: false,
        status: res.status,
        code: envelope.code,
        message:
          typeof envelope.message === "string"
            ? envelope.message
            : "Không có thông tin người dùng",
      };
    }

    return {
      ok: true,
      user: envelope.result,
      code: envelope.code,
      message: envelope.message,
    };
  } catch {
    return {
      ok: false,
      message: "Không thể kết nối tới server. Vui lòng thử lại sau.",
    };
  }
}
