export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bvcnxpfpvwvzonsttbmz.supabase.co',
  anonKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_jUlsUiJWDne27I7z9sm0XA_GStfEDxE',
  serviceRoleKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
         'sb_publishable_jUlsUiJWDne27I7z9sm0XA_GStfEDxE'),
}

export function isConfiguredSupabase(): boolean {
  return Boolean(SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.includes('placeholder'))
}
