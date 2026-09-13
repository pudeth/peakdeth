'use client'

import { useEffect, useState, useCallback } from 'react'
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
  is_featured: boolean
  is_active: boolean
  photos_count?: number
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

export default function ManageHomepagePage() {
  const supabase = createClient()

  // State
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [revalidating, setRevalidating] = useState(false)

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
    show_on_homepage: true,
  })

  // Services state
  const [services, setServices] = useState<ServiceItem[]>([])
  const [isAddingService, setIsAddingService] = useState(false)
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    title: '',
    description: '',
    icon: 'pos',
    link: '',
    is_active: true,
  })

  // Collections state
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [albumSearch, setAlbumSearch] = useState('')

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
                is_active: s.is_active ?? true,
                order: Number(s.order) || idx,
              }))
            )
          }
        }
      } catch (e) {
        console.warn('Failed to load services from API:', e)
      }

      // 3. Load Collections
      try {
        const collectionsRes = await fetch('/api/collections')
        if (collectionsRes.ok) {
          const colJson = await collectionsRes.json()
          if (Array.isArray(colJson.collections)) {
            setCollections(colJson.collections)
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
              show_on_homepage: aboutJson.about.show_on_homepage ?? true,
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
      if (updatedAbout) setAbout(updatedAbout)
      toast.success('About Profile saved successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error saving about profile')
    } finally {
      setSaving(false)
    }
  }

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
  const handleSaveServices = async (updatedList?: ServiceItem[]) => {
    const listToSave = updatedList || services
    try {
      setSaving(true)
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: listToSave }),
      })

      if (!res.ok) throw new Error('Failed to save services')
      toast.success('Services updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error saving services')
    } finally {
      setSaving(false)
    }
  }

  // Add new service
  const handleAddService = async () => {
    if (!newService.title?.trim()) {
      toast.error('Please enter a service title')
      return
    }

    const item: ServiceItem = {
      id: `service-${Date.now()}`,
      number: services.length + 1,
      title: newService.title.trim(),
      description: (newService.description || '').trim(),
      icon: newService.icon || 'pos',
      link: newService.link ? newService.link.trim() : null,
      is_active: newService.is_active ?? true,
      order: services.length,
    }

    const updated = [...services, item]
    setServices(updated)
    setIsAddingService(false)
    setNewService({ title: '', description: '', icon: 'pos', link: '', is_active: true })
    await handleSaveServices(updated)
  }

  // Delete service
  const handleDeleteService = async (id?: string) => {
    if (!id) return
    const updated = services.filter(s => (s.id !== id && s._id !== id))
    setServices(updated)
    await handleSaveServices(updated)
  }

  // Toggle collection featured status
  const handleToggleCollectionFeatured = async (collectionId: string, currentFeatured: boolean) => {
    const updated = collections.map(c => c.id === collectionId ? { ...c, is_featured: !currentFeatured } : c)
    setCollections(updated)

    try {
      await supabase
        .from('collections')
        .update({ is_featured: !currentFeatured })
        .eq('id', collectionId)

      toast.success(!currentFeatured ? 'Album pinned to Homepage' : 'Album removed from Homepage')
    } catch {
      toast.error('Failed to update album status')
    }
  }

  // Toggle video featured status
  const handleToggleVideoFeatured = async (videoId: string, currentFeatured: boolean) => {
    const updated = videos.map(v => v.id === videoId ? { ...v, featured: !currentFeatured } : v)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-zinc-400">Loading Homepage Manager...</p>
        </div>
      </div>
    )
  }

  const filteredAlbums = collections.filter(c =>
    c.title.toLowerCase().includes(albumSearch.toLowerCase())
  )

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
    (v.category && v.category.toLowerCase().includes(videoSearch.toLowerCase()))
  )

  const featuredAlbumsCount = collections.filter(c => c.is_featured).length
  const featuredVideosCount = videos.filter(v => v.featured).length
  const activeServicesCount = services.filter(s => s.is_active).length

  return (
    <div className="space-y-8 max-w-7xl pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Homepage Control Center
            </h1>
            <Badge variant="secondary" className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs">
              Live Management
            </Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Configure and update all sections of your homepage: Hero visuals, developer live systems, featured albums, and motion films.
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
              <span>View Live Homepage</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Hero Status</span>
          <span className="text-lg font-bold text-white mt-1">
            {hero.title || 'PEAK DETH'}
          </span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Production Ready
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Developer Live Systems</span>
          <span className="text-lg font-bold text-white mt-1">
            {activeServicesCount} Active
          </span>
          <span className="text-[11px] text-zinc-400 mt-1">
            {services.length} Total Systems
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">About Profile</span>
          <span className="text-lg font-bold text-white mt-1">
            {about.show_on_homepage ? 'Displayed' : 'Hidden'}
          </span>
          <span className={`text-[11px] flex items-center gap-1 mt-1 ${about.show_on_homepage ? 'text-emerald-400' : 'text-zinc-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${about.show_on_homepage ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
            {about.show_on_homepage ? 'Active on Home' : 'Hidden from Home'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Featured Albums</span>
          <span className="text-lg font-bold text-white mt-1">
            {featuredAlbumsCount} on Homepage
          </span>
          <span className="text-[11px] text-zinc-400 mt-1">
            {collections.length} Total Albums
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Featured Videos</span>
          <span className="text-lg font-bold text-white mt-1">
            {featuredVideosCount} on Homepage
          </span>
          <span className="text-[11px] text-zinc-400 mt-1">
            {videos.length} Total Videos
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="bg-zinc-900/80 p-1 rounded-2xl border border-white/10 w-full sm:w-auto flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>1. Hero Section</span>
          </TabsTrigger>

          <TabsTrigger value="services" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span>2. Developer Systems ({activeServicesCount})</span>
          </TabsTrigger>

          <TabsTrigger value="about" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>3. About Profile ({about.show_on_homepage ? 'Active' : 'Off'})</span>
          </TabsTrigger>

          <TabsTrigger value="albums" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span>4. Featured Albums ({featuredAlbumsCount})</span>
          </TabsTrigger>

          <TabsTrigger value="videos" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3.5 flex items-center gap-2">
            <Film className="w-4 h-4" />
            <span>5. Featured Videos ({featuredVideosCount})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: HERO SECTION */}
        <TabsContent value="hero" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hero Form */}
            <Card className="lg:col-span-7 bg-zinc-950/80 border-white/10 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
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
                      onUploadComplete={(result) => {
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
                        onClick={() => setHero(prev => ({ ...prev, background_image_url: null, background_image_id: null }))}
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
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg px-6 h-11"
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
                <div className="p-3 bg-zinc-950 border-b border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Live Hero Mockup Preview
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Viewport</span>
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
                    className="absolute inset-0 bg-black"
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
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: DEVELOPER & LIVE SYSTEMS */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                <span>Developer Systems & Live Demos</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                These interactive software cards appear on the Homepage and in the Developer (Coding) view with live iframe previews.
              </p>
            </div>

            <Button
              onClick={() => setIsAddingService(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md self-start"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add New System
            </Button>
          </div>

          {/* Add Service Modal / Inline Card */}
          {isAddingService && (
            <Card className="bg-zinc-950 border-blue-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-400" /> Add New Live System
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingService(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>

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
                    placeholder="https://your-demo-app.vercel.app"
                    className="bg-zinc-900 border-white/10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Description</Label>
                <Textarea
                  value={newService.description}
                  onChange={e => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the system capabilities, tech stack, and benefits..."
                  rows={2}
                  className="bg-zinc-900 border-white/10 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
                >
                  Save System
                </Button>
              </div>
            </Card>
          )}

          {/* List of Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, idx) => (
              <Card
                key={service.id || service._id || idx}
                className={`bg-zinc-950/80 border-white/10 rounded-3xl p-5 space-y-4 hover:border-white/20 transition-all duration-300 ${!service.is_active ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {service.number || idx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {service.title}
                      </h3>
                      {service.link ? (
                        <p className="text-xs text-blue-400 truncate max-w-xs flex items-center gap-1 mt-0.5">
                          <Globe className="w-3 h-3 shrink-0" />
                          <span>{service.link}</span>
                        </p>
                      ) : (
                        <span className="text-[11px] text-zinc-500">No live link</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-zinc-400 font-medium">Homepage</span>
                      <Switch
                        checked={service.show_on_homepage !== false}
                        onCheckedChange={(checked) => {
                          const updated = services.map(s => (s.id === service.id || s._id === service._id) ? { ...s, show_on_homepage: checked } : s)
                          setServices(updated)
                          handleSaveServices(updated)
                        }}
                        title={service.show_on_homepage !== false ? 'Shown on Homepage' : 'Hidden from Homepage'}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id || service._id)}
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                {service.link && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPreviewUrl(service.link || null)
                        setPreviewTitle(service.title)
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl h-8 px-2.5 flex items-center gap-1.5"
                    >
                      <MonitorPlay className="w-3.5 h-3.5" />
                      <span>Test Live Preview</span>
                    </Button>

                    <Link
                      href={service.link}
                      target="_blank"
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Open site</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: ABOUT PROFILE */}
        <TabsContent value="about" className="space-y-6">
          {/* Top Control Banner */}
          <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Homepage About Profile Section</h3>
                <Badge variant="outline" className={`text-xs ${about.show_on_homepage ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
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
                onCheckedChange={(checked) => setAbout(prev => ({ ...prev, show_on_homepage: checked }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Edit Form */}
            <Card className="lg:col-span-7 bg-zinc-950/80 border-white/10 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
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
                      placeholder="e.g. Full-Stack Programming & Cinematic Photography Design"
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
                    onUploadComplete={(result) => {
                      setAbout(prev => ({
                        ...prev,
                        profile_image_url: result.image_url,
                        profile_image_id: result.image_id
                      }))
                    }}
                    currentImageUrl={about.profile_image_url || undefined}
                    currentImageId={about.profile_image_id || undefined}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    onClick={() => handleSaveAbout()}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm h-10 px-6 font-semibold"
                  >
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    <span>Save About Profile</span>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    <Link href="/about" target="_blank" className="flex items-center gap-1.5">
                      <span>Preview /about Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right: Live Realistic Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  Live Homepage Preview
                </span>
                <Badge variant="outline" className="text-[10px] bg-zinc-900 text-zinc-400 border-white/10">
                  {about.show_on_homepage ? 'Enabled' : 'Section Disabled'}
                </Badge>
              </div>

              <div className={`p-6 rounded-3xl border border-white/10 bg-zinc-950/90 shadow-2xl space-y-4 relative overflow-hidden transition-all duration-300 ${!about.show_on_homepage ? 'opacity-40 grayscale' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 shrink-0">
                    {about.profile_image_url ? (
                      <NextImage
                        src={about.profile_image_url}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
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
                  <Link
                    href="/"
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                  >
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
                <Camera className="w-5 h-5 text-amber-400" />
                <span>Featured Photography Albums on Homepage</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Toggle which curated collections appear in the visual gallery section on the Homepage.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                value={albumSearch}
                onChange={e => setAlbumSearch(e.target.value)}
                placeholder="Search albums..."
                className="bg-zinc-900 border-white/10 rounded-xl pl-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAlbums.map((album) => (
              <Card
                key={album.id}
                className={`bg-zinc-950/80 border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 ${album.is_featured ? 'ring-1 ring-amber-500/40' : ''}`}
              >
                <div className="relative aspect-[16/10] w-full bg-zinc-900">
                  {album.cover_image_url ? (
                    <NextImage
                      src={album.cover_image_url}
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <FolderOpen className="w-10 h-10" />
                    </div>
                  )}

                  {album.is_featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-black" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight truncate max-w-[180px]">
                      {album.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {album.photos_count ?? 0} photos
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={album.is_featured ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleCollectionFeatured(album.id, album.is_featured)}
                      className={`rounded-xl text-xs h-8 ${album.is_featured ? 'bg-amber-500 hover:bg-amber-400 text-black font-semibold' : 'bg-zinc-900 border-white/10 text-zinc-300'}`}
                    >
                      {album.is_featured ? 'Pinned' : 'Pin to Home'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: FEATURED VIDEOS */}
        <TabsContent value="videos" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" />
                <span>Featured Motion & Videos on Homepage</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Toggle which cinema productions and motion highlights appear on the Homepage.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                value={videoSearch}
                onChange={e => setVideoSearch(e.target.value)}
                placeholder="Search videos..."
                className="bg-zinc-900 border-white/10 rounded-xl pl-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className={`bg-zinc-950/80 border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 ${video.featured ? 'ring-1 ring-purple-500/40' : ''}`}
              >
                <div className="relative aspect-[16/9] w-full bg-zinc-900">
                  {video.thumbnail_url ? (
                    <NextImage
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Video className="w-10 h-10" />
                    </div>
                  )}

                  {video.featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-lg">
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

                  <div className="flex items-center gap-2">
                    <Button
                      variant={video.featured ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleVideoFeatured(video.id, video.featured)}
                      className={`rounded-xl text-xs h-8 ${video.featured ? 'bg-purple-600 hover:bg-purple-500 text-white font-semibold' : 'bg-zinc-900 border-white/10 text-zinc-300'}`}
                    >
                      {video.featured ? 'Pinned' : 'Pin to Home'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
