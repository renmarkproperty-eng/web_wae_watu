import Image from "next/image";
import {
  type TerraVilla,
  cleanHtmlText,
  getTerraBookingUrl,
} from "@/lib/terra";

interface TerraVillasSectionProps {
  villas: TerraVilla[];
  propertyName?: string;
  propertySlug?: string;
  lang: "id" | "en";
}

export default function TerraVillasSection({
  villas,
  propertyName = "Wae Watu Hotel & Resort",
  propertySlug,
  lang,
}: TerraVillasSectionProps) {
  const isId = lang === "id";
  const bookingUrl = getTerraBookingUrl(propertySlug);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="kamar" className="bg-cream px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center text-charcoal">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
            {propertyName} · TERRA ECOSYSTEM
          </p>
          <h2 className="mt-3 font-heading text-4xl font-medium leading-tight sm:text-5xl">
            {isId ? "Pilihan Kamar & Tarif Resmi" : "Room Selection & Rates"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-charcoal/60 sm:text-base">
            {isId
              ? "Setiap kamar menghadap pemandangan laut yang tenang, dengan kenyamanan interior kayu hangat dan fasilitas lengkap."
              : "Every room faces serene ocean views, featuring warm wooden interiors and premium resort amenities."}
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-sand-gold bg-sand-gold/10 px-5 py-2 font-sans text-xs font-semibold uppercase tracking-wider text-charcoal transition-all hover:bg-sand-gold hover:text-white"
            >
              <span>
                {isId
                  ? "Cek Ketersediaan di Terra Prime"
                  : "Check Live Dates on Terra Prime"}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Room / Villa Cards Grid */}
        {villas && villas.length > 0 ? (
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {villas.map((villa) => {
              const cleanVillaDesc = cleanHtmlText(villa.description);

              return (
                <div
                  key={villa.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-charcoal/10"
                >
                  {/* Villa Photo */}
                  <div className="relative h-72 w-full overflow-hidden bg-charcoal/10">
                    <Image
                      src={villa.image_url || "/images/room_1.webp"}
                      alt={villa.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 rounded-full bg-black/70 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {villa.available_units > 0
                        ? `${villa.available_units} ${isId ? "Unit Tersedia" : "Units Left"}`
                        : isId
                          ? "Penuh"
                          : "Fully Booked"}
                    </div>
                  </div>

                  {/* Villa Details */}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-heading text-3xl font-medium text-charcoal">
                            {villa.name}
                          </h3>
                          <p className="mt-1 font-sans text-xs uppercase tracking-wider text-charcoal/60">
                            {villa.capacity}{" "}
                            {isId ? "Tamu / Kamar" : "Guests / Room"}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <span className="block font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                            {formatCurrency(villa.price_per_night)}
                          </span>
                          <span className="text-xs text-charcoal/60">
                            /{isId ? "malam" : "night"}
                          </span>
                        </div>
                      </div>

                      {/* Description per room from Terra */}
                      {cleanVillaDesc && (
                        <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal/75">
                          {cleanVillaDesc}
                        </p>
                      )}

                      {/* Facilities tags per room */}
                      {villa.features && villa.features.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {villa.features.slice(0, 6).map((feat, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-cream px-3 py-1 font-sans text-[11px] font-semibold tracking-wider text-charcoal/80 uppercase"
                            >
                              {feat}
                            </span>
                          ))}
                          {villa.features.length > 6 && (
                            <span className="rounded-full bg-cream/70 px-2.5 py-1 font-sans text-[11px] font-medium text-charcoal/60">
                              +{villa.features.length - 6} {isId ? "lainnya" : "more"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA Book on Terra */}
                    <div className="mt-8 border-t border-charcoal/10 pt-5">
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-charcoal px-6 py-3.5 text-center font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-sand-gold hover:shadow-lg"
                      >
                        <span>
                          {isId ? "Pesan di Terra Prime" : "Book Now"}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                      <p className="mt-2 text-center font-sans text-[11px] text-charcoal/50">
                        {isId
                          ? "Reservasi langsung melalui sistem pemesanan resmi Terra"
                          : "Direct reservation processed via official Terra booking engine"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-charcoal/10 bg-white/60 p-8 text-center text-charcoal/60">
            <p className="font-sans text-sm">
              {isId
                ? "Data kamar sedang diperbarui dari sistem Terra Prime."
                : "Room inventory is currently synchronizing with Terra Prime."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
