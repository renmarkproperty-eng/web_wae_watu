import Image from "next/image";
import { getDictionary, hasLocale, type Locale } from "./dictionaries";
import { notFound } from "next/navigation";
import {
  getWaeWatuPropertyData,
  getTerraAdditionalProducts,
  getTerraBookingUrl,
  cleanHtmlText,
} from "@/lib/terra";
import { getCMSContent } from "@/lib/cms";
import TerraVillasSection from "../components/TerraVillasSection";
import ExperienceCarousel from "../components/ExperienceCarousel";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const isId = lang === "id";
  const dict = await getDictionary(lang as Locale);
  const [terraData, terraProducts, cms] = await Promise.all([
    getWaeWatuPropertyData(),
    getTerraAdditionalProducts(17),
    getCMSContent().catch(() => null),
  ]);

  const heroEyebrow = cms?.hero?.eyebrow || dict.hero.eyebrow;
  const heroTitle = cms?.hero?.title || dict.hero.title;
  const heroSubtitle = cms?.hero?.subtitle || dict.hero.subtitle;

  const propertyPhotos = terraData?.property?.photos || [];
  const showcaseImg1 = propertyPhotos[0] || "/images/section_1.webp";
  const showcaseImg2 = propertyPhotos[1] || "/images/section_2.webp";
  const showcaseImg3 = propertyPhotos[2] || "/images/section_3.webp";

  const terraBookingUrl = getTerraBookingUrl();

  // Combine top Terra additional products + CMS custom experiences (up to 3 items)
  interface HomeExperienceItem {
    id: string | number;
    title: string;
    description: string;
    image: string;
    badge: string;
    price?: string | null;
    link: string;
    isExternal?: boolean;
  }

  const homeExperiences: HomeExperienceItem[] = [];

  // 1. Add Terra products
  terraProducts.forEach((tp) => {
    const numPrice = Number(tp.price);
    const formattedPrice =
      !isNaN(numPrice) && numPrice > 0
        ? `${new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(numPrice)}${tp.unit ? ` / ${tp.unit}` : ""}`
        : null;

    homeExperiences.push({
      id: `terra-${tp.id}`,
      title: tp.name,
      description: cleanHtmlText(tp.description),
      image: tp.image_url || "/images/hero.webp",
      badge: "Terra Activity",
      price: formattedPrice,
      link: terraBookingUrl,
      isExternal: true,
    });
  });

  // 2. Add CMS experiences
  if (cms?.experiences) {
    for (const exp of cms.experiences) {
      homeExperiences.push({
        id: exp.id,
        title: exp.title,
        description: exp.description,
        image: exp.image || "/images/hero.webp",
        badge: exp.duration || (isId ? "Tur Pilihan" : "Curated Tour"),
        price: exp.price && exp.price.trim() !== "" ? exp.price : null,
        link: `/${lang}/pengalaman`,
        isExternal: false,
      });
    }
  }

  return (
    <main className="flex-1">
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.webp"
          alt="Wae Watu Reef Resort"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 px-6 text-center text-white">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/80">
            {heroEyebrow}
          </p>
          <h1 className="mt-4 font-heading text-5xl font-medium leading-tight sm:text-7xl">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-relaxed text-white/80 sm:text-base">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center text-charcoal">
            <h2 className="font-heading text-4xl font-medium leading-tight sm:text-5xl">
              {dict.showcase.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-charcoal/60 sm:text-base">
              {dict.showcase.subtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:grid-rows-2">
            <div className="relative overflow-hidden sm:row-span-2 min-h-[300px] sm:min-h-[560px] rounded-2xl">
              <Image
                src={showcaseImg1}
                alt={dict.showcase.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative min-h-[180px] overflow-hidden sm:min-h-0 rounded-2xl">
              <Image
                src={showcaseImg2}
                alt={dict.showcase.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative min-h-[180px] overflow-hidden sm:min-h-0 rounded-2xl">
              <Image
                src={showcaseImg3}
                alt={dict.showcase.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {homeExperiences.length > 0 && (
        <section className="bg-cream px-6 py-20 sm:py-28 border-t border-charcoal/10 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
                  {isId ? "AKTIVITAS & PETUALANGAN" : "CURATED EXPERIENCES"}
                </p>
                <h2 className="mt-2 font-heading text-4xl sm:text-5xl font-medium text-charcoal">
                  {isId ? "Pengalaman Istimewa" : "Curated Adventures"}
                </h2>
              </div>
              <a
                href={`/${lang}/pengalaman`}
                className="w-fit border-b border-charcoal pb-1 font-sans text-xs uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-sand-gold hover:text-sand-gold sm:mr-28"
              >
                {isId ? "Lihat Semua Pengalaman →" : "View All Experiences →"}
              </a>
            </div>

            <ExperienceCarousel items={homeExperiences} lang={lang} />
          </div>
        </section>
      )}

      <TerraVillasSection
        villas={terraData?.villas || []}
        propertyName={terraData?.property?.name}
        propertySlug={terraData?.property?.slug}
        lang={lang as Locale}
      />
    </main>
  );
}
