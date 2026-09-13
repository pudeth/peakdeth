import { createBrowserClient } from '@supabase/ssr'
import { isPlaceholderSupabaseUrl, getMockFetch } from './mock-fetch'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabasePublicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    'placeholder-anon-key'

  const isPlaceholder = isPlaceholderSupabaseUrl(supabaseUrl) || supabasePublicKey === 'placeholder-anon-key'

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
