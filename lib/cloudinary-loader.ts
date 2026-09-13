import { buildCloudinaryUrl, extractCloudinaryPublicId } from './cloudinary'

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (!src || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('/')) {
    return src
  }

  const publicId = extractCloudinaryPublicId(src)
  
  if (!publicId) {
    // If we can't extract a Cloudinary public ID (e.g. for YouTube/Vimeo thumbnails),
    // just return the original source URL. It won't be optimized by Vercel,
    // which saves costs, and loads directly from the original source.
    return src
  }

  return buildCloudinaryUrl(publicId, {
    width,
    quality: quality || 'auto',
    format: 'auto',
    crop: 'scale',
  })
}
