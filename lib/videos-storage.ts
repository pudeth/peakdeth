import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import type { Video } from '@/types/database'

const DATA_DIR = path.join(process.cwd(), 'data')
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json')

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true })
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    let raw = await readFile(filePath, 'utf-8')
    if (raw.charCodeAt(0) === 0xFEFF) {
      raw = raw.slice(1)
    }
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await ensureDir()
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Failed to write JSON file ${filePath}:`, error)
  }
}

function isSupabasePlaceholder(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !url || url.includes('placeholder')
}

export async function getStoredVideos(): Promise<Video[]> {
  const videos = await readJsonFile<Video[]>(VIDEOS_FILE, [])
  return videos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function saveStoredVideos(videos: Video[]): Promise<Video[]> {
  await writeJsonFile(VIDEOS_FILE, videos)
  return videos
}

export async function insertStoredVideo(v: Partial<Video>): Promise<Video> {
  const videos = await getStoredVideos()
  const now = new Date().toISOString()
  const title = (v.title || 'Untitled Video').trim()
  const baseSlug = (v.slug || title).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `video-${Date.now()}`

  let uniqueSlug = baseSlug
  let counter = 1
  while (videos.some(item => item.slug.toLowerCase() === uniqueSlug && item.id !== v.id)) {
    uniqueSlug = `${baseSlug}-${counter}`
    counter++
  }

  const newVideo: Video = {
    id: v.id || crypto.randomUUID(),
    title,
    slug: uniqueSlug,
    video_url: v.video_url || '',
    video_type: v.video_type || 'youtube',
    thumbnail_url: v.thumbnail_url || undefined,
    description: v.description || '',
    category: v.category || '',
    year: v.year || new Date().getFullYear(),
    tags: v.tags || [],
    is_active: v.is_active ?? true,
    featured: v.featured ?? false,
    order: typeof v.order === 'number' ? v.order : videos.length,
    created_at: v.created_at || now,
    updated_at: now,
  }

  videos.push(newVideo)
  await writeJsonFile(VIDEOS_FILE, videos)

  if (!isSupabasePlaceholder()) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await supabase.from('videos').insert([newVideo])
    } catch (e) {
      console.warn('Failed to mirror video insert to Supabase:', e)
    }
  }

  return newVideo
}

export async function updateStoredVideo(id: string, updates: Partial<Video>): Promise<Video | null> {
  const videos = await getStoredVideos()
  const index = videos.findIndex(v => v.id === id)
  if (index === -1) return null

  const updatedFields = { ...updates }
  if (updatedFields.slug) {
    const baseSlug = updatedFields.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `video-${Date.now()}`
    let uniqueSlug = baseSlug
    let counter = 1
    while (videos.some(item => item.slug.toLowerCase() === uniqueSlug && item.id !== id)) {
      uniqueSlug = `${baseSlug}-${counter}`
      counter++
    }
    updatedFields.slug = uniqueSlug
  }

  const updated: Video = {
    ...videos[index],
    ...updatedFields,
    updated_at: new Date().toISOString(),
  }
  videos[index] = updated
  await writeJsonFile(VIDEOS_FILE, videos)

  if (!isSupabasePlaceholder()) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await supabase.from('videos').update(updatedFields).eq('id', id)
    } catch (e) {
      console.warn('Failed to mirror video update to Supabase:', e)
    }
  }

  return updated
}

export async function deleteStoredVideo(id: string): Promise<boolean> {
  const videos = await getStoredVideos()
  const filtered = videos.filter(v => v.id !== id)
  await writeJsonFile(VIDEOS_FILE, filtered)

  if (!isSupabasePlaceholder()) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await supabase.from('videos').delete().eq('id', id)
    } catch (e) {
      console.warn('Failed to mirror video delete to Supabase:', e)
    }
  }

  return true
}
