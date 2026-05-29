import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "./dictionaries";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wae Watu Reef Resort — Labuan Bajo",
  description:
    "Luxury overwater resort di Labuan Bajo, gerbang Taman Nasional Komodo.",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html
      lang={lang}
      className={`${cormorant.variable} ${jost.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <Navbar lang={lang as Locale} nav={dict.nav} />
        {children}
        <Footer footer={dict.footer} />
      </body>
    </html>
  );
}
