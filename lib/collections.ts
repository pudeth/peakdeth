import type { Collection, Photo } from '@/types/database'
import {
  getStoredCollections,
  getStoredPhotos,
  getStoredCollectionPhotos,
} from '@/lib/photos-storage'

export interface CollectionWithStats extends Collection {
  totalPhotos: number
  directPhotosCount: number
  subAlbums: number
  previewPhotos: string[]
  parentTitle?: string
}

export interface GalleryPhoto extends Photo {
  collection_id?: string
  collection_title?: string
  collection_slug?: string
}

export interface CollectionDetailData {
  collection: CollectionWithStats & {
    childCollections: CollectionWithStats[]
    parentCollection?: { title: string; slug: string }
    collectionType: 'main' | 'sub'
  }
  photos: Photo[]
}

import { isConfiguredSupabase } from '@/lib/supabase/config'

function isSupabasePlaceholder(): boolean {
  return !isConfiguredSupabase()
}

async function getSafeSupabaseClient() {
  if (isSupabasePlaceholder()) return null
  try {
    const { createClient } = await import('@/lib/supabase/server')
    return await createClient()
  } catch {
    return null
  }
}

/**
 * Fetch all collection_photos in batches to avoid PostgREST 1,000-row silent truncation.
 */
async function fetchAllCollectionPhotoLinks(supabase: any) {
  if (!supabase || isSupabasePlaceholder()) {
    const [storedPhotos, storedLinks] = await Promise.all([
      getStoredPhotos(),
      getStoredCollectionPhotos(),
    ])
    const photoMap = new Map(storedPhotos.map(p => [p.id, { id: p.id, image_url: p.image_url }]))
    return storedLinks.map(l => ({
      collection_id: l.collection_id,
      photo_id: l.photo_id,
      order: l.order,
      photos: photoMap.get(l.photo_id) || null,
    }))
  }

  const allLinks: {
    collection_id: string
    photo_id: string
    order: number
    photos: { id: string; image_url: string } | { id: string; image_url: string }[] | null
  }[] = []

  const PAGE_SIZE = 1000
  let from = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from('collection_photos')
      .select(`
        collection_id,
        photo_id,
        order,
        photos ( id, image_url )
      `)
      .order('order', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      if (!error.message?.includes('fetch failed') && !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        console.error('Error fetching collection_photos batch:', error)
      }
      break
    }

    if (data && data.length > 0) {
      allLinks.push(...(data as unknown as typeof allLinks))
      if (data.length < PAGE_SIZE) {
        hasMore = false
      } else {
        from += PAGE_SIZE
      }
    } else {
      hasMore = false
    }
  }

  if (allLinks.length === 0) {
    const [storedPhotos, storedLinks] = await Promise.all([
      getStoredPhotos(),
      getStoredCollectionPhotos(),
    ])
    const photoMap = new Map(storedPhotos.map(p => [p.id, { id: p.id, image_url: p.image_url }]))
    return storedLinks.map(l => ({
      collection_id: l.collection_id,
      photo_id: l.photo_id,
      order: l.order,
      photos: photoMap.get(l.photo_id) || null,
    }))
  }

  return allLinks
}

/**
 * Fetch all photos in batches to avoid PostgREST 1,000-row silent truncation.
 */
async function fetchAllPhotos(supabase: any): Promise<Photo[]> {
  if (!supabase || isSupabasePlaceholder()) {
    return await getStoredPhotos()
  }

  const allPhotos: Photo[] = []
  const PAGE_SIZE = 1000
  let from = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      if (!error.message?.includes('fetch failed') && !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        console.error('Error fetching photos batch:', error)
      }
      break
    }

    if (data && data.length > 0) {
      allPhotos.push(...(data as Photo[]))
      if (data.length < PAGE_SIZE) {
        hasMore = false
      } else {
        from += PAGE_SIZE
      }
    } else {
      hasMore = false
    }
  }

  if (allPhotos.length === 0) {
    return await getStoredPhotos()
  }

  return allPhotos
}

/**
 * Core engine to build collection hierarchy, count unique photos recursively, and gather preview collages.
 */
export async function getCollectionsHierarchy(): Promise<{
  allCollections: Collection[]
  rootCollections: CollectionWithStats[]
  collectionsMap: Map<string, CollectionWithStats>
  directPhotoIdsMap: Map<string, Set<string>>
  directPhotosMap: Map<string, { url: string; order: number }[]>
  childrenMap: Map<string, string[]>
}> {
  const supabase = await getSafeSupabaseClient()

  let allCollections: Collection[] = []

  if (supabase) {
    try {
      const { data, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('order', { ascending: true })

      if (!collectionsError && data && data.length > 0) {
        allCollections = data
      }
    } catch {}
  }

  if (allCollections.length === 0) {
    allCollections = await getStoredCollections()
  }

  if (allCollections.length === 0) {
    return {
      allCollections: [],
      rootCollections: [],
      collectionsMap: new Map(),
      directPhotoIdsMap: new Map(),
      directPhotosMap: new Map(),
      childrenMap: new Map(),
    }
  }

  // 2. Fetch all collection_photos with batch pagination
  const allLinks = await fetchAllCollectionPhotoLinks(supabase)

  // 3. Build maps for direct photo IDs and preview photos
  const directPhotoIdsMap = new Map<string, Set<string>>()
  const directPhotosMap = new Map<string, { url: string; order: number }[]>()

  for (const link of allLinks) {
    const rawPhoto = link.photos
    const photo = Array.isArray(rawPhoto) ? rawPhoto[0] : rawPhoto
    const photoId = link.photo_id || (photo && photo.id)

    if (link.collection_id && photoId) {
      const idSet = directPhotoIdsMap.get(link.collection_id) || new Set<string>()
      idSet.add(photoId)
      directPhotoIdsMap.set(link.collection_id, idSet)

      const imageUrl = photo?.image_url
      if (imageUrl) {
        const list = directPhotosMap.get(link.collection_id) || []
        list.push({ url: imageUrl, order: link.order || 0 })
        directPhotosMap.set(link.collection_id, list)
      }
    }
  }

  // 4. Build parent -> children map for hierarchy traversal
  const childrenMap = new Map<string, string[]>()
  for (const col of allCollections) {
    if (col.parent_id) {
      const siblings = childrenMap.get(col.parent_id) || []
      siblings.push(col.id)
      childrenMap.set(col.parent_id, siblings)
    }
  }

  // 5. Recursive tree-aggregation function for any collection node
  const computeStatsForNode = (nodeId: string) => {
    const photoIds = new Set<string>(directPhotoIdsMap.get(nodeId) || [])
    let subAlbums = 0
    const allPreviewPhotos: { url: string; order: number }[] = [
      ...(directPhotosMap.get(nodeId) || []),
    ]

    const queue = [nodeId]
    while (queue.length > 0) {
      const current = queue.shift()!
      const children = childrenMap.get(current) || []
      for (const childId of children) {
        const childPhotoIds = directPhotoIdsMap.get(childId) || []
        childPhotoIds.forEach((id) => photoIds.add(id))
        subAlbums += 1
        allPreviewPhotos.push(...(directPhotosMap.get(childId) || []))
        queue.push(childId)
      }
    }

    const previewPhotos = allPreviewPhotos
      .sort((a, b) => a.order - b.order)
      .slice(0, 3)
      .map((p) => p.url)

    return {
      totalPhotos: photoIds.size,
      directPhotosCount: (directPhotoIdsMap.get(nodeId) || new Set()).size,
      subAlbums,
      previewPhotos,
    }
  }

  // 6. Build enriched collections map
  const collectionsMap = new Map<string, CollectionWithStats>()
  for (const col of allCollections) {
    const stats = computeStatsForNode(col.id)
    let finalPreviews = stats.previewPhotos
    if (col.cover_image_url) {
      const filtered = stats.previewPhotos.filter((url) => url !== col.cover_image_url)
      finalPreviews = [col.cover_image_url, ...filtered].slice(0, 3)
    }

    const parentCol = col.parent_id
      ? allCollections.find((c) => c.id === col.parent_id)
      : undefined

    collectionsMap.set(col.id, {
      ...col,
      totalPhotos: stats.totalPhotos,
      directPhotosCount: stats.directPhotosCount,
      subAlbums: stats.subAlbums,
      previewPhotos: finalPreviews,
      parentTitle: parentCol?.title,
    })
  }

  // 7. Get root collections
  const rootCollections: CollectionWithStats[] = allCollections
    .filter((col) => !col.parent_id)
    .map((col) => collectionsMap.get(col.id)!)

  return {
    allCollections,
    rootCollections,
    collectionsMap,
    directPhotoIdsMap,
    directPhotosMap,
    childrenMap,
  }
}

/**
 * Fetch featured collections for homepage with fallback to top-level collections.
 * Strictly returns only Main Categories (root collections where parent_id is null).
 */
export async function getFeaturedCollections(): Promise<CollectionWithStats[]> {
  const { rootCollections } = await getCollectionsHierarchy()

  // Return all main categories (top-level root collections where parent_id is null)
  // Featured albums first, then sorted by order, then newest
  const sorted = [...rootCollections].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    if ((a.order ?? 0) !== (b.order ?? 0)) {
      return (a.order ?? 0) - (b.order ?? 0)
    }
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })

  return sorted.slice(0, 12)
}

/**
 * Fetch all gallery collections for /gallery page.
 * Returns all albums (both main and sub-albums) with parentTitle, plus accurate total photos count.
 */
export async function getGalleryCollections(): Promise<{
  collections: CollectionWithStats[]
  allCollections: CollectionWithStats[]
  rootCollections: CollectionWithStats[]
  totalPhotosCount: number
}> {
  const { allCollections, rootCollections, collectionsMap } = await getCollectionsHierarchy()
  const enrichedAll = allCollections
    .map((c) => collectionsMap.get(c.id)!)
    .filter(Boolean)
    .sort((a, b) => {
      // Main categories first, then sub-albums
      if (!a.parent_id && b.parent_id) return -1
      if (a.parent_id && !b.parent_id) return 1
      return (a.order ?? 0) - (b.order ?? 0)
    })

  const supabase = await getSafeSupabaseClient()
  let totalPhotosCount = 0
  if (supabase) {
    try {
      const { count } = await supabase.from('photos').select('*', { count: 'exact', head: true })
      totalPhotosCount = count || 0
    } catch {}
  }
  if (!totalPhotosCount) {
    const stored = await getStoredPhotos()
    totalPhotosCount = stored.length
  }

  return {
    collections: enrichedAll,
    allCollections: enrichedAll,
    rootCollections,
    totalPhotosCount,
  }
}

/**
 * Fetch all photos enriched with collection information for the gallery.
 */
export async function getAllPhotosForGallery(): Promise<GalleryPhoto[]> {
  const supabase = await getSafeSupabaseClient()
  if (supabase) {
    try {
      // Fetch all photos
      const { data: allDbPhotos } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch all collection photo links with collection info
      const { data: links } = await supabase
        .from('collection_photos')
        .select(`
          collection_id,
          photo_id,
          collections ( id, title, slug )
        `)

      const colMapByPhoto = new Map<string, { id: string; title: string; slug: string }>()
      if (links) {
        for (const item of links) {
          const col = item.collections as unknown as { id: string; title: string; slug: string } | null
          if (col && !colMapByPhoto.has(item.photo_id)) {
            colMapByPhoto.set(item.photo_id, col)
          }
        }
      }

      if (allDbPhotos && allDbPhotos.length > 0) {
        return allDbPhotos.map((p) => {
          const col = colMapByPhoto.get(p.id)
          return {
            ...p,
            collection_id: col?.id,
            collection_title: col?.title,
            collection_slug: col?.slug,
          }
        })
      }
    } catch (err) {
      console.error('Error fetching all photos for gallery:', err)
    }
  }

  // Fallback to local files
  const [storedPhotos, storedLinks, storedCols] = await Promise.all([
    getStoredPhotos(),
    getStoredCollectionPhotos(),
    getStoredCollections(),
  ])
  const colLookup = new Map(storedCols.map((c) => [c.id, c]))
  const linkLookup = new Map(storedLinks.map((l) => [l.photo_id, l.collection_id]))

  return storedPhotos.map((p) => {
    const colId = linkLookup.get(p.id)
    const col = colId ? colLookup.get(colId) : undefined
    return {
      ...p,
      collection_id: colId,
      collection_title: col?.title,
      collection_slug: col?.slug,
    }
  })
}

/**
 * Fetch a single collection by slug (or ID) with all direct photos and sub-collections.
 */
export async function getCollectionDetail(slug: string): Promise<CollectionDetailData | null> {
  const supabase = await getSafeSupabaseClient()

  // Handle special 'root' uncategorized collection
  if (slug === 'root') {
    const [rawPhotos, allLinks] = await Promise.all([
      fetchAllPhotos(supabase),
      fetchAllCollectionPhotoLinks(supabase),
    ])

    const linkedIds = new Set(allLinks.map((r) => r.photo_id))
    const rootPhotos = rawPhotos.filter((p) => !linkedIds.has(p.id))
    const now = new Date().toISOString()

    const rootCollectionStats: CollectionWithStats = {
      id: 'root-uncategorized',
      title: 'Root Album',
      slug: 'root',
      description: 'Photos uploaded without assigning to a collection',
      parent_id: undefined,
      order: -1,
      created_at: now,
      updated_at: now,
      totalPhotos: rootPhotos.length,
      directPhotosCount: rootPhotos.length,
      subAlbums: 0,
      previewPhotos: rootPhotos.slice(0, 3).map((p) => p.image_url),
    }

    return {
      collection: {
        ...rootCollectionStats,
        childCollections: [],
        collectionType: 'sub',
      },
      photos: rootPhotos,
    }
  }

  const { allCollections, collectionsMap, childrenMap } = await getCollectionsHierarchy()

  const decodedSlug = decodeURIComponent(slug).toLowerCase()
  const targetCol = allCollections.find(
    (c) => c.slug.toLowerCase() === decodedSlug || c.id === slug
  )

  if (!targetCol) return null

  const targetStats = collectionsMap.get(targetCol.id)!

  // Child collections
  const childIds = childrenMap.get(targetCol.id) || []
  const childCollections: CollectionWithStats[] = childIds
    .map((id) => collectionsMap.get(id))
    .filter(Boolean) as CollectionWithStats[]

  // Parent collection
  const parentCol = targetCol.parent_id
    ? allCollections.find((c) => c.id === targetCol.parent_id)
    : undefined

  // Direct photos for this collection
  let photos: Photo[] = []

  if (supabase) {
    try {
      const { data: directPhotoLinks } = await supabase
        .from('collection_photos')
        .select(`
          order,
          photos (*)
        `)
        .eq('collection_id', targetCol.id)
        .order('order', { ascending: true })

      const photoLinks = (directPhotoLinks || []) as unknown as { photos: Photo | Photo[] | null }[]
      photos = photoLinks
        .map((link) => {
          const raw = link.photos
          return Array.isArray(raw) ? raw[0] : raw
        })
        .filter(Boolean) as Photo[]
    } catch {}
  }

  // If direct photos are empty, aggregate photos from all child collections
  if (photos.length === 0 && childIds.length > 0) {
    const allDescendantIds = new Set<string>()
    const q = [...childIds]
    while (q.length > 0) {
      const cur = q.shift()!
      allDescendantIds.add(cur)
      const nextChildren = childrenMap.get(cur) || []
      for (const nc of nextChildren) q.push(nc)
    }

    if (supabase) {
      try {
        const { data: descendantPhotoLinks } = await supabase
          .from('collection_photos')
          .select(`
            order,
            photos (*)
          `)
          .in('collection_id', Array.from(allDescendantIds))
          .order('order', { ascending: true })

        const photoLinks = (descendantPhotoLinks || []) as unknown as { photos: Photo | Photo[] | null }[]
        const seen = new Set<string>()
        photos = photoLinks
          .map((link) => {
            const raw = link.photos
            return Array.isArray(raw) ? raw[0] : raw
          })
          .filter((p): p is Photo => {
            if (!p || seen.has(p.id)) return false
            seen.add(p.id)
            return true
          })
      } catch {}
    }

    if (photos.length === 0) {
      const [allStoredPhotos, allStoredLinks] = await Promise.all([
        getStoredPhotos(),
        getStoredCollectionPhotos(),
      ])
      const colLinks = allStoredLinks
        .filter((l) => allDescendantIds.has(l.collection_id))
        .sort((a, b) => a.order - b.order)
      const photoMap = new Map(allStoredPhotos.map((p) => [p.id, p]))
      const seen = new Set<string>()
      photos = colLinks
        .map((l) => photoMap.get(l.photo_id))
        .filter((p): p is Photo => {
          if (!p || seen.has(p.id)) return false
          seen.add(p.id)
          return true
        })
    }
  }

  if (photos.length === 0) {
    const [allStoredPhotos, allStoredLinks] = await Promise.all([
      getStoredPhotos(),
      getStoredCollectionPhotos(),
    ])
    const colLinks = allStoredLinks
      .filter(l => l.collection_id === targetCol.id)
      .sort((a, b) => a.order - b.order)
    const photoMap = new Map(allStoredPhotos.map(p => [p.id, p]))
    photos = colLinks.map(l => photoMap.get(l.photo_id)).filter((p): p is Photo => Boolean(p))
  }

  return {
    collection: {
      ...targetStats,
      childCollections,
      parentCollection: parentCol ? { title: parentCol.title, slug: parentCol.slug } : undefined,
      collectionType: targetCol.parent_id ? 'sub' : 'main',
    },
    photos,
  }
}