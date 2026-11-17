import Image from "next/image";
import { getCMSContent } from "@/lib/cms";
import { hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/fasilitas">): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";
  return {
    title: isId
      ? "Fasilitas Resort — Wae Watu Reef Resort"
      : "Resort Facilities — Wae Watu Reef Resort",
    description: isId
      ? "Restoran samudera, infinity pool, dermaga privat, dan dive center di Wae Watu."
      : "Oceanfront dining, infinity reef pool, private jetty, and dive center at Wae Watu.",
  };
}

export default async function FasilitasPage({
  params,
}: PageProps<"/[lang]/fasilitas">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const isId = lang === "id";
  const cms = await getCMSContent();

  return (
    <main className="flex-1 pt-24 bg-cream">
      {/* Page Header */}
      <div className="border-b border-charcoal/10 bg-white py-14 px-6 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
          RESORT AMENITIES & LEISURE
        </p>
        <h1 className="mt-2 font-heading text-4xl sm:text-6xl font-medium text-charcoal">
          {isId ? "Fasilitas Istimewa" : "Exceptional Facilities"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-sans text-sm text-charcoal/65 sm:text-base">
          {isId
            ? "Dirancang untuk menyempurnakan masa inap Anda dengan kenyamanan bernuansa alam."
            : "Thoughtfully curated to elevate your sanctuary escape with barefoot luxury."}
        </p>
      </div>

      {/* Facilities Grid */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-16">
          {cms.facilities.map((fac, idx) => (
            <div
              key={fac.id || idx}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div
                className={`relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl shadow-sm ${
                  idx % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={fac.image || "/images/section_1.webp"}
                  alt={fac.title}
                  fill
                  unoptimized={Boolean(fac.image?.startsWith("data:"))}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div
                className={`flex flex-col justify-center px-4 ${
                  idx % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-sand-gold font-semibold">
                  {fac.category}
                </span>
                <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-medium text-charcoal">
                  {fac.title}
                </h2>
                <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal/75 sm:text-base">
                  {fac.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
