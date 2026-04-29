"use client";

import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Search,
  Ticket,
  User,
  UserRound,
} from "lucide-react";

import { CATEGORY_LABELS, type Category } from "@/constants";
import { useMyInfo } from "@/features/user/hooks/use-my-info";
import { useLogout } from "@/features/auth/hooks/use-logout";

export default function NavBar() {
  const { data: myInfo, isLoading } = useMyInfo();
  const { logout } = useLogout();
  const categories = Object.entries(CATEGORY_LABELS) as Array<[Category, string]>;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface/55 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-extrabold tracking-tight sm:text-2xl"
        >
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(124,58,237,0.40)]">
            TicketRush
          </span>
        </Link>

        <details className="group relative shrink-0">
          <summary className="group flex h-11 cursor-pointer list-none items-center gap-2 rounded-full px-3 text-sm font-medium text-foreground/80 transition hover:bg-surface-2/70 hover:text-foreground">
            Thể loại
            <ChevronDown className="h-4 w-4 text-foreground/70 transition group-open:rotate-180" />
          </summary>
          <div className="absolute left-0 mt-2 w-[min(92vw,44rem)] overflow-hidden rounded-2xl border border-border bg-surface/90 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:w-[min(92vw,36rem)] lg:w-2xl">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([key, label]) => (
              <a
                  key={key}
                  href="#"
                  className="rounded-xl px-3 py-2 text-sm text-foreground/80 transition hover:bg-surface-2/70 hover:text-foreground"
              >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </details>

        <div className="flex min-w-0 flex-1 justify-center">
          <div className="group relative w-full max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
            <input
              aria-label="Tìm kiếm"
              placeholder="Tìm kiếm sự kiện, nghệ sĩ, địa điểm..."
              className="h-11 w-full rounded-full border border-border bg-surface/60 pl-11 pr-4 text-sm text-foreground/90 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isLoading ? (
            <div
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-foreground/80"
              aria-label="Đang tải thông tin tài khoản"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface/60">
                <UserRound className="h-4 w-4 text-foreground/70" />
              </span>
              <span aria-hidden className="skeleton h-4 w-28 rounded-full" />
            </div>
          ) : myInfo ? (
            <details className="relative">
              <summary className="group flex h-11 cursor-pointer list-none items-center gap-2 rounded-full px-3 text-sm font-semibold text-foreground/85 transition hover:bg-surface-2/70 hover:text-foreground">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface/60">
                  <UserRound className="h-4 w-4 text-foreground/70" />
                </span>
                <span className="max-w-40 truncate sm:max-w-56">
                  {myInfo.fullName}
                </span>
                <ChevronDown className="h-4 w-4 text-foreground/70 transition group-open:rotate-180" />
              </summary>

              <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface/85 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-surface-2/70 hover:text-foreground"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60">
                    <User className="h-4 w-4 text-foreground/75" />
                  </span>
                  Thông tin cá nhân
                </Link>

                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-surface-2/70 hover:text-foreground"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60">
                    <Ticket className="h-4 w-4 text-foreground/75" />
                  </span>
                  Vé của tôi
                </a>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-400 transition hover:bg-surface-2/70 hover:text-red-300"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60">
                    <LogOut className="h-4 w-4" />
                  </span>
                  Đăng xuất
                </button>
              </div>
            </details>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-foreground/80 transition hover:bg-surface-2/70 hover:text-foreground"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface/60">
                <UserRound className="h-4 w-4 text-foreground/70" />
              </span>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
