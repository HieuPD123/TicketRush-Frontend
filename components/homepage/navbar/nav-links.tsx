"use client";

import Link from "next/link";

type NavLink = {
  label: string;
  href: string;
};

const links: NavLink[] = [
  { label: "Explore", href: "#explore" },
  { label: "Login/Signup", href: "#auth" },
  { label: "Language", href: "#language" },
];

export default function NavLinks() {
  return (
    <div className="flex items-center gap-1">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
