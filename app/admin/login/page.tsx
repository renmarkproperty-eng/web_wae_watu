"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "Username atau password salah");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background Resort Image */}
      <Image
        src="/images/hero.webp"
        alt="Wae Watu Reef Resort"
        fill
        priority
        className="object-cover scale-105 filter blur-[2px]"
      />

      {/* Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" />

      {/* Ambient Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sand-gold/15 rounded-full blur-3xl pointer-events-none" />

      {/* Luxury Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#141414]/85 backdrop-blur-xl p-8 sm:p-10 border border-white/15 shadow-2xl">
        {/* Header with Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105 duration-300">
            <Image
              src="/images/logo.webp"
              alt="Wae Watu Reef Resort"
              width={140}
              height={100}
              className="h-14 w-auto mx-auto object-contain brightness-0 invert"
            />
          </Link>
          <h1 className="mt-4 font-heading text-2xl sm:text-3xl font-medium tracking-wide text-white">
            Wae Watu CMS
          </h1>
          <p className="mt-1 font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
            Portal Pengelola Website
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-6 flex items-center gap-2.5 rounded-xl bg-red-900/30 border border-red-500/40 p-3.5 text-xs text-red-200">
            <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-7 space-y-4">
          <div>
            <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/30 focus:border-sand-gold focus:bg-white/10 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-11 font-sans text-sm text-white placeholder-white/30 focus:border-sand-gold focus:bg-white/10 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sand-gold py-3.5 px-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-charcoal shadow-lg transition-all hover:bg-white hover:shadow-xl active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Panel Admin</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back Link */}
        <div className="mt-8 border-t border-white/10 pt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-sans text-xs text-white/60 transition-colors hover:text-sand-gold"
          >
            <span>←</span>
            <span>Kembali ke Website Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
