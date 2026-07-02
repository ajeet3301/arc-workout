import { createBrowserClient } from "@supabase/ssr";

// Note: intentionally untyped against the Database generic. The generated
// Postgrest types in newer @supabase/ssr versions are strict enough that
// they can produce spurious "never" errors on inserts/selects. We keep
// full row types in types/database.ts and cast query results manually
// where useful, instead of wiring them into the client generic.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}