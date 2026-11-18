"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getTerraBookingUrl } from "@/lib/terra";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "id" | "en";
  propertySlug?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  lang = "id",
  propertySlug = "wae-watu-hotel-resort",
}: BookingModalProps) {
  const isId = lang === "id";

  const getTodayStr = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const getTomorrowStr = (baseDateStr?: string) => {
    const base = baseDateStr ? new Date(baseDateStr) : new Date();
    const t = new Date(base.getTime() + 24 * 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  };

  const [checkIn, setCheckIn] = useState(getTodayStr());
  const [checkOut, setCheckOut] = useState(getTomorrowStr());
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Convert YYYY-MM-DD to DD-MM-YYYY
  const toDDMMYYYY = (isoDate: string) => {
    const [y, m, d] = isoDate.split("-");
    return `${d}-${m}-${y}`;
  };

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    if (new Date(val) >= new Date(checkOut)) {
      setCheckOut(getTomorrowStr(val));
    }
  };

  const handleProceed = () => {
    const url = getTerraBookingUrl(propertySlug, {
      checkIn: toDDMMYYYY(checkIn),
      checkOut: toDDMMYYYY(checkOut),
      rooms: 1,
      adults: Math.max(1, adults),
      children,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  // Calculate nights
  const dIn = new Date(checkIn);
  const dOut = new Date(checkOut);
  const diffTime = Math.max(1, Math.round((dOut.getTime() - dIn.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-[#141414] border border-white/15 text-white shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.webp"
              alt="Wae Watu Logo"
              width={40}
              height={40}
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-sand-gold">
                Wae Watu · Terra Prime
              </p>
              <h3 className="font-heading text-lg font-medium tracking-wide">
                {isId ? "Pilih Tanggal Menginap" : "Plan Your Stay"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-sand-gold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-sand-gold font-semibold mb-2">
                {isId ? "Tanggal Check-In" : "Check-In Date"}
              </label>
              <input
                type="date"
                value={checkIn}
                min={getTodayStr()}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-sans text-sm text-white focus:border-sand-gold focus:bg-white/10 focus:outline-none transition-all cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-sand-gold font-semibold mb-2">
                {isId ? "Tanggal Check-Out" : "Check-Out Date"}
              </label>
              <input
                type="date"
                value={checkOut}
                min={getTomorrowStr(checkIn)}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-sans text-sm text-white focus:border-sand-gold focus:bg-white/10 focus:outline-none transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Guests & Rooms Counter Grid */}
          <div className="grid grid-cols-3 gap-3 border-t border-b border-white/10 py-5">
            {/* Rooms */}
            <div className="text-center">
              <span className="block font-sans text-[11px] text-white/60 mb-2">
                {isId ? "Kamar" : "Rooms"}
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-heading text-lg font-bold text-sand-gold">1 Villa</span>
              </div>
              <span className="block text-[9px] text-white/40 mt-1">
                {isId ? "1 unit per booking" : "1 unit per order"}
              </span>
            </div>

            {/* Adults */}
            <div className="text-center">
              <span className="block font-sans text-[11px] text-white/60 mb-2">
                {isId ? "Dewasa" : "Adults"}
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdults((a) => Math.max(1, a - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-sm hover:border-sand-gold transition-colors"
                >
                  -
                </button>
                <span className="font-heading text-lg font-bold w-6">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults((a) => Math.min(10, a + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-sm hover:border-sand-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="text-center">
              <span className="block font-sans text-[11px] text-white/60 mb-2">
                {isId ? "Anak" : "Children"}
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setChildren((c) => Math.max(0, c - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-sm hover:border-sand-gold transition-colors"
                >
                  -
                </button>
                <span className="font-heading text-lg font-bold w-6">{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren((c) => Math.min(10, c + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-sm hover:border-sand-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Stay Summary */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-center font-sans text-xs text-white/80">
            <span>
              {diffTime} {isId ? "Malam" : "Night(s)"} · {rooms} {isId ? "Kamar" : "Room(s)"} · {adults} {isId ? "Dewasa" : "Adult(s)"} {children > 0 ? `· ${children} ${isId ? "Anak" : "Child"}` : ""}
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleProceed}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sand-gold py-4 px-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-charcoal shadow-lg hover:bg-white transition-all duration-300"
          >
            <span>{isId ? "Lanjut ke Terra Prime" : "Check Rates on Terra Prime"}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <p className="text-center font-sans text-[11px] text-white/40">
            {isId
              ? "Anda akan diarahkan langsung ke halaman Wae Watu di Terra Prime sesuai tanggal yang dipilih."
              : "You will be directed to Wae Watu official booking page on Terra Prime with your selected dates."}
          </p>
        </div>
      </div>
    </div>
  );
}
