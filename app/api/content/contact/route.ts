import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  getContactContent,
  saveContactItemServer,
  deleteContactItemServer,
  updateContactStatusServer,
  setAllContactStatusServer,
} from '@/lib/site-content'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function checkIsAuthorized(): Promise<boolean> {
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
    const contacts = await getContactContent()
    return NextResponse.json(
      { contacts },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to get contact content:', error)
    return NextResponse.json({ error: 'Failed to retrieve contact content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await checkIsAuthorized()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, type, label, value, icon, is_active, order } = body

    if (!label || !value) {
      return NextResponse.json({ error: 'Label and value are required' }, { status: 400 })
    }

    const contact = await saveContactItemServer({
      id,
      type: type || 'email',
      label: String(label).trim(),
      value: String(value).trim(),
      icon: icon || null,
      is_active: is_active ?? true,
      order: typeof order === 'number' ? order : undefined,
    })

    try {
      revalidatePath('/')
      revalidatePath('/contact')
      revalidatePath('/admin/dashboard/content')
      revalidatePath('/admin/dashboard/contact')
    } catch {}

    return NextResponse.json(
      { success: true, contact },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Failed to save contact item:', error)
    return NextResponse.json({ error: 'Failed to save contact item' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const isAuth = await checkIsAuthorized()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, is_active, set_all_active } = body

    if (typeof set_all_active === 'boolean') {
      await setAllContactStatusServer(set_all_active)
    } else if (id) {
      await updateContactStatusServer(id, Boolean(is_active))
    } else {
      return NextResponse.json({ error: 'Contact ID or set_all_active is required' }, { status: 400 })
    }

    try {
      revalidatePath('/')
      revalidatePath('/contact')
      revalidatePath('/admin/dashboard/content')
      revalidatePath('/admin/dashboard/contact')
    } catch {}

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Failed to update contact item:', error)
    return NextResponse.json({ error: 'Failed to update contact item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuth = await checkIsAuthorized()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 })
    }

    await deleteContactItemServer(id)

    try {
      revalidatePath('/')
      revalidatePath('/contact')
      revalidatePath('/admin/dashboard/content')
      revalidatePath('/admin/dashboard/contact')
    } catch {}

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Failed to delete contact item:', error)
    return NextResponse.json({ error: 'Failed to delete contact item' }, { status: 500 })
  }
}
