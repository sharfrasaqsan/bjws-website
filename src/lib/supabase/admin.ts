import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Server-only Supabase client initialized with the Service Role Key.
 * Bypasses Row Level Security (RLS) for trusted server-side background tasks.
 * NEVER import or execute this file in client-side code.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY ALERT: createAdminClient cannot be called from client-side code."
    );
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const rawServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  // If user has a truncated placeholder ending in '...', fallback to SUPABASE_SECRET_KEY
  const serviceRoleKey =
    rawServiceKey && !rawServiceKey.endsWith("...")
      ? rawServiceKey
      : process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      "Supabase Admin: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }

  return createClient<Database>(
    supabaseUrl || "https://placeholder.supabase.co",
    serviceRoleKey || "placeholder-service-role-key",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
