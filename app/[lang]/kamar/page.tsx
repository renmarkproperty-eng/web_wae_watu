import { getWaeWatuPropertyData } from "@/lib/terra";
import TerraVillasSection from "@/app/components/TerraVillasSection";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/kamar">): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";
  return {
    title: isId
      ? "Kamar & Villa — Wae Watu Reef Resort"
      : "Rooms & Villas — Wae Watu Reef Resort",
    description: isId
      ? "Pilihan kamar overwater bungalow eksklusif di atas terumbu karang Labuan Bajo."
      : "Exclusive overwater bungalow suites situated over the coral reefs of Labuan Bajo.",
  };
}

export default async function KamarPage({
  params,
}: PageProps<"/[lang]/kamar">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  await getDictionary(lang as Locale);
  const terraData = await getWaeWatuPropertyData();

  return (
    <main className="flex-1 pt-16 bg-cream">
      <TerraVillasSection
        villas={terraData?.villas || []}
        propertyName={terraData?.property?.name}
        propertySlug={terraData?.property?.slug}
        lang={lang as Locale}
      />
    </main>
  );
}
