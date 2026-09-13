import { createBrowserClient } from '@supabase/ssr'
import { isPlaceholderSupabaseUrl, getMockFetch } from './mock-fetch'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabasePublicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabasePublicKey) {
    throw new Error(
      'Missing Supabase public key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  const isPlaceholder = isPlaceholderSupabaseUrl(supabaseUrl)

  return createBrowserClient(
    supabaseUrl,
    supabasePublicKey,
    isPlaceholder
      ? {
          global: {
            fetch: getMockFetch(),
          },
        }
      : undefined
  )
}
