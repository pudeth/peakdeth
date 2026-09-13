import { getGalleryCollections } from '@/lib/collections'
import { GalleryView } from '@/components/gallery-view'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Gallery | Peak Deth',
  description: 'Explore photo collections and albums by Peak Deth.',
}

export default async function GalleryPage() {
  const { collections, totalPhotosCount } = await getGalleryCollections()

  return (
    <main className="min-h-screen bg-[#030303]">
      <GalleryView collections={collections} totalPhotosCount={totalPhotosCount} />
    </main>
  )
}
