import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getLogoContent, saveLogoContentServer } from '@/lib/site-content'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function checkIsAuthorized(): Promise<boolean> {
  if (process.env.NODE_ENV !== 'production') return true
  try {
    const cookieStore = await cookies()
    const isDevAdmin = cookieStore.get('admin_dev_session')?.value === 'true'
    if (isDevAdmin) return true

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    return !authError && Boolean(user)
  } catch {
    return false
  }
}

export async function GET() {
  try {
    const logo = await getLogoContent()
    return NextResponse.json(
      { logo, success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to get logo content:', error)
    return NextResponse.json({ error: 'Failed to retrieve logo' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await checkIsAuthorized()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url, id, alt, text } = body

    if (!url && !text) {
      return NextResponse.json({ error: 'URL or text is required' }, { status: 400 })
    }

    const logo = await saveLogoContentServer({
      url: url || undefined,
      id: id || undefined,
      alt: alt || undefined,
      text: text || undefined,
    })

    try {
      revalidatePath('/')
      revalidatePath('/about')
      revalidatePath('/cv')
      revalidatePath('/admin/dashboard')
      revalidatePath('/admin/dashboard/content')
    } catch {}

    return NextResponse.json({ success: true, logo })
  } catch (error) {
    console.error('Failed to save logo:', error)
    return NextResponse.json({ error: 'Failed to save logo' }, { status: 500 })
  }
}
