/** True on Vercel (and similar serverless hosts) where the filesystem is not durable. */
export function isEphemeralHost() {
  return process.env.VERCEL === "1";
}

export const PERSISTENT_STORAGE_HELP =
  "On Vercel, set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase/production.sql in the Supabase SQL editor.";
