"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "../[lang]/dictionaries";

type NavLabels = {
  home: string;
  rooms: string;
  facilities: string;
  experiences: string;
  gallery: string;
  about?: string;
  contact?: string;
};

export default function Navbar({
  lang,
  nav,
}: {
  lang: Locale;
  nav: NavLabels;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const menu = [
    { label: nav.home, href: `/${lang}` },
    { label: nav.rooms, href: `/${lang}/kamar` },
    { label: nav.facilities, href: `/${lang}/fasilitas` },
    { label: nav.experiences, href: `/${lang}/pengalaman` },
    { label: nav.gallery, href: `/${lang}/galeri` },
    { label: nav.about, href: `/${lang}/tentang` },
    { label: nav.contact, href: `/${lang}/kontak` },
  ];

  const pathForLocale = (target: Locale) => {
    const rest = pathname.replace(/^\/(id|en)/, "");
    return `/${target}${rest || ""}` || `/${target}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const top =
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setScrolled(top > 15);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isHome =
    pathname === `/${lang}` ||
    pathname === `/${lang}/` ||
    pathname === "/" ||
    pathname === "";

  const isLightNav = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isLightNav
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-charcoal/10"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        }`}
      >
        <nav className="relative mx-auto flex h-20 sm:h-24 max-w-6xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={`group flex flex-col gap-[5px] p-2 transition-colors duration-300 ${
              isLightNav ? "text-charcoal" : "text-white"
            }`}
          >
            <span className="h-0.5 w-7 bg-current transition-all" />
            <span className="h-0.5 w-7 bg-current transition-all" />
            <span className="h-0.5 w-7 bg-current transition-all" />
          </button>

          <Link
            href={`/${lang}`}
            aria-label="Wae Watu Reef Resort"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-1"
          >
            <Image
              src="/images/logo.webp"
              alt="Wae Watu Reef Resort"
              width={160}
              height={114}
              priority
              className={`h-12 sm:h-15 w-auto object-contain transition-all duration-300 ${
                isLightNav ? "" : "brightness-0 invert"
              }`}
            />
          </Link>

          <div
            className={`ml-auto flex items-center gap-2 font-sans text-sm transition-colors duration-300 ${
              isLightNav ? "text-charcoal" : "text-white"
            }`}
          >
            <Link
              href={pathForLocale("id")}
              aria-current={lang === "id"}
              className={`px-1.5 py-0.5 transition-opacity ${
                lang === "id" ? "font-bold text-sand-gold" : "opacity-70 hover:opacity-100"
              }`}
            >
              ID
            </Link>
            <span className="opacity-40">|</span>
            <Link
              href={pathForLocale("en")}
              aria-current={lang === "en"}
              className={`px-1.5 py-0.5 transition-opacity ${
                lang === "en" ? "font-bold text-sand-gold" : "opacity-70 hover:opacity-100"
              }`}
            >
              EN
            </Link>
          </div>
        </nav>
      </header>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-[340px] sm:max-w-md flex-col justify-between bg-[#131313] text-white shadow-2xl border-r border-white/10 transition-transform duration-500 ease-out overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-7 py-6">
          <Link
            href={`/${lang}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <Image
              src="/images/logo.webp"
              alt="Wae Watu Reef Resort"
              width={120}
              height={85}
              className="h-9 w-auto object-contain brightness-0 invert"
            />
            <div className="flex flex-col">
              <span className="font-heading text-sm uppercase tracking-[0.2em] text-white font-medium">
                Wae Watu
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-sand-gold font-semibold">
                Reef Resort
              </span>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-sand-gold hover:text-sand-gold hover:rotate-90 duration-300"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-1 flex-col justify-center px-7 py-8 space-y-1">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-sand-gold/70 font-semibold mb-3">
            {lang === "id" ? "NAVIGASI UTAMA" : "MAIN NAVIGATION"}
          </p>
          {menu.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${lang}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between py-2.5 transition-all ${
                  isActive ? "text-sand-gold" : "text-white/80 hover:text-white"
                }`}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={`font-mono text-xs transition-colors ${
                      isActive
                        ? "text-sand-gold font-bold"
                        : "text-sand-gold/50 group-hover:text-sand-gold"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span className="font-heading text-2xl sm:text-3xl tracking-wide transition-transform duration-300 group-hover:translate-x-2">
                    {item.label}
                  </span>
                </div>
                <span
                  className={`text-sm transition-all duration-300 ${
                    isActive
                      ? "opacity-100 text-sand-gold translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-sand-gold"
                  }`}
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        {/* CTA & Quick Actions */}
        <div className="border-t border-white/10 p-7 bg-white/[0.02] space-y-4">
          <a
            href="https://terraprime.id/detail/hotel/wae-watu-hotel-resort"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sand-gold py-3.5 px-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-charcoal shadow-md transition-all hover:bg-white hover:shadow-lg"
          >
            <span>{lang === "id" ? "Reservasi Villa" : "Book Your Stay"}</span>
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>

          <a
            href="https://wa.me/6282197102971?text=Halo%20Wae%20Watu%20Reef%20Resort,%20saya%20ingin%20bertanya%20tentang%20reservasi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 px-4 font-sans text-xs font-medium uppercase tracking-wider text-white/80 transition-colors hover:border-sand-gold hover:text-sand-gold hover:bg-white/10"
          >
            <svg
              className="h-4 w-4 text-emerald-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.53 1.769.813 2.796.813h.005c3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.769-5.768zm0 10.375c-.947 0-1.874-.255-2.679-.738l-.192-.114-1.988.521.53-1.937-.126-.2c-.529-.842-.808-1.815-.807-2.812.001-2.738 2.228-4.965 4.968-4.965 1.325.001 2.571.517 3.508 1.454.937.938 1.453 2.184 1.453 3.51-.001 2.738-2.229 4.965-4.969 4.965z" />
            </svg>
            <span>{lang === "id" ? "WhatsApp Concierge" : "Chat Concierge"}</span>
          </a>

          {/* Location & Social */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-white/40 font-sans">
            <span>Labuan Bajo · Flores</span>
            <a
              href="https://instagram.com/waewaturesort"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sand-gold transition-colors"
            >
              @waewaturesort
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
