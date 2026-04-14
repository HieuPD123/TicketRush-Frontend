"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export type SearchBarProps = {
  placeholder?: string;
};

export default function SearchBar({ placeholder = "Search events" }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();

    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}#explore` : "/#explore");
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full bg-surface pl-11 pr-4 text-sm text-foreground placeholder:text-muted ring-1 ring-border outline-none transition focus:ring-2 focus:ring-primary/30"
      />
    </form>
  );
}
