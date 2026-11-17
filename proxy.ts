import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["id", "en"] as const;
const defaultLocale = "id";

function getLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    const preferred = header
      .split(",")
      .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
    const match = preferred.find((code) =>
      locales.includes(code as (typeof locales)[number]),
    );
    if (match) return match;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Do not redirect admin or API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return;
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|images|uploads|favicon.ico|api|admin|.*\\..*).*)"],
};
