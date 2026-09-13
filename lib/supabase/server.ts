import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isPlaceholderSupabaseUrl, getMockFetch } from './mock-fetch'

export async function createClient() {
  let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null
  try {
    cookieStore = await cookies()
  } catch {
    // Outside request scope (e.g. script, static generation, background task)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabasePublicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    'placeholder-anon-key'

  const isPlaceholder = isPlaceholderSupabaseUrl(supabaseUrl) || supabasePublicKey === 'placeholder-anon-key'

  return createServerClient(
    supabaseUrl,
    supabasePublicKey,
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : []
        },
        setAll(cookiesToSet) {
          if (!cookieStore) return
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      global: isPlaceholder
        ? {
            fetch: getMockFetch(),
          }
        : undefined,
    }
  )
}
