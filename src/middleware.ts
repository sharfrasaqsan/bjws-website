import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept Admin routes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const sessionCookie = request.cookies.get("bjws_admin_session");
    const demoCookie = request.cookies.get("bjws_admin_demo_session");
    const isAuthenticated = Boolean(
      sessionCookie?.value || demoCookie?.value === "active"
    );

    // Unauthenticated user attempting to access protected admin pages
    if (!isAuthenticated && pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Already authenticated user visiting login page
    if (isAuthenticated && pathname === "/admin/login") {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }

    return NextResponse.next();
  }

  // Force root "/" to always redirect to English ("/en") as the default language
  // and clear any stale NEXT_LOCALE cookie from previous sessions.
  if (pathname === "/") {
    const enUrl = new URL("/en", request.url);
    const response = NextResponse.redirect(enUrl);
    if (request.cookies.has("NEXT_LOCALE")) {
      response.cookies.delete("NEXT_LOCALE");
    }
    return response;
  }

  // Handle internationalized public pages
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
