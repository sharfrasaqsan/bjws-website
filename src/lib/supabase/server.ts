/**
 * Unified Backend Database Bridge
 *
 * Automatically delegates all database operations to Firebase Firestore
 * with full backward-compatible query-builder semantics.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { createFirestoreClient } from "@/lib/firebase/adapter";

export async function createClient(): Promise<SupabaseClient<Database>> {
  return createFirestoreClient() as unknown as SupabaseClient<Database>;
}

export async function createAdminClient(): Promise<SupabaseClient<Database>> {
  return createFirestoreClient() as unknown as SupabaseClient<Database>;
}

export function createPublicClient(): SupabaseClient<Database> {
  return createFirestoreClient() as unknown as SupabaseClient<Database>;
}

export function isSupabaseConfigured(): boolean {
  return true;
}
