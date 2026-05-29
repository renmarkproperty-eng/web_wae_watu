import Image from "next/image";
import { getDictionary, hasLocale, type Locale } from "./dictionaries";
import { notFound } from "next/navigation";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

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
            {dict.hero.eyebrow}
          </p>
          <h1 className="mt-4 font-heading text-5xl font-medium leading-tight sm:text-7xl">
            {dict.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-relaxed text-white/80 sm:text-base">
            {dict.hero.subtitle}
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
            <div className="relative overflow-hidden sm:row-span-2 min-h-[300px] sm:min-h-[560px]">
              <Image
                src="/images/section_1.webp"
                alt={dict.showcase.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative min-h-[180px] overflow-hidden sm:min-h-0">
              <Image
                src="/images/section_2.webp"
                alt={dict.showcase.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative min-h-[180px] overflow-hidden sm:min-h-0">
              <Image
                src="/images/section_3.webp"
                alt={dict.showcase.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl items-stretch gap-0 py-20 md:grid-cols-2 md:py-24">
          <div className="relative min-h-[260px] md:min-h-[440px]">
            <Image
              src="/images/resto_1.webp"
              alt={dict.dining.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 text-charcoal sm:px-12 md:py-0">
            <h2 className="font-heading text-4xl font-medium leading-tight sm:text-5xl">
              {dict.dining.title}
            </h2>
            <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-charcoal/60 sm:text-base">
              {dict.dining.subtitle}
            </p>
            <a
              href="#fasilitas"
              className="mt-8 w-fit border-b border-charcoal pb-1 font-sans text-xs uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-sand-gold hover:text-sand-gold"
            >
              {dict.dining.cta}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center text-charcoal">
            <h2 className="font-heading text-4xl font-medium leading-tight sm:text-5xl">
              {dict.rooms.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-charcoal/60 sm:text-base">
              {dict.rooms.subtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:grid-rows-2">
            <div className="relative h-44 overflow-hidden sm:h-auto sm:col-start-1 sm:row-span-2 sm:min-h-[440px]">
              <Image
                src="/images/room_1.webp"
                alt={dict.rooms.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative h-44 overflow-hidden sm:h-auto sm:col-start-2 sm:row-start-1">
              <Image
                src="/images/room_2.webp"
                alt={dict.rooms.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative h-44 overflow-hidden sm:h-auto sm:col-start-2 sm:row-start-2">
              <Image
                src="/images/room_3.webp"
                alt={dict.rooms.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative h-44 overflow-hidden sm:h-auto sm:col-start-3 sm:row-span-2 sm:min-h-[440px]">
              <Image
                src="/images/room_4.webp"
                alt={dict.rooms.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="#kamar"
              className="group inline-flex items-center gap-3 font-heading text-2xl text-charcoal transition-colors hover:text-sand-gold sm:text-3xl"
            >
              {dict.rooms.cta}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
