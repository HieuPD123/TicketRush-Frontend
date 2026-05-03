"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Pencil, Ticket, User } from "lucide-react";

import { useDateOfBirthField } from "@/features/auth/hooks/use-date-of-birth-field";
import { useMyInfo } from "@/features/user/hooks/use-my-info";

const navItems = [
  {
    label: "Thông tin cá nhân",
    href: "/profile",
    icon: User,
    active: true,
  },
  {
    label: "Vé của tôi",
    href: "#",
    icon: Ticket,
    active: false,
  },
] as const;

export default function ProfileDashboard() {
  const { data: myInfo } = useMyInfo();
  const dateOfBirthField = useDateOfBirthField();
  const hasInitializedRef = useRef(false);

  const avatarSrc = myInfo?.avatarUrl || "/default-avatar.svg";

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"" | "MALE" | "FEMALE" | "OTHER">("");
  const [dobError, setDobError] = useState<string | null>(null);

  useEffect(() => {
    if (!myInfo) return;
    if (hasInitializedRef.current) return;

    setFullName(myInfo.fullName ?? "");
    setGender(myInfo.gender ?? "");
    dateOfBirthField.setFromIso(myInfo.dateOfBirth ?? "");

    hasInitializedRef.current = true;
  }, [dateOfBirthField, myInfo]);

  const joinedAtLabel = myInfo?.createdAt
    ? new Date(myInfo.createdAt).toLocaleDateString("vi-VN")
    : "--";

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:sticky lg:top-24 lg:h-[calc(100dvh-6rem)] lg:w-72">
        <div className="h-full rounded-[36px] border border-border bg-surface/55 p-3 backdrop-blur-xl">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const className = item.active
                ? "relative flex items-center gap-3 rounded-2xl border border-primary/25 bg-linear-to-r from-primary/20 to-secondary/10 px-4 py-3 text-sm font-semibold text-foreground"
                : "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground/75 transition hover:bg-surface-2/70 hover:text-foreground";

              const content = (
                <>
                  {item.active ? (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-linear-to-b from-primary to-secondary" />
                  ) : null}
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60">
                    <Icon className="h-4 w-4 text-foreground/75" />
                  </span>
                  <span className="min-w-0 truncate">{item.label}</span>
                </>
              );

              const inner = item.href === "#" ? (
                <a href={item.href} className={className}>
                  {content}
                </a>
              ) : (
                <Link href={item.href} className={className}>
                  {content}
                </Link>
              );

              return (
                <motion.div
                  key={item.label}
                  whileHover={item.active ? undefined : { scale: 1.01 }}
                  whileTap={item.active ? undefined : { scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  {inner}
                </motion.div>
              );
            })}
          </nav>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <div className="rounded-[36px] border border-border bg-surface/55 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">
          <header>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Thông tin cá nhân
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Quản lý thông tin tài khoản của bạn.
            </p>
          </header>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-linear-to-r from-primary/70 to-secondary/60 p-0.5">
                  <div className="h-full w-full overflow-hidden rounded-full border border-border bg-surface-2/70">
                    <img
                      src={avatarSrc}
                      alt="Ảnh đại diện"
                      className="h-full w-full rounded-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.src = "/default-avatar.svg";
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="cursor-pointer  absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/80 text-foreground/80 backdrop-blur-xl transition hover:bg-surface-2/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                  aria-label="Chỉnh sửa ảnh đại diện"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold">Ảnh đại diện</p>
                <p className="mt-1 text-xs text-muted">
                  Nhấn biểu tượng bút để thay đổi.
                </p>
                <p className="mt-2 text-xs text-muted">
                  Ngày tham gia: <span className="text-foreground/80">{joinedAtLabel}</span>
                </p>
              </div>
            </div>
          </div>

          <form
            className="mt-8"
            onSubmit={(event) => {
              event.preventDefault();

              const iso = dateOfBirthField.isoValue;
              const display = dateOfBirthField.displayValue.trim();

              if (display && !iso) {
                setDobError("Ngày sinh không hợp lệ. Vui lòng nhập theo dd/mm/yyyy.");
                return;
              }

              if (iso) {
                const todayIso = new Date().toISOString().slice(0, 10);
                if (iso > todayIso) {
                  setDobError("Ngày sinh không hợp lệ.");
                  return;
                }
              }

              setDobError(null);
            }}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold tracking-[0.18em] text-foreground/85">
                  HỌ VÀ TÊN
                </label>
                <input
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(event) => setFullName(event.currentTarget.value)}
                  className="h-11 w-full rounded-full border border-border bg-white/5 px-4 text-sm text-foreground/90 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-[0.18em] text-foreground/85">
                  EMAIL
                </label>
                <input
                  name="email"
                  type="email"
                  readOnly
                  placeholder="email@domain.com"
                  value={myInfo?.email ?? ""}
                  className="h-11 w-full cursor-not-allowed rounded-full border border-border bg-white/5 px-4 text-sm text-foreground/55 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                />
              </div>


              <div className="space-y-2">
                <label className="text-xs font-bold tracking-[0.18em] text-foreground/85">
                  NGÀY SINH
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="dd/mm/yyyy"
                    value={dateOfBirthField.displayValue}
                    onChange={(event) => {
                      setDobError(null);
                      dateOfBirthField.setFromDisplayInput(event.currentTarget.value);
                    }}
                    onBlur={() => {
                      const display = dateOfBirthField.displayValue.trim();
                      if (!display) {
                        setDobError(null);
                        return;
                      }
                      if (!dateOfBirthField.isoValue) {
                        setDobError("Ngày sinh không hợp lệ. Vui lòng nhập theo dd/mm/yyyy.");
                        return;
                      }

                      const todayIso = new Date().toISOString().slice(0, 10);
                      if (dateOfBirthField.isoValue > todayIso) {
                        setDobError("Ngày sinh không hợp lệ.");
                        return;
                      }

                      setDobError(null);
                    }}
                    className="h-11 w-full rounded-full border border-border bg-white/5 px-4 pr-11 text-sm text-foreground/90 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                  />
                  <input
                    ref={dateOfBirthField.pickerRef}
                    name="dateOfBirth"
                    type="date"
                    value={dateOfBirthField.isoValue}
                    onChange={(event) => {
                      setDobError(null);
                      dateOfBirthField.setFromIso(event.currentTarget.value);
                    }}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-0 w-0 opacity-0"
                  />
                  <button
                    type="button"
                    onClick={dateOfBirthField.openPicker}
                    className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-foreground/85 transition hover:bg-surface-2/70 hover:text-foreground"
                    aria-label="Chọn ngày sinh"
                  >
                    <CalendarDays className="h-4 w-4" />
                  </button>
                </div>
                {dobError ? (
                  <p className="text-xs font-medium text-red-400">{dobError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-[0.18em] text-foreground/85">
                  GIỚI TÍNH
                </label>
                <select
                  name="gender"
                  value={gender}
                  onChange={(event) => {
                    const next = event.currentTarget.value;
                    if (next === "MALE" || next === "FEMALE" || next === "OTHER") {
                      setGender(next);
                      return;
                    }
                    setGender("");
                  }}
                  className="h-11 w-full appearance-none rounded-full border border-border bg-white/5 px-4 text-sm text-foreground/90 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                >
                  <option value="" className="bg-surface">
                    Chọn giới tính
                  </option>
                  <option value="MALE" className="bg-surface">
                    Nam
                  </option>
                  <option value="FEMALE" className="bg-surface">
                    Nữ
                  </option>
                  <option value="OTHER" className="bg-surface">
                    Khác
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="cursor-pointer inline-flex h-11 items-center justify-center rounded-full bg-linear-to-r from-primary to-secondary px-6 text-sm font-semibold text-foreground shadow-lg shadow-black/20 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                Lưu thay đổi
              </motion.button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
