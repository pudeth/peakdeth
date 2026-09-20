import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getAboutContent, saveAboutContentServer } from '@/lib/site-content'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const about = await getAboutContent()
    return NextResponse.json({ about })
  } catch (error) {
    console.error('Failed to get about content:', error)
    return NextResponse.json({ error: 'Failed to retrieve about content' }, { status: 500 })
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
      id,
      title,
      name,
      tagline,
      bio,
      profile_image_url,
      profile_image_id,
      show_on_homepage,
    } = body

    const about = await saveAboutContentServer({
      id,
      title: (title || 'About Me').trim(),
      name: (name || 'Peak Deth').trim(),
      tagline: tagline || null,
      bio: bio || null,
      profile_image_url: profile_image_url || null,
      profile_image_id: profile_image_id || null,
      show_on_homepage: typeof show_on_homepage === 'boolean' ? show_on_homepage : false,
    })

    try {
      revalidatePath('/')
      revalidatePath('/about')
      revalidatePath('/cv')
      revalidatePath('/admin/dashboard/content')
      revalidatePath('/admin/dashboard/homepage')
    } catch {}

    return NextResponse.json({ success: true, about })
  } catch (error) {
    console.error('Failed to save about content:', error)
    return NextResponse.json({ error: 'Failed to save about content' }, { status: 500 })
  }
}