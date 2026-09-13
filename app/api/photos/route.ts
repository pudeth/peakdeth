import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  getStoredPhotos,
  insertStoredPhotos,
  updateStoredPhoto,
  deleteStoredPhotos,
  linkStoredPhotosToCollection,
  getStoredCollectionPhotos,
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get('collection_id')

    let photos = await getStoredPhotos()

    if (collectionId) {
      const links = await getStoredCollectionPhotos()
      if (collectionId === 'unassigned') {
        const linkedPhotoIds = new Set(links.map(l => l.photo_id))
        photos = photos.filter(p => !linkedPhotoIds.has(p.id))
      } else {
        const colLinks = links
          .filter(l => l.collection_id === collectionId)
          .sort((a, b) => a.order - b.order)
        const photoMap = new Map(photos.map(p => [p.id, p]))
        photos = colLinks
          .map(l => photoMap.get(l.photo_id))
          .filter((p): p is typeof photos[0] => Boolean(p))
      }
    }

    return NextResponse.json({ photos, total: photos.length })
  } catch (error) {
    console.error('Error in GET /api/photos:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const rawPhotos = body.photos || (body.photo ? [body.photo] : [])
    const collectionId = body.collection_id || body.collectionId

    if (!Array.isArray(rawPhotos) || rawPhotos.length === 0) {
      return NextResponse.json({ error: 'No photos provided' }, { status: 400 })
    }

    const inserted = await insertStoredPhotos(rawPhotos)

    if (collectionId && collectionId !== 'none') {
      const links = inserted.map((p, idx) => ({
        collection_id: collectionId,
        photo_id: p.id,
        order: idx,
      }))
      await linkStoredPhotosToCollection(links)
    }

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/photos')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    return NextResponse.json({ success: true, photos: inserted })
  } catch (error) {
    console.error('Error in POST /api/photos:', error)
    return NextResponse.json({ error: 'Failed to save photos' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 })
    }

    const updated = await updateStoredPhoto(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/photos')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    return NextResponse.json({ success: true, photo: updated })
  } catch (error) {
    console.error('Error in PUT /api/photos:', error)
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const ids: string[] = body.ids || (body.id ? [body.id] : [])

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }

    await deleteStoredPhotos(ids)

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/photos')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    return NextResponse.json({ success: true, deletedCount: ids.length })
  } catch (error) {
    console.error('Error in DELETE /api/photos:', error)
    return NextResponse.json({ error: 'Failed to delete photos' }, { status: 500 })
  }
}