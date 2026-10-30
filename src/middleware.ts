import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept Admin routes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    let isAuthenticated = false;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY;
    const isConfigured = Boolean(
      supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("your-project") &&
      !supabaseAnonKey.includes("your-anon-key") &&
      !supabaseUrl.includes("placeholder") &&
      !supabaseAnonKey.endsWith("...")
    );

    if (isConfigured) {
      try {
        const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              response = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            },
          },
        });

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          isAuthenticated = true;
        }
      } catch (err) {
        console.error("Middleware Supabase auth error:", err);
      }
    } else {
      // Check local demo cookie for development preview
      const demoCookie = request.cookies.get("bjws_admin_demo_session");
      if (demoCookie?.value === "active") {
        isAuthenticated = true;
      }
    }

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

    return response;
  }

  // Handle internationalized public pages
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
