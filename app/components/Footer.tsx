import Image from "next/image";

type FooterLabels = {
  tagline: string;
  addressLabel: string;
  address: string;
  contactLabel: string;
  hoursLabel: string;
  hours: string;
  rights: string;
};

const PHONE = "+62 812-0000-0000";
const WHATSAPP = "+62 812-0000-0000";
const EMAIL = "stay@waewatu.com";

export default function Footer({ footer }: { footer: FooterLabels }) {
  return (
    <footer className="bg-cream text-charcoal">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="border-t border-charcoal/15" />

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/images/logo.webp"
              alt="Wae Watu Reef Resort"
              width={160}
              height={114}
              className="h-16 w-auto object-contain"
            />
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-charcoal/50">
              {footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/40">
              {footer.addressLabel}
            </h3>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-charcoal/70">
              {footer.address}
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/40">
              {footer.contactLabel}
            </h3>
            <ul className="mt-4 space-y-2 font-sans text-sm text-charcoal/70">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, "")}`}
                  className="transition-colors hover:text-sand-gold"
                >
                  WhatsApp · {WHATSAPP}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${PHONE.replace(/[^0-9+]/g, "")}`}
                  className="transition-colors hover:text-sand-gold"
                >
                  {PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition-colors hover:text-sand-gold"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/40">
              {footer.hoursLabel}
            </h3>
            <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal/70">
              {footer.hours}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-charcoal/15" />
        <p className="mt-6 font-sans text-xs text-charcoal/40">
          © {new Date().getFullYear()} Wae Watu Reef Resort. {footer.rights}
        </p>
      </div>
    </footer>
  );
}
