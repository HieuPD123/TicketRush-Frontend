"use client";

import Link from "next/link";

export default function BookNowButton() {
  return (
    <Link
      href="#book"
      className="relative inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
    >
      <span className="absolute inset-0 rounded-full bg-linear-to-r from-primary to-secondary" />
      <span className="absolute inset-0 rounded-full bg-primary/25 blur-xl opacity-70 transition-opacity hover:opacity-100" />
      <span className="absolute inset-0 rounded-full ring-1 ring-border" />
      <span className="relative">Book Now</span>
    </Link>
  );
}
