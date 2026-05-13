"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

import EventCard from "@/features/events/components/event-card";
import { TRENDING_EVENTS } from "@/features/events/mock-data";
import { useGetEventById } from "@/features/events/services/get-event-by-id";
import { formatIsoToDobDisplay } from "@/features/auth/utils/date-of-birth";
import { formatPriceVND } from "@/features/events/utils/format-price";

export default function EventDetailScreen({ eventId }: { eventId: string }) {
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isHoveringDetailZone, setIsHoveringDetailZone] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const showDetail = !isDesktop || !isHoveringImage || isHoveringDetailZone;
  
  const relatedEvents = TRENDING_EVENTS;
  const parsedId = Number.parseInt(eventId, 10);
  const { event, loading } = useGetEventById(parsedId);

  const heroImageSrc = event?.posterUrl ?? relatedEvents[Math.abs(parsedId) % Math.max(relatedEvents.length, 1)]?.imageSrc ?? "/events/event-1.svg";

  const EventMap = dynamic(() => import("./event-map"), { ssr: false });
  
  const formattedDate = event?.startTime 
    ? formatIsoToDobDisplay(new Date(event.startTime).toISOString().slice(0, 10))
    : "--";
  
  const minPrice = event?.zones && event.zones.length > 0
    ? Math.min(...event.zones.map(z => z.price))
    : undefined;

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2.25rem] border border-border bg-surface/30 shadow-[0_26px_120px_rgba(0,0,0,0.55)]"
          >
            <div
              className="relative aspect-video w-full overflow-hidden rounded-[2.25rem]"
              onMouseEnter={() => isDesktop && setIsHoveringImage(true)}
              onMouseLeave={() => isDesktop && setIsHoveringImage(false)}
            >
              <Image
                src={heroImageSrc}
                alt="Poster sự kiện"
                fill
                sizes="(max-width: 1024px) 100vw, 1280px"
                className="object-cover"
                priority
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-background/85 via-background/15 to-transparent"
              />
            </div>
          </motion.div>
          <motion.aside
            initial={{ opacity: 0, x: -14, y: 8 }}
            animate={{
              opacity: showDetail ? 1 : 0,
              y: showDetail ? 0 : 12,
              scale: showDetail ? 1 : 0.98,
            }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="
              mt-6 max-w-xl rounded-3xl
              border border-border bg-surface/55 p-6
              shadow-[0_20px_80px_rgba(0,0,0,0.40)]
              backdrop-blur-xl
              lg:absolute lg:bottom-10 lg:left-10
            "
            onMouseEnter={() => setIsHoveringDetailZone(true)}
            onMouseLeave={() => setIsHoveringDetailZone(false)}
            onFocusCapture={() => setIsHoveringDetailZone(true)}
            onBlurCapture={() => setIsHoveringDetailZone(false)}
            onTouchStart={() => setIsHoveringDetailZone(true)}
          >
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {loading ? "Đang tải..." : event?.title ?? "Sự kiện"}
            </h1>

            <div className="mt-4 space-y-2 text-sm text-foreground/75">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary/85" />
                <span>{event ? `${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "--"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/85" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/85" />
                <span className="leading-relaxed">{event?.venue ?? 'Địa điểm chưa xác định'}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-foreground/85">
                {minPrice !== undefined ? `Giá vé từ ${formatPriceVND(minPrice)}` : 'Giá vé'}
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-linear-to-r from-primary to-secondary text-sm font-bold text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.06)] outline-none transition focus:ring-4 focus:ring-primary/20"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.06), 0 22px 70px color-mix(in srgb, var(--primary) 20%, transparent)",
                }}
              >
                Mua vé ngay
              </motion.button>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-surface/45 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <h2 className="text-2xl font-extrabold tracking-tight">Giới thiệu</h2>

          <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/75">
            <p className="whitespace-pre-wrap">{event?.description ?? "Không có phần mô tả cho sự kiện này."}</p>
          </div>
        </div>

        {/* Separate map container with its own border */}
        <div className="mt-6 rounded-3xl border border-border bg-surface/45 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
          <h3 className="text-lg font-semibold">Địa điểm</h3>
          {event?.latitude && event?.longitude ? (
            <div className="mt-4 h-96 w-full overflow-hidden rounded-2xl">
              <EventMap lat={event.latitude} lng={event.longitude} title={event.title} />
            </div>
          ) : (
            <div className="mt-4 text-sm text-foreground/60">Địa điểm chưa có tọa độ.</div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Có thể bạn cũng thích
            </h2>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {relatedEvents.map((event, index) => (
            <motion.div
              key={event.title}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="overflow-hidden rounded-3xl"
            >
              <EventCard data={event} href={`/events/${index + 1}`} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
