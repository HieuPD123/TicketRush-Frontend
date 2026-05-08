"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_25%,rgba(124,58,237,0.22)_0%,rgba(14,14,21,0)_62%)]"
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-14 text-center sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl"
        >
          <span className="text-foreground">Đừng Bỏ Lỡ Điều</span>{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mọi Người Đang Nói Đến
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-muted sm:text-base"
        >
          ...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
          className="mt-9 flex items-center justify-center gap-3"
        >
          <a
            href="#trending"
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 text-sm font-semibold text-white shadow-[0_0_26px_rgba(124,58,237,0.30)] transition hover:scale-[1.02] hover:shadow-[0_0_38px_rgba(124,58,237,0.40)] active:scale-[0.99]"
          >
            Mua Vé Ngay
          </a>
          <a
            href="#"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-surface/40 px-6 text-sm font-semibold text-foreground/90 backdrop-blur-xl transition hover:bg-surface/60 hover:scale-[1.02] active:scale-[0.99]"
          >
            Khám phá
          </a>
        </motion.div>
      </div>
    </section>
  );
}
