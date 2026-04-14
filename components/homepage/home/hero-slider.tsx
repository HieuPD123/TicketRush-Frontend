"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
};

const slides: Slide[] = [
  {
    id: "slide-1",
    title: "Trending Events, Electric Energy",
    subtitle: "Discover what’s selling out near you.",
    imageSrc: "/hero-1.svg",
  },
  {
    id: "slide-2",
    title: "Sell Faster With Seat Maps",
    subtitle: "A sleek buying experience in dark mode.",
    imageSrc: "/hero-2.svg",
  },
  {
    id: "slide-3",
    title: "Find Venues Near You",
    subtitle: "Search your city or zip and explore the map.",
    imageSrc: "/hero-3.svg",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const active = useMemo(() => slides[index]!, [index]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <section className="w-full border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="relative overflow-hidden rounded-3xl bg-surface ring-1 ring-border">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative h-105"
            >
              <Image
                src={active.imageSrc}
                alt=""
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/35 to-transparent" />

              <div className="relative flex h-full flex-col justify-end p-8 sm:p-12">
                <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                  Electric Emerald
                </div>
                <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                  {active.title}
                </h1>
                <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">
                  {active.subtitle}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <button
              type="button"
              onClick={prev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground ring-1 ring-border backdrop-blur transition hover:bg-surface"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground ring-1 ring-border backdrop-blur transition hover:bg-surface"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full ring-1 ring-border transition ${
                  i === index ? "bg-primary" : "bg-surface"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
