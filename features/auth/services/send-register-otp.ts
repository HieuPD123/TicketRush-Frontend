export type SendRegisterOtpRequest = {
  email: string;
};

type ApiResponse = {
  code: number;
  message: string;
  result: unknown;
};

export type SendRegisterOtpResult = {
  ok: boolean;
  message: string;
};

export async function sendRegisterOtp(
  request: SendRegisterOtpRequest,
): Promise<SendRegisterOtpResult> {
  const url =
    process.env.NEXT_PUBLIC_AUTH_SEND_REGISTER_OTP_URL;

    if (!url) {
    return {
        ok: false,
        message:
        "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(request),
    });

    const data: ApiResponse = await res.json();

    if (res.ok) {
      return {
        ok: true,
        message: data.message || "Đã gửi OTP",
      };
    }

    return {
      ok: false,
      message: data.message || "Gửi OTP thất bại",
    };
  } catch {
    return {
      ok: false,
      message: "Lỗi kết nối server",
    };
  }
}
