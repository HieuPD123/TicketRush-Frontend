
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/api-config";

import Logo from "@/components/shared/logo";

async function isAuthenticated() {
  const url = API_ENDPOINTS.auth.me;

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

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (await isAuthenticated()) {
    redirect("/");
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-128 w-lg rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-128 w-lg rounded-full bg-secondary/16 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background to-surface/30" />
      </div>

      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <Logo className="text-2xl sm:text-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
