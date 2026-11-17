import Image from "next/image";
import { getCMSContent } from "@/lib/cms";
import {
  getTerraAdditionalProducts,
  getTerraBookingUrl,
  cleanHtmlText,
} from "@/lib/terra";
import { hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/pengalaman">): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";
  return {
    title: isId
      ? "Pengalaman & Aktivitas — Wae Watu Reef Resort"
      : "Experiences & Tours — Wae Watu Reef Resort",
    description: isId
      ? "Jelajahi water sports, Jet Ski, snorkeling manta ray, dan petualangan laut di Wae Watu."
      : "Explore water sports, Jet Ski, manta ray snorkeling, and sea adventures at Wae Watu.",
  };
}

export default async function PengalamanPage({
  params,
}: PageProps<"/[lang]/pengalaman">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const isId = lang === "id";
  const [cms, terraProducts] = await Promise.all([
    getCMSContent(),
    getTerraAdditionalProducts(17),
  ]);

  const waNumber = cms.contact.whatsapp.replace(/[^0-9]/g, "");
  const terraBookingUrl = getTerraBookingUrl();

  const formatPrice = (val: string | number, unit?: string) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return null;
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
    return unit ? `${formatted} / ${unit}` : formatted;
  };

  return (
    <main className="flex-1 pt-24 bg-cream">
      {/* Header */}
      <div className="border-b border-charcoal/10 bg-white py-14 px-6 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
          TERRA EXPERIENCES & RESORT ACTIVITIES
        </p>
        <h1 className="mt-2 font-heading text-4xl sm:text-6xl font-medium text-charcoal">
          {isId ? "Pengalaman & Petualangan" : "Curated Experiences"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-sans text-sm text-charcoal/65 sm:text-base">
          {isId
            ? "Nikmati serunya petualangan air, olahraga laut, dan aktivitas eksklusif langsung dari sistem reservasi Terra Prime."
            : "Enjoy thrilling water sports, marine adventures, and curated resort activities directly connected to Terra Prime."}
        </p>
      </div>

      <div className="px-6 py-20 space-y-20">
        {/* Section 1: Additional Products from Terra Prime */}
        {terraProducts.length > 0 && (
          <section className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-charcoal/10 pb-4">
              <div>
                <span className="inline-block rounded bg-sand-gold/20 px-2.5 py-0.5 font-sans text-[11px] font-semibold tracking-wider text-charcoal uppercase">
                  Terra Prime Live Ecosystem
                </span>
                <h2 className="mt-2 font-heading text-3xl font-medium text-charcoal">
                  {isId ? "Aktivitas & Rental Resmi" : "Official Activities & Rentals"}
                </h2>
              </div>
              <p className="font-sans text-xs text-charcoal/60">
                {isId
                  ? "Dapat langsung dipesan saat reservasi kamar di Terra"
                  : "Can be booked directly with your room reservation on Terra"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {terraProducts.map((prod) => {
                const formattedPrice = formatPrice(prod.price, prod.unit);
                return (
                  <div
                    key={prod.id}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-charcoal/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-charcoal/10">
                      <Image
                        src={prod.image_url || "/images/hero.webp"}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 rounded-full bg-sand-gold/90 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-charcoal backdrop-blur-md">
                        Terra Product
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="font-heading text-2xl font-medium text-charcoal">
                          {prod.name}
                        </h3>
                        <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70 line-clamp-4">
                          {cleanHtmlText(prod.description)}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-charcoal/10 pt-4">
                        {formattedPrice && (
                          <div className="mb-4">
                            <span className="font-sans text-[11px] uppercase tracking-wider text-charcoal/60">
                              {isId ? "Harga Mulai" : "Rate"}
                            </span>
                            <p className="font-heading text-xl font-semibold text-charcoal">
                              {formattedPrice}
                            </p>
                          </div>
                        )}
                        <a
                          href={terraBookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-sand-gold"
                        >
                          <span>{isId ? "Pesan via Terra Prime" : "Book via Terra Prime"}</span>
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
                );
              })}
            </div>
          </section>
        )}

        {/* Section 2: Custom Experiences & Tours */}
        {cms.experiences && cms.experiences.length > 0 && (
          <section className="mx-auto max-w-6xl">
            <div className="mb-8 border-b border-charcoal/10 pb-4">
              <h2 className="font-heading text-3xl font-medium text-charcoal">
                {isId ? "Tur & Eksplorasi Komodo" : "Tours & Komodo Excursions"}
              </h2>
              <p className="mt-1 font-sans text-xs text-charcoal/60">
                {isId
                  ? "Pilihan paket tur darat dan laut dengan panduan pemandu lokal berpengalaman"
                  : "Curated island adventures guided by experienced local tour leaders"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cms.experiences.map((exp, idx) => {
                const waText = encodeURIComponent(
                  `Halo Wae Watu Reef Resort, saya ingin bertanya tentang paket pengalaman "${exp.title}".`
                );
                return (
                  <div
                    key={exp.id || idx}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-charcoal/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-charcoal/10">
                      <Image
                        src={exp.image || "/images/hero.webp"}
                        alt={exp.title}
                        fill
                        unoptimized={Boolean(exp.image?.startsWith("data:"))}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {exp.duration && (
                        <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 font-sans text-[11px] font-medium text-white backdrop-blur-md">
                          {exp.duration}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="font-heading text-2xl font-medium text-charcoal">
                          {exp.title}
                        </h3>
                        <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">
                          {exp.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-charcoal/10 pt-4">
                        {exp.price && exp.price.trim() !== "" && (
                          <div className="mb-4">
                            <span className="font-sans text-[11px] uppercase tracking-wider text-charcoal/60">
                              {isId ? "Estimasi Biaya" : "Estimated Rate"}
                            </span>
                            <p className="font-heading text-xl font-semibold text-charcoal">
                              {exp.price}
                            </p>
                          </div>
                        )}
                        <a
                          href={`https://wa.me/${waNumber}?text=${waText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-sand-gold"
                        >
                          {isId ? "Tanya via WhatsApp" : "Inquire via WhatsApp"}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
