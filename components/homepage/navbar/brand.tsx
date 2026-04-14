"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

export default function Brand() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 rounded-full px-2 py-1"
      aria-label="TicketRush home"
    >
      <motion.span
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface ring-1 ring-border"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
        <Ticket className="relative h-5 w-5 text-primary" />
      </motion.span>

      <motion.span
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
        className="text-base font-semibold tracking-tight text-foreground"
      >
        TicketRush
      </motion.span>
    </Link>
  );
}
