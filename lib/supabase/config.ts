const REAL_SUPABASE_URL = 'https://bvcnxpfpvwvzonsttbmz.supabase.co'
const REAL_SUPABASE_KEY = 'sb_publishable_jUlsUiJWDne27I7z9sm0XA_GStfEDxE'

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const isValidEnvUrl = Boolean(envUrl && !envUrl.includes('placeholder'))

const envPublishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const envAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const envService = process.env.SUPABASE_SERVICE_ROLE_KEY

const validKey =
  (envPublishable && !envPublishable.includes('placeholder') && envPublishable) ||
  (envAnon && !envAnon.includes('placeholder') && envAnon) ||
  (envService && !envService.includes('placeholder') && envService) ||
  REAL_SUPABASE_KEY

export const SUPABASE_CONFIG = {
  url: isValidEnvUrl ? envUrl! : REAL_SUPABASE_URL,
  anonKey: validKey,
  serviceRoleKey: (envService && !envService.includes('placeholder')) ? envService : validKey,
}

export function isConfiguredSupabase(): boolean {
  return Boolean(SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.includes('placeholder'))
}
