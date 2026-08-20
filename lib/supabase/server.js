import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server-only Supabase client (used by Route Handlers / Server Components).
// Credentials come from env vars — NEVER hardcode them.
//
// NOTE: Authentication is not wired up yet, so cookie get/set below is a
// minimal stub. When auth lands later, @supabase/ssr will manage the session
// cookies automatically through these same hooks.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // No auth yet — nothing to persist. Safe no-op that becomes a real
          // cookie write once authentication is implemented.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — can't set cookies here. Ignore.
          }
        },
      },
    }
  );
}
