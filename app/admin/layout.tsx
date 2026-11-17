import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Wae Watu CMS — Pengelola Konten",
  description: "Panel admin pengelola konten website Wae Watu Reef Resort.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#F7F3EC]">
        {children}
      </body>
    </html>
  );
}
