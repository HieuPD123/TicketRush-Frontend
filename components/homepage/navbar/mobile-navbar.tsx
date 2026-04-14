"use client";

import Brand from "./brand";
import BookNowButton from "./book-now-button";
import NavLinks from "./nav-links";
import SearchBar from "./search-bar";

export default function MobileNavbar() {
  return (
    <div className="flex w-full flex-col gap-3 md:hidden">
      <div className="flex items-center justify-between">
        <Brand />
        <BookNowButton />
      </div>
      <SearchBar placeholder="Find an event" />
      <NavLinks />
    </div>
  );
}
