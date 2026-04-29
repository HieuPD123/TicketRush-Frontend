export type RegisterGender = "MALE" | "FEMALE" | "OTHER";

type Result = {
  id: number;
  email: string;
  fullName: string;
  dateOfBirth: string;
  gender: RegisterGender;
  role: string;
  avatarUrl: string;
  createdAt: string;
};

type ApiResponse = {
  code: number;
  message: string;
  result: Result;
};

export type RegisterRequest = { 
  fullName: string; 
  email: string; 
  password: string; 
  dateOfBirth: string; // yyyy-mm-dd 
  gender: RegisterGender; 
};

export type RegisterResult = {
  ok: boolean;
  message: string;
}

export async function registerAccount(
  request: RegisterRequest,
): Promise<RegisterResult> {
  const url = process.env.NEXT_PUBLIC_AUTH_REGISTER_URL;
  
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
      },
      body: JSON.stringify(request),
    });

    const data: ApiResponse = await res.json();

    if (res.ok) {
      return {
        ok: true,
        message: data.message || "Đăng ký thành công",
      };
    }

    return {
      ok: false,
      message: data.message || "Đăng ký thất bại",
    };
  } catch {
    return {
      ok: false,
      message: "Lỗi kết nối server",
    };
  }
}