'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { WebsitePreviewModal } from '@/components/website-preview-modal'
import {
  Code2,
  Globe,
  Sparkles,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  Loader2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  MonitorPlay,
  Layers,
  Smartphone,
  CreditCard,
  RotateCcw,
  Link as LinkIcon,
  Search,
  Laptop
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { ServiceItem } from '@/lib/services'

const ICON_PRESETS = [
  { id: 'pos', label: 'POS / Billing', emoji: '💳', iconComponent: CreditCard },
  { id: 'diamond', label: 'Top-Up / Game', emoji: '💎', iconComponent: Sparkles },
  { id: 'web', label: 'Web-App / Store', emoji: '🌐', iconComponent: Globe },
  { id: 'mobile', label: 'Mobile App', emoji: '📱', iconComponent: Smartphone },
  { id: 'system', label: 'System / Cloud', emoji: '⚙️', iconComponent: Laptop },
  { id: 'store', label: 'E-Commerce', emoji: '🛒', iconComponent: Layers },
]

export default function DeveloperManagementPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [revalidating, setRevalidating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formNumber, setFormNumber] = useState<number>(1)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formIcon, setFormIcon] = useState('pos')
  const [formLink, setFormLink] = useState('')
  const [formShowOnHomepage, setFormShowOnHomepage] = useState(true)
  const [formIsActive, setFormIsActive] = useState(true)

  // Preview Modal
  const [previewModal, setPreviewModal] = useState<{ url: string; title: string } | null>(null)

  // Load Services from API
  const loadServices = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/services?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        if (Array.isArray(json.services) && json.services.length > 0) {
          const sorted = [...json.services].sort((a, b) => (Number(a.number || a.order || 0) - Number(b.number || b.order || 0)))
          setServices(sorted)
          setFormNumber(sorted.length + 1)
          return
        }
      }
    } catch (e) {
      console.warn('Failed to load services:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  // Save all services to API
  const persistServices = async (listToSave: ServiceItem[]) => {
    try {
      setSaving(true)
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: listToSave }),
      })

      if (!res.ok) throw new Error('Failed to save developer services')
      const json = await res.json()
      if (json.services) {
        setServices(json.services)
      }
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_services_cache', JSON.stringify(listToSave))
        }
      } catch {}
      return true
    } catch (error: any) {
      console.error('Error saving services:', error)
      toast.error(error.message || 'Error saving services')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Handle Form Submit (Add / Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) {
      toast.error('Please enter a service title')
      return
    }

    const payload: ServiceItem = {
      id: editingId || `service-${Date.now()}`,
      _id: editingId || `service-${Date.now()}`,
      number: Number(formNumber) || (services.length + 1),
      title: formTitle.trim(),
      description: formDescription.trim(),
      icon: formIcon || 'pos',
      link: formLink.trim() || null,
      show_on_homepage: formShowOnHomepage,
      is_active: formIsActive,
      order: Number(formNumber) || (services.length + 1),
    }

    let updatedList: ServiceItem[] = []

    if (editingId) {
      updatedList = services.map(s => (s.id === editingId || s._id === editingId) ? { ...payload } : s)
      toast.success(`Service #${payload.number} "${payload.title}" updated`)
    } else {
      updatedList = [...services, payload]
      toast.success(`New service "${payload.title}" added to position #${payload.number}`)
    }

    // Sort by position number
    updatedList.sort((a, b) => Number(a.number) - Number(b.number))

    const success = await persistServices(updatedList)
    if (success) {
      resetForm(updatedList.length + 1)
    }
  }

  // Edit Service
  const handleStartEdit = (service: ServiceItem) => {
    setEditingId(service.id || service._id)
    setFormNumber(service.number || 1)
    setFormTitle(service.title)
    setFormDescription(service.description)
    setFormIcon(service.icon || 'pos')
    setFormLink(service.link || '')
    setFormShowOnHomepage(service.show_on_homepage !== false)
    setFormIsActive(service.is_active !== false)
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  // Cancel Edit
  const resetForm = (nextNumber?: number) => {
    setEditingId(null)
    setFormNumber(nextNumber ?? (services.length + 1))
    setFormTitle('')
    setFormDescription('')
    setFormIcon('pos')
    setFormLink('')
    setFormShowOnHomepage(true)
    setFormIsActive(true)
  }

  // Delete Service
  const handleDelete = async (id: string) => {
    const updated = services.filter(s => s.id !== id && s._id !== id)
    const reindexed = updated.map((s, idx) => ({
      ...s,
      number: idx + 1,
      order: idx + 1,
    }))
    setServices(reindexed)
    const ok = await persistServices(reindexed)
    if (ok) {
      toast.success('Service removed')
      if (editingId === id) resetForm(reindexed.length + 1)
    }
  }

  // Move Position Up
  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const list = [...services]
    const temp = list[index]
    list[index] = list[index - 1]
    list[index - 1] = temp

    const reindexed = list.map((s, idx) => ({
      ...s,
      number: idx + 1,
      order: idx + 1,
    }))
    setServices(reindexed)
    await persistServices(reindexed)
    toast.success('Position updated')
  }

  // Move Position Down
  const handleMoveDown = async (index: number) => {
    if (index === services.length - 1) return
    const list = [...services]
    const temp = list[index]
    list[index] = list[index + 1]
    list[index + 1] = temp

    const reindexed = list.map((s, idx) => ({
      ...s,
      number: idx + 1,
      order: idx + 1,
    }))
    setServices(reindexed)
    await persistServices(reindexed)
    toast.success('Position updated')
  }

  // Toggle Homepage Visibility directly
  const handleToggleHomepage = async (id: string, current: boolean) => {
    const updated = services.map(s => (s.id === id || s._id === id) ? { ...s, show_on_homepage: !current } : s)
    setServices(updated)
    await persistServices(updated)
    toast.success(!current ? 'Shown on Homepage' : 'Hidden from Homepage (stays in Developer)')
  }

  // Toggle Active directly
  const handleToggleActive = async (id: string, current: boolean) => {
    const updated = services.map(s => (s.id === id || s._id === id) ? { ...s, is_active: !current } : s)
    setServices(updated)
    await persistServices(updated)
  }

  // Revalidate Cache
  const handleRevalidate = async () => {
    try {
      setRevalidating(true)
      await fetch('/api/services', { method: 'GET' })
      toast.success('Services cache refreshed across website!')
    } catch {
      toast.error('Revalidation failed')
    } finally {
      setRevalidating(false)
    }
  }

  // Metrics
  const activeCount = services.filter(s => s.is_active !== false).length
  const homepageCount = services.filter(s => s.is_active !== false && s.show_on_homepage !== false).length
  const domainsCount = services.filter(s => s.link && s.link.trim().length > 0).length

  // Filtered List for Search
  const filteredServices = services.filter(s => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return (
      s.title?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.link?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Developer Systems & Domain Manager
            </h1>
            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
              Live Control
            </Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Upload custom web domains, arrange display positions, and configure which software systems show on the Homepage.
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
            <span>Refresh Cache</span>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-zinc-900 border-white/10 hover:bg-white/5 text-zinc-300 rounded-xl h-10"
          >
            <Link href="/developer" target="_blank" className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>View /developer Page</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-zinc-900 border-white/10 hover:bg-white/5 text-zinc-300 rounded-xl h-10"
          >
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>View Homepage</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Systems</span>
          <span className="text-xl font-bold text-white mt-1">{services.length} Systems</span>
          <span className="text-[11px] text-zinc-400 mt-1">{activeCount} active in database</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col justify-between">
          <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Featured on Homepage</span>
          <span className="text-xl font-bold text-white mt-1">{homepageCount} on Home</span>
          <span className="text-[11px] text-blue-300 mt-1">Admin curated selection</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
          <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Domains Uploaded</span>
          <span className="text-xl font-bold text-white mt-1">{domainsCount} Live URLs</span>
          <span className="text-[11px] text-emerald-300 mt-1">Interactive embed ready</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between">
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Developer Page (/developer)</span>
          <span className="text-xl font-bold text-white mt-1">All {activeCount} Active</span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Full Showcase
          </span>
        </div>
      </div>

      {/* Add / Edit System Form Card */}
      <Card className="bg-zinc-950/80 border-white/10 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-950/30 via-zinc-950 to-zinc-950 border-b border-white/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                {editingId ? <Edit className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
              </div>
              <div>
                <CardTitle className="text-lg text-white">
                  {editingId ? `Edit System #${formNumber}: ${formTitle || 'Untitled'}` : 'Add New Developer System & Upload Domain'}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  {editingId ? 'Modify domain URL, position order, or homepage visibility.' : 'Configure a live web application, set its position, and choose if it appears on Homepage.'}
                </CardDescription>
              </div>
            </div>

            {editingId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => resetForm()}
                className="text-xs text-zinc-400 hover:text-white rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Cancel Edit
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Position / Order */}
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs text-zinc-400 font-semibold">Position #</Label>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={formNumber}
                  onChange={e => setFormNumber(Number(e.target.value) || 1)}
                  className="bg-zinc-900 border-white/10 rounded-xl text-white font-mono text-center font-bold text-base"
                />
                <span className="text-[10px] text-zinc-500 block">Display order</span>
              </div>

              {/* Title */}
              <div className="md:col-span-5 space-y-2">
                <Label className="text-xs text-zinc-400 font-semibold">System Title</Label>
                <Input
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. POS, Top-Up Diamond, Web-APP, Mobile App"
                  className="bg-zinc-900 border-white/10 rounded-xl text-white font-medium text-sm"
                  required
                />
                <span className="text-[10px] text-zinc-500 block">Displayed on card headline</span>
              </div>

              {/* Icon Preset Picker */}
              <div className="md:col-span-5 space-y-2">
                <Label className="text-xs text-zinc-400 font-semibold">Icon / Category</Label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ICON_PRESETS.map(preset => (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => setFormIcon(preset.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all border ${
                        formIcon === preset.id
                          ? 'bg-blue-600 border-blue-500 text-white font-semibold shadow-md'
                          : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{preset.emoji}</span>
                      <span>{preset.label.split('/')[0].trim()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Domain Link / Website URL */}
            <div className="space-y-2 p-4 rounded-2xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>Domain Link / Website URL (Uploaded Interface)</span>
                </Label>
                {formLink && (
                  <button
                    type="button"
                    onClick={() => setPreviewModal({ url: formLink, title: formTitle || 'Live Preview' })}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium bg-blue-500/10 px-2 py-0.5 rounded-md"
                  >
                    <MonitorPlay className="w-3.5 h-3.5" />
                    Test Live Preview
                  </button>
                )}
              </div>

              <div className="relative">
                <Input
                  value={formLink}
                  onChange={e => setFormLink(e.target.value)}
                  placeholder="https://weppage-1.onrender.com/home.html or https://your-domain.com"
                  className="bg-zinc-900 border-white/10 rounded-xl text-white font-mono text-xs sm:text-sm pl-9"
                />
                <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-zinc-400">
                When visitors click this service or preview card on your website, it will link directly to this live domain and embed the interactive browser mock.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400 font-semibold">Service Description</Label>
              <Textarea
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                rows={3}
                placeholder="Point of sale software with real-time inventory tracking, smart billing, payments, and sales analytics..."
                className="bg-zinc-900 border-white/10 rounded-xl text-xs sm:text-sm text-zinc-300 resize-none leading-relaxed"
              />
            </div>

            {/* Visibility Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Show on Homepage Toggle */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-white">Show on Homepage</span>
                    <Badge variant="outline" className={`text-[10px] ${formShowOnHomepage ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                      {formShowOnHomepage ? 'Home Visible' : 'Developer Page Only'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    If OFF, this service will NOT appear on the main Homepage, but will still show on the /developer page.
                  </p>
                </div>
                <Switch
                  checked={formShowOnHomepage}
                  onCheckedChange={setFormShowOnHomepage}
                />
              </div>

              {/* Active Toggle */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">Service Active</span>
                    <Badge variant="outline" className={`text-[10px] ${formIsActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                      {formIsActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Global switch to enable or disable this service completely.
                  </p>
                </div>
                <Switch
                  checked={formIsActive}
                  onCheckedChange={setFormIsActive}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-10 px-6 font-semibold text-xs sm:text-sm"
                >
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Service' : 'Add Developer System'}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => resetForm()}
                    className="bg-zinc-900 border-white/10 text-zinc-300 rounded-xl h-10 text-xs"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <span className="text-xs text-zinc-500 italic">
                Position #{formNumber} • {formShowOnHomepage ? 'Will show on Homepage' : 'Only on /developer'}
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Systems List & Position Arranger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Configured Developer Systems ({services.length})</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Arranged by current position order. Use arrow buttons to change position order or switch homepage visibility.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title, domain, description..."
              className="bg-zinc-900 border-white/10 rounded-xl pl-9 text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" />
            <p className="text-xs">Loading developer systems...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl space-y-3 bg-zinc-950/40">
            <p className="text-zinc-400 text-sm">No developer systems matching your search.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="bg-zinc-900 border-white/10 text-xs"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredServices.map((service, index) => {
              const hasDomain = Boolean(service.link && service.link.trim().length > 0)
              const isHomeVisible = service.show_on_homepage !== false && service.is_active !== false

              return (
                <Card
                  key={service.id || service._id || index}
                  className={`bg-zinc-950/80 border-white/10 rounded-3xl p-5 hover:border-white/20 transition-all duration-200 shadow-xl ${
                    !service.is_active ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Position & Details */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Position & Re-order Arrows */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => handleMoveUp(index)}
                          className="h-6 w-6 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>

                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center">
                          <span className="text-[10px] text-blue-400 font-mono">POS</span>
                          <span className="text-sm font-bold text-white font-mono leading-none">
                            #{service.number || index + 1}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === filteredServices.length - 1}
                          onClick={() => handleMoveDown(index)}
                          className="h-6 w-6 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {service.title}
                          </h3>

                          {/* Homepage Status Badge */}
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              isHomeVisible
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}
                          >
                            {isHomeVisible ? 'Shown on Homepage' : 'Hidden from Homepage'}
                          </Badge>

                          <Badge
                            variant={service.is_active ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {service.is_active ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                          {service.description}
                        </p>

                        {/* Domain Upload Link */}
                        <div className="flex items-center gap-3 pt-1 flex-wrap">
                          {hasDomain ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-emerald-400">
                              <Globe className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              <span className="truncate max-w-[280px]">{service.link}</span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 italic">
                              <LinkIcon className="w-3.5 h-3.5" /> No domain uploaded yet
                            </span>
                          )}

                          {hasDomain && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewModal({ url: service.link!, title: service.title })}
                              className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl h-7 px-2.5 flex items-center gap-1.5 font-medium"
                            >
                              <MonitorPlay className="w-3.5 h-3.5" />
                              <span>Live Preview</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Controls & Toggles */}
                    <div className="flex items-center gap-4 self-end lg:self-center shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5 w-full lg:w-auto justify-between lg:justify-end">
                      {/* Homepage Switch */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-zinc-400 font-medium">Homepage</span>
                        <Switch
                          checked={service.show_on_homepage !== false}
                          onCheckedChange={() => handleToggleHomepage(service.id || service._id, service.show_on_homepage !== false)}
                        />
                      </div>

                      {/* Active Switch */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-zinc-400 font-medium">Active</span>
                        <Switch
                          checked={service.is_active !== false}
                          onCheckedChange={() => handleToggleActive(service.id || service._id, service.is_active !== false)}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartEdit(service)}
                          className="h-8 px-3 text-xs bg-zinc-900 border-white/10 hover:bg-white/5 text-zinc-200 rounded-xl"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1 text-blue-400" />
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(service.id || service._id)}
                          className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Website Live Preview Modal */}
      {previewModal && (
        <WebsitePreviewModal
          url={previewModal.url}
          title={previewModal.title}
          isOpen={Boolean(previewModal)}
          onClose={() => setPreviewModal(null)}
        />
      )}
    </div>
  )
}
