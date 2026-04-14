"use client";

import PCNavbar from "./pc-navbar";
import MobileNavbar from "./mobile-navbar";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <PCNavbar />
        <MobileNavbar />
      </div>
    </header>
  );
}