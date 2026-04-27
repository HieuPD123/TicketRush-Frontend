export type RegisterGender = "MALE" | "FEMALE" | "OTHER";

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string; // yyyy-mm-dd
  gender: RegisterGender;
};

export type RegisterResult =
  | {
      ok: true;
      message: string;
      code?: number | string;
    }
  | {
      ok: false;
      message: string;
      code?: number | string;
      status?: number;
    };

type PossibleApiEnvelope = {
  code?: number | string;
  message?: string;
  data?: unknown;
};

function extractMessage(payload: unknown): {
  code?: number | string;
  message?: string;
} {
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (/^\d+$/.test(trimmed)) return { code: trimmed };
    return { message: trimmed };
  }

  if (payload && typeof payload === "object") {
    const envelope = payload as PossibleApiEnvelope;
    return {
      code: envelope.code,
      message:
        typeof envelope.message === "string" ? envelope.message : undefined,
    };
  }

  return {};
}

export async function registerAccount(
  request: RegisterRequest,
): Promise<RegisterResult> {
  const url = process.env.NEXT_PUBLIC_AUTH_REGISTER_URL;
  if (!url) {
    return {
      ok: false,
      message:
        "Thiếu NEXT_PUBLIC_AUTH_REGISTER_URL.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(request),
    });

    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    const payload = isJson
      ? await res.json().catch(() => undefined)
      : await res.text().catch(() => undefined);

    const { code, message } = extractMessage(payload);

    // Some backends always return 200 and put the business code in the body.
    if (code !== undefined) {
      if (String(code) === "1000") {
        return {
          ok: true,
          code,
          message: message ?? "Đăng ký thành công",
        };
      }

      return {
        ok: false,
        status: res.status,
        code,
        message: message ?? "Đăng ký thất bại",
      };
    }

    if (res.ok) {
      return {
        ok: true,
        message:
          message ?? (typeof payload === "string" ? payload : "Đăng ký thành công"),
      };
    }

    return {
      ok: false,
      status: res.status,
      message:
        message ?? (typeof payload === "string" ? payload : "Đăng ký thất bại"),
    };
  } catch {
    return {
      ok: false,
      message: "Không thể kết nối tới server. Kiểm tra URL/CORS/backend.",
    };
  }
}
