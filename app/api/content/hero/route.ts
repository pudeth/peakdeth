import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getHeroContent, saveHeroContentServer } from '@/lib/site-content'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const hero = await getHeroContent()
    return NextResponse.json({ hero })
  } catch (error) {
    console.error('Failed to get hero content:', error)
    return NextResponse.json({ error: 'Failed to retrieve hero content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const isDevAdmin = cookieStore.get('admin_dev_session')?.value === 'true'

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if ((authError || !user) && !isDevAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      subtitle,
      background_image_url,
      background_image_id,
      overlay_opacity,
    } = body

    const hero = await saveHeroContentServer({
      title: (title || '').trim(),
      subtitle: (subtitle || '').trim(),
      background_image_url: background_image_url || null,
      background_image_id: background_image_id || null,
      overlay_opacity: typeof overlay_opacity === 'number' ? overlay_opacity : 0.5,
    })

    try {
      revalidatePath('/')
      revalidatePath('/admin/dashboard/content')
    } catch {}

    return NextResponse.json({ success: true, hero })
  } catch (error) {
    console.error('Failed to save hero content:', error)
    return NextResponse.json({ error: 'Failed to save hero content' }, { status: 500 })
  }
}
