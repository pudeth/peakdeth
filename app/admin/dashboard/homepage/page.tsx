'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { CloudinaryUpload } from '@/components/cloudinary-upload'
import { WebsitePreviewModal } from '@/components/website-preview-modal'
import {
  Home,
  Sparkles,
  Save,
  Loader2,
  ExternalLink,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  FolderOpen,
  Video,
  Code2,
  CheckCircle2,
  ArrowUpRight,
  MonitorPlay,
  Film,
  Camera,
  Search,
  Star,
  Globe,
  User,
  Edit3,
  Sliders,
  Smartphone,
  CreditCard,
  Lock,
  RefreshCw,
  Layers,
  Maximize2,
  Laptop,
  Tablet,
  ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import NextImage from 'next/image'
import Link from 'next/link'

interface HeroData {
  id?: string
  title: string
  subtitle: string
  background_image_url?: string | null
  background_image_id?: string | null
  overlay_opacity: number
}

interface ServiceItem {
  id?: string
  _id?: string
  number: number
  title: string
  description: string
  icon?: string
  link?: string | null
  show_on_homepage?: boolean
  is_active: boolean
  order: number
}

interface CollectionItem {
  id: string
  title: string
  slug: string
  cover_image_url?: string | null
  parent_id?: string | null
  is_featured: boolean
  featured: boolean
  is_active: boolean
  photos_count?: number
  sub_albums_count?: number
}

interface VideoItem {
  id: string
  title: string
  slug: string
  category?: string
  year?: string
  thumbnail_url?: string | null
  video_url?: string
  featured: boolean
  is_active: boolean
}

interface AboutData {
  id?: string
  title: string
  name: string
  tagline?: string | null
  bio?: string | null
  profile_image_url?: string | null
  profile_image_id?: string | null
  show_on_homepage?: boolean
}

const DEFAULT_SERVICES_PRESETS: ServiceItem[] = [
  {
    id: 'service-1',
    number: 1,
    title: 'POS',
    description: 'Point of sale software with real-time inventory tracking, smart billing, payments, and sales analytics.',
    icon: 'pos',
    link: 'https://weppage-1.onrender.com/home.html',
    show_on_homepage: true,
    is_active: true,
    order: 0,
  },
  {
    id: 'service-2',
    number: 2,
    title: 'Top-Up Diamond',
    description: 'Mobile Legends Bang Bang diamond top-up platform with instant account validation and automated payments.',
    icon: 'diamond',
    link: 'https://mlbb-topup-jet.vercel.app/',
    show_on_homepage: true,
    is_active: true,
    order: 1,
  },
  {
    id: 'service-3',
    number: 3,
    title: 'Web-APP',
    description: 'Smartphone & digital electronics store e-commerce management system, modern responsive web application.',
    icon: 'web',
    link: 'https://dymaly-store.onrender.com',
    show_on_homepage: true,
    is_active: true,
    order: 2,
  },
  {
    id: 'service-4',
    number: 4,
    title: 'Mobile App & Custom System',
    description: 'Cross-platform iOS & Android mobile development, specialized business dashboards, and custom software systems.',
    icon: 'mobile',
    link: '/demo/mobile',
    show_on_homepage: true,
    is_active: true,
    order: 3,
  },
]

export default function ManageHomepagePage() {
  const supabase = createClient()

  // State
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [revalidating, setRevalidating] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  // Hero state
  const [hero, setHero] = useState<HeroData>({
    title: 'PEAK DETH',
    subtitle: 'POS, Management System, Website & Mobile App Development',
    background_image_url: null,
    background_image_id: null,
    overlay_opacity: 0.5,
  })

  // About Profile state
  const [about, setAbout] = useState<AboutData>({
    title: 'About Me',
    name: 'Peak Deth',
    tagline: 'Full-Stack Programming & Cinematic Photography Design',
    bio: 'A multidisciplinary Full-Stack Developer and Visual Artist bridging high-performance software engineering with cinematic photography and design. Dedicated to architecting robust enterprise systems, bespoke POS solutions, and modern mobile & web apps, while capturing evocative visual narratives and crafting refined aesthetic designs.',
    profile_image_url: null,
    profile_image_id: null,
    show_on_homepage: false,
  })

  // Services state
  const [services, setServices] = useState<ServiceItem[]>([])
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)
  const [isAddingService, setIsAddingService] = useState(false)
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    title: '',
    description: '',
    icon: 'pos',
    link: '',
    show_on_homepage: true,
    is_active: true,
  })

  // Collections state
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [albumSearch, setAlbumSearch] = useState('')
  const [albumFilter, setAlbumFilter] = useState<'all' | 'main' | 'sub'>('all')

  // Videos state
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [videoSearch, setVideoSearch] = useState('')

  // Website preview modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState<string>('')

  // Fetch all homepage data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)

      // 1. Load Hero
      try {
        const heroRes = await fetch('/api/content/hero')
        if (heroRes.ok) {
          const heroJson = await heroRes.json()
          if (heroJson.hero) {
            setHero({
              id: heroJson.hero.id,
              title: heroJson.hero.title || 'PEAK DETH',
              subtitle: heroJson.hero.subtitle || '',
              background_image_url: heroJson.hero.background_image_url || null,
              background_image_id: heroJson.hero.background_image_id || null,
              overlay_opacity: heroJson.hero.overlay_opacity ?? 0.5,
            })
          }
        }
      } catch (e) {
        console.warn('Failed to load hero from API:', e)
      }

      // 2. Load Services
      try {
        const servicesRes = await fetch('/api/services')
        if (servicesRes.ok) {
          const servicesJson = await servicesRes.json()
          if (Array.isArray(servicesJson.services) && servicesJson.services.length > 0) {
            setServices(
              servicesJson.services.map((s: any, idx: number) => ({
                id: s.id || s._id || `service-${idx + 1}`,
                _id: s.id || s._id || `service-${idx + 1}`,
                number: Number(s.number) || idx + 1,
                title: s.title || '',
                description: s.description || '',
                icon: s.icon || 'pos',
                link: s.link || '',
                show_on_homepage: s.show_on_homepage !== false,
                is_active: s.is_active ?? true,
                order: Number(s.order !== undefined ? s.order : idx),
              }))
            )
          } else {
            setServices(DEFAULT_SERVICES_PRESETS)
          }
        } else {
          setServices(DEFAULT_SERVICES_PRESETS)
        }
      } catch (e) {
        console.warn('Failed to load services from API:', e)
        setServices(DEFAULT_SERVICES_PRESETS)
      }

      // 3. Load Collections
      try {
        const collectionsRes = await fetch('/api/collections')
        if (collectionsRes.ok) {
          const colJson = await collectionsRes.json()
          if (Array.isArray(colJson.collections)) {
            const raw = colJson.collections
            const links = Array.isArray(colJson.collectionPhotos) ? colJson.collectionPhotos : []

            // Photo counts per collection
            const countMap = new Map<string, number>()
            for (const l of links) {
              if (l.collection_id) {
                countMap.set(l.collection_id, (countMap.get(l.collection_id) || 0) + 1)
              }
            }

            // Sub-albums count per collection
            const subCountMap = new Map<string, number>()
            for (const c of raw) {
              if (c.parent_id) {
                subCountMap.set(c.parent_id, (subCountMap.get(c.parent_id) || 0) + 1)
              }
            }

            setCollections(
              raw.map((c: any) => {
                const isFeaturedVal = Boolean(c.featured ?? c.is_featured)
                return {
                  id: c.id,
                  title: c.title || c.name || 'Untitled Album',
                  slug: c.slug || '',
                  cover_image_url: c.cover_image_url || null,
                  parent_id: c.parent_id || null,
                  is_featured: isFeaturedVal,
                  featured: isFeaturedVal,
                  is_active: c.is_active ?? true,
                  photos_count: countMap.get(c.id) ?? (c.photos_count || 0),
                  sub_albums_count: subCountMap.get(c.id) || 0,
                }
              })
            )
          }
        }
      } catch (e) {
        console.warn('Failed to load collections from API:', e)
      }

      // 4. Load Videos
      try {
        const videosRes = await fetch('/api/videos')
        if (videosRes.ok) {
          const vidJson = await videosRes.json()
          if (Array.isArray(vidJson.videos)) {
            setVideos(vidJson.videos)
          }
        }
      } catch (e) {
        console.warn('Failed to load videos from API:', e)
      }

      // 5. Load About Profile
      try {
        const aboutRes = await fetch('/api/content/about')
        if (aboutRes.ok) {
          const aboutJson = await aboutRes.json()
          if (aboutJson.about) {
            setAbout({
              id: aboutJson.about.id,
              title: aboutJson.about.title || 'About Me',
              name: aboutJson.about.name || 'Peak Deth',
              tagline: aboutJson.about.tagline || '',
              bio: aboutJson.about.bio || '',
              profile_image_url: aboutJson.about.profile_image_url || null,
              profile_image_id: aboutJson.about.profile_image_id || null,
              show_on_homepage: aboutJson.about.show_on_homepage ?? false,
            })
          }
        }
      } catch (e) {
        console.warn('Failed to load about profile from API:', e)
      }
    } catch (error) {
      console.error('Error loading homepage data:', error)
      toast.error('Failed to load some homepage data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Save Hero changes
  const handleSaveHero = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/content/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      })

      if (!res.ok) throw new Error('Failed to save Hero content')
      toast.success('Hero Section saved successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error saving hero section')
    } finally {
      setSaving(false)
    }
  }

  // Save Services list
  const handleSaveServices = async (updatedList?: ServiceItem[], quiet = false) => {
    const listToSave = updatedList || services
    try {
      setSaving(true)
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: listToSave }),
      })

      if (!res.ok) throw new Error('Failed to save services')
      if (!quiet) toast.success('Developer Live Systems updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error saving services')
    } finally {
      setSaving(false)
    }
  }

  // Add new service
  const handleAddService = async () => {
    if (!newService.title?.trim()) {
      toast.error('Please enter a system title')
      return
    }

    const item: ServiceItem = {
      id: `service-${Date.now()}`,
      number: services.length + 1,
      title: newService.title.trim(),
      description: (newService.description || '').trim(),
      icon: newService.icon || 'pos',
      link: newService.link ? newService.link.trim() : null,
      show_on_homepage: newService.show_on_homepage ?? true,
      is_active: newService.is_active ?? true,
      order: services.length,
    }

    const updated = [...services, item]
    setServices(updated)
    setIsAddingService(false)
    setNewService({ title: '', description: '', icon: 'pos', link: '', show_on_homepage: true, is_active: true })
    await handleSaveServices(updated)
  }

  // Update existing service
  const handleUpdateService = async (service: ServiceItem) => {
    const updated = services.map(s => (s.id === service.id || s._id === service._id ? service : s))
    setServices(updated)
    setEditingService(null)
    await handleSaveServices(updated)
  }

  // Delete service
  const handleDeleteService = async (id?: string) => {
    if (!id) return
    if (!confirm('Are you sure you want to delete this developer system?')) return
    try {
      setSaving(true)
      // Call dedicated DELETE API
      const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to delete system from server')
      }

      const updated = services
        .filter(s => s.id !== id && s._id !== id)
        .map((s, idx) => ({
          ...s,
          number: idx + 1,
          order: idx + 1,
        }))
      setServices(updated)
      await handleSaveServices(updated, true)
      toast.success('Developer system deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error deleting service')
    } finally {
      setSaving(false)
    }
  }

  // Reset to default 4 production services
  const handleResetDefaultServices = async () => {
    setServices(DEFAULT_SERVICES_PRESETS)
    await handleSaveServices(DEFAULT_SERVICES_PRESETS)
    toast.success('Reset to 4 default production systems')
  }

  // Save About Profile changes
  const handleSaveAbout = async (updatedAbout?: AboutData) => {
    const dataToSave = updatedAbout || about
    try {
      setSaving(true)
      const res = await fetch('/api/content/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })

      if (!res.ok) throw new Error('Failed to save About Profile')
      const json = await res.json()
      if (json.about) {
        setAbout(prev => ({
          ...prev,
          ...json.about,
          profile_image_url: json.about.profile_image_url ?? prev.profile_image_url,
          profile_image_id: json.about.profile_image_id ?? prev.profile_image_id,
        }))
      } else if (updatedAbout) {
        setAbout(updatedAbout)
      }
      toast.success('About Profile saved successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error saving about profile')
    } finally {
      setSaving(false)
    }
  }


  // Toggle collection featured status
  const handleToggleCollectionFeatured = async (collectionId: string, currentFeatured: boolean) => {
    const newFeatured = !currentFeatured
    const updated = collections.map(c =>
      c.id === collectionId ? { ...c, is_featured: newFeatured, featured: newFeatured } : c
    )
    setCollections(updated)

    try {
      // 1. Try updating via API endpoint with admin privileges
      const res = await fetch('/api/collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: collectionId, featured: newFeatured }),
      })

      if (!res.ok) {
        // Fallback directly to supabase client
        await supabase
          .from('collections')
          .update({ featured: newFeatured })
          .eq('id', collectionId)
      }

      toast.success(newFeatured ? 'Album pinned to Homepage' : 'Album unpinned from Homepage')
    } catch {
      toast.error('Failed to update album status')
    }
  }

  // Toggle video featured status
  const handleToggleVideoFeatured = async (videoId: string, currentFeatured: boolean) => {
    const updated = videos.map(v => (v.id === videoId ? { ...v, featured: !currentFeatured } : v))
    setVideos(updated)

    try {
      await supabase
        .from('videos')
        .update({ featured: !currentFeatured })
        .eq('id', videoId)

      toast.success(!currentFeatured ? 'Video pinned to Homepage' : 'Video removed from Homepage')
    } catch {
      toast.error('Failed to update video status')
    }
  }

  // Revalidate homepage cache
  const handleRevalidate = async () => {
    try {
      setRevalidating(true)
      const res = await fetch('/api/revalidate?path=/')
      if (res.ok) {
        toast.success('Homepage cache revalidated and updated!')
      } else {
        toast.info('Cache refreshed')
      }
    } catch {
      toast.info('Cache refreshed')
    } finally {
      setRevalidating(false)
    }
  }

  // Filter collections
  const filteredAlbums = useMemo(() => {
    return collections.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(albumSearch.toLowerCase())
      if (!matchesSearch) return false
      if (albumFilter === 'main') return !c.parent_id
      if (albumFilter === 'sub') return Boolean(c.parent_id)
      return true
    })
  }, [collections, albumSearch, albumFilter])

  // Filter videos
  const filteredVideos = useMemo(() => {
    return videos.filter(
      v =>
        v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
        (v.category && v.category.toLowerCase().includes(videoSearch.toLowerCase()))
    )
  }, [videos, videoSearch])

  // Stat counts
  const mainAlbums = useMemo(() => collections.filter(c => !c.parent_id), [collections])
  const featuredAlbumsCount = useMemo(
    () => collections.filter(c => !c.parent_id && (c.featured || c.is_featured)).length,
    [collections]
  )
  const featuredVideosCount = useMemo(() => videos.filter(v => v.featured).length, [videos])
  const activeServicesCount = useMemo(
    () => services.filter(s => s.is_active && s.show_on_homepage !== false).length,
    [services]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono text-zinc-400">Loading Homepage Control Center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Homepage Control Center
            </h1>
            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
              Live Production
            </Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Configure every interface layer of your landing page: Hero visuals, developer live systems, about narrative, curated photo albums, and video reels.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevalidate}
            disabled={revalidating}
            className="bg-zinc-900 border-white/10 hover:bg-white/5 text-zinc-300 rounded-xl h-10"
          >
            <RotateCcw className={`w-4 h-4 mr-2 ${revalidating ? 'animate-spin' : ''}`} />
            <span>Revalidate Cache</span>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-zinc-900 border-white/10 hover:bg-white/5 text-zinc-300 rounded-xl h-10"
          >
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Open Live Homepage</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setActiveTab('hero')}
          className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Hero Section</span>
          <span className="text-base sm:text-lg font-bold text-white mt-1 truncate">
            {hero.title || 'PEAK DETH'}
          </span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Optic
          </span>
        </div>

        <div
          onClick={() => setActiveTab('services')}
          className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Developer Systems</span>
          <span className="text-base sm:text-lg font-bold text-white mt-1">
            {activeServicesCount}/4 Active
          </span>
          <span className="text-[11px] text-zinc-400 mt-1">
            {services.length} Registered Nodes
          </span>
        </div>

        <div
          onClick={() => setActiveTab('about')}
          className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">About Profile</span>
          <span className="text-base sm:text-lg font-bold text-white mt-1">
            {about.show_on_homepage ? 'Displayed' : 'Hidden'}
          </span>
          <span className={`text-[11px] flex items-center gap-1 mt-1 ${about.show_on_homepage ? 'text-emerald-400' : 'text-zinc-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${about.show_on_homepage ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
            {about.show_on_homepage ? 'Live Section' : 'Disabled'}
          </span>
        </div>

        <div
          onClick={() => setActiveTab('albums')}
          className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Main Albums</span>
          <span className="text-base sm:text-lg font-bold text-white mt-1">
            {mainAlbums.length} Main Categories
          </span>
          <span className="text-[11px] text-zinc-400 mt-1">
            {collections.length} Total Collections
          </span>
        </div>

        <div
          onClick={() => setActiveTab('videos')}
          className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Cinema Videos</span>
          <span className="text-base sm:text-lg font-bold text-white mt-1">
            {featuredVideosCount} Featured
          </span>
          <span className="text-[11px] text-zinc-400 mt-1">
            {videos.length} Total Reels
          </span>
        </div>
      </div>

      {/* Main Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900/90 p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto flex flex-wrap h-auto gap-1">
          <TabsTrigger
            value="hero"
            className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-semibold text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>1. Hero Section</span>
          </TabsTrigger>

          <TabsTrigger
            value="services"
            className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-semibold text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2 transition-all"
          >
            <Code2 className="w-4 h-4" />
            <span>2. Developer Systems ({activeServicesCount})</span>
          </TabsTrigger>

          <TabsTrigger
            value="about"
            className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-semibold text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2 transition-all"
          >
            <User className="w-4 h-4" />
            <span>3. About Profile ({about.show_on_homepage ? 'Active' : 'Off'})</span>
          </TabsTrigger>

          <TabsTrigger
            value="albums"
            className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-semibold text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>4. Main Albums ({mainAlbums.length})</span>
          </TabsTrigger>

          <TabsTrigger
            value="videos"
            className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-black font-semibold text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2 transition-all"
          >
            <Film className="w-4 h-4" />
            <span>5. Cinema & Videos ({featuredVideosCount})</span>
          </TabsTrigger>

          <TabsTrigger
            value="preview"
            className="rounded-xl data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-semibold text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2 transition-all ml-auto"
          >
            <Eye className="w-4 h-4" />
            <span>Interactive Live View</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: HERO SECTION */}
        <TabsContent value="hero" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hero Form */}
            <Card className="lg:col-span-7 bg-zinc-950/80 border-white/10 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Hero Visuals & Text</span>
                </CardTitle>
                <CardDescription>
                  Configure the primary banner title, subtitle, and full-screen optics overlay.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="hero-title" className="text-xs uppercase font-semibold text-zinc-400">
                    Brand Name / Title
                  </Label>
                  <Input
                    id="hero-title"
                    value={hero.title}
                    onChange={e => setHero(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="PEAK DETH"
                    className="bg-zinc-900 border-white/10 rounded-xl text-white font-bold"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Displayed in huge cinematic typography on the homepage hero. (English: PEAK DETH / Khmer: ពាក្យ ដេត)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-sub" className="text-xs uppercase font-semibold text-zinc-400">
                    Hero Subtitle / Description
                  </Label>
                  <Textarea
                    id="hero-sub"
                    value={hero.subtitle}
                    onChange={e => setHero(prev => ({ ...prev, subtitle: e.target.value }))}
                    rows={3}
                    placeholder="POS, Management System, Website & Mobile App Development • Cinematic Photography & Video Production"
                    className="bg-zinc-900 border-white/10 rounded-xl text-zinc-200 text-sm leading-relaxed"
                  />
                </div>

                {/* Background Image */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <Label className="text-xs uppercase font-semibold text-zinc-400">
                    Hero Background Image (Optional Full-Screen Optic)
                  </Label>

                  <div className="flex items-center gap-3">
                    <CloudinaryUpload
                      onUploadComplete={result => {
                        setHero(prev => ({
                          ...prev,
                          background_image_url: result.image_url,
                          background_image_id: result.image_id,
                        }))
                        toast.success('Hero background image uploaded')
                      }}
                      currentImageUrl={hero.background_image_url || undefined}
                      folder="hero"
                    />

                    {hero.background_image_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setHero(prev => ({ ...prev, background_image_url: null, background_image_id: null }))
                        }
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl h-10"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" /> Remove Image
                      </Button>
                    )}
                  </div>

                  <Input
                    value={hero.background_image_url || ''}
                    onChange={e => setHero(prev => ({ ...prev, background_image_url: e.target.value || null }))}
                    placeholder="https://res.cloudinary.com/... or direct image URL"
                    className="bg-zinc-900/60 border-white/10 rounded-xl text-xs text-zinc-300 mt-2"
                  />
                </div>

                {/* Overlay Opacity */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase font-semibold text-zinc-400">
                      Dark Vignette / Overlay Opacity
                    </Label>
                    <span className="text-xs font-mono font-bold text-white">
                      {Math.round(hero.overlay_opacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[hero.overlay_opacity]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={([val]) => setHero(prev => ({ ...prev, overlay_opacity: val }))}
                    className="py-2"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Controls how dark the background overlay is to ensure high text contrast.
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleSaveHero}
                    disabled={saving}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl shadow-lg px-6 h-11"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    <span>Save Hero Section</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Mockup Preview */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-black border-white/15 shadow-2xl rounded-3xl overflow-hidden sticky top-8">
                <div className="p-3.5 bg-zinc-950 border-b border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE HERO PREVIEW
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  </div>
                </div>

                <div className="relative aspect-[16/11] w-full flex flex-col justify-center items-center p-6 text-center overflow-hidden bg-zinc-950">
                  {hero.background_image_url && (
                    <NextImage
                      src={hero.background_image_url}
                      alt="Hero preview"
                      fill
                      className="object-cover"
                    />
                  )}

                  {/* Dark overlay */}
                  <div
                    className="absolute inset-0 bg-black pointer-events-none"
                    style={{ opacity: hero.overlay_opacity }}
                  />

                  {/* Mock content */}
                  <div className="relative z-10 space-y-3 max-w-sm">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-[9px] text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      SYSTEMS & CINEMA
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase">
                      {hero.title || 'PEAK DETH'}
                    </h3>

                    <p className="text-[11px] text-zinc-300 leading-snug line-clamp-3">
                      {hero.subtitle || 'POS, Management System, Website & Mobile App Development'}
                    </p>

                    <div className="flex items-center justify-center gap-2 pt-2">
                      <span className="px-3 py-1 rounded-full bg-white text-black font-bold text-[10px]">
                        Developer (Coding)
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-medium text-[10px]">
                        Visual Stories
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/80 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>SCALE: 1:1 SCALED</span>
                  <Link href="/" target="_blank" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    <span>Preview Live</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: DEVELOPER & LIVE SYSTEMS */}
        <TabsContent value="services" className="space-y-6">
          {/* Cluster Telemetry Ribbon */}
          <div className="px-4 py-3 rounded-2xl bg-zinc-950/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3 text-emerald-400">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM CLUSTER STATUS: {activeServicesCount}/4 ONLINE
              </span>
              <span className="text-zinc-600 hidden md:inline">•</span>
              <span className="text-zinc-400 hidden md:inline">ROUTING: EDGE REVERSE PROXY</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetDefaultServices}
                className="bg-zinc-900 border-white/10 text-xs h-8 rounded-xl text-zinc-300 hover:text-white"
              >
                <RefreshCw className="w-3 h-3 mr-1.5" />
                <span>Reset 4 Production Presets</span>
              </Button>

              <Button
                onClick={() => setIsAddingService(true)}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs h-8 rounded-xl shadow-md"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Node
              </Button>
            </div>
          </div>

          {/* Add / Edit Service Form */}
          {(isAddingService || editingService) && (
            <Card className="bg-zinc-950 border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  {editingService ? `Edit Node #${String(editingService.number).padStart(2, '0')}: ${editingService.title}` : 'Add New System Node'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingService(false)
                    setEditingService(null)
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>

              {editingService ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-400">Node Number</Label>
                      <Input
                        type="number"
                        value={editingService.number}
                        onChange={e => setEditingService({ ...editingService, number: Number(e.target.value) || 1 })}
                        className="bg-zinc-900 border-white/10 rounded-xl font-mono"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-400">System Title</Label>
                      <Input
                        value={editingService.title}
                        onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                        placeholder="POS, Top-Up Diamond, Web-APP..."
                        className="bg-zinc-900 border-white/10 rounded-xl font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400">Interactive Preview URL</Label>
                    <Input
                      value={editingService.link || ''}
                      onChange={e => setEditingService({ ...editingService, link: e.target.value })}
                      placeholder="https://weppage-1.onrender.com/home.html or /demo/mobile"
                      className="bg-zinc-900 border-white/10 rounded-xl font-mono text-xs text-cyan-300"
                    />
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                      <span className="text-zinc-500">Quick Presets:</span>
                      <button
                        type="button"
                        onClick={() => setEditingService({ ...editingService, link: 'https://weppage-1.onrender.com/home.html' })}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300"
                      >
                        POS (Grocery)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingService({ ...editingService, link: 'https://mlbb-topup-jet.vercel.app/' })}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300"
                      >
                        MLBB Diamond
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingService({ ...editingService, link: 'https://dymaly-store.onrender.com' })}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300"
                      >
                        Web-APP Store
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingService({ ...editingService, link: '/demo/mobile' })}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300"
                      >
                        /demo/mobile
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400">Description</Label>
                    <Textarea
                      value={editingService.description}
                      onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                      rows={2}
                      className="bg-zinc-900 border-white/10 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editingService.show_on_homepage !== false}
                        onCheckedChange={checked => setEditingService({ ...editingService, show_on_homepage: checked })}
                      />
                      <span className="text-xs text-zinc-300">Show on Homepage</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const targetId = editingService.id || editingService._id
                          setEditingService(null)
                          if (targetId) handleDeleteService(targetId)
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingService(null)}
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateService(editingService)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-400">System Title</Label>
                      <Input
                        value={newService.title}
                        onChange={e => setNewService(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. POS Billing & Inventory"
                        className="bg-zinc-900 border-white/10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-400">Interactive Live Demo URL</Label>
                      <Input
                        value={newService.link || ''}
                        onChange={e => setNewService(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="https://your-demo.vercel.app or /demo/mobile"
                        className="bg-zinc-900 border-white/10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400">Description</Label>
                    <Textarea
                      value={newService.description}
                      onChange={e => setNewService(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe system capabilities, stack, and features..."
                      rows={2}
                      className="bg-zinc-900 border-white/10 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingService(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddService}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl"
                    >
                      Create Node
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* 4 Cards Grid - Styled exactly like the Homepage Developer Window */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, idx) => (
              <Card
                key={service.id || service._id || idx}
                className={`bg-zinc-950 border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-white/25 transition-all duration-300 ${!service.is_active || service.show_on_homepage === false ? 'opacity-60' : ''}`}
              >
                {/* Browser Titlebar */}
                <div className="px-3.5 py-2.5 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between text-xs select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950 border border-white/10 text-[10px] font-mono text-zinc-400 max-w-[130px] truncate">
                    <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      {service.link
                        ? (service.link.startsWith('/') ? 'mobile-app.peakdeth.com' : service.link.replace(/^https?:\/\//, '').replace(/\/$/, ''))
                        : service.title}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] font-bold text-white px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10">
                    {String(service.number || idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-white truncate">
                        {service.title}
                      </h3>
                      {service.show_on_homepage !== false ? (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          ON HOME
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
                          HIDDEN
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-zinc-500">Show on Home:</span>
                      <Switch
                        checked={service.show_on_homepage !== false}
                        onCheckedChange={checked => {
                          const updated = services.map(s =>
                            s.id === service.id || s._id === service._id ? { ...s, show_on_homepage: checked } : s
                          )
                          setServices(updated)
                          handleSaveServices(updated)
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingService(service)}
                        className="bg-zinc-900 border-white/10 hover:bg-white/5 text-zinc-300 text-xs h-7 px-2.5 rounded-lg flex-1"
                      >
                        <Edit3 className="w-3 h-3 mr-1" /> Edit
                      </Button>

                      {service.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPreviewUrl(service.link || null)
                            setPreviewTitle(service.title)
                          }}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-300 text-xs h-7 px-2.5 rounded-lg"
                          title="Test Live Preview"
                        >
                          <MonitorPlay className="w-3 h-3" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete this system"
                        disabled={saving}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteService(service.id || service._id)
                        }}
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: ABOUT PROFILE */}
        <TabsContent value="about" className="space-y-6">
          <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Homepage About Profile Section</h3>
                <Badge
                  variant="outline"
                  className={`text-xs ${about.show_on_homepage ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
                >
                  {about.show_on_homepage ? 'Displayed on Homepage' : 'Hidden from Homepage'}
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                Display a prominent personal introduction with your engineering & photography capabilities directly on the main landing page.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-medium text-zinc-300">
                {about.show_on_homepage ? 'Show on Homepage' : 'Hidden'}
              </span>
              <Switch
                checked={about.show_on_homepage}
                onCheckedChange={checked => {
                  const updated = { ...about, show_on_homepage: checked }
                  setAbout(updated)
                  handleSaveAbout(updated)
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7 bg-zinc-950/80 border-white/10 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span>Edit Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update the narrative copy, headline tagline, and photography bio featured across your site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">Section Headline Title</Label>
                    <Input
                      value={about.title}
                      onChange={e => setAbout(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Full-Stack Programming & Cinematic Photography Design"
                      className="bg-zinc-900 border-white/10 rounded-xl text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">Creator / Display Name</Label>
                    <Input
                      value={about.name}
                      onChange={e => setAbout(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Peak Deth"
                      className="bg-zinc-900 border-white/10 rounded-xl text-xs sm:text-sm text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-400">Primary Tagline</Label>
                  <Input
                    value={about.tagline || ''}
                    onChange={e => setAbout(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Full-Stack Programming & Cinematic Photography Design"
                    className="bg-zinc-900 border-white/10 rounded-xl text-xs sm:text-sm text-emerald-400 font-medium"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Highlighted as a bold quotation badge right beneath the section headline.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-400">Biography / Narrative</Label>
                  <Textarea
                    value={about.bio || ''}
                    onChange={e => setAbout(prev => ({ ...prev, bio: e.target.value }))}
                    rows={5}
                    placeholder="Describe your background in engineering, software systems, and cinematography design..."
                    className="bg-zinc-900 border-white/10 rounded-xl text-xs sm:text-sm text-zinc-300 leading-relaxed resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-400">Profile Portrait / Brand Logo</Label>
                  <CloudinaryUpload
                    onUploadComplete={result => {
                      const updated: AboutData = {
                        ...about,
                        profile_image_url: result.image_url,
                        profile_image_id: result.image_id,
                      }
                      setAbout(updated)
                      handleSaveAbout(updated)
                    }}
                    onRemove={() => {
                      const updated: AboutData = {
                        ...about,
                        profile_image_url: null,
                        profile_image_id: null,
                      }
                      setAbout(updated)
                      handleSaveAbout(updated)
                    }}
                    currentImageUrl={about.profile_image_url || undefined}
                    currentImageId={about.profile_image_id || undefined}
                  />

                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    onClick={() => handleSaveAbout()}
                    disabled={saving}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-xs sm:text-sm h-10 px-6"
                  >
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    <span>Save About Profile</span>
                  </Button>

                  <Button asChild variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
                    <Link href="/about" target="_blank" className="flex items-center gap-1.5">
                      <span>Preview /about Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Realistic Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  Live Homepage Preview
                </span>
                <Badge variant="outline" className="text-[10px] bg-zinc-900 text-zinc-400 border-white/10">
                  {about.show_on_homepage ? 'Enabled' : 'Section Disabled'}
                </Badge>
              </div>

              <div
                className={`p-6 rounded-3xl border border-white/10 bg-zinc-950/90 shadow-2xl space-y-4 relative overflow-hidden transition-all duration-300 ${!about.show_on_homepage ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 shrink-0">
                    {about.profile_image_url ? (
                      <NextImage src={about.profile_image_url} alt="Profile" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <User className="w-8 h-8 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">
                      {about.name || 'Peak Deth'}
                    </h4>
                    <p className="text-xs text-emerald-400 mt-0.5 line-clamp-1">
                      {about.tagline || 'Full-Stack Programming & Photography'}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available for projects
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-4">
                  {about.bio || 'A multidisciplinary Full-Stack Developer and Visual Artist...'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                  <div className="p-2 rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-300">
                    <span className="font-bold text-white block">POS & Systems</span>
                    Enterprise billing
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-300">
                    <span className="font-bold text-white block">Cinematics</span>
                    High-end optics
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 text-[11px]">Rendered on Homepage</span>
                  <Link href="/" target="_blank" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold">
                    <span>View Home</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: FEATURED ALBUMS */}
        <TabsContent value="albums" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Main Photography Albums on Homepage</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                All Main Albums (root collections without parent) appear directly on your Homepage. Sub-albums appear nested inside their parent collection.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-zinc-900 border border-white/10 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setAlbumFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors ${albumFilter === 'all' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400'}`}
                >
                  All ({collections.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAlbumFilter('main')}
                  className={`px-3 py-1 rounded-lg transition-colors ${albumFilter === 'main' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400'}`}
                >
                  Main ({mainAlbums.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAlbumFilter('sub')}
                  className={`px-3 py-1 rounded-lg transition-colors ${albumFilter === 'sub' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400'}`}
                >
                  Sub ({collections.length - mainAlbums.length})
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={albumSearch}
                  onChange={e => setAlbumSearch(e.target.value)}
                  placeholder="Search albums..."
                  className="bg-zinc-900 border-white/10 rounded-xl pl-9 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAlbums.map(album => {
              const isMain = !album.parent_id
              return (
                <Card
                  key={album.id}
                  className={`bg-zinc-950 border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-300 flex flex-col justify-between ${album.featured || album.is_featured ? 'ring-1 ring-emerald-500/50' : ''}`}
                >
                  <div className="relative aspect-[4/3] w-full bg-zinc-900">
                    {album.cover_image_url ? (
                      <NextImage src={album.cover_image_url} alt={album.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-zinc-500 gap-2">
                        <FolderOpen className="w-10 h-10 text-zinc-600" />
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Empty Album</span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {isMain ? (
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                          MAIN ALBUM
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-cyan-400 border border-cyan-500/30 font-mono text-[10px]">
                          SUB-ALBUM
                        </span>
                      )}
                    </div>

                    {(album.featured || album.is_featured) && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500 text-black font-bold text-[10px] flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-black" />
                        <span>Pinned</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white truncate max-w-[150px]">
                          {album.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400 font-mono">
                          <span>{album.photos_count ?? 0} photos</span>
                          {album.sub_albums_count ? (
                            <>
                              <span>•</span>
                              <span>{album.sub_albums_count} sub-albums</span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <Button
                        variant={album.featured || album.is_featured ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleCollectionFeatured(album.id, album.featured || album.is_featured)}
                        className={`rounded-xl text-[11px] h-7 px-2.5 ${album.featured || album.is_featured ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-semibold' : 'bg-zinc-900 border-white/10 text-zinc-300'}`}
                      >
                        {album.featured || album.is_featured ? 'Pinned' : 'Pin'}
                      </Button>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <Link
                        href={`/collection/${album.slug}`}
                        target="_blank"
                        className="text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      >
                        <span>View Album</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <Link
                        href="/admin/dashboard/collections"
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* TAB 5: FEATURED VIDEOS */}
        <TabsContent value="videos" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" />
                <span>Cinema & Motion Highlights on Homepage</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Toggle which cinema productions and motion highlights appear on the Homepage.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs h-8">
                <Link href="/admin/dashboard/videos">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add New Video
                </Link>
              </Button>

              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={videoSearch}
                  onChange={e => setVideoSearch(e.target.value)}
                  placeholder="Search videos..."
                  className="bg-zinc-900 border-white/10 rounded-xl pl-9 text-xs"
                />
              </div>
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="p-12 rounded-3xl bg-zinc-950 border border-white/10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Videos Created Yet</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Upload video reels or link YouTube/Vimeo highlights in the Videos manager to showcase them on your Homepage.
              </p>
              <Button asChild className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs">
                <Link href="/admin/dashboard/videos">Open Videos Manager</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredVideos.map(video => (
                <Card
                  key={video.id}
                  className={`bg-zinc-950 border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 ${video.featured ? 'ring-1 ring-purple-500/40' : ''}`}
                >
                  <div className="relative aspect-[16/9] w-full bg-zinc-900">
                    {video.thumbnail_url ? (
                      <NextImage src={video.thumbnail_url} alt={video.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Video className="w-10 h-10" />
                      </div>
                    )}

                    {video.featured && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-purple-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight truncate max-w-[180px]">
                        {video.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {video.category || 'Cinema'} {video.year ? `• ${video.year}` : ''}
                      </p>
                    </div>

                    <Button
                      variant={video.featured ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleVideoFeatured(video.id, video.featured)}
                      className={`rounded-xl text-xs h-8 ${video.featured ? 'bg-purple-600 hover:bg-purple-500 text-white font-semibold' : 'bg-zinc-900 border-white/10 text-zinc-300'}`}
                    >
                      {video.featured ? 'Pinned' : 'Pin to Home'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 6: INTERACTIVE LIVE VIEWPORT */}
        <TabsContent value="preview" className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE HOMEPAGE SIMULATOR</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-zinc-900 border border-white/10 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${previewDevice === 'desktop' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400'}`}
                >
                  <Laptop className="w-3.5 h-3.5" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${previewDevice === 'mobile' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
              </div>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="bg-zinc-900 border-white/10 text-xs h-8 rounded-xl text-zinc-300"
              >
                <Link href="/" target="_blank" className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
                </Link>
              </Button>
            </div>
          </div>

          {/* Device Frame */}
          <div className="flex justify-center p-4 bg-zinc-950/60 rounded-3xl border border-white/10 overflow-hidden">
            <div
              className={`transition-all duration-300 overflow-hidden bg-black border border-white/20 shadow-2xl rounded-3xl ${previewDevice === 'mobile' ? 'w-[390px] h-[780px]' : 'w-full h-[850px]'}`}
            >
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded bg-zinc-950 border border-white/10 text-[11px]">
                  <Lock className="w-2.5 h-2.5 text-emerald-400" />
                  <span>peakdeth.com</span>
                </div>
                <span className="text-[10px] text-zinc-500">HTTPS / 200 OK</span>
              </div>

              <iframe
                src="/"
                title="Live Homepage"
                className="w-full h-[calc(100%-40px)] border-0 bg-[#030303]"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Website Live Preview Modal */}
      {previewUrl && (
        <WebsitePreviewModal
          url={previewUrl}
          title={previewTitle}
          isOpen={Boolean(previewUrl)}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </div>
  )
}
