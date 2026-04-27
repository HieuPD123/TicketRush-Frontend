export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResult =
  | {
      ok: true;
      message: string;
      code?: number | string;
    }
  | {
      ok: false;
      message: string;
      status?: number;
      code?: number | string;
    };

type LoginApiEnvelope = {
  code?: number | string;
  message?: string;
};

export async function loginAccount(
  request: LoginRequest
): Promise<LoginResult> {
  const url =
    process.env.NEXT_PUBLIC_AUTH_LOGIN_URL ?? "/api/auth/login";

  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: "Email hoặc mật khẩu không đúng",
      };
    }

    let payload: LoginApiEnvelope | undefined;

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      payload = await res.json().catch(() => undefined);
    }

    return {
      ok: true,
      code: payload?.code,
      message:
        typeof payload?.message === "string"
          ? payload.message
          : "Đăng nhập thành công",
    };
  } catch {
    return {
      ok: false,
      message: "Không thể kết nối tới server. Vui lòng thử lại sau.",
    };
  }
}