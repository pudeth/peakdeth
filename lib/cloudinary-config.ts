const REAL_CLOUDINARY_CLOUD_NAME = 'dpz7vpmf8'
const REAL_CLOUDINARY_API_KEY = '617524462118688'
const REAL_CLOUDINARY_API_SECRET = 'PpQ_E0PPEKBZS7gSinrBWSYaI5M'

export function isRealCloudinary(value?: string | null): boolean {
  if (!value) return false
  const trimmed = value.trim()
  if (trimmed === '') return false
  if (trimmed.includes('placeholder')) return false
  if (trimmed.includes('your-') || trimmed.includes('your_')) return false
  return true
}

export function getCloudinaryConfig() {
  const envCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  const envApiKey = process.env.CLOUDINARY_API_KEY ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  const envApiSecret = process.env.CLOUDINARY_API_SECRET

  const cloudName = isRealCloudinary(envCloudName) ? envCloudName! : REAL_CLOUDINARY_CLOUD_NAME
  const apiKey = isRealCloudinary(envApiKey) ? envApiKey! : REAL_CLOUDINARY_API_KEY
  const apiSecret = isRealCloudinary(envApiSecret) ? envApiSecret! : REAL_CLOUDINARY_API_SECRET

  return {
    cloudName,
    apiKey,
    apiSecret,
    isConfigured: Boolean(cloudName && apiKey && apiSecret),
  }
}
