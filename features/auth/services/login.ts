export type LoginRequest = {
  email: string;
  password: string;
};


export type ApiRespone = {
  code: number;
  message: string;
};

export type LoginResult = {
  ok: boolean;
  message: string;
}



export async function loginAccount(
  request: LoginRequest
): Promise<LoginResult> {
  
  const url = process.env.NEXT_PUBLIC_AUTH_LOGIN_URL;

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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(request),
    });
    
    const data: ApiRespone = await res.json();
    
    if (res.ok) {
      return {
        ok: true,
        message: data.message,
      };
    }

    return {
      ok: false,
      message: "email hoặc mật khẩu không chính xác.",
    };
  } catch {
    return {
      ok: false,
      message: "Không thể kết nối tới server. Vui lòng thử lại sau.",
    };
  }
}