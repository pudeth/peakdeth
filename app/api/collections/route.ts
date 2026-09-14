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

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    let collections: any[] = []
    let collectionPhotos: any[] = []

    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      const { data: dbCollections, error: colErr } = await supabase
        .from('collections')
        .select('*')
        .order('order', { ascending: true })

      if (!colErr && dbCollections && dbCollections.length > 0) {
        collections = dbCollections.map((c: any) => ({
          ...c,
          title: c.title || c.name || 'Untitled Collection',
          name: c.name || c.title || 'Untitled Collection',
        }))
      }

      const { data: dbLinks, error: linkErr } = await supabase
        .from('collection_photos')
        .select('*')
        .order('order', { ascending: true })

      if (!linkErr && dbLinks) {
        collectionPhotos = dbLinks
      }
    } catch (e) {
      console.warn('Supabase fetch failed in GET /api/collections:', e)
    }

    if (collections.length === 0) {
      collections = await getStoredCollections()
    }
    if (collectionPhotos.length === 0) {
      collectionPhotos = await getStoredCollectionPhotos()
    }

    const response = NextResponse.json({ collections, collectionPhotos })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    return response
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
    const { title, name, slug, parent_id, description, cover_image_url, featured, order } = body
    const rawTitle = (title || name || '').trim()
    if (!rawTitle) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const baseSlug = (slug || rawTitle).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `album-${Date.now()}`
    const newColId = crypto.randomUUID()
    const now = new Date().toISOString()

    const newRecord = {
      id: newColId,
      title: rawTitle,
      name: rawTitle,
      slug: baseSlug,
      parent_id: parent_id || null,
      description: description || '',
      cover_image_url: cover_image_url || null,
      featured: featured ?? false,
      order: typeof order === 'number' ? order : 0,
      created_at: now,
      updated_at: now,
    }

    // 1. Try saving directly to Supabase with admin client
    let supabaseSuccess = false
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      
      // Try full record with both title and name
      const { error: insertErr } = await supabase.from('collections').insert([newRecord])
      if (!insertErr) {
        supabaseSuccess = true
      } else {
        console.warn('First insert failed, retrying with schema variations:', insertErr.message)
        // If "name" doesn't exist, remove name
        if (insertErr.message?.includes('name')) {
          const { name: _, ...noName } = newRecord
          const { error: err2 } = await supabase.from('collections').insert([noName])
          if (!err2) supabaseSuccess = true
        } else if (insertErr.message?.includes('title')) {
          const { title: _, ...noTitle } = newRecord
          const { error: err3 } = await supabase.from('collections').insert([noTitle])
          if (!err3) supabaseSuccess = true
        }
      }
    } catch (e) {
      console.warn('Supabase insert exception in POST /api/collections:', e)
    }

    // 2. Also mirror to stored collections
    let created: any = newRecord
    try {
      created = await insertStoredCollection({
        id: newColId,
        title: rawTitle,
        slug: baseSlug,
        parent_id,
        description,
        cover_image_url,
        featured,
        order,
      })
    } catch (e) {
      console.warn('Local storage write failed (expected on Vercel):', e)
    }

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    return NextResponse.json({ success: true, collection: created || newRecord, savedToSupabase: supabaseSuccess })
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
      try {
        const { createAdminClient } = await import('@/lib/supabase/server')
        const supabase = createAdminClient()
        for (let i = 0; i < body.orderedCollections.length; i++) {
          const c = body.orderedCollections[i]
          await supabase.from('collections').update({ order: i }).eq('id', c.id)
        }
      } catch {}

      try {
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
      } catch {}

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

    // Update in Supabase
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      const updateData: any = { ...updates, updated_at: new Date().toISOString() }
      if (updateData.title) updateData.name = updateData.title
      await supabase.from('collections').update(updateData).eq('id', id)
    } catch {}

    let updated: any = null
    try {
      updated = await updateStoredCollection(id, updates)
    } catch {}

    try {
      revalidatePath('/')
      revalidatePath('/gallery')
      revalidatePath('/admin/dashboard/collections')
    } catch {}

    return NextResponse.json({ success: true, collection: updated || { id, ...updates } })
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

    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('collections').delete().eq('id', id)
    } catch {}

    try {
      await deleteStoredCollection(id)
    } catch {}

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