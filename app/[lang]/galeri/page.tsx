import { getTerraGallery, getTerraBookingUrl } from "@/lib/terra";
import { hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TerraGalleryViewer from "@/app/components/TerraGalleryViewer";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/galeri">): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";
  return {
    title: isId
      ? "Galeri Foto — Wae Watu Reef Resort"
      : "Photo Gallery — Wae Watu Reef Resort",
    description: isId
      ? "Koleksi foto eksklusif resor, pemandangan laut, dan interior kamar resmi dari Terra Prime."
      : "Exclusive collection of resort panoramas, ocean views, and suite interiors from Terra Prime.",
  };
}

export default async function GaleriPage({
  params,
}: PageProps<"/[lang]/galeri">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const isId = lang === "id";
  const { mosaic, items } = await getTerraGallery();
  const bookingUrl = getTerraBookingUrl();

  return (
    <main className="flex-1 pt-24 bg-cream">
      {/* Header */}
      <div className="border-b border-charcoal/10 bg-white py-14 px-6 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
          TERRA PRIME LIVE VISUALS
        </p>
        <h1 className="mt-2 font-heading text-4xl sm:text-6xl font-medium text-charcoal">
          {isId ? "Galeri Foto Resort" : "Resort Photo Gallery"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-sans text-sm text-charcoal/65 sm:text-base">
          {isId
            ? "Momen-momen magis dan pemandangan laut Labuan Bajo yang terhubung langsung dengan sistem reservasi Terra Prime."
            : "Timeless glimpses of barefoot luxury captured live from the official Terra Prime ecosystem."}
        </p>
      </div>

      {/* Interactive Gallery Viewer */}
      <div className="px-6 py-16">
        <TerraGalleryViewer
          mosaic={mosaic}
          items={items}
          lang={lang}
          bookingUrl={bookingUrl}
        />
      </div>
    </main>
  );
}
