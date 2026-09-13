import { createBrowserClient } from '@supabase/ssr'
import { isPlaceholderSupabaseUrl, getMockFetch } from './mock-fetch'
import { SUPABASE_CONFIG, isConfiguredSupabase } from './config'

export function createClient() {
  const supabaseUrl = SUPABASE_CONFIG.url
  const supabasePublicKey = SUPABASE_CONFIG.anonKey
  const isPlaceholder = !isConfiguredSupabase()

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
