import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCloudinaryConfig } from '@/lib/cloudinary-config'
import {
  getStoredPhotos,
  insertStoredPhotos,
  getStoredCollectionPhotos,
  linkStoredPhotosToCollection,
  getStoredCollections,
  insertStoredCollection,
  updateStoredCollection,
} from '@/lib/photos-storage'

async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const isDevAdmin = cookieStore.get('admin_dev_session')?.value === 'true'
  if (isDevAdmin) return true

  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    return !error && !!user
  } catch {
    return false
  }
}

interface CloudinaryResource {
  asset_id: string
  public_id: string
  format: string
  version: number
  resource_type: string
  type: string
  created_at: string
  bytes: number
  width: number
  height: number
  asset_folder?: string
  display_name?: string
  secure_url: string
}

async function fetchCloudinaryResources(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  prefix: string
): Promise<CloudinaryResource[]> {
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  let allResources: CloudinaryResource[] = []
  let nextCursor: string | null = null

  do {
    let url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${encodeURIComponent(prefix)}&max_results=500`
    if (nextCursor) {
      url += `&next_cursor=${encodeURIComponent(nextCursor)}`
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error(`Failed to fetch Cloudinary resources for ${prefix}:`, errText)
      break
    }

    const data = await res.json()
    if (Array.isArray(data.resources)) {
      allResources.push(...data.resources)
    }
    nextCursor = data.next_cursor || null
  } while (nextCursor)

  return allResources
}

function formatAlbumTitle(slug: string): string {
  return slug
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as {
      folder?: string
      collection_id?: string
    }

    const { cloudName, apiKey, apiSecret, isConfigured } = getCloudinaryConfig()
    if (!isConfigured) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured with real credentials' },
        { status: 500 }
      )
    }

    let allCollections = await getStoredCollections()
    let targetCollectionId = body.collection_id

    let prefix = body.folder?.trim()
    if (!prefix) {
      if (targetCollectionId) {
        const matchedCol = allCollections.find(c => c.id === targetCollectionId)
        if (matchedCol) {
          prefix = `rithychanvirak/collections/${matchedCol.slug}`
        }
      }
      if (!prefix) {
        prefix = 'rithychanvirak/collections'
      }
    }

    const resources = await fetchCloudinaryResources(cloudName, apiKey, apiSecret, prefix)

    if (resources.length === 0) {
      return NextResponse.json({
        success: true,
        message: `No images found in Cloudinary folder ${prefix}`,
        totalFound: 0,
        syncedCount: 0,
      })
    }

    // Trip or primary parent collection ID
    const tripCollection = allCollections.find(c => c.slug === 'trip' || c.title.toLowerCase() === 'trip')
    const defaultParentId = tripCollection ? tripCollection.id : undefined

    // 1. Auto-discover albums from Cloudinary folder structure
    const albumsCreated: string[] = []
    const folderSlugToCollectionMap = new Map<string, string>()

    for (const c of allCollections) {
      folderSlugToCollectionMap.set(c.slug.toLowerCase(), c.id)
    }

    for (const r of resources) {
      const parts = r.public_id.split('/')
      // If path is like rithychanvirak/collections/[album_slug]/[image_name]
      if (parts.length >= 4 && parts[0] === 'rithychanvirak' && parts[1] === 'collections') {
        const albumSlug = parts[2].toLowerCase()
        if (!folderSlugToCollectionMap.has(albumSlug)) {
          const title = formatAlbumTitle(albumSlug)
          const newAlbum = await insertStoredCollection({
            title,
            slug: albumSlug,
            parent_id: defaultParentId,
            cover_image_url: r.secure_url,
          })
          folderSlugToCollectionMap.set(albumSlug, newAlbum.id)
          albumsCreated.push(title)
        }
      }
    }

    // Refresh collections list if new albums were created
    if (albumsCreated.length > 0) {
      allCollections = await getStoredCollections()
    }

    // 2. Get current photos in DB & insert missing ones
    let existingPhotos = await getStoredPhotos()
    const existingImageMap = new Map<string, typeof existingPhotos[0]>()
    existingPhotos.forEach(p => existingImageMap.set(p.image_id, p))

    const missingResources = resources.filter(r => !existingImageMap.has(r.public_id))
    const batchSize = 25
    let totalInserted = 0

    for (let i = 0; i < missingResources.length; i += batchSize) {
      const chunk = missingResources.slice(i, i + batchSize)
      const photosToInsert = chunk.map((r, idx) => ({
        title: r.display_name || `Photo ${existingPhotos.length + totalInserted + idx + 1}`,
        image_url: r.secure_url,
        image_id: r.public_id,
        image_width: r.width || 1200,
        image_height: r.height || 800,
        alt: r.display_name || 'Photo',
        date_taken: r.created_at,
        order: existingPhotos.length + totalInserted + idx,
      }))

      const inserted = await insertStoredPhotos(photosToInsert)
      totalInserted += inserted.length
      inserted.forEach(p => existingImageMap.set(p.image_id, p))
    }

    // 3. Link photos to their respective collections
    const existingLinks = await getStoredCollectionPhotos()
    const linkedSet = new Set(existingLinks.map(l => `${l.collection_id}-${l.photo_id}`))
    const linksToInsert: Array<{ collection_id: string; photo_id: string; order: number }> = []

    for (let idx = 0; idx < resources.length; idx++) {
      const r = resources[idx]
      const photo = existingImageMap.get(r.public_id)
      if (!photo) continue

      let colId = targetCollectionId

      if (!colId) {
        const parts = r.public_id.split('/')
        if (parts.length >= 4 && parts[0] === 'rithychanvirak' && parts[1] === 'collections') {
          const albumSlug = parts[2].toLowerCase()
          colId = folderSlugToCollectionMap.get(albumSlug)
        }
      }

      if (colId) {
        const key = `${colId}-${photo.id}`
        if (!linkedSet.has(key)) {
          linkedSet.add(key)
          linksToInsert.push({
            collection_id: colId,
            photo_id: photo.id,
            order: existingLinks.length + linksToInsert.length,
          })
        }
      }
    }

    if (linksToInsert.length > 0) {
      await linkStoredPhotosToCollection(linksToInsert)
    }

    // 4. Update album cover images if they don't have one
    for (const [slug, colId] of folderSlugToCollectionMap.entries()) {
      const col = allCollections.find(c => c.id === colId)
      if (col && !col.cover_image_url) {
        const firstPhotoInAlbum = resources.find(r => r.public_id.includes(`/collections/${slug}/`))
        if (firstPhotoInAlbum) {
          await updateStoredCollection(colId, { cover_image_url: firstPhotoInAlbum.secure_url })
        }
      }
    }

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/photos')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    let message = `Cloudinary sync complete: ${totalInserted} new photos imported, ${linksToInsert.length} photos linked.`
    if (albumsCreated.length > 0) {
      message += ` Auto-created ${albumsCreated.length} album(s): ${albumsCreated.join(', ')}.`
    }

    return NextResponse.json({
      success: true,
      message,
      totalFound: resources.length,
      syncedCount: totalInserted,
      linkedCount: linksToInsert.length,
      albumsCreated,
    })
  } catch (error: any) {
    console.error('Error in POST /api/cloudinary/sync:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to sync with Cloudinary' },
      { status: 500 }
    )
  }
}
