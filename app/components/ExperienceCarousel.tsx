"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export interface ExperienceItem {
  id: string | number;
  title: string;
  description: string;
  image: string;
  badge: string;
  price?: string | null;
  link: string;
  isExternal?: boolean;
}

interface ExperienceCarouselProps {
  items: ExperienceItem[];
  lang: string;
}

export default function ExperienceCarousel({
  items,
  lang,
}: ExperienceCarouselProps) {
  const isId = lang === "id";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 360;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Navigation Arrow Buttons */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-16 right-0 z-10">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 bg-white text-charcoal shadow-sm transition-all hover:bg-charcoal hover:text-white disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 bg-white text-charcoal shadow-sm transition-all hover:bg-charcoal hover:text-white disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Swipeable Horizontal Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 -mx-4 sm:mx-0 sm:px-0 no-scrollbar touch-pan-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between w-[280px] sm:w-[330px] md:w-[350px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white border border-charcoal/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-60 w-full overflow-hidden bg-charcoal/10">
              <Image
                src={item.image || "/images/hero.webp"}
                alt={item.title}
                fill
                unoptimized={Boolean(item.image?.startsWith("data:"))}
                sizes="(max-width: 768px) 280px, 350px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 rounded-full bg-sand-gold/90 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-charcoal backdrop-blur-md shadow-sm">
                {item.badge}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="font-heading text-xl font-medium text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70 line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 border-t border-charcoal/10 pt-4">
                {item.price && (
                  <p className="font-heading text-lg font-semibold text-charcoal mb-3">
                    {item.price}
                  </p>
                )}
                <a
                  href={item.link}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-sand-gold"
                >
                  <span>
                    {item.isExternal
                      ? isId
                        ? "Pesan via Terra"
                        : "Book via Terra"
                      : isId
                      ? "Detail Aktivitas"
                      : "Activity Details"}
                  </span>
                  {item.isExternal && (
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Swipe Hint for Mobile */}
      <div className="mt-4 flex sm:hidden items-center justify-center gap-1.5 text-xs text-charcoal/50 font-sans">
        <span>← Geser untuk melihat lainnya →</span>
      </div>
    </div>
  );
}
