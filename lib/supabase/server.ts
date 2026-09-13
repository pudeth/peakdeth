import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isPlaceholderSupabaseUrl, getMockFetch } from './mock-fetch'
import { SUPABASE_CONFIG, isConfiguredSupabase } from './config'

export async function createClient() {
  let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null
  try {
    cookieStore = await cookies()
  } catch {
    // Outside request scope (e.g. script, static generation, background task)
  }

  const supabaseUrl = SUPABASE_CONFIG.url
  const supabasePublicKey = SUPABASE_CONFIG.anonKey
  const isPlaceholder = !isConfiguredSupabase()

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

export function createAdminClient() {
  const supabaseUrl = SUPABASE_CONFIG.url
  const keyToUse = SUPABASE_CONFIG.serviceRoleKey
  const isPlaceholder = !isConfiguredSupabase()

  return createServerClient(
    supabaseUrl,
    keyToUse,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
      global: isPlaceholder
        ? {
            fetch: getMockFetch(),
          }
        : undefined,
    }
  )
}
