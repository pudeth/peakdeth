import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { readJsonStorage, writeJsonStorage } from '@/lib/server-storage'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { DEFAULT_SERVICES } from '@/lib/services'

async function readLocalServices(): Promise<any[]> {
  const local = await readJsonStorage<any[]>('services.json', DEFAULT_SERVICES)
  return Array.isArray(local) && local.length > 0 ? local : DEFAULT_SERVICES
}

async function writeLocalServices(data: any[]): Promise<void> {
  await writeJsonStorage('services.json', data)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const onlyHomepage = searchParams.get('onlyHomepage') === 'true'

    const local = await readLocalServices()
    if (Array.isArray(local) && local.length > 0) {
      const filtered = onlyHomepage ? local.filter((s: any) => s.show_on_homepage !== false && s.is_active !== false) : local
      return NextResponse.json({ services: filtered })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true })

    if (!error && data && data.length > 0) {
      const filtered = onlyHomepage ? data.filter((s: any) => s.show_on_homepage !== false && s.is_active !== false) : data
      return NextResponse.json({ services: filtered })
    }

    const fallback = onlyHomepage ? DEFAULT_SERVICES.filter(s => s.show_on_homepage !== false) : DEFAULT_SERVICES
    return NextResponse.json({ services: fallback })
  } catch {
    const local = await readLocalServices()
    return NextResponse.json({ services: local })
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
    const { services } = body

    if (Array.isArray(services)) {
      const normalizedServices = services.map((item: any, idx: number) => ({
        id: item.id || item._id || `service-${idx + 1}`,
        _id: item.id || item._id || `service-${idx + 1}`,
        number: Number(item.number) || idx + 1,
        title: item.title,
        description: item.description,
        icon: item.icon || 'pos',
        link: item.link || null,
        show_on_homepage: item.show_on_homepage ?? true,
        is_active: item.is_active ?? true,
        order: Number(item.order !== undefined ? item.order : idx + 1),
      }))

      await writeLocalServices(normalizedServices)

      try {
        const adminSupabase = createAdminClient()
        for (const item of normalizedServices) {
          await adminSupabase.from('services').upsert({
            id: item.id,
            number: item.number,
            title: item.title,
            description: item.description,
            icon: item.icon,
            link: item.link,
            show_on_homepage: item.show_on_homepage,
            is_active: item.is_active,
            order: item.order,
          })
        }
      } catch (err) {
        console.warn('Supabase services sync failed:', err)
      }

      try {
        revalidatePath('/')
        revalidatePath('/developer')
        revalidatePath('/admin/dashboard/developer')
        revalidatePath('/admin/dashboard/homepage')
        revalidatePath('/admin/dashboard/content')
      } catch {}

      return NextResponse.json({ success: true, services: normalizedServices })
    }

    return NextResponse.json({ error: 'Invalid services payload' }, { status: 400 })
  } catch (error) {
    console.error('Failed to save services:', error)
    return NextResponse.json({ error: 'Failed to save services' }, { status: 500 })
  }
}
