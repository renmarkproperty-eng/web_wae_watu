import Image from "next/image";
import Link from "next/link";

type FooterLabels = {
  tagline: string;
  addressLabel: string;
  address: string;
  contactLabel: string;
  hoursLabel: string;
  hours: string;
  rights: string;
};

const PHONE = "+62 821-9710-2971";
const WHATSAPP = "+62 821-9710-2971";
const EMAIL = "waewatureef@gmail.com";
const TERRA_BOOKING_URL =
  "https://terraprime.id/detail/hotel/wae-watu-hotel-resort";

export default function Footer({ footer }: { footer: FooterLabels }) {
  return (
    <footer className="bg-[#161616] text-white/80 border-t border-white/10 mt-auto">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Image
              src="/images/logo.webp"
              alt="Wae Watu Reef Resort"
              width={160}
              height={114}
              className="h-16 w-auto object-contain brightness-0 invert"
            />
            <p className="font-heading text-lg font-medium text-white">
              Wae Watu Reef Resort
            </p>
            <p className="font-sans text-xs leading-relaxed text-white/60">
              {footer.tagline ||
                "Barefoot luxury resort di atas terumbu karang Labuan Bajo, tepi Taman Nasional Komodo."}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sand-gold">
              Eksplorasi
            </h3>
            <ul className="space-y-2.5 font-sans text-xs text-white/70">
              <li>
                <Link href="/id" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/id/kamar"
                  className="hover:text-white transition-colors"
                >
                  Kamar &amp; Villa
                </Link>
              </li>
              <li>
                <Link
                  href="/id/fasilitas"
                  className="hover:text-white transition-colors"
                >
                  Fasilitas Resort
                </Link>
              </li>
              <li>
                <Link
                  href="/id/pengalaman"
                  className="hover:text-white transition-colors"
                >
                  Pengalaman &amp; Aktivitas
                </Link>
              </li>
              <li>
                <Link
                  href="/id/galeri"
                  className="hover:text-white transition-colors"
                >
                  Galeri Foto
                </Link>
              </li>
              <li>
                <Link
                  href="/id/tentang"
                  className="hover:text-white transition-colors"
                >
                  Tentang Resort
                </Link>
              </li>
              <li>
                <Link
                  href="/id/kontak"
                  className="hover:text-white transition-colors"
                >
                  Kontak &amp; Lokasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Address & Checkin */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sand-gold">
              {footer.addressLabel || "Lokasi & Operasional"}
            </h3>
            <div className="space-y-3 font-sans text-xs text-white/70">
              <div>
                <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-1">
                  Alamat Resort
                </span>
                <p className="leading-relaxed text-white/80">
                  {footer.address ||
                    "Jl. Wae Watu, Batu Cermin, Labuan Bajo, Manggarai Barat, NTT 86763"}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-1">
                  {footer.hoursLabel || "Check-in / Check-out"}
                </span>
                <p className="text-white/80">
                  {footer.hours || "Check-in: 14:00 · Check-out: 12:00"}
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Direct Booking */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sand-gold">
              {footer.contactLabel || "Reservasi & Kontak"}
            </h3>
            <div className="space-y-2.5 font-sans text-xs text-white/70">
              <div>
                <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                  WhatsApp
                </span>
                <a
                  href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, "")}`}
                  className="text-white hover:text-sand-gold transition-colors font-medium"
                >
                  {WHATSAPP}
                </a>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                  Telepon
                </span>
                <a
                  href={`tel:${PHONE.replace(/[^0-9+]/g, "")}`}
                  className="text-white hover:text-sand-gold transition-colors font-medium"
                >
                  {PHONE}
                </a>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                  Email
                </span>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-white hover:text-sand-gold transition-colors"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} Wae Watu Reef Resort.{" "}
            {footer.rights || "All rights reserved."}
          </p>
          <p className="text-white/40">
            Labuan Bajo · Komodo National Park · Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
