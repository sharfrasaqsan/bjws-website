"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
}

const DEMO_ADMIN_COOKIE = "bjws_admin_demo_session";

/**
 * Verifies if there is an active authenticated admin session.
 * Checks demo session first for instant local response.
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();

  // 1. Fast path: check developer demo session cookie
  const demoCookie = cookieStore.get(DEMO_ADMIN_COOKIE);
  if (demoCookie?.value === "active") {
    return {
      id: "demo-admin-id",
      email: "admin@bjws.org",
      role: "admin",
    };
  }

  // 2. Check Supabase Auth only if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user && user.email) {
        return {
          id: user.id,
          email: user.email,
          role: "admin",
        };
      }
    } catch (err) {
      console.warn("Supabase admin session check:", err);
    }
  }

  return null;
}

/**
 * Server Action: Authenticate admin with email and password.
 */
export async function loginAdminAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const isDemo = formData.get("demo_login") === "true";
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

  let shouldRedirect = false;

  const isProduction = process.env.NODE_ENV === "production";

  // Development-only demo login bypass (disabled in production)
  if (isDemo && !isProduction) {
    const cookieStore = await cookies();
    cookieStore.set(DEMO_ADMIN_COOKIE, "active", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    shouldRedirect = true;
  } else {
    if (!email || !password) {
      return { error: "Please provide both email and password." };
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          // Development/testing fallback only in non-production
          if (
            !isProduction &&
            (email === "admin@bjws.org" || email.endsWith("@bjws.org"))
          ) {
            const cookieStore = await cookies();
            cookieStore.set(DEMO_ADMIN_COOKIE, "active", {
              httpOnly: true,
              secure: isProduction,
              sameSite: "lax",
              path: "/",
              maxAge: 60 * 60 * 8,
            });
            shouldRedirect = true;
          } else {
            return { error: error?.message || "Invalid email or password." };
          }
        } else {
          shouldRedirect = true;
        }
      } catch (err) {
        console.error("Login authentication error:", err);
        // Fallback for admin@bjws.org if network fails (development only)
        if (!isProduction && email === "admin@bjws.org" && password.length >= 6) {
          const cookieStore = await cookies();
          cookieStore.set(DEMO_ADMIN_COOKIE, "active", {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8,
          });
          shouldRedirect = true;
        } else {
          return { error: "Authentication failed. Please verify credentials." };
        }
      }
    } else {
      // Fallback when Supabase is not configured
      const configuredAdminPassword = process.env.ADMIN_PASSWORD;
      const isPasswordValid = configuredAdminPassword
        ? password === configuredAdminPassword
        : !isProduction && password.length >= 6;

      if (isPasswordValid) {
        const cookieStore = await cookies();
        cookieStore.set(DEMO_ADMIN_COOKIE, "active", {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 8,
        });
        shouldRedirect = true;
      } else {
        return {
          error: configuredAdminPassword
            ? "Invalid admin password."
            : isProduction
            ? "Authentication service unconfigured. Please configure Supabase or ADMIN_PASSWORD."
            : "Password must be at least 6 characters.",
        };
      }
    }
  }

  if (shouldRedirect) {
    redirect("/admin");
  }

  return { success: true };
}

/**
 * Server Action: Log out the admin user.
 */
export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase sign out error:", err);
    }
  }

  cookieStore.delete(DEMO_ADMIN_COOKIE);
  redirect("/admin/login");
}
