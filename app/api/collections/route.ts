import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  getStoredCollections,
  insertStoredCollection,
  updateStoredCollection,
  deleteStoredCollection,
  getStoredCollectionPhotos,
  linkStoredPhotosToCollection,
  unlinkStoredPhotos,
  saveStoredCollections,
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

export async function GET() {
  try {
    const [collections, collectionPhotos] = await Promise.all([
      getStoredCollections(),
      getStoredCollectionPhotos(),
    ])
    return NextResponse.json({ collections, collectionPhotos })
  } catch (error) {
    console.error('Error in GET /api/collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Handle photo linking action
    if (body.action === 'link') {
      const links = body.links || []
      const created = await linkStoredPhotosToCollection(links)
      try {
        revalidatePath('/')
        revalidatePath('/gallery')
      } catch {}
      return NextResponse.json({ success: true, links: created })
    }

    // Handle photo unlinking action
    if (body.action === 'unlink') {
      const { collection_id, photo_ids } = body
      if (!collection_id) {
        return NextResponse.json({ error: 'collection_id is required' }, { status: 400 })
      }
      await unlinkStoredPhotos(collection_id, photo_ids)
      try {
        revalidatePath('/')
        revalidatePath('/gallery')
      } catch {}
      return NextResponse.json({ success: true })
    }

    // Create new collection
    const { title, slug, parent_id, description, cover_image_url, featured, order } = body
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const created = await insertStoredCollection({
      title: title.trim(),
      slug,
      parent_id,
      description,
      cover_image_url,
      featured,
      order,
    })

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    return NextResponse.json({ success: true, collection: created })
  } catch (error) {
    console.error('Error in POST /api/collections:', error)
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Handle reordering multiple collections
    if (body.action === 'reorder' && Array.isArray(body.orderedCollections)) {
      const existing = await getStoredCollections()
      const orderMap = new Map<string, number>()
      body.orderedCollections.forEach((c: { id: string }, idx: number) => {
        orderMap.set(c.id, idx)
      })

      const updatedList = existing.map(c => {
        if (orderMap.has(c.id)) {
          return { ...c, order: orderMap.get(c.id)! }
        }
        return c
      })

      await saveStoredCollections(updatedList)
      try {
        revalidatePath('/')
        revalidatePath('/gallery')
      } catch {}
      return NextResponse.json({ success: true })
    }

    const { id, ...updates } = body
    if (!id) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 })
    }

    const updated = await updateStoredCollection(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    return NextResponse.json({ success: true, collection: updated })
  } catch (error) {
    console.error('Error in PUT /api/collections:', error)
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 })
    }

    await deleteStoredCollection(id)

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/collections:', error)
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 })
  }
}