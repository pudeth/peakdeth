import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getDynamicCVData, saveDynamicCVData } from '@/lib/cv-service'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const cv = await getDynamicCVData()
    return NextResponse.json(
      { cv, success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to get dynamic CV API:', error)
    return NextResponse.json({ error: 'Failed to retrieve CV data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const isDevAdmin = cookieStore.get('admin_dev_session')?.value === 'true'
    const hasSbAuth = cookieStore.getAll().some(
      (c) => (c.name.startsWith('sb-') || c.name.includes('auth-token') || c.name.includes('supabase')) && Boolean(c.value)
    )

    let isAuthenticated = isDevAdmin || hasSbAuth

    if (!isAuthenticated) {
      try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) isAuthenticated = true
      } catch {}
    }

    if (!isAuthenticated && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updatedCV = await saveDynamicCVData(body)

    try {
      revalidatePath('/cv')
      revalidatePath('/cv/print')
      revalidatePath('/about')
      revalidatePath('/admin/dashboard/content')
      revalidatePath('/')
    } catch {}

    return NextResponse.json({ success: true, cv: updatedCV })
  } catch (error) {
    console.error('Failed to save CV data:', error)
    return NextResponse.json({ error: 'Failed to save CV data' }, { status: 500 })
  }
}

