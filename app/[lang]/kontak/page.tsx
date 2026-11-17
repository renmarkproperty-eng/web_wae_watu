import { getCMSContent } from "@/lib/cms";
import { hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/kontak">): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";
  return {
    title: isId
      ? "Kontak & Lokasi — Wae Watu Reef Resort"
      : "Contact & Location — Wae Watu Reef Resort",
    description: isId
      ? "Hubungi Wae Watu Reef Resort untuk reservasi, rute lokasi, dan pertanyaan umum."
      : "Contact Wae Watu Reef Resort for reservations, location guide, and general inquiries.",
  };
}

export default async function KontakPage({
  params,
}: PageProps<"/[lang]/kontak">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const isId = lang === "id";
  const cms = await getCMSContent();
  const { contact } = cms;

  const waNumber = contact.whatsapp.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    isId
      ? "Halo Wae Watu Reef Resort, saya ingin bertanya tentang reservasi dan informasi lainnya."
      : "Hello Wae Watu Reef Resort, I would like to inquire about reservations and resort details."
  )}`;

  return (
    <main className="flex-1 pt-24 bg-cream">
      {/* Header */}
      <div className="border-b border-charcoal/10 bg-white py-14 px-6 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-sand-gold font-semibold">
          GET IN TOUCH
        </p>
        <h1 className="mt-2 font-heading text-4xl sm:text-6xl font-medium text-charcoal">
          {isId ? "Hubungi & Temukan Kami" : "Contact & Location"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-sans text-sm text-charcoal/65 sm:text-base">
          {isId
            ? "Tim reservasi kami siap membantu merencanakan liburan impian Anda di Labuan Bajo."
            : "Our dedicated concierge is at your service to curate your unforgettable Flores getaway."}
        </p>
      </div>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details Card */}
          <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-charcoal/10 space-y-8">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-sand-gold font-semibold">
                DIRECT INQUIRY
              </span>
              <h2 className="mt-2 font-heading text-3xl font-medium text-charcoal">
                {isId ? "Informasi Resmi" : "Official Channels"}
              </h2>
            </div>

            <div className="space-y-6 font-sans text-sm">
              <div className="border-b border-charcoal/10 pb-4">
                <span className="text-xs uppercase tracking-wider text-charcoal/50 font-semibold block mb-1">
                  WhatsApp / Phone
                </span>
                <p className="font-heading text-xl text-charcoal font-medium">
                  {contact.whatsapp}
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sand-gold hover:underline"
                >
                  {isId ? "Chat Langsung via WhatsApp →" : "Direct WhatsApp Chat →"}
                </a>
              </div>

              <div className="border-b border-charcoal/10 pb-4">
                <span className="text-xs uppercase tracking-wider text-charcoal/50 font-semibold block mb-1">
                  Email
                </span>
                <p className="text-charcoal font-medium">
                  {contact.email}
                </p>
              </div>

              <div className="border-b border-charcoal/10 pb-4">
                <span className="text-xs uppercase tracking-wider text-charcoal/50 font-semibold block mb-1">
                  Check-in / Check-out
                </span>
                <p className="text-charcoal">
                  Check-in: <strong className="text-charcoal">{contact.checkin}</strong> · Check-out: <strong className="text-charcoal">{contact.checkout}</strong>
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-charcoal/50 font-semibold block mb-1">
                  Alamat Resort
                </span>
                <p className="text-charcoal/80 leading-relaxed">
                  {contact.address}
                </p>
              </div>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-charcoal px-6 py-4 font-sans text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-sand-gold hover:shadow-lg"
            >
              <span>{isId ? "Hubungi Reservasi via WhatsApp" : "Contact Concierge on WhatsApp"}</span>
            </a>
          </div>

          {/* Google Maps Embed */}
          <div className="rounded-3xl overflow-hidden border border-charcoal/10 shadow-sm bg-white h-[480px]">
            <iframe
              src={contact.maps_embed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Wae Watu Reef Resort Location Map"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
