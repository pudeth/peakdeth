import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { isConfiguredSupabase } from '@/lib/supabase/config'

export interface HeroContentData {
  id?: string
  title: string
  subtitle: string
  background_image_url?: string | null
  background_image_id?: string | null
  overlay_opacity: number
  is_active?: boolean
  updated_at?: string
}

export interface AboutContentData {
  id?: string
  title: string
  name: string
  tagline?: string | null
  bio?: string | null
  profile_image_url?: string | null
  profile_image_id?: string | null
  show_on_homepage?: boolean
  is_active?: boolean
  updated_at?: string
}

const DEFAULT_HERO: HeroContentData = {
  id: 'hero-1',
  title: 'PEAK DETH',
  subtitle: 'POS, Management System, Website & Mobile App Development',
  background_image_url: null,
  background_image_id: null,
  overlay_opacity: 0.5,
  is_active: true,
}

const DEFAULT_ABOUT: AboutContentData = {
  id: 'about-1',
  title: 'About Me',
  name: 'Peak Deth',
  tagline: 'Full-Stack Programming & Cinematic Photography Design',
  bio: 'A multidisciplinary Full-Stack Developer and Visual Artist bridging high-performance software engineering with cinematic photography and design. Dedicated to architecting robust enterprise systems, bespoke POS solutions, and modern mobile & web apps, while capturing evocative visual narratives and crafting refined aesthetic designs.',
  profile_image_url: null,
  profile_image_id: null,
  show_on_homepage: false,
  is_active: true,
}

import { readJsonStorage, writeJsonStorage } from '@/lib/server-storage'

async function readLocalData(): Promise<Record<string, any>> {
  return await readJsonStorage<Record<string, any>>('content.json', {})
}

async function writeLocalData(data: Record<string, any>): Promise<void> {
  await writeJsonStorage('content.json', data)
}

// ----------------------------------------------------------------------
// HERO
// ----------------------------------------------------------------------

export async function getHeroContent(): Promise<HeroContentData> {
  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!error && data && data.title) {
        const bgUrl = data.background_image || data.background_image_url || null
        return {
          id: data.id,
          title: data.title,
          subtitle: data.subtitle || '',
          background_image_url: bgUrl,
          background_image_id: bgUrl,
          overlay_opacity: 0.5,
          is_active: true,
          updated_at: data.updated_at,
        }
      }
    } catch {
      // Fall through to local storage
    }
  }

  const localData = await readLocalData()
  let hero = DEFAULT_HERO
  if (localData.hero && localData.hero.title) {
    hero = {
      ...DEFAULT_HERO,
      ...localData.hero,
    }
  }

  return hero
}

export async function saveHeroContentServer(hero: HeroContentData): Promise<HeroContentData> {
  const localData = await readLocalData()
  const updatedHero: HeroContentData = {
    ...DEFAULT_HERO,
    ...(localData.hero || {}),
    ...hero,
    updated_at: new Date().toISOString(),
  }

  localData.hero = updatedHero
  await writeLocalData(localData)

  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      const img = updatedHero.background_image_url || null
      await supabase.from('hero_content').upsert({
        id: updatedHero.id || 'hero-1',
        title: updatedHero.title,
        subtitle: updatedHero.subtitle || null,
        background_image: img,
        updated_at: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('Failed to sync hero content to Supabase (local copy saved):', e)
    }
  }

  return updatedHero
}

// ----------------------------------------------------------------------
// ABOUT
// ----------------------------------------------------------------------

export async function getAboutContent(): Promise<AboutContentData> {
  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!error && data) {
        const localData = await readLocalData()
        const img = data.image_url || data.profile_image_url || localData.about?.profile_image_url || null
        return {
          id: data.id,
          title: data.title || 'About Me',
          name: localData.about?.name || 'Peak Deth',
          tagline: data.subtitle || localData.about?.tagline || 'Full-Stack Programming & Cinematic Photography Design',
          bio: data.bio || localData.about?.bio || '',
          profile_image_url: img,
          profile_image_id: img,
          show_on_homepage: localData.about?.show_on_homepage ?? true,
          is_active: true,
          updated_at: data.updated_at,
        }
      }
    } catch {
      // Fall through to local storage
    }
  }

  const localData = await readLocalData()
  let about = DEFAULT_ABOUT
  if (localData.about && (localData.about.name || localData.about.title)) {
    about = {
      ...DEFAULT_ABOUT,
      ...localData.about,
      show_on_homepage: localData.about.show_on_homepage ?? true,
    }
  }

  return about
}

export async function saveAboutContentServer(about: AboutContentData): Promise<AboutContentData> {
  const localData = await readLocalData()
  const updatedAbout: AboutContentData = {
    ...DEFAULT_ABOUT,
    ...(localData.about || {}),
    ...about,
    show_on_homepage: about.show_on_homepage ?? (localData.about?.show_on_homepage ?? true),
    updated_at: new Date().toISOString(),
  }

  localData.about = updatedAbout
  await writeLocalData(localData)

  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      const img = updatedAbout.profile_image_url || null
      await supabase.from('about_content').upsert({
        id: updatedAbout.id || 'about-1',
        title: updatedAbout.title,
        subtitle: updatedAbout.tagline || null,
        bio: updatedAbout.bio || null,
        image_url: img,
        updated_at: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('Failed to sync about content to Supabase (local copy saved):', e)
    }
  }

  return updatedAbout
}

// ----------------------------------------------------------------------
// CONTACT
// ----------------------------------------------------------------------

export interface ContactInfoItem {
  id: string
  type: 'email' | 'phone' | 'instagram' | 'website' | 'location'
  value: string
  label: string
  icon?: string | null
  is_active: boolean
  order: number
  created_at?: string
  updated_at?: string
}

export const DEFAULT_CONTACTS: ContactInfoItem[] = [
  {
    id: 'contact-1',
    type: 'email',
    label: 'Email',
    value: 'hello@peakdeth.com',
    icon: '📧',
    is_active: true,
    order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'contact-2',
    type: 'phone',
    label: 'Phone Number',
    value: '+855 12 345 678',
    icon: '📞',
    is_active: true,
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'contact-3',
    type: 'instagram',
    label: 'Instagram',
    value: '@peakdeth',
    icon: '📷',
    is_active: true,
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'contact-4',
    type: 'location',
    label: 'Studio Location',
    value: 'Phnom Penh, Cambodia',
    icon: '📍',
    is_active: true,
    order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'contact-5',
    type: 'website',
    label: 'Website',
    value: 'https://peakdeth.com',
    icon: '🌐',
    is_active: true,
    order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function getContactContent(): Promise<ContactInfoItem[]> {
  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('order', { ascending: true })

      if (!error && data && data.length > 0) {
        return data as ContactInfoItem[]
      }
    } catch {
      // Fall through to local storage
    }
  }

  const localData = await readLocalData()
  if (Array.isArray(localData.contacts) && localData.contacts.length > 0) {
    return localData.contacts
  }

  // Seed default contacts to local storage
  localData.contacts = DEFAULT_CONTACTS
  await writeLocalData(localData)
  return DEFAULT_CONTACTS
}

export async function saveContactItemServer(item: Partial<ContactInfoItem>): Promise<ContactInfoItem> {
  const localData = await readLocalData()
  let contacts: ContactInfoItem[] = Array.isArray(localData.contacts) ? localData.contacts : [...DEFAULT_CONTACTS]

  const now = new Date().toISOString()
  let savedItem: ContactInfoItem

  if (item.id) {
    const existingIndex = contacts.findIndex((c) => c.id === item.id)
    if (existingIndex !== -1) {
      savedItem = {
        ...contacts[existingIndex],
        ...item,
        updated_at: now,
      } as ContactInfoItem
      contacts[existingIndex] = savedItem
    } else {
      savedItem = {
        id: item.id,
        type: item.type || 'email',
        label: (item.label || 'Contact').trim(),
        value: (item.value || '').trim(),
        icon: item.icon || null,
        is_active: item.is_active ?? true,
        order: typeof item.order === 'number' ? item.order : contacts.length,
        created_at: now,
        updated_at: now,
      }
      contacts.push(savedItem)
    }
  } else {
    savedItem = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: item.type || 'email',
      label: (item.label || 'Contact').trim(),
      value: (item.value || '').trim(),
      icon: item.icon || null,
      is_active: item.is_active ?? true,
      order: typeof item.order === 'number' ? item.order : contacts.length,
      created_at: now,
      updated_at: now,
    }
    contacts.push(savedItem)
  }

  localData.contacts = contacts
  await writeLocalData(localData)

  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('contact_info').upsert({
        id: savedItem.id,
        type: savedItem.type,
        label: savedItem.label,
        value: savedItem.value,
        icon: savedItem.icon || null,
        is_active: savedItem.is_active,
        order: savedItem.order,
      })
    } catch (e) {
      console.warn('Failed to sync contact info to Supabase (local copy saved):', e)
    }
  }

  return savedItem
}

export async function deleteContactItemServer(id: string): Promise<boolean> {
  const localData = await readLocalData()
  let contacts: ContactInfoItem[] = Array.isArray(localData.contacts) ? localData.contacts : [...DEFAULT_CONTACTS]

  localData.contacts = contacts.filter((c) => c.id !== id)
  await writeLocalData(localData)

  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('contact_info').delete().eq('id', id)
    } catch (e) {
      console.warn('Failed to delete contact info from Supabase (local copy deleted):', e)
    }
  }

  return true
}

export async function updateContactStatusServer(id: string, is_active: boolean): Promise<boolean> {
  const localData = await readLocalData()
  let contacts: ContactInfoItem[] = Array.isArray(localData.contacts) ? localData.contacts : [...DEFAULT_CONTACTS]

  const contact = contacts.find((c) => c.id === id)
  if (contact) {
    contact.is_active = is_active
    contact.updated_at = new Date().toISOString()
    localData.contacts = contacts
    await writeLocalData(localData)
  }

  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('contact_info').update({ is_active }).eq('id', id)
    } catch (e) {
      console.warn('Failed to update contact status in Supabase (local copy updated):', e)
    }
  }

  return true
}

export async function setAllContactStatusServer(is_active: boolean): Promise<boolean> {
  const localData = await readLocalData()
  let contacts: ContactInfoItem[] = Array.isArray(localData.contacts) ? localData.contacts : [...DEFAULT_CONTACTS]

  const now = new Date().toISOString()
  contacts = contacts.map((c) => ({
    ...c,
    is_active,
    updated_at: now,
  }))

  localData.contacts = contacts
  await writeLocalData(localData)

  const isPlaceholder = !isConfiguredSupabase()

  if (!isPlaceholder) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()
      await supabase.from('contact_info').update({ is_active })
    } catch (e) {
      console.warn('Failed to batch update contact status in Supabase (local copy updated):', e)
    }
  }

  return true
}