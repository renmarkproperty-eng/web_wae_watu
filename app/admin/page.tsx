"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { CMSContent } from "@/lib/cms";

function ImageField({
  label,
  value,
  fieldId,
  uploadingField,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  fieldId: string;
  uploadingField: string | null;
  onChange: (val: string) => void;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
    fieldId: string,
  ) => void;
}) {
  const isUploading = uploadingField === fieldId;

  return (
    <div>
      <label className="block text-xs font-semibold text-charcoal/70 mb-1">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {value ? (
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-charcoal/15 bg-charcoal/5 shadow-sm">
            <Image
              src={value}
              alt="Preview"
              fill
              unoptimized={
                typeof value === "string" && value.startsWith("data:")
              }
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-charcoal/20 bg-charcoal/5 text-[10px] text-charcoal/40 font-sans">
            No Image
          </div>
        )}

        <div className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/images/foto.webp atau data:image/..."
              className="w-full rounded-lg border border-charcoal/20 px-3 py-2 text-xs text-charcoal focus:border-sand-gold focus:outline-none truncate"
            />
            {typeof value === "string" && value.startsWith("data:") && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-sand-gold/20 px-1.5 py-0.5 text-[9px] font-bold text-charcoal uppercase pointer-events-none">
                Base64 DB
              </span>
            )}
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-charcoal px-3 py-2 text-xs font-semibold text-white hover:bg-sand-gold transition-colors shrink-0 shadow-sm">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => onUpload(e, (url) => onChange(url), fieldId)}
            />
            {isUploading ? "Memproses..." : "📁 Upload Foto"}
          </label>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "hero"
    | "about"
    | "facilities"
    | "experiences"
    | "gallery"
    | "contact"
    | "account"
  >("hero");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const res = await fetch("/api/admin/content");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        if (!ignore) {
          setContent(data);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setNotification({ type: "error", text: "Gagal memuat data konten" });
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [router]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
    fieldId: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldId);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onSuccess(data.url);
        showNotification(
          "success",
          "Foto berhasil diproses ke Base64 (BLOB DB)!",
        );
      } else {
        showNotification("error", data.message || "Gagal memproses foto");
      }
    } catch {
      showNotification("error", "Koneksi upload gagal");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        showNotification("success", "Perubahan berhasil disimpan!");
      } else {
        showNotification(
          "error",
          result.message || "Gagal menyimpan perubahan",
        );
      }
    } catch {
      showNotification("error", "Koneksi ke server gagal");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC]">
        <div className="text-center font-sans text-sm text-charcoal/70">
          Memuat Panel Admin...
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="min-h-screen bg-[#F7F3EC] pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-charcoal/10 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal p-1.5 shadow-sm">
              <Image
                src="/images/logo.webp"
                alt="Wae Watu Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain invert brightness-0"
              />
            </div>
            <div>
              <h1 className="font-heading text-xl font-medium text-charcoal">
                Wae Watu CMS
              </h1>
              <p className="font-sans text-[11px] text-charcoal/60">
                Pengelola Konten Website
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-sand-gold px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-opacity-90 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-charcoal/20 px-4 py-2 font-sans text-xs text-charcoal/70 hover:bg-charcoal/5"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50">
          <div
            className={`rounded-xl px-5 py-3 font-sans text-xs font-medium shadow-lg border ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {notification.text}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-6 pt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-charcoal/10 pb-4">
          {[
            { id: "hero", label: "Beranda & Hero" },
            { id: "about", label: "Tentang Kami" },
            { id: "facilities", label: "Fasilitas" },
            { id: "experiences", label: "Experience" },
            { id: "contact", label: "Kontak & Peta" },
            { id: "account", label: "Password Admin" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-charcoal text-white shadow-sm"
                  : "bg-white text-charcoal/70 hover:bg-charcoal/5 border border-charcoal/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-charcoal/10">
          {/* TAB 1: HERO */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <h2 className="font-heading text-2xl font-medium text-charcoal">
                Tampilan Hero Beranda
              </h2>
              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Eyebrow / Sub-tagline Atas
                </label>
                <input
                  type="text"
                  value={content.hero.eyebrow}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, eyebrow: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Judul Utama (Title)
                </label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Deskripsi Singkat (Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sand-gold focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <h2 className="font-heading text-2xl font-medium text-charcoal">
                Halaman Tentang Kami
              </h2>
              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Judul Bagian
                </label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Sub-judul
                </label>
                <input
                  type="text"
                  value={content.about.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, subtitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Cerita Lengkap Resort
                </label>
                <textarea
                  rows={6}
                  value={content.about.story}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, story: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sand-gold focus:outline-none"
                />
              </div>

              <div className="border-t border-charcoal/10 pt-6">
                <h3 className="font-heading text-xl font-medium text-charcoal mb-4">
                  Data Konservasi Karang
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-charcoal/70 mb-1">
                      Judul Konservasi
                    </label>
                    <input
                      type="text"
                      value={content.about.conservation.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: {
                            ...content.about,
                            conservation: {
                              ...content.about.conservation,
                              title: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full rounded-xl border border-charcoal/20 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-charcoal/70 mb-1">
                      Deskripsi Konservasi
                    </label>
                    <textarea
                      rows={2}
                      value={content.about.conservation.description}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: {
                            ...content.about,
                            conservation: {
                              ...content.about.conservation,
                              description: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full rounded-xl border border-charcoal/20 px-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FACILITIES */}
          {activeTab === "facilities" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-medium text-charcoal">
                  Daftar Fasilitas Resort
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newId = `facility-${Date.now()}`;
                    setContent({
                      ...content,
                      facilities: [
                        ...content.facilities,
                        {
                          id: newId,
                          title: "Fasilitas Baru",
                          category: "Umum",
                          description: "Deskripsi fasilitas...",
                          image: "/images/section_1.webp",
                        },
                      ],
                    });
                  }}
                  className="rounded-xl bg-charcoal px-3.5 py-1.5 font-sans text-xs font-semibold text-white hover:bg-sand-gold"
                >
                  + Tambah Fasilitas
                </button>
              </div>

              <div className="grid gap-6">
                {content.facilities.map((fac, idx) => (
                  <div
                    key={fac.id || idx}
                    className="rounded-xl border border-charcoal/15 p-5 bg-cream/30 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-xs font-bold text-sand-gold uppercase">
                        Fasilitas #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.facilities.filter(
                            (_, i) => i !== idx,
                          );
                          setContent({ ...content, facilities: updated });
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                          Nama Fasilitas
                        </label>
                        <input
                          type="text"
                          value={fac.title}
                          onChange={(e) => {
                            const updated = [...content.facilities];
                            updated[idx].title = e.target.value;
                            setContent({ ...content, facilities: updated });
                          }}
                          className="w-full rounded-lg border border-charcoal/20 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                          Kategori
                        </label>
                        <input
                          type="text"
                          value={fac.category}
                          onChange={(e) => {
                            const updated = [...content.facilities];
                            updated[idx].category = e.target.value;
                            setContent({ ...content, facilities: updated });
                          }}
                          className="w-full rounded-lg border border-charcoal/20 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <ImageField
                      label="Foto Fasilitas"
                      value={fac.image}
                      fieldId={`facility-${idx}`}
                      uploadingField={uploadingField}
                      onChange={(val) => {
                        const updated = [...content.facilities];
                        updated[idx].image = val;
                        setContent({ ...content, facilities: updated });
                      }}
                      onUpload={handleFileUpload}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        rows={2}
                        value={fac.description}
                        onChange={(e) => {
                          const updated = [...content.facilities];
                          updated[idx].description = e.target.value;
                          setContent({ ...content, facilities: updated });
                        }}
                        className="w-full rounded-lg border border-charcoal/20 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCES */}
          {activeTab === "experiences" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-medium text-charcoal">
                  Experiences
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newId = `exp-${Date.now()}`;
                    setContent({
                      ...content,
                      experiences: [
                        ...content.experiences,
                        {
                          id: newId,
                          title: "Paket Wisata Baru",
                          duration: "Setengah Hari",
                          description: "Deskripsi aktivitas...",
                          image: "/images/hero.webp",
                          price: "",
                        },
                      ],
                    });
                  }}
                  className="rounded-xl bg-charcoal px-3.5 py-1.5 font-sans text-xs font-semibold text-white hover:bg-sand-gold"
                >
                  + Tambah Pengalaman
                </button>
              </div>

              <div className="grid gap-6">
                {content.experiences.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="rounded-xl border border-charcoal/15 p-5 bg-cream/30 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-xs font-bold text-sand-gold uppercase">
                        Paket #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.experiences.filter(
                            (_, i) => i !== idx,
                          );
                          setContent({ ...content, experiences: updated });
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                          Nama Paket
                        </label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...content.experiences];
                            updated[idx].title = e.target.value;
                            setContent({ ...content, experiences: updated });
                          }}
                          className="w-full rounded-lg border border-charcoal/20 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                          Durasi
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const updated = [...content.experiences];
                            updated[idx].duration = e.target.value;
                            setContent({ ...content, experiences: updated });
                          }}
                          className="w-full rounded-lg border border-charcoal/20 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                          Estimasi Biaya / Harga (Opsional)
                        </label>
                        <input
                          type="text"
                          value={exp.price}
                          placeholder="Mulai Rp 2.500.000 / orang (kosongkan jika tidak ada)"
                          onChange={(e) => {
                            const updated = [...content.experiences];
                            updated[idx].price = e.target.value;
                            setContent({ ...content, experiences: updated });
                          }}
                          className="w-full rounded-lg border border-charcoal/20 px-3 py-2 text-sm"
                        />
                        <p className="mt-1 text-[11px] text-charcoal/50">
                          Jika dikosongkan, harga tidak akan ditampilkan di
                          halaman publik.
                        </p>
                      </div>

                      <ImageField
                        label="Foto Paket Wisata"
                        value={exp.image}
                        fieldId={`experience-${idx}`}
                        uploadingField={uploadingField}
                        onChange={(val) => {
                          const updated = [...content.experiences];
                          updated[idx].image = val;
                          setContent({ ...content, experiences: updated });
                        }}
                        onUpload={handleFileUpload}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...content.experiences];
                          updated[idx].description = e.target.value;
                          setContent({ ...content, experiences: updated });
                        }}
                        className="w-full rounded-lg border border-charcoal/20 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-sand-gold/30 bg-sand-gold/10 p-6 text-charcoal">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-sand-gold p-2.5 text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-charcoal">
                      Galeri Foto Tersinkronisasi Otomatis dari Terra Prime
                    </h3>
                    <p className="mt-1 font-sans text-xs sm:text-sm text-charcoal/75 leading-relaxed">
                      Sesuai pengaturan, seluruh foto di halaman publik{" "}
                      <strong>/galeri</strong> sekarang otomatis ditarik
                      langsung secara live dari{" "}
                      <strong>
                        Terra Prime (halaman detail &amp; availability
                        ketersediaan kamar)
                      </strong>
                      , termasuk foto panorama mosaic dan galeri interior setiap
                      kamar. Anda tidak perlu repot mengupload atau menginput
                      foto galeri secara manual di sini.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href="/id/galeri"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-charcoal px-3.5 py-2 font-sans text-xs font-semibold text-white hover:bg-sand-gold transition-colors"
                      >
                        <span>Lihat Halaman Galeri Publik</span>
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
                      </a>
                      <a
                        href="https://terraprime.id/detail/hotel/wae-watu-hotel-resort"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-charcoal/20 px-3.5 py-2 font-sans text-xs font-semibold text-charcoal hover:bg-cream transition-colors"
                      >
                        <span>Buka Detail di Terra Prime</span>
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
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <h2 className="font-heading text-2xl font-medium text-charcoal">
                Informasi Kontak & Jam Operasional
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                    Nomor WhatsApp Resmi
                  </label>
                  <input
                    type="text"
                    value={content.contact.whatsapp}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          whatsapp: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={content.contact.phone}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, phone: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, email: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                    Akun Instagram
                  </label>
                  <input
                    type="text"
                    value={content.contact.instagram}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          instagram: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                    Waktu Check-in
                  </label>
                  <input
                    type="text"
                    value={content.contact.checkin}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          checkin: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                    Waktu Check-out
                  </label>
                  <input
                    type="text"
                    value={content.contact.checkout}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          checkout: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={content.contact.address}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                  URL Google Maps Embed
                </label>
                <input
                  type="text"
                  value={content.contact.maps_embed}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        maps_embed: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 7: ACCOUNT */}
          {activeTab === "account" && (
            <div className="space-y-6 max-w-md">
              <h2 className="font-heading text-2xl font-medium text-charcoal">
                Ganti Kredensial Login Admin
              </h2>

              <div>
                <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={content.admin.username}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      admin: { ...content.admin, username: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal/70 mb-1">
                  Password Baru
                </label>
                <input
                  type="text"
                  value={content.admin.password}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      admin: { ...content.admin, password: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm font-mono"
                />
                <p className="mt-1 text-[11px] text-charcoal/50">
                  Klik &quot;Simpan Perubahan&quot; di kanan atas setelah
                  mengganti password.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
