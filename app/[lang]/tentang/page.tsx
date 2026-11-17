import Image from "next/image";
import { getCMSContent } from "@/lib/cms";
import { hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/tentang">): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";
  return {
    title: isId
      ? "Tentang Kami — Wae Watu Reef Resort"
      : "About Us — Wae Watu Reef Resort",
    description: isId
      ? "Kisah resor ramah lingkungan di atas terumbu karang Labuan Bajo, Flores."
      : "The sanctuary story of barefoot luxury over the reefs of Labuan Bajo, Flores.",
  };
}

export default async function TentangPage({
  params,
}: PageProps<"/[lang]/tentang">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const isId = lang === "id";
  const cms = await getCMSContent();

  return (
    <main className="flex-1 pt-24 bg-cream">
      {/* Header */}
      <div className="border-b border-charcoal/10 bg-white py-14 px-6 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
          OUR STORY & PHILOSOPHY
        </p>
        <h1 className="mt-2 font-heading text-4xl sm:text-6xl font-medium text-charcoal">
          {cms.about.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-sans text-sm text-charcoal/65 sm:text-base italic">
          &ldquo;{cms.about.subtitle}&rdquo;
        </p>
      </div>

      {/* Story Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 sm:h-[480px] w-full overflow-hidden rounded-3xl shadow-md">
            <Image
              src="/images/hero.webp"
              alt={cms.about.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-sand-gold font-semibold">
              {isId ? "Kearifan Alam Flores" : "Flores Heritage"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-charcoal">
              {isId ? "Harmoni Alam & Kemewahan Hening" : "Nature Harmony & Quiet Luxury"}
            </h2>
            <div className="font-sans text-sm leading-relaxed text-charcoal/75 sm:text-base space-y-4 whitespace-pre-line">
              {cms.about.story}
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Section */}
      <section className="bg-white border-t border-charcoal/10 py-20 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-sand-gold font-semibold">
            SUSTAINABILITY COMMITMENT
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-medium text-charcoal">
            {cms.about.conservation.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-sm text-charcoal/70 sm:text-base">
            {cms.about.conservation.description}
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cms.about.conservation.stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-charcoal/10 bg-cream/40 p-8 text-center"
              >
                <p className="font-heading text-3xl sm:text-4xl font-semibold text-charcoal">
                  {stat.value}
                </p>
                <p className="mt-2 font-sans text-xs uppercase tracking-wider text-charcoal/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
