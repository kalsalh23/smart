import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Public client (browser + server). Caching disabled so admin edits show instantly. */
export function createPublicClient() {
  return createClient(url, anonKey, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

/** Client with the admin key header attached (used by /admin pages). */
export function createAdminClient(adminKey: string) {
  return createClient(url, anonKey, {
    global: {
      headers: { "x-admin-key": adminKey },
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
