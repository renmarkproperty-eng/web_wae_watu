"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-charcoal/10 sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-charcoal text-white shadow-md">
            <Image
              src="/images/logo.webp"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain invert brightness-0"
            />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-medium text-charcoal">
            Wae Watu CMS
          </h1>
          <p className="mt-2 font-sans text-xs uppercase tracking-widest text-charcoal/60">
            Login Pengelola Website
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-3.5 text-center text-xs font-medium text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full rounded-xl border border-charcoal/20 px-4 py-3 font-sans text-sm text-charcoal focus:border-sand-gold focus:outline-none focus:ring-1 focus:ring-sand-gold"
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-charcoal/20 px-4 py-3 font-sans text-sm text-charcoal focus:border-sand-gold focus:outline-none focus:ring-1 focus:ring-sand-gold"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-charcoal px-4 py-3.5 font-sans text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-sand-gold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk ke Panel Admin"}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-charcoal/10 pt-4 text-center">
          <p className="font-sans text-[11px] text-charcoal/50">
            Default: <span className="font-mono text-charcoal/80">admin</span> / <span className="font-mono text-charcoal/80">waewatu2026!</span>
          </p>
          <Link
            href="/"
            className="mt-3 inline-block font-sans text-xs text-sand-gold underline hover:text-charcoal"
          >
            ← Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  );
}
