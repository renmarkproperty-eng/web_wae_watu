"use client";

import { useState } from "react";
import Image from "next/image";
import type { TerraGalleryItem } from "@/lib/terra";

interface TerraGalleryViewerProps {
  mosaic: string[];
  items: TerraGalleryItem[];
  lang: string;
  bookingUrl: string;
}

export default function TerraGalleryViewer({
  mosaic,
  items,
  lang,
  bookingUrl,
}: TerraGalleryViewerProps) {
  const isId = lang === "id";
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { key: "ALL", label: isId ? "Semua Foto" : "All Photos" },
    { key: "Resort & Landscape", label: isId ? "Resor & Lanskap" : "Resort & Landscape" },
    { key: "Rooms & Suites", label: isId ? "Kamar & Suite" : "Rooms & Suites" },
  ];

  const filteredItems =
    selectedCategory === "ALL"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <div className="space-y-16">
      {/* 1. TERRA PRIME SIGNATURE MOSAIC (from Availability / Detail Page) */}
      {mosaic.length >= 4 && (
        <section className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sand-gold">
              Terra Prime Official Gallery Showcase
            </span>
            <span className="font-sans text-xs text-charcoal/50">
              {mosaic.length} {isId ? "Foto Utama" : "Featured Views"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[420px] sm:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-charcoal/10 bg-charcoal/5">
            {/* Left Big Hero Image */}
            <div
              onClick={() => {
                const idx = items.findIndex((it) => it.url === mosaic[0]);
                openLightbox(idx >= 0 ? idx : 0);
              }}
              className="relative h-full w-full cursor-pointer overflow-hidden group"
            >
              <Image
                src={mosaic[0]}
                alt="Wae Watu Signature View"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-heading text-lg font-medium">
                  {isId ? "Bungalow Atas Air Saat Senja" : "Overwater Bungalows at Twilight"}
                </span>
              </div>
            </div>

            {/* Right 3/4 Images Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
              {mosaic.slice(1, 4).map((url, i) => {
                const isBottomSpan = i === 2;
                return (
                  <div
                    key={url + i}
                    onClick={() => {
                      const idx = items.findIndex((it) => it.url === url);
                      openLightbox(idx >= 0 ? idx : 0);
                    }}
                    className={`relative cursor-pointer overflow-hidden group ${
                      isBottomSpan ? "col-span-2 row-span-1" : "col-span-1 row-span-1"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Wae Watu Feature View ${i + 2}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <svg
                        className="h-8 w-8 text-white drop-shadow"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 2. FILTER TABS & COLLECTION */}
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-charcoal/10 pb-6 mb-8">
          <div>
            <h2 className="font-heading text-3xl font-medium text-charcoal">
              {isId ? "Koleksi Lengkap Resort" : "Full Resort Collection"}
            </h2>
            <p className="mt-1 font-sans text-xs text-charcoal/60">
              {isId
                ? "Menampilkan foto resmi resort dan interior kamar dari Terra Prime"
                : "Official resort panoramas and suite interior galleries from Terra Prime"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-full px-4 py-2 font-sans text-xs font-semibold tracking-wider transition-colors uppercase ${
                  selectedCategory === cat.key
                    ? "bg-charcoal text-white"
                    : "bg-white text-charcoal/70 border border-charcoal/15 hover:border-sand-gold hover:text-charcoal"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.url + idx}
              onClick={() => openLightbox(idx)}
              className="group relative h-72 sm:h-80 w-full cursor-pointer overflow-hidden rounded-2xl bg-charcoal/10 shadow-sm border border-charcoal/10"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 text-white">
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-sand-gold">
                  {item.category}
                </span>
                <p className="mt-1 font-heading text-lg font-medium leading-snug">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BOOKING CALL TO ACTION */}
        <div className="mt-16 rounded-2xl bg-white border border-charcoal/10 p-8 sm:p-10 text-center flex flex-col items-center justify-center shadow-sm">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
            TERRA PRIME RESERVATION
          </p>
          <h3 className="mt-2 font-heading text-2xl sm:text-3xl font-medium text-charcoal max-w-xl">
            {isId
              ? "Siap Menikmati Kemewahan Alami di Wae Watu?"
              : "Ready to Experience Barefoot Luxury at Wae Watu?"}
          </h3>
          <p className="mt-3 font-sans text-sm text-charcoal/65 max-w-md">
            {isId
              ? "Cek ketersediaan kamar secara live dan lakukan reservasi langsung di sistem resmi Terra Prime."
              : "Check live room availability and secure your reservation directly on Terra Prime."}
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-charcoal px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-sand-gold"
          >
            <span>{isId ? "Pesan Kamar di Terra Prime" : "Book Room on Terra Prime"}</span>
            <svg
              className="h-4 w-4"
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
          </a>
        </div>
      </section>

      {/* 3. FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Tutup"
            className="absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Sebelumnya"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Selanjutnya"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            ›
          </button>

          <div
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[65vh] w-[85vw] max-w-4xl">
              <Image
                src={filteredItems[lightboxIndex].url}
                alt={filteredItems[lightboxIndex].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-sand-gold">
                {filteredItems[lightboxIndex].category}
              </span>
              <p className="mt-1 font-heading text-xl font-medium">
                {filteredItems[lightboxIndex].title}
              </p>
              <p className="font-sans text-xs text-white/50 mt-1">
                {lightboxIndex + 1} / {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
