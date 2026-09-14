import { getGalleryCollections, getAllPhotosForGallery } from '@/lib/collections'
import { GalleryView } from '@/components/gallery-view'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Gallery | Peak Deth',
  description: 'Explore all photo albums and images by Peak Deth.',
}

export default async function GalleryPage() {
  const [{ collections, totalPhotosCount }, photos] = await Promise.all([
    getGalleryCollections(),
    getAllPhotosForGallery(),
  ])

  return (
    <main className="min-h-screen bg-[#030303]">
      <GalleryView
        collections={collections}
        photos={photos}
        totalPhotosCount={totalPhotosCount}
      />
    </main>
  )
}
