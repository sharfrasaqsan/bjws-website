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
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();

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
      console.error("Failed to check Supabase admin session:", err);
    }
  }

  // Fallback demo session for local development
  const demoCookie = cookieStore.get(DEMO_ADMIN_COOKIE);
  if (demoCookie?.value === "active") {
    return {
      id: "demo-admin-id",
      email: "admin@bjws.org",
      role: "admin",
    };
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
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

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
        return { error: error?.message || "Invalid email or password." };
      }

      redirect("/admin");
    } catch (err) {
      if ((err as Error).message === "NEXT_REDIRECT") {
        throw err;
      }
      return { error: "Authentication failed. Please verify credentials." };
    }
  } else {
    // Development fallback when live Supabase is not yet configured
    if (password.length >= 6) {
      const cookieStore = await cookies();
      cookieStore.set(DEMO_ADMIN_COOKIE, "active", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours
      });
      redirect("/admin");
    } else {
      return { error: "Password must be at least 6 characters." };
    }
  }
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
