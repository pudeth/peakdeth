import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import type { Photo, Collection, CollectionPhoto } from '@/types/database'

const DATA_DIR = path.join(process.cwd(), 'data')
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json')
const COLLECTIONS_FILE = path.join(DATA_DIR, 'collections.json')
const COLLECTION_PHOTOS_FILE = path.join(DATA_DIR, 'collection_photos.json')
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

import { readJsonStorage, writeJsonStorage } from '@/lib/server-storage'

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  const filename = path.basename(filePath)
  return await readJsonStorage(filename, fallback)
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const filename = path.basename(filePath)
  await writeJsonStorage(filename, data)
}

function isSupabasePlaceholder(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !url || url.includes('placeholder')
}

// ----------------------------------------------------------------------
// PHOTOS
// ----------------------------------------------------------------------

export async function getStoredPhotos(): Promise<Photo[]> {
  let photos = await readJsonFile<Photo[]>(PHOTOS_FILE, [])

  // Auto-seed existing uploads if photos file is empty
  if (photos.length === 0) {
    try {
      const files = await readdir(UPLOADS_DIR)
      const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      if (imageFiles.length > 0) {
        const now = new Date().toISOString()
        photos = imageFiles.map((file, idx) => {
          const publicUrl = `/uploads/${file}`
          return {
            id: crypto.randomUUID(),
            title: `Photo ${idx + 1}`,
            image_url: publicUrl,
            image_id: publicUrl,
            image_width: 1920,
            image_height: 1080,
            alt: `Photo ${idx + 1}`,
            caption: '',
            description: '',
            order: idx,
            featured: idx < 4,
            created_at: now,
            updated_at: now,
          }
        })
        await writeJsonFile(PHOTOS_FILE, photos)
      }
    } catch {
      // uploads folder might not exist yet
    }
  }

  return photos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function saveStoredPhotos(photos: Photo[]): Promise<Photo[]> {
  await writeJsonFile(PHOTOS_FILE, photos)
  return photos
}

export async function insertStoredPhotos(newPhotos: Partial<Photo>[]): Promise<Photo[]> {
  const existing = await getStoredPhotos()
  const now = new Date().toISOString()

  const created: Photo[] = newPhotos.map((p, idx) => {
    const id = p.id || crypto.randomUUID()
    return {
      id,
      title: p.title || `Photo ${Date.now() + idx}`,
      image_url: p.image_url || '',
      image_id: p.image_id || p.image_url || '',
      image_width: p.image_width,
      image_height: p.image_height,
      alt: p.alt || p.title || '',
      caption: p.caption,
      description: p.description,
      camera: p.camera,
      lens: p.lens,
      settings: p.settings || {},
      location: p.location,
      date_taken: p.date_taken,
      featured: p.featured ?? false,
      order: typeof p.order === 'number' ? p.order : existing.length + idx,
      created_at: p.created_at || now,
      updated_at: now,
    }
  })

  const updatedList = [...created, ...existing]
  await writeJsonFile(PHOTOS_FILE, updatedList)

  // Try mirroring to Supabase if valid
  if (!isSupabasePlaceholder()) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('photos').insert(created)
    } catch (e) {
      console.warn('Failed to mirror photos to Supabase:', e)
    }
  }

  return created
}

export async function updateStoredPhoto(id: string, updates: Partial<Photo>): Promise<Photo | null> {
  const photos = await getStoredPhotos()
  const index = photos.findIndex(p => p.id === id)
  if (index === -1) return null

  const updated: Photo = {
    ...photos[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  photos[index] = updated
  await writeJsonFile(PHOTOS_FILE, photos)

  if (!isSupabasePlaceholder()) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('photos').update(updates).eq('id', id)
    } catch (e) {
      console.warn('Failed to mirror photo update to Supabase:', e)
    }
  }

  return updated
}

export async function deleteStoredPhotos(ids: string[]): Promise<boolean> {
  const idSet = new Set(ids)
  const photos = await getStoredPhotos()
  const filtered = photos.filter(p => !idSet.has(p.id))
  await writeJsonFile(PHOTOS_FILE, filtered)

  // Also remove from collection_photos
  const links = await getStoredCollectionPhotos()
  const remainingLinks = links.filter(l => !idSet.has(l.photo_id))
  await writeJsonFile(COLLECTION_PHOTOS_FILE, remainingLinks)

  if (!isSupabasePlaceholder()) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('photos').delete().in('id', ids)
    } catch (e) {
      console.warn('Failed to mirror photo delete to Supabase:', e)
    }
  }

  return true
}

// ----------------------------------------------------------------------
// COLLECTIONS
// ----------------------------------------------------------------------

export async function getStoredCollections(): Promise<Collection[]> {
  let collections = await readJsonFile<Collection[]>(COLLECTIONS_FILE, [])

  // Auto-seed default collection only if empty
  if (collections.length === 0) {
    const photos = await getStoredPhotos()
    const coverUrl = photos[0]?.image_url || ''
    const now = new Date().toISOString()
    const defaultCol: Collection = {
      id: 'col-featured-works',
      title: 'Selected Works',
      slug: 'selected-works',
      description: 'Featured photography and digital projects',
      cover_image_url: coverUrl,
      featured: true,
      order: 0,
      created_at: now,
      updated_at: now,
    }
    collections = [defaultCol]
    await writeJsonFile(COLLECTIONS_FILE, collections)

    // Also link initial photos to this default collection
    if (photos.length > 0) {
      const links: CollectionPhoto[] = photos.map((p, idx) => ({
        id: crypto.randomUUID(),
        collection_id: defaultCol.id,
        photo_id: p.id,
        order: idx,
        created_at: now,
      }))
      await writeJsonFile(COLLECTION_PHOTOS_FILE, links)
    }
  }

  // Cleanup & deduplicate slugs and orphaned parents
  const idSet = new Set(collections.map(c => c.id))
  const seenSlugs = new Set<string>()
  let modified = false

  for (const col of collections) {
    // 1. Fix orphan parent_id if parent no longer exists
    if (col.parent_id && !idSet.has(col.parent_id)) {
      col.parent_id = undefined
      modified = true
    }

    // 2. Ensure unique slug (case-insensitive)
    const base = (col.slug || col.title || 'album').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 'album'
    let uniqueSlug = base
    let counter = 1
    while (seenSlugs.has(uniqueSlug)) {
      uniqueSlug = `${base}-${counter}`
      counter++
    }
    if (col.slug !== uniqueSlug) {
      col.slug = uniqueSlug
      modified = true
    }
    seenSlugs.add(uniqueSlug)
  }

  if (modified) {
    await writeJsonFile(COLLECTIONS_FILE, collections)
  }

  return collections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function saveStoredCollections(cols: Collection[]): Promise<Collection[]> {
  await writeJsonFile(COLLECTIONS_FILE, cols)
  return cols
}

export async function insertStoredCollection(col: Partial<Collection>): Promise<Collection> {
  const collections = await getStoredCollections()
  const now = new Date().toISOString()
  const title = (col.title || 'Untitled Collection').trim()
  const baseSlug = (col.slug || title).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `album-${Date.now()}`

  let uniqueSlug = baseSlug
  let counter = 1
  while (collections.some(c => c.slug.toLowerCase() === uniqueSlug && c.id !== col.id)) {
    uniqueSlug = `${baseSlug}-${counter}`
    counter++
  }

  const newCol: Collection = {
    id: col.id || crypto.randomUUID(),
    title,
    slug: uniqueSlug,
    description: col.description || '',
    cover_image_url: col.cover_image_url || undefined,
    parent_id: col.parent_id || undefined,
    featured: col.featured ?? false,
    order: typeof col.order === 'number' ? col.order : collections.length,
    created_at: now,
    updated_at: now,
  }

  collections.push(newCol)
  await writeJsonFile(COLLECTIONS_FILE, collections)

  if (!isSupabasePlaceholder()) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('collections').insert([newCol])
    } catch (e) {
      console.warn('Failed to mirror collection insert to Supabase:', e)
    }
  }

  return newCol
}

export async function updateStoredCollection(id: string, updates: Partial<Collection>): Promise<Collection | null> {
  const collections = await getStoredCollections()
  const index = collections.findIndex(c => c.id === id)
  if (index === -1) return null

  const updatedFields = { ...updates }
  if (updatedFields.slug) {
    const baseSlug = updatedFields.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `album-${Date.now()}`
    let uniqueSlug = baseSlug
    let counter = 1
    while (collections.some(c => c.slug.toLowerCase() === uniqueSlug && c.id !== id)) {
      uniqueSlug = `${baseSlug}-${counter}`
      counter++
    }
    updatedFields.slug = uniqueSlug
  }

  const updated: Collection = {
    ...collections[index],
    ...updatedFields,
    updated_at: new Date().toISOString(),
  }
  collections[index] = updated
  await writeJsonFile(COLLECTIONS_FILE, collections)

  if (!isSupabasePlaceholder()) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('collections').update(updatedFields).eq('id', id)
    } catch (e) {
      console.warn('Failed to mirror collection update to Supabase:', e)
    }
  }

  return updated
}

export async function deleteStoredCollection(id: string): Promise<boolean> {
  const collections = await getStoredCollections()

  // Recursively find all descendant collections (cascade delete)
  const toDelete = new Set<string>([id])
  let added = true
  while (added) {
    added = false
    for (const c of collections) {
      if (c.parent_id && toDelete.has(c.parent_id) && !toDelete.has(c.id)) {
        toDelete.add(c.id)
        added = true
      }
    }
  }

  const filtered = collections.filter(c => !toDelete.has(c.id))
  await writeJsonFile(COLLECTIONS_FILE, filtered)

  // Unlink associated photos for all deleted collections
  const links = await getStoredCollectionPhotos()
  const remainingLinks = links.filter(l => !toDelete.has(l.collection_id))
  await writeJsonFile(COLLECTION_PHOTOS_FILE, remainingLinks)

  if (!isSupabasePlaceholder()) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('collections').delete().in('id', Array.from(toDelete))
    } catch (e) {
      console.warn('Failed to mirror collection delete to Supabase:', e)
    }
  }

  return true
}

// ----------------------------------------------------------------------
// JUNCTION: COLLECTION_PHOTOS
// ----------------------------------------------------------------------

export async function getStoredCollectionPhotos(): Promise<CollectionPhoto[]> {
  return await readJsonFile<CollectionPhoto[]>(COLLECTION_PHOTOS_FILE, [])
}

export async function linkStoredPhotosToCollection(
  links: { collection_id: string; photo_id: string; order?: number }[]
): Promise<CollectionPhoto[]> {
  const existing = await getStoredCollectionPhotos()
  const now = new Date().toISOString()
  const created: CollectionPhoto[] = []

  for (const item of links) {
    if (!item.collection_id || !item.photo_id) continue
    const alreadyLinked = existing.some(
      l => l.collection_id === item.collection_id && l.photo_id === item.photo_id
    )
    if (!alreadyLinked) {
      const newLink: CollectionPhoto = {
        id: crypto.randomUUID(),
        collection_id: item.collection_id,
        photo_id: item.photo_id,
        order: typeof item.order === 'number' ? item.order : existing.length + created.length,
        created_at: now,
      }
      existing.push(newLink)
      created.push(newLink)
    }
  }

  await writeJsonFile(COLLECTION_PHOTOS_FILE, existing)

  if (!isSupabasePlaceholder() && created.length > 0) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('collection_photos').insert(
        created.map(c => ({
          collection_id: c.collection_id,
          photo_id: c.photo_id,
          order: c.order,
        }))
      )
    } catch (e) {
      console.warn('Failed to mirror collection_photos to Supabase:', e)
    }
  }

  return created
}

export async function unlinkStoredPhotos(collection_id: string, photo_ids?: string[]): Promise<boolean> {
  const existing = await getStoredCollectionPhotos()
  let filtered: CollectionPhoto[]

  if (photo_ids && photo_ids.length > 0) {
    const photoIdSet = new Set(photo_ids)
    filtered = existing.filter(
      l => !(l.collection_id === collection_id && photoIdSet.has(l.photo_id))
    )
  } else {
    filtered = existing.filter(l => l.collection_id !== collection_id)
  }

  await writeJsonFile(COLLECTION_PHOTOS_FILE, filtered)

  if (!isSupabasePlaceholder()) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      let query = supabase.from('collection_photos').delete().eq('collection_id', collection_id)
      if (photo_ids && photo_ids.length > 0) {
        query = query.in('photo_id', photo_ids)
      }
      await query
    } catch (e) {
      console.warn('Failed to mirror unlink to Supabase:', e)
    }
  }

  return true
}