import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function isAuthenticated() {
  const url = process.env.NEXT_PUBLIC_AUTH_ME_URL;

  if (!url) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  if (!cookieHeader) {
    return false;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  return children;
}
