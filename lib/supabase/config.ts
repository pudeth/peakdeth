const REAL_SUPABASE_URL = 'https://bvcnxpfpvwvzonsttbmz.supabase.co'
const REAL_SUPABASE_KEY = 'sb_publishable_jUlsUiJWDne27I7z9sm0XA_GStfEDxE'

function isRealSupabaseUrl(url?: string | null): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed.startsWith('https://')) return false
  if (['placeholder', 'example', 'your-', 'your_'].some(bad => trimmed.toLowerCase().includes(bad))) return false
  return trimmed.includes('.supabase.co')
}

function isRealSupabaseKey(key?: string | null): boolean {
  if (!key) return false
  const trimmed = key.trim()
  if (trimmed.length < 20) return false
  if (['placeholder', 'your-', 'your_', 'example', 'change-me', 'secret_key'].some(bad => trimmed.toLowerCase().includes(bad))) return false
  return trimmed.startsWith('sb_') || trimmed.startsWith('eyJ')
}

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const validUrl = isRealSupabaseUrl(envUrl) ? envUrl!.trim() : REAL_SUPABASE_URL

const envPublishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const envAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const envService = process.env.SUPABASE_SERVICE_ROLE_KEY

const validAnonKey =
  (isRealSupabaseKey(envPublishable) && envPublishable!.trim()) ||
  (isRealSupabaseKey(envAnon) && envAnon!.trim()) ||
  (isRealSupabaseKey(envService) && envService!.trim()) ||
  REAL_SUPABASE_KEY

const validServiceRoleKey =
  (isRealSupabaseKey(envService) && envService!.trim()) ||
  validAnonKey

export const SUPABASE_CONFIG = {
  url: validUrl,
  anonKey: validAnonKey,
  serviceRoleKey: validServiceRoleKey,
}

export function isConfiguredSupabase(): boolean {
  return isRealSupabaseUrl(SUPABASE_CONFIG.url) && isRealSupabaseKey(SUPABASE_CONFIG.anonKey)
}

