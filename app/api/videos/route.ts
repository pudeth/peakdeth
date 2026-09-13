import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  getStoredVideos,
  insertStoredVideo,
  updateStoredVideo,
  deleteStoredVideo,
  saveStoredVideos,
} from '@/lib/videos-storage'

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
    const activeOnly = searchParams.get('active_only') === 'true'

    let videos = await getStoredVideos()
    if (activeOnly) {
      videos = videos.filter(v => v.is_active)
    }

    return NextResponse.json({ videos, total: videos.length })
  } catch (error) {
    console.error('Error in GET /api/videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, video_url, video_type, thumbnail_url, description, category, year, tags, featured, is_active, order } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!video_url || !video_url.trim()) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
    }

    const created = await insertStoredVideo({
      title: title.trim(),
      slug,
      video_url: video_url.trim(),
      video_type,
      thumbnail_url,
      description,
      category,
      year: year ? parseInt(year, 10) : undefined,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      featured: featured ?? false,
      is_active: is_active ?? true,
      order,
    })

    try {
      revalidatePath('/')
      revalidatePath('/videos')
      revalidatePath('/admin/dashboard/videos')
    } catch {}

    return NextResponse.json({ success: true, video: created })
  } catch (error) {
    console.error('Error in POST /api/videos:', error)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthed = await checkAdminAuth()
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Handle reordering
    if (body.action === 'reorder' && Array.isArray(body.orderedVideos)) {
      const existing = await getStoredVideos()
      const orderMap = new Map<string, number>()
      body.orderedVideos.forEach((v: { id: string }, idx: number) => {
        orderMap.set(v.id, idx)
      })

      const updatedList = existing.map(v => {
        if (orderMap.has(v.id)) {
          return { ...v, order: orderMap.get(v.id)! }
        }
        return v
      })

      await saveStoredVideos(updatedList)
      try {
        revalidatePath('/')
        revalidatePath('/videos')
      } catch {}
      return NextResponse.json({ success: true })
    }

    const { id, ...updates } = body
    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    const updated = await updateStoredVideo(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    try {
      revalidatePath('/')
      revalidatePath('/videos')
      revalidatePath('/admin/dashboard/videos')
    } catch {}

    return NextResponse.json({ success: true, video: updated })
  } catch (error) {
    console.error('Error in PUT /api/videos:', error)
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
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
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    await deleteStoredVideo(id)

    try {
      revalidatePath('/')
      revalidatePath('/videos')
      revalidatePath('/admin/dashboard/videos')
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/videos:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
