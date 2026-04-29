export async function logoutAccount(): Promise<{ ok: true } | { ok: false }> {
  const url = process.env.NEXT_PUBLIC_AUTH_LOGOUT_URL;

  if (!url) {
    return { ok: false };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "*/*",
      },
    });

    if (!res.ok) {
      return { ok: false };
    }

    return { ok: true };
  } catch {
    return { ok: false };
  }
}
