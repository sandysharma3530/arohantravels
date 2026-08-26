import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isEphemeralHost, PERSISTENT_STORAGE_HELP } from "@/lib/runtime";

let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getAdminClient() {
  if (!isSupabaseConfigured()) return null;
  if (adminClient) return adminClient;

  adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return adminClient;
}

export function assertPersistentBackend(feature: "content" | "enquiries" | "uploads") {
  if (isEphemeralHost() && !isSupabaseConfigured()) {
    throw new Error(
      `Supabase is required for ${feature} on this host. ${PERSISTENT_STORAGE_HELP}`,
    );
  }
}
