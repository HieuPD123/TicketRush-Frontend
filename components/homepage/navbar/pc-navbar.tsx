"use client";

import Brand from "./brand";
import SearchBar from "./search-bar";
import NavLinks from "./nav-links";
import BookNowButton from "./book-now-button";

export default function PCNavbar() {
  return (
    <div className="hidden w-full items-center gap-4 md:flex">
      <Brand />

      <div className="flex-1 px-2">
        <SearchBar />
      </div>

      <NavLinks />
      <BookNowButton />
    </div>
  );
}
