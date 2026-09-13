export interface ServiceItem {
  id?: string
  _id: string
  number: number
  title: string
  description: string
  icon?: string
  link?: string | null
  show_on_homepage?: boolean
  is_active?: boolean
  order?: number
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'service-1',
    _id: 'service-1',
    number: 1,
    title: 'POS',
    description: 'Point of sale software with real-time inventory tracking, smart billing, payments, and sales analytics.',
    icon: 'pos',
    link: 'https://weppage-1.onrender.com/home.html',
    show_on_homepage: true,
    is_active: true,
    order: 1,
  },
  {
    id: 'service-2',
    _id: 'service-2',
    number: 2,
    title: 'Top-Up Diamond',
    description: 'Mobile Legends Bang Bang diamond top-up platform with instant account validation and automated payments.',
    icon: 'diamond',
    link: 'https://mlbb-topup-jet.vercel.app/',
    show_on_homepage: true,
    is_active: true,
    order: 2,
  },
  {
    id: 'service-3',
    _id: 'service-3',
    number: 3,
    title: 'Web-APP',
    description: 'Management Phone Store system, modern responsive web applications and digital interfaces.',
    icon: 'web',
    link: 'https://dymaly-store.onrender.com',
    show_on_homepage: true,
    is_active: true,
    order: 3,
  },
  {
    id: 'service-4',
    _id: 'service-4',
    number: 4,
    title: 'Mobile App',
    description: 'Native and cross-platform mobile apps for iOS and Android with intuitive UI/UX and seamless performance.',
    icon: 'mobile',
    link: 'https://weppage-1.onrender.com/',
    show_on_homepage: false,
    is_active: true,
    order: 4,
  }
]

function isConnectionOrPlaceholderError(error: unknown): boolean {
  if (!error) return false
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) return true
  const msg = typeof error === 'string' ? error : (error as { message?: string })?.message || ''
  return msg.includes('fetch failed') || msg.includes('Failed to fetch')
}

export async function getServices(options?: { onlyHomepage?: boolean }): Promise<ServiceItem[]> {
  try {
    // 1. Try Supabase first
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true })

      if (!error && data && data.length > 0) {
        const isOldService = (title?: string) =>
          !title || /photography|videography|retouching|portrait|wedding|event|commercial & editorial/i.test(title)

        let activeServices = data.filter(s => !isOldService(s.title))
        if (options?.onlyHomepage) {
          activeServices = activeServices.filter(s => s.show_on_homepage !== false)
        }

        if (activeServices.length > 0) {
          return activeServices.map((service, idx) => ({
            id: service.id || service._id || `service-${idx + 1}`,
            _id: service.id || service._id || `service-${idx + 1}`,
            number: Number(service.number) || idx + 1,
            title: service.title,
            description: service.description,
            icon: service.icon || 'pos',
            link: service.link || null,
            show_on_homepage: service.show_on_homepage ?? true,
            is_active: service.is_active ?? true,
            order: Number(service.order) || idx + 1,
          }))
        }
      }
    } catch {}

    // 2. Fall back to local data/services.json
    try {
      const { readFile } = await import('node:fs/promises')
      const path = await import('node:path')
      const filePath = path.join(process.cwd(), 'data', 'services.json')
      const raw = await readFile(filePath, 'utf-8')
      const local = JSON.parse(raw)
      if (Array.isArray(local) && local.length > 0) {
        let active = local.filter((s: any) => s.is_active !== false)
        if (options?.onlyHomepage) {
          active = active.filter((s: any) => s.show_on_homepage !== false)
        }
        if (active.length > 0) {
          return active.map((service: any, idx: number) => ({
            id: service.id || service._id || `service-${idx + 1}`,
            _id: service.id || service._id || `service-${idx + 1}`,
            number: Number(service.number) || idx + 1,
            title: service.title,
            description: service.description,
            icon: service.icon,
            link: service.link,
            show_on_homepage: service.show_on_homepage ?? true,
            is_active: service.is_active ?? true,
            order: Number(service.order) || idx + 1,
          }))
        }
      }
    } catch {}

    return options?.onlyHomepage ? DEFAULT_SERVICES.filter(s => s.show_on_homepage !== false) : DEFAULT_SERVICES
  } catch (error) {
    if (!isConnectionOrPlaceholderError(error)) {
      console.error('Error fetching services (catch block):', error)
    }
    return options?.onlyHomepage ? DEFAULT_SERVICES.filter(s => s.show_on_homepage !== false) : DEFAULT_SERVICES
  }
}
