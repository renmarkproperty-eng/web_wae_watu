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
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-white text-black transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-24 items-center justify-end px-5">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="p-2 text-black/60 transition-colors hover:text-black"
          >
            <span className="relative block h-6 w-6">
              <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-3 px-10 pt-6">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-heading text-3xl tracking-wide text-black/80 transition-colors hover:text-sand-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
