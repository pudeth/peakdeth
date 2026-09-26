'use client'

export const dynamic = 'force-dynamic'

// Refresh client cache
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HeroContent, Service, AboutContent, AboutExperience, AboutSkill, AboutAward, AboutEquipmentCategory, AboutEquipmentItem, ContactInfo, SiteSettings } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CloudinaryUpload } from '@/components/cloudinary-upload'
import { Loader2, Save, Eye, EyeOff, Settings, User, Mail, MapPin, Globe, Phone, ArrowLeft, Home, Sparkles, ExternalLink, Trash2, Edit, Link as LinkIcon, PlusCircle, RotateCcw, ArrowUpRight, Briefcase, GraduationCap, Code2, Award, Camera, Printer, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import NextImage from 'next/image'
import Link from 'next/link'
import { revalidatePublicPaths } from '@/lib/revalidate-client'
import { WebsitePreviewModal } from '@/components/website-preview-modal'
import { CardWebsitePreview } from '@/components/card-website-preview'
import { CVExperienceManager } from '@/components/admin/cv/cv-experience-manager'
import { CVEducationManager } from '@/components/admin/cv/cv-education-manager'
import { CVSkillsManager } from '@/components/admin/cv/cv-skills-manager'
import { CVAwardsManager } from '@/components/admin/cv/cv-awards-manager'
import { CVLivePreviewTab } from '@/components/admin/cv/cv-live-preview-tab'
import { CVProfileManager } from '@/components/admin/cv/cv-profile-manager'
import { BrandLogoCard } from '@/components/admin/brand-logo-card'
import { cvData as defaultCvData, CVData, ExperienceItem, EducationItem, AwardItem, SkillCategory } from '@/data/cv-data'

type ContactTemplate = {
  title: string
  description: string
  form: {
    type: ContactInfo['type']
    label: string
    value: string
    icon: string
  }
}

type SiteSettingTemplate = {
  label: string
  key: string
  value: string
  type: SiteSettings['type']
  description: string
}

const CONTACT_TEMPLATES: ContactTemplate[] = [
  {
    title: 'Business Email',
    description: 'Primary email contact for inquiries',
    form: { type: 'email', label: 'Email', value: 'hello@example.com', icon: '' },
  },
  {
    title: 'Phone Number',
    description: 'Direct mobile or office number',
    form: { type: 'phone', label: 'Phone', value: '+1 555 000 0000', icon: '' },
  },
  {
    title: 'Instagram Profile',
    description: 'Social profile for daily updates',
    form: { type: 'instagram', label: 'Instagram', value: '@yourhandle', icon: '' },
  },
  {
    title: 'Website',
    description: 'Main portfolio or business website',
    form: { type: 'website', label: 'Website', value: 'https://example.com', icon: '' },
  },
  {
    title: 'Studio Location',
    description: 'Public location or city',
    form: { type: 'location', label: 'Location', value: 'City, Country', icon: '' },
  },
]

const SITE_SETTING_TEMPLATES: SiteSettingTemplate[] = [
  {
    label: 'Footer Brand Title',
    key: 'footer_brand_title',
    value: 'Peak Deth',
    type: 'string',
    description: 'Brand title shown in footer.',
  },
  {
    label: 'Footer Description',
    key: 'footer_brand_description',
    value: 'Digital systems and modern application developer.',
    type: 'string',
    description: 'Short footer description under brand title.',
  },
  {
    label: 'Footer Copyright',
    key: 'footer_copyright',
    value: '© 2026 Peak Deth. All rights reserved.',
    type: 'string',
    description: 'Footer copyright text.',
  },
  {
    label: 'Made By Name',
    key: 'footer_made_by_name',
    value: 'Built by Team',
    type: 'string',
    description: 'Name shown in footer credit.',
  },
  {
    label: 'Made By URL',
    key: 'footer_made_by_url',
    value: 'https://example.com',
    type: 'string',
    description: 'Link for footer credit.',
  },
]

const DEFAULT_SERVICES_LIST: Service[] = [
  {
    id: 'service-pos-1',
    number: 1,
    title: 'POS',
    description: 'Point of sale software with real-time inventory tracking, smart billing, payments, and sales analytics.',
    icon: '💳',
    link: 'https://weppage-1.onrender.com/home.html',
    show_on_homepage: true,
    is_active: true,
    order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'service-topup-2',
    number: 2,
    title: 'Top-Up Diamond',
    description: 'Mobile Legends Bang Bang diamond top-up platform with instant account validation and automated payments.',
    icon: '💎',
    link: 'https://mlbb-topup-jet.vercel.app/',
    show_on_homepage: true,
    is_active: true,
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'service-web-3',
    number: 3,
    title: 'Web-APP',
    description: 'Management Phone Store system, modern responsive web applications and digital interfaces.',
    icon: '🌐',
    link: 'https://dymaly-store.onrender.com',
    show_on_homepage: true,
    is_active: true,
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'service-app-4',
    number: 4,
    title: 'Mobile App',
    description: 'Native and cross-platform mobile apps for iOS and Android with intuitive UI/UX and seamless performance.',
    icon: '📱',
    link: '',
    show_on_homepage: false,
    is_active: true,
    order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function ContentManagementPage() {
  const supabase = createClient()
  const revalidateContentPages = async () => {
    await revalidatePublicPaths(['/', '/about', '/contact', '/cv'])
  }

  // State for different content sections
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [aboutExperience, setAboutExperience] = useState<AboutExperience[]>([])
  const [aboutSkills, setAboutSkills] = useState<AboutSkill[]>([])
  const [aboutAwards, setAboutAwards] = useState<AboutAward[]>([])
  const [aboutEquipmentCategories, setAboutEquipmentCategories] = useState<AboutEquipmentCategory[]>([])
  const [aboutEquipmentItems, setAboutEquipmentItems] = useState<AboutEquipmentItem[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings[]>([])
  const [cvData, setCvData] = useState<CVData>(defaultCvData)
  const [savingCV, setSavingCV] = useState(false)
  const [quickContact, setQuickContact] = useState({
    phone: '',
    email: '',
    location: '',
    website: '',
    instagram: '',
  })

  // Loading states
  const [loading, setLoading] = useState({
    hero: true,
    services: true,
    about: true,
    experience: true,
    skills: true,
    awards: true,
    equipment: true,
    contact: true,
    settings: true,
  })

  // Table existence check
  const [tablesExist, setTablesExist] = useState<boolean | null>(null)

  // Check if tables exist
  const checkTablesExist = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('hero_content')
        .select('id')
        .limit(1)

      return !error
    } catch {
      return false
    }
  }, [supabase])

  // Form states (declared before callbacks to prevent TDZ ReferenceErrors)
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    background_image_url: '',
    background_image_id: '',
    overlay_opacity: 0.5
  })

  const [serviceForm, setServiceForm] = useState({
    number: 1,
    title: '',
    description: '',
    icon: '📸',
    link: '',
    show_on_homepage: true
  })
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [previewModal, setPreviewModal] = useState<{ url: string; title: string } | null>(null)

  const [aboutForm, setAboutForm] = useState({
    title: '',
    name: '',
    tagline: '',
    bio: '',
    profile_image_url: '',
    profile_image_id: '',
    show_on_homepage: true
  })

  const [contactForm, setContactForm] = useState({
    type: 'email' as ContactInfo['type'],
    value: '',
    label: '',
    icon: ''
  })
  const [editingContactId, setEditingContactId] = useState<string | null>(null)

  const [settingsForm, setSettingsForm] = useState({
    key: '',
    value: '',
    type: 'string' as SiteSettings['type'],
    description: ''
  })
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null)

  const [experienceForm, setExperienceForm] = useState({
    title: '',
    organization: '',
    period: '',
    description: ''
  })

  const [skillForm, setSkillForm] = useState({
    name: '',
    icon: ''
  })

  const [awardForm, setAwardForm] = useState({
    title: '',
    organization: '',
    year: ''
  })

  const [equipmentCategoryForm, setEquipmentCategoryForm] = useState({
    category: ''
  })

  const [equipmentItemForm, setEquipmentItemForm] = useState({
    item: '',
    equipment_category_id: ''
  })

  const loadAllContent = useCallback(async () => {
    try {
      // Load hero content
      let heroData: any = null
      try {
        const res = await fetch('/api/content/hero')
        if (res.ok) {
          const json = await res.json()
          heroData = json.hero
        }
      } catch {}

      if (!heroData) {
        try {
          const { data } = await supabase
            .from('hero_content')
            .select('*')
            .eq('is_active', true)
            .single()
          heroData = data
        } catch {}
      }

      if (heroData && heroData.title !== undefined) {
        setHeroContent(heroData)
        setHeroForm({
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          background_image_url: heroData.background_image_url || '',
          background_image_id: heroData.background_image_id || '',
          overlay_opacity: heroData.overlay_opacity ?? 0.5
        })
      } else {
        setHeroForm({
          title: 'PEAK DETH',
          subtitle: 'POS, Management System, Website & Mobile App Development',
          background_image_url: '',
          background_image_id: '',
          overlay_opacity: 0.5
        })
      }

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true })

      let loadedServices: Service[] = []
      if (!servicesError && servicesData && servicesData.length > 0) {
        loadedServices = servicesData
      } else {
        try {
          const cached = typeof window !== 'undefined' ? localStorage.getItem('site_services_cache') : null
          if (cached) {
            const parsed = JSON.parse(cached)
            if (Array.isArray(parsed)) {
              loadedServices = parsed
            }
          }
        } catch {
          // ignore cache read error
        }
      }

      // Check for and remove old photography services
      const isOldService = (s: Service) =>
        !s || !s.title || /photography|videography|retouching|portrait|wedding|event|commercial & editorial/i.test(s.title)

      const safeList = Array.isArray(loadedServices) ? loadedServices : []
      const cleaned = safeList.filter(s => s && !isOldService(s))

      if (cleaned.length === 0) {
        setServices(DEFAULT_SERVICES_LIST)
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('site_services_cache', JSON.stringify(DEFAULT_SERVICES_LIST))
          }
        } catch {}
      } else {
        setServices(cleaned)
      }

      // Load about content
      let aboutData: any = null
      try {
        const res = await fetch('/api/content/about')
        if (res.ok) {
          const json = await res.json()
          aboutData = json.about
        }
      } catch {}

      if (!aboutData) {
        try {
          const { data } = await supabase
            .from('about_content')
            .select('*')
            .eq('is_active', true)
            .single()
          aboutData = data
        } catch {}
      }

      if (aboutData && aboutData.name !== undefined) {
        setAboutContent(aboutData)
        setAboutForm({
          title: aboutData.title || '',
          name: aboutData.name || '',
          tagline: aboutData.tagline || '',
          bio: aboutData.bio || '',
          profile_image_url: aboutData.profile_image_url || '',
          profile_image_id: aboutData.profile_image_id || '',
          show_on_homepage: aboutData.show_on_homepage ?? true
        })
      }

      // Load contact info
      try {
        const contactRes = await fetch(`/api/content/contact?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
        })
        if (contactRes.ok) {
          const { contacts } = await contactRes.json()
          if (Array.isArray(contacts)) {
            setContactInfo(contacts)
          } else {
            setContactInfo([])
          }
        } else {
          throw new Error('API failed')
        }
      } catch {
        const { data: contactData } = await supabase
          .from('contact_info')
          .select('*')
          .order('order', { ascending: true })
        setContactInfo(contactData || [])
      }

      // Load experience
      const { data: experienceData } = await supabase
        .from('about_experience')
        .select('*')
        .order('order', { ascending: true })

      setAboutExperience(experienceData || [])

      // Load skills
      const { data: skillsData } = await supabase
        .from('about_skills')
        .select('*')
        .order('order', { ascending: true })

      setAboutSkills(skillsData || [])

      // Load awards
      const { data: awardsData } = await supabase
        .from('about_awards')
        .select('*')
        .order('order', { ascending: true })

      setAboutAwards(awardsData || [])

      // Load equipment categories
      const { data: equipmentCategoriesData } = await supabase
        .from('about_equipment_categories')
        .select('*')
        .order('order', { ascending: true })

      setAboutEquipmentCategories(equipmentCategoriesData || [])

      // Load equipment items
      const { data: equipmentItemsData } = await supabase
        .from('about_equipment_items')
        .select('*')
        .order('order', { ascending: true })

      setAboutEquipmentItems(equipmentItemsData || [])

      // Load site settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true })

      setSiteSettings(settingsData || [])

      // Load CV data
      try {
        const cvRes = await fetch(`/api/cv?t=${Date.now()}`, { cache: 'no-store' })
        if (cvRes.ok) {
          const json = await cvRes.json()
          if (json.cv) {
            setCvData(json.cv)
            setQuickContact({
              phone: json.cv.phone || '',
              email: json.cv.email || '',
              location: json.cv.location || '',
              website: json.cv.website?.url || '',
              instagram: json.cv.social?.label || '',
            })
          }
        }
      } catch (e) {
        console.warn('Failed to load CV data in content page:', e)
      }

    } catch (error: unknown) {
      console.error('Error loading content:', error)
      toast.error('Failed to load content')
    } finally {
      setLoading({
        hero: false,
        services: false,
        about: false,
        experience: false,
        skills: false,
        awards: false,
        equipment: false,
        contact: false,
        settings: false
      })
    }
  }, [supabase])

  // Load all content on mount
  useEffect(() => {
    checkTablesExist().then(exist => {
      setTablesExist(exist)
      if (exist) {
        loadAllContent()
      } else {
        setLoading({
          hero: false,
          services: false,
          about: false,
          experience: false,
          skills: false,
          awards: false,
          equipment: false,
          contact: false,
          settings: false
        })
      }
    })
  }, [checkTablesExist, loadAllContent])



  // Save functions
  const saveHeroContent = async () => {
    try {
      setLoading(prev => ({ ...prev, hero: true }))

      const response = await fetch('/api/content/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: heroForm.title,
          subtitle: heroForm.subtitle,
          background_image_url: heroForm.background_image_url || null,
          background_image_id: heroForm.background_image_id || null,
          overlay_opacity: heroForm.overlay_opacity,
        }),
      })

      if (!response.ok) {
        const errJson = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errJson.error || 'Failed to save hero content')
      }

      const json = await response.json()
      if (json.hero) {
        setHeroContent(json.hero)
        setHeroForm({
          title: json.hero.title || '',
          subtitle: json.hero.subtitle || '',
          background_image_url: json.hero.background_image_url || '',
          background_image_id: json.hero.background_image_id || '',
          overlay_opacity: json.hero.overlay_opacity ?? 0.5,
        })
      }

      toast.success('Hero content saved successfully')
      await revalidateContentPages()
    } catch (error: any) {
      console.error('Error saving hero content:', error)
      toast.error(error.message || 'Failed to save hero content')
    } finally {
      setLoading(prev => ({ ...prev, hero: false }))
    }
  }

  const saveService = async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }))

      const payload = {
        number: Number(serviceForm.number) || (services.length + 1),
        title: serviceForm.title.trim(),
        description: serviceForm.description.trim(),
        icon: serviceForm.icon || '📸',
        link: serviceForm.link ? serviceForm.link.trim() : null,
        show_on_homepage: serviceForm.show_on_homepage ?? true,
      }

      let updatedList: Service[] = []

      if (editingServiceId) {
        try {
          await supabase
            .from('services')
            .update(payload)
            .eq('id', editingServiceId)
        } catch (e) {
          console.warn('Supabase service update warning:', e)
        }

        updatedList = services.map(s =>
          s.id === editingServiceId
            ? { ...s, ...payload, link: payload.link || undefined }
            : s
        )
        toast.success('Service updated successfully')
      } else {
        const newId = `service-${Date.now()}`
        try {
          await supabase
            .from('services')
            .insert({
              ...payload,
              is_active: true,
              order: services.length
            })
        } catch (e) {
          console.warn('Supabase service insert warning:', e)
        }

        const newService: Service = {
          id: newId,
          ...payload,
          link: payload.link || undefined,
          is_active: true,
          order: services.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        updatedList = [...services, newService]
        toast.success('Service added successfully')
      }

      setServices(updatedList)

      // Sync via API
      try {
        await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ services: updatedList }),
        })
      } catch {}

      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_services_cache', JSON.stringify(updatedList))
        }
      } catch {}

      await revalidateContentPages()
      setServiceForm({ number: updatedList.length + 1, title: '', description: '', icon: '📸', link: '', show_on_homepage: true })
      setEditingServiceId(null)
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Failed to save service')
    } finally {
      setLoading(prev => ({ ...prev, services: false }))
    }
  }

  const editService = (service: Service) => {
    setEditingServiceId(service.id)
    setServiceForm({
      number: service.number,
      title: service.title,
      description: service.description,
      icon: service.icon || '📸',
      link: service.link || '',
      show_on_homepage: service.show_on_homepage !== false,
    })
  }

  const cancelEditService = () => {
    setEditingServiceId(null)
    setServiceForm({ number: services.length + 1, title: '', description: '', icon: '📸', link: '', show_on_homepage: true })
  }

  const deleteService = async (id: string) => {
    try {
      setLoading(prev => ({ ...prev, services: true }))
      try {
        await supabase.from('services').delete().eq('id', id)
      } catch (e) {
        console.warn('Supabase delete service warning:', e)
      }
      const updated = services.filter(s => s.id !== id)
      setServices(updated)
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_services_cache', JSON.stringify(updated))
        }
      } catch {}
      toast.success('Service removed')
      await revalidateContentPages()
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Failed to delete service')
    } finally {
      setLoading(prev => ({ ...prev, services: false }))
    }
  }

  const removeOldAndResetServices = async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }))

      // Delete old photography services or clear table
      try {
        await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      } catch (e) {
        console.warn('Supabase delete old services warning:', e)
      }

      try {
        await supabase.from('services').upsert(DEFAULT_SERVICES_LIST)
      } catch (e) {
        console.warn('Supabase seed services warning:', e)
      }

      setServices(DEFAULT_SERVICES_LIST)
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_services_cache', JSON.stringify(DEFAULT_SERVICES_LIST))
        }
      } catch {}

      toast.success('Old services removed! 4 active digital systems (POS, Management System, Website, Mobile App) loaded.')
      await revalidateContentPages()
    } catch (error: unknown) {
      console.error('Error removing old services:', error)
      toast.error('Failed to remove old services')
    } finally {
      setLoading(prev => ({ ...prev, services: false }))
    }
  }

  const seedDefaultServices = removeOldAndResetServices

  const saveAboutContent = async () => {
    try {
      setLoading(prev => ({ ...prev, about: true }))

      const res = await fetch('/api/content/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: aboutContent?.id,
          title: aboutForm.title,
          name: aboutForm.name || 'Your Name',
          tagline: aboutForm.tagline || null,
          bio: aboutForm.bio || null,
          profile_image_url: aboutForm.profile_image_url || null,
          profile_image_id: aboutForm.profile_image_id || null,
          show_on_homepage: aboutForm.show_on_homepage ?? true,
        }),
      })

      if (!res.ok) {
        // Fall back to direct Supabase if API route failed
        const { error } = await supabase
          .from('about_content')
          .upsert({
            id: aboutContent?.id || 'about-1',
            title: aboutForm.title,
            name: aboutForm.name || 'Peak Deth',
            tagline: aboutForm.tagline || null,
            subtitle: aboutForm.tagline || null,
            bio: aboutForm.bio || null,
            content: aboutForm.bio || null,
            image_url: aboutForm.profile_image_url || null,
            profile_image_url: aboutForm.profile_image_url || null,
            profile_image_id: aboutForm.profile_image_id || null,
            show_on_homepage: aboutForm.show_on_homepage ?? true,
            is_active: true,
            updated_at: new Date().toISOString(),
          })


        if (error) throw error
      }

      // Sync to CV Data
      const cvPatch: Partial<CVData> = {
        name: (aboutForm.name || 'PEAK DETH').toUpperCase(),
        roleTitle: (aboutForm.tagline || 'FULL-STACK SOFTWARE ARCHITECT').toUpperCase(),
        summary: aboutForm.bio || '',
        photoUrl: aboutForm.profile_image_url || cvData.photoUrl,
      }
      if (quickContact.phone) cvPatch.phone = quickContact.phone
      if (quickContact.email) cvPatch.email = quickContact.email
      if (quickContact.location) cvPatch.location = quickContact.location
      if (quickContact.website) {
        cvPatch.website = {
          label: quickContact.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
          url: quickContact.website.startsWith('http') ? quickContact.website : `https://${quickContact.website}`
        }
      }
      if (quickContact.instagram) {
        cvPatch.social = {
          platform: 'Instagram',
          label: quickContact.instagram.startsWith('@') ? quickContact.instagram : `@${quickContact.instagram}`,
          url: `https://instagram.com/${quickContact.instagram.replace(/^@/, '')}`
        }
      }

      await syncAndSaveCV(cvPatch, 'About content & CV profile saved successfully')
      await revalidateContentPages()
      await loadAllContent()
    } catch (error: unknown) {
      console.error('Error saving about content:', error)
      toast.error('Failed to save about content')
    } finally {
      setLoading(prev => ({ ...prev, about: false }))
    }
  }

  const saveContactInfo = async () => {
    try {
      setLoading(prev => ({ ...prev, contact: true }))

      const payload = {
        id: editingContactId || undefined,
        type: contactForm.type,
        value: contactForm.value.trim(),
        label: contactForm.label.trim(),
        icon: contactForm.icon || null,
        order: editingContactId
          ? contactInfo.find(c => c.id === editingContactId)?.order ?? 0
          : contactInfo.length,
      }

      const res = await fetch('/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        // Fall back to direct Supabase if API endpoint failed
        const query = editingContactId
          ? supabase
              .from('contact_info')
              .update(payload)
              .eq('id', editingContactId)
          : supabase
              .from('contact_info')
              .insert({
                ...payload,
                is_active: true,
                order: contactInfo.length
              })
        const { error } = await query
        if (error) throw error
      }

      toast.success(editingContactId ? 'Contact info updated successfully' : 'Contact info added successfully')
      await revalidateContentPages()
      setContactForm({ type: 'email', value: '', label: '', icon: '' })
      setEditingContactId(null)
      await loadAllContent()
    } catch (error: unknown) {
      console.error('Error saving contact info:', error)
      toast.error('Failed to save contact info')
    } finally {
      setLoading(prev => ({ ...prev, contact: false }))
    }
  }

  const saveSiteSetting = async () => {
    try {
      setLoading(prev => ({ ...prev, settings: true }))

      const payload = {
        key: settingsForm.key,
        value: settingsForm.value || null,
        type: settingsForm.type,
        description: settingsForm.description || null
      }
      const query = editingSettingId
        ? supabase
            .from('site_settings')
            .update(payload)
            .eq('id', editingSettingId)
        : supabase
            .from('site_settings')
            .upsert(payload)
      const { error } = await query

      if (error) throw error

      toast.success(editingSettingId ? 'Site setting updated successfully' : 'Site setting saved successfully')
      await revalidateContentPages()
      setSettingsForm({ key: '', value: '', type: 'string', description: '' })
      setEditingSettingId(null)
      await loadAllContent()
    } catch (error: unknown) {
      console.error('Error saving site setting:', error)
      toast.error('Failed to save site setting')
    } finally {
      setLoading(prev => ({ ...prev, settings: false }))
    }
  }

  // -------------------------------------------------------------
  // CV & Profile Synchronization Handlers
  // -------------------------------------------------------------
  const syncAndSaveCV = async (patch: Partial<CVData>, successMessage = 'CV updated successfully') => {
    try {
      setSavingCV(true)
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error('Failed to save CV')
      const json = await res.json()
      if (json.cv) {
        setCvData(json.cv)
      }
      toast.success(successMessage)
      await revalidateContentPages()
    } catch (err: any) {
      console.error('Error updating CV:', err)
      toast.error(err.message || 'Failed to update CV')
    } finally {
      setSavingCV(false)
    }
  }

  const handleUpdateProfile = async (patch: Partial<CVData>) => {
    await syncAndSaveCV(patch, 'CV profile & contact channels updated successfully')
    if (patch.name || patch.roleTitle || patch.summary || patch.photoUrl) {
      setAboutForm((prev) => ({
        ...prev,
        name: patch.name || prev.name,
        tagline: patch.roleTitle || prev.tagline,
        bio: patch.summary || prev.bio,
        profile_image_url: patch.photoUrl || prev.profile_image_url,
      }))
    }
  }

  const handleUpdateExperiences = async (updated: ExperienceItem[]) => {
    await syncAndSaveCV({ experiences: updated }, 'Experience updated successfully')
  }

  const handleUpdateEducation = async (updated: EducationItem[]) => {
    await syncAndSaveCV({ education: updated }, 'Education updated successfully')
  }

  const handleUpdateCompetencies = async (updated: string[]) => {
    await syncAndSaveCV({ coreCompetencies: updated }, 'Core competencies updated successfully')
  }

  const handleUpdateExpertise = async (updated: SkillCategory[]) => {
    await syncAndSaveCV({ technicalExpertise: updated }, 'Technical expertise updated successfully')
  }

  const handleUpdateAwards = async (updated: AwardItem[]) => {
    await syncAndSaveCV({ awards: updated }, 'Awards updated successfully')
  }

  const addAboutSkill = async (name: string, icon = '⚡') => {
    try {
      const { error } = await supabase.from('about_skills').insert({
        name,
        icon,
        about_content_id: aboutContent?.id,
        order: aboutSkills.length,
      })
      if (error) throw error
      toast.success('Skill added')
      await revalidateContentPages()
      await loadAllContent()
    } catch (e: any) {
      console.error(e)
      toast.error('Failed to add skill')
    }
  }

  const deleteAboutSkill = async (id: string) => {
    try {
      const { error } = await supabase.from('about_skills').delete().eq('id', id)
      if (error) throw error
      toast.success('Skill removed')
      await revalidateContentPages()
      await loadAllContent()
    } catch (e: any) {
      console.error(e)
      toast.error('Failed to delete skill')
    }
  }

  const saveExperience = async () => {
    try {
      setLoading(prev => ({ ...prev, experience: true }))

      const { error } = await supabase
        .from('about_experience')
        .insert({
          title: experienceForm.title,
          organization: experienceForm.organization,
          period: experienceForm.period,
          description: experienceForm.description || null,
          about_content_id: aboutContent?.id,
          order: aboutExperience.length
        })

      if (error) throw error

      toast.success('Experience added successfully')
      await revalidateContentPages()
      setExperienceForm({ title: '', organization: '', period: '', description: '' })
      await loadAllContent()
    } catch (error: unknown) {
      console.error('Error saving experience:', error)
      toast.error('Failed to save experience')
    } finally {
      setLoading(prev => ({ ...prev, experience: false }))
    }
  }

  const saveSkill = async () => {
    try {
      setLoading(prev => ({ ...prev, skills: true }))

      const { error } = await supabase
        .from('about_skills')
        .insert({
          name: skillForm.name,
          icon: skillForm.icon || null,
          about_content_id: aboutContent?.id,
          order: aboutSkills.length
        })

      if (error) throw error

      toast.success('Skill added successfully')
      await revalidateContentPages()
      setSkillForm({ name: '', icon: '' })
      await loadAllContent()
    } catch (error: unknown) {
      console.error('Error saving skill:', error)
      toast.error('Failed to save skill')
    } finally {
      setLoading(prev => ({ ...prev, skills: false }))
    }
  }

  const saveAward = async () => {
    try {
      setLoading(prev => ({ ...prev, awards: true }))

      const { error } = await supabase
        .from('about_awards')
        .insert({
          title: awardForm.title,
          organization: awardForm.organization,
          year: awardForm.year,
          about_content_id: aboutContent?.id,
          order: aboutAwards.length
        })

      if (error) throw error

      toast.success('Award added successfully')
      await revalidateContentPages()
      setAwardForm({ title: '', organization: '', year: '' })
      await loadAllContent()
    } catch (error: unknown) {
      console.error('Error saving award:', error)
      toast.error('Failed to save award')
    } finally {
      setLoading(prev => ({ ...prev, awards: false }))
    }
  }

  const saveEquipmentCategory = async () => {
    try {
      setLoading(prev => ({ ...prev, equipment: true }))

      const { error } = await supabase
        .from('about_equipment_categories')
        .insert({
          category: equipmentCategoryForm.category,
          about_content_id: aboutContent?.id,
          order: aboutEquipmentCategories.length
        })

      if (error) throw error

      toast.success('Equipment category added successfully')
      await revalidateContentPages()
      setEquipmentCategoryForm({ category: '' })
      await loadAllContent()
    } catch (error: unknown) {
      console.error('Error saving equipment category:', error)
      toast.error('Failed to save equipment category')
    } finally {
      setLoading(prev => ({ ...prev, equipment: false }))
    }
  }

  const saveEquipmentItem = async () => {
    try {
      setLoading(prev => ({ ...prev, equipment: true }))

      const { error } = await supabase
        .from('about_equipment_items')
        .insert({
          item: equipmentItemForm.item,
          equipment_category_id: equipmentItemForm.equipment_category_id,
          order: aboutEquipmentItems.filter(item => item.equipment_category_id === equipmentItemForm.equipment_category_id).length
        })

      if (error) throw error

      toast.success('Equipment item added successfully')
      await revalidateContentPages()
      setEquipmentItemForm({ item: '', equipment_category_id: '' })
      await loadAllContent()
    } catch (error: unknown) {
      console.error('Error saving equipment item:', error)
      toast.error('Failed to save equipment item')
    } finally {
      setLoading(prev => ({ ...prev, equipment: false }))
    }
  }


  const getContactIcon = (type: ContactInfo['type']) => {
    switch (type) {
      case 'email': return Mail
      case 'phone': return Phone
      case 'instagram': return Eye
      case 'website': return Globe
      case 'location': return MapPin
      default: return Settings
    }
  }

  const applyContactTemplate = (template: ContactTemplate) => {
    setContactForm(template.form)
  }

  const applyContactTypePreset = (type: ContactInfo['type']) => {
    const defaultLabelByType: Record<ContactInfo['type'], string> = {
      email: 'Email',
      phone: 'Phone',
      instagram: 'Instagram',
      website: 'Website',
      location: 'Location',
    }
    setContactForm((prev) => ({
      ...prev,
      type,
      label: prev.label || defaultLabelByType[type],
      icon: '',
    }))
  }

  const applySiteSettingTemplate = (template: SiteSettingTemplate) => {
    setSettingsForm({
      key: template.key,
      value: template.value,
      type: template.type,
      description: template.description,
    })
  }

  const startEditContact = (contact: ContactInfo) => {
    setEditingContactId(contact.id)
    setContactForm({
      type: contact.type,
      value: contact.value,
      label: contact.label,
      icon: contact.icon || '',
    })
  }

  const cancelEditContact = () => {
    setEditingContactId(null)
    setContactForm({ type: 'email', value: '', label: '', icon: '' })
  }

  const startEditSiteSetting = (setting: SiteSettings) => {
    setEditingSettingId(setting.id)
    setSettingsForm({
      key: setting.key,
      value: setting.value || '',
      type: setting.type,
      description: setting.description || '',
    })
  }

  const cancelEditSiteSetting = () => {
    setEditingSettingId(null)
    setSettingsForm({ key: '', value: '', type: 'string', description: '' })
  }

  return (
    <div className="space-y-8">
      {/* Database Migration Warning */}
      {tablesExist === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Database Migration Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The CMS database tables haven&apos;t been created yet. Please run the migration SQL below in your Supabase dashboard.</p>
                <div className="mt-3 space-y-2">
                  <div className="bg-yellow-100 p-3 rounded font-mono text-xs text-yellow-900 max-h-32 overflow-y-auto">
                    {`-- Copy this SQL and run it in Supabase Dashboard > SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'PEAK DETH',
  subtitle TEXT NOT NULL DEFAULT 'POS, Management System, Website & Mobile App Development',
  background_image_url TEXT,
  background_image_id TEXT,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ... (additional tables and policies)`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(`-- Copy and run this in Supabase Dashboard > SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'PEAK DETH',
  subtitle TEXT NOT NULL DEFAULT 'POS, Management System, Website & Mobile App Development',
  background_image_url TEXT,
  background_image_id TEXT,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional tables, indexes, policies, and default data...
-- See database_migration.sql file for complete SQL`)}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium"
                    >
                      Copy SQL
                    </button>
                    <button
                      onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium"
                    >
                      Open Supabase
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>About & CV Management</span>
            <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-mono">
              Live Synchronized
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Easily edit and update every part of your Profile, CV / Resume, experience, education, skills, and awards in real time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild className="border-white/10 text-zinc-300 hover:text-white rounded-xl">
            <a href="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="border-white/10 text-zinc-300 hover:text-white rounded-xl">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Home className="w-4 h-4 mr-2" />
              Website
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-xl">
            <a href="/cv" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live CV
            </a>
          </Button>
          <Button size="sm" onClick={() => window.open('/cv/print', '_blank')} className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg">
            <Printer className="w-4 h-4 mr-2" />
            Print CV (A4 PDF)
          </Button>
        </div>
      </div>

      {/* Informative Hub Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
          <span>
            Looking for Homepage optics or Developer systems?{' '}
            <span className="text-zinc-200 font-medium">Hero Section</span> is managed under <Link href="/admin/dashboard/homepage" className="text-blue-400 hover:underline font-medium">Homepage</Link>, and <span className="text-zinc-200 font-medium">Services & Domains</span> are under <Link href="/admin/dashboard/developer" className="text-blue-400 hover:underline font-medium">Developer</Link>.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm" className="h-7 text-xs border-white/10 text-zinc-300 hover:text-white">
            <Link href="/admin/dashboard/homepage">Homepage</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-7 text-xs border-white/10 text-zinc-300 hover:text-white">
            <Link href="/admin/dashboard/developer">Developer</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cv-profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1.5 gap-1.5 bg-zinc-900/60 border border-white/10 rounded-2xl">
          <TabsTrigger value="cv-profile" className="rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-white font-medium py-2 text-xs">
            <User className="w-3.5 h-3.5 mr-1.5" />
            CV Profile & Bio
          </TabsTrigger>
          <TabsTrigger value="experience" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium py-2 text-xs">
            <Briefcase className="w-3.5 h-3.5 mr-1.5" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium py-2 text-xs">
            <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
            Education
          </TabsTrigger>
          <TabsTrigger value="skills" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium py-2 text-xs">
            <Code2 className="w-3.5 h-3.5 mr-1.5" />
            Skills & Stack
          </TabsTrigger>
          <TabsTrigger value="awards" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium py-2 text-xs">
            <Award className="w-3.5 h-3.5 mr-1.5" />
            Awards
          </TabsTrigger>
          <TabsTrigger value="cv-preview" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-medium py-2 text-xs">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            CV Live Preview
          </TabsTrigger>
          <TabsTrigger value="about" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium py-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Artist Web Bio
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium py-2 text-xs">
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Hero Content Tab (Moved to Homepage) */}
        <TabsContent value="hero" className="space-y-6">
          <Card className="bg-zinc-900/50 border-white/10 rounded-3xl">
            <CardContent className="p-8 text-center space-y-4">
              <Sparkles className="w-10 h-10 text-blue-400 mx-auto" />
              <div>
                <h3 className="text-base font-semibold text-white">Hero Section is Managed Under Homepage</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Hero visuals, banner titles, subtitles, background optics, and full-screen overlay are now centralized in the Homepage Control Center.
                </p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg">
                <Link href="/admin/dashboard/homepage">Go to Homepage Control Center</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab (Moved to Developer) */}
        <TabsContent value="services" className="space-y-6">
          <Card className="bg-zinc-900/50 border-white/10 rounded-3xl">
            <CardContent className="p-8 text-center space-y-4">
              <Globe className="w-10 h-10 text-blue-400 mx-auto" />
              <div>
                <h3 className="text-base font-semibold text-white">Developer Systems & Services are Managed Under Developer</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Manage software services, domain URLs, interactive live previews, position ordering, and homepage visibility in the dedicated Developer manager.
                </p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg">
                <Link href="/admin/dashboard/developer">Go to Developer Manager</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                About Page Content
              </CardTitle>
              <CardDescription>
                Manage the content displayed on your about page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Homepage Showcase Switch Card */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-sm text-white">Display About Section on Homepage</span>
                    <Badge variant="outline" className={`text-[10px] ${aboutForm.show_on_homepage ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                      {aboutForm.show_on_homepage ? 'Active on Homepage' : 'Hidden from Homepage'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, a featured profile snapshot with your tagline, bio, competencies, and portrait is displayed on the main homepage.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Switch
                    checked={aboutForm.show_on_homepage}
                    onCheckedChange={(checked) => setAboutForm(prev => ({ ...prev, show_on_homepage: checked }))}
                  />
                  <span className="text-xs font-medium text-zinc-300">
                    {aboutForm.show_on_homepage ? 'Visible' : 'Off'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="about-title">Page Title</Label>
                    <Input
                      id="about-title"
                      value={aboutForm.title}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="About Me"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-name">Name</Label>
                    <Input
                      id="about-name"
                      value={aboutForm.name}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-tagline">Tagline</Label>
                    <Input
                      id="about-tagline"
                      value={aboutForm.tagline}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Professional Photographer & Visual Storyteller"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-bio">Bio</Label>
                    <Textarea
                      id="about-bio"
                      value={aboutForm.bio}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell your story..."
                      rows={6}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <CloudinaryUpload
                      onUploadComplete={(result) => {
                        setAboutForm(prev => ({
                          ...prev,
                          profile_image_url: result.image_url,
                          profile_image_id: result.image_id
                        }))
                      }}
                      currentImageUrl={aboutForm.profile_image_url}
                      currentImageId={aboutForm.profile_image_id}
                    />
                  </div>

                  {aboutForm.profile_image_url && (
                    <div className="relative aspect-square rounded-lg overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={aboutForm.profile_image_url}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs font-semibold text-white flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      CV Contact & Direct Channels (Synchronized with CV Document)
                    </span>
                    <Badge variant="outline" className="text-[10px] text-zinc-400 border-white/10">
                      Auto-syncs to CV
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-zinc-400">Phone Number</Label>
                      <Input
                        value={quickContact.phone}
                        onChange={(e) => setQuickContact({ ...quickContact, phone: e.target.value })}
                        placeholder="+855 68656263"
                        className="h-8 text-xs bg-zinc-900 border-white/10 text-white rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-zinc-400">Public Email</Label>
                      <Input
                        value={quickContact.email}
                        onChange={(e) => setQuickContact({ ...quickContact, email: e.target.value })}
                        placeholder="hello@peakdeth.com"
                        className="h-8 text-xs bg-zinc-900 border-white/10 text-white rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-zinc-400">City / Country Location</Label>
                      <Input
                        value={quickContact.location}
                        onChange={(e) => setQuickContact({ ...quickContact, location: e.target.value })}
                        placeholder="Phnom Penh, Cambodia"
                        className="h-8 text-xs bg-zinc-900 border-white/10 text-white rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-zinc-400">Website URL</Label>
                      <Input
                        value={quickContact.website}
                        onChange={(e) => setQuickContact({ ...quickContact, website: e.target.value })}
                        placeholder="https://peakdeth.com"
                        className="h-8 text-xs bg-zinc-900 border-white/10 text-white rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-zinc-400">Instagram Handle</Label>
                      <Input
                        value={quickContact.instagram}
                        onChange={(e) => setQuickContact({ ...quickContact, instagram: e.target.value })}
                        placeholder="@peakdeth"
                        className="h-8 text-xs bg-zinc-900 border-white/10 text-white rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button
                  onClick={saveAboutContent}
                  disabled={loading.about || savingCV}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg min-w-44 h-10 text-xs font-semibold"
                >
                  {(loading.about || savingCV) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save Bio & Sync CV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab (Moved to Contact) */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="bg-zinc-900/50 border-white/10 rounded-3xl">
            <CardContent className="p-8 text-center space-y-4">
              <Phone className="w-10 h-10 text-emerald-400 mx-auto" />
              <div>
                <h3 className="text-base font-semibold text-white">Contact Information is Managed Under Contact</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Configure public contact channels, email, phone, location, social links, and privacy toggles in the dedicated Contact manager.
                </p>
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg">
                <Link href="/admin/dashboard/contact">Go to Contact Manager</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CV Profile & Bio Tab */}
        <TabsContent value="cv-profile" className="space-y-6">
          <CVProfileManager
            cvData={cvData}
            onUpdate={handleUpdateProfile}
            saving={savingCV}
          />
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <CVExperienceManager
            experiences={cvData.experiences}
            onUpdate={handleUpdateExperiences}
            saving={savingCV}
          />
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <CVEducationManager
            education={cvData.education}
            onUpdate={handleUpdateEducation}
            saving={savingCV}
          />
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <CVSkillsManager
            coreCompetencies={cvData.coreCompetencies}
            technicalExpertise={cvData.technicalExpertise}
            aboutSkills={aboutSkills}
            onUpdateCompetencies={handleUpdateCompetencies}
            onUpdateExpertise={handleUpdateExpertise}
            onAddAboutSkill={addAboutSkill}
            onDeleteAboutSkill={deleteAboutSkill}
            saving={savingCV}
          />
        </TabsContent>

        {/* Awards Tab */}
        <TabsContent value="awards" className="space-y-6">
          <CVAwardsManager
            awards={cvData.awards}
            onUpdate={handleUpdateAwards}
            saving={savingCV}
          />
        </TabsContent>

        {/* CV Live Preview Tab */}
        <TabsContent value="cv-preview" className="space-y-6">
          <CVLivePreviewTab
            cvData={cvData}
            onRefresh={loadAllContent}
            onUpdateProfile={handleUpdateProfile}
            saving={savingCV}
          />
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Equipment</CardTitle>
              <CardDescription>
                Manage your photography equipment and gear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Equipment Category */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Add Equipment Category</h3>
                <div className="space-y-2">
                  <Label htmlFor="equipment-category">Category Name</Label>
                  <Input
                    id="equipment-category"
                    value={equipmentCategoryForm.category}
                    onChange={(e) => setEquipmentCategoryForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Cameras"
                  />
                </div>

                <Button
                  onClick={saveEquipmentCategory}
                  disabled={loading.equipment || !equipmentCategoryForm.category.trim()}
                  className="w-full md:w-auto"
                >
                  {loading.equipment && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add Category
                </Button>
              </div>

              {/* Add Equipment Item */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Add Equipment Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipment-item">Item Name</Label>
                    <Input
                      id="equipment-item"
                      value={equipmentItemForm.item}
                      onChange={(e) => setEquipmentItemForm(prev => ({ ...prev, item: e.target.value }))}
                      placeholder="Canon EOS R5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipment-category-select">Category</Label>
                    <Select
                      value={equipmentItemForm.equipment_category_id}
                      onValueChange={(value) => setEquipmentItemForm(prev => ({ ...prev, equipment_category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {aboutEquipmentCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={saveEquipmentItem}
                  disabled={loading.equipment || !equipmentItemForm.item.trim() || !equipmentItemForm.equipment_category_id}
                  className="w-full md:w-auto"
                >
                  {loading.equipment && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add Equipment Item
                </Button>
              </div>

              {/* Existing Equipment */}
              <div className="space-y-4">
                <h3 className="font-semibold">Equipment</h3>
                {aboutEquipmentCategories.length === 0 ? (
                  <p className="text-muted-foreground">No equipment categories added yet.</p>
                ) : (
                  <div className="grid gap-6">
                    {aboutEquipmentCategories.map((category) => {
                      const items = aboutEquipmentItems.filter(item => item.equipment_category_id === category.id)
                      return (
                        <Card key={category.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{category.category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {items.length === 0 ? (
                              <p className="text-muted-foreground">No items in this category.</p>
                            ) : (
                              <ul className="space-y-2">
                                {items.map((item) => (
                                  <li key={item.id} className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <span className="font-medium">{item.item}</span>
                                      <Badge variant="outline" className="ml-2">Order: {item.order}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="default">Active</Badge>
                                      <Button variant="outline" size="sm">
                                        Edit
                                      </Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <BrandLogoCard />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Site Settings
              </CardTitle>
              <CardDescription>
                Global site configuration and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Setting */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{editingSettingId ? 'Edit Site Setting' : 'Add Site Setting'}</h3>
                  <div className="flex items-center gap-2">
                    {editingSettingId && (
                      <Badge variant="default">Editing</Badge>
                    )}
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Templates available
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Common Footer Presets</Label>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {SITE_SETTING_TEMPLATES.map((template) => (
                      <button
                        key={template.key}
                        type="button"
                        onClick={() => applySiteSettingTemplate(template)}
                        className="rounded-lg border bg-muted/30 p-3 text-left transition hover:bg-muted"
                      >
                        <div className="font-medium text-sm">{template.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{template.key}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="setting-key">Setting Key</Label>
                    <Input
                      id="setting-key"
                      value={settingsForm.key}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="site_title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setting-type">Type</Label>
                    <Select
                      value={settingsForm.type}
                      onValueChange={(value: SiteSettings['type']) => setSettingsForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setting-value">Value</Label>
                  <Input
                    id="setting-value"
                    value={settingsForm.value}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Setting value"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setting-description">Description</Label>
                  <Input
                    id="setting-description"
                    value={settingsForm.description}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={saveSiteSetting}
                    disabled={loading.settings || !settingsForm.key.trim()}
                    className="w-full md:w-auto"
                  >
                    {loading.settings && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingSettingId ? 'Update Setting' : 'Add Setting'}
                  </Button>
                  {editingSettingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditSiteSetting}
                      className="w-full md:w-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
              {/* Existing Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Site Settings</h3>
                {siteSettings.length === 0 ? (
                  <p className="text-muted-foreground">No settings configured yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {siteSettings.map((setting) => (
                      <Card key={setting.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{setting.key}</h4>
                              <p className="text-sm text-muted-foreground">{setting.value}</p>
                              {setting.description && (
                                <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                              )}
                              <Badge variant="outline" className="mt-1">{setting.type}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="default">Active</Badge>
                              <Button variant="outline" size="sm" onClick={() => startEditSiteSetting(setting)}>
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {previewModal && (
        <WebsitePreviewModal
          isOpen={!!previewModal}
          onClose={() => setPreviewModal(null)}
          url={previewModal.url}
          title={previewModal.title}
        />
      )}
    </div>
  )
}
