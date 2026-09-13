'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Phone, Mail, Globe, MapPin, Eye, EyeOff, Plus, Trash2, Edit3,
  ExternalLink, RefreshCw, CheckCircle2, AlertCircle,
  ArrowUpRight, Loader2, Linkedin
} from 'lucide-react'
import {
  siInstagram, siTelegram, siFacebook, siGmail,
  siWhatsapp, siYoutube, siTiktok
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'
import type { LucideIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import Link from 'next/link'

interface ContactItem {
  id: string
  type: string
  label: string
  value: string
  icon?: string | null
  is_active: boolean
  order?: number
}

const PRESET_CHANNELS = [
  { type: 'email', label: 'Email', value: 'hello@peakdeth.com', icon: 'Mail', desc: 'Primary inquiry email' },
  { type: 'phone', label: 'Phone Number', value: '+855 12 345 678', icon: 'Phone', desc: 'Direct phone or mobile' },
  { type: 'telegram', label: 'Telegram', value: '@peakdeth', icon: 'Telegram', desc: 'Instant messaging channel' },
  { type: 'instagram', label: 'Instagram', value: '@peakdeth', icon: 'Instagram', desc: 'Social photography portfolio' },
  { type: 'whatsapp', label: 'WhatsApp', value: '+855 12 345 678', icon: 'WhatsApp', desc: 'WhatsApp chat channel' },
  { type: 'location', label: 'Studio Location', value: 'Phnom Penh, Cambodia', icon: 'Location', desc: 'Physical studio or city' },
  { type: 'website', label: 'Website', value: 'https://peakdeth.com', icon: 'Website', desc: 'Primary portfolio URL' },
  { type: 'tiktok', label: 'TikTok', value: '@peakdeth', icon: 'TikTok', desc: 'Video & reel showcases' },
  { type: 'youtube', label: 'YouTube', value: '@peakdeth', icon: 'YouTube', desc: 'Cinematic video portfolio' },
  { type: 'facebook', label: 'Facebook', value: 'peakdeth', icon: 'Facebook', desc: 'Facebook page or profile' },
  { type: 'linkedin', label: 'LinkedIn', value: 'peakdeth', icon: 'LinkedIn', desc: 'Professional network' },
]

const iconMap: Record<string, SimpleIcon | LucideIcon> = {
  phone: Phone,
  Phone: Phone,
  email: Mail,
  Mail: Mail,
  gmail: siGmail,
  Gmail: siGmail,
  telegram: siTelegram,
  Telegram: siTelegram,
  instagram: siInstagram,
  Instagram: siInstagram,
  whatsapp: siWhatsapp,
  WhatsApp: siWhatsapp,
  tiktok: siTiktok,
  TikTok: siTiktok,
  youtube: siYoutube,
  YouTube: siYoutube,
  facebook: siFacebook,
  Facebook: siFacebook,
  linkedin: Linkedin,
  LinkedIn: Linkedin,
  location: MapPin,
  Location: MapPin,
  website: Globe,
  Website: Globe,
}

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null)
  const [formData, setFormData] = useState({
    type: 'email',
    label: '',
    value: '',
    icon: '',
    is_active: true,
  })

  // Load contacts
  const loadContacts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/content/contact?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.contacts)) {
          setContacts(data.contacts)
        }
      }
    } catch (err) {
      console.error('Failed to load contacts:', err)
      toast.error('Failed to load contact channels')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  // Toggle Visibility for a Single Channel
  const toggleVisibility = async (id: string, currentActive: boolean) => {
    const nextState = !currentActive
    setSavingId(id)

    // Optimistic UI update
    setContacts(prev => prev.map(c => c.id === id ? { ...c, is_active: nextState } : c))

    try {
      const res = await fetch('/api/content/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: nextState }),
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      toast.success(
        nextState
          ? 'Channel is now VISIBLE on website'
          : 'Channel is now HIDDEN from website'
      )
    } catch (err) {
      console.error('Error toggling visibility:', err)
      // Revert optimistic update
      setContacts(prev => prev.map(c => c.id === id ? { ...c, is_active: currentActive } : c))
      toast.error('Failed to update channel visibility')
    } finally {
      setSavingId(null)
    }
  }

  // Toggle All Channels
  const toggleAll = async (setActive: boolean) => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ set_all_active: setActive }),
      })

      if (!res.ok) {
        throw new Error('Batch update failed')
      }

      setContacts(prev => prev.map(c => ({ ...c, is_active: setActive })))
      toast.success(
        setActive
          ? 'All contact channels are now VISIBLE'
          : 'All contact channels are now HIDDEN'
      )
    } catch (err) {
      console.error('Error toggling all:', err)
      toast.error('Failed to update all channels')
    } finally {
      setLoading(false)
    }
  }

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingContact(null)
    setFormData({
      type: 'email',
      label: 'Email',
      value: '',
      icon: 'Mail',
      is_active: true,
    })
    setIsDialogOpen(true)
  }

  // Open Edit Dialog
  const handleOpenEdit = (contact: ContactItem) => {
    setEditingContact(contact)
    setFormData({
      type: contact.type,
      label: contact.label,
      value: contact.value,
      icon: contact.icon || '',
      is_active: contact.is_active,
    })
    setIsDialogOpen(true)
  }

  // Apply Preset
  const applyPreset = (preset: typeof PRESET_CHANNELS[0]) => {
    setFormData({
      type: preset.type,
      label: preset.label,
      value: preset.value,
      icon: preset.icon,
      is_active: true,
    })
  }

  // Save Channel
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.label.trim() || !formData.value.trim()) {
      toast.error('Label and value are required')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingContact?.id,
          type: formData.type,
          label: formData.label.trim(),
          value: formData.value.trim(),
          icon: formData.icon || formData.type,
          is_active: formData.is_active,
        }),
      })

      if (!res.ok) {
        throw new Error('Save failed')
      }

      toast.success(editingContact ? 'Channel updated successfully' : 'New channel created successfully')
      setIsDialogOpen(false)
      await loadContacts()
    } catch (err) {
      console.error('Error saving channel:', err)
      toast.error('Failed to save channel')
    } finally {
      setLoading(false)
    }
  }

  // Delete Channel
  const handleDeleteContact = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${label}"?`)) return

    try {
      setLoading(true)
      const res = await fetch('/api/content/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      setContacts(prev => prev.filter(c => c.id !== id))
      toast.success(`"${label}" deleted successfully`)
    } catch (err) {
      console.error('Error deleting channel:', err)
      toast.error('Failed to delete channel')
    } finally {
      setLoading(false)
    }
  }

  // Helper to render icon
  const renderIcon = (type: string, iconKey?: string | null, className = 'w-5 h-5') => {
    const key = iconKey || type
    const IconComp = iconMap[key] || iconMap[type] || Phone
    if (IconComp && 'path' in IconComp) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d={IconComp.path} />
        </svg>
      )
    }
    const LucideComp = IconComp as LucideIcon
    return <LucideComp className={className} strokeWidth={1.8} />
  }

  const visibleCount = contacts.filter(c => c.is_active).length
  const hiddenCount = contacts.length - visibleCount

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Public Visibility Controls
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Contact Channels &amp; Content
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-1">
            Choose which contact channels are <span className="text-emerald-400 font-medium">Visible</span> to visitors or <span className="text-amber-400 font-medium">Hidden</span> from the public site.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadContacts}
            disabled={loading}
            className="border-white/10 text-zinc-300 hover:bg-white/10 rounded-xl"
            title="Refresh channels"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <Link href="/contact" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2 text-emerald-400" />
              View Live Page
            </Link>
          </Button>

          <Button
            onClick={handleOpenAdd}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Channel
          </Button>
        </div>
      </div>

      {/* Summary Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-zinc-400 uppercase">Total Channels</p>
            <p className="text-3xl font-extrabold text-white mt-1">{contacts.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-emerald-300 uppercase flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Visible to Public
            </p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">{visibleCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-amber-300 uppercase flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" /> Hidden from Public
            </p>
            <p className="text-3xl font-extrabold text-amber-400 mt-1">{hiddenCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <EyeOff className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Master Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="text-xs text-zinc-300">
            <span className="font-semibold text-white">Quick Batch Actions:</span> Click to toggle all contact items at once.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAll(true)}
            disabled={loading || visibleCount === contacts.length}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-xs h-9"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Show All Channels
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAll(false)}
            disabled={loading || hiddenCount === contacts.length}
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-xl text-xs h-9"
          >
            <EyeOff className="w-3.5 h-3.5 mr-1.5" />
            Hide All Channels
          </Button>
        </div>
      </div>

      {/* Main Channels List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>Direct Channels</span>
            <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
              {contacts.length} items
            </span>
          </h2>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Toggle switch on the right to instantly hide or show a channel on your live website.
          </span>
        </div>

        {loading && contacts.length === 0 ? (
          <div className="p-12 text-center border border-white/10 rounded-3xl bg-zinc-900/30 space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
            <p className="text-sm text-zinc-400">Loading contact channels...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-white/15 rounded-3xl bg-zinc-900/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">No Contact Channels Configured</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1">
                Add channels such as Email, Phone, Telegram, Instagram, or Location to allow clients to reach you.
              </p>
            </div>
            <Button onClick={handleOpenAdd} className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add First Channel
            </Button>
          </div>
        ) : (
          <div className="grid gap-3.5">
            {contacts.map((contact) => {
              const isSaving = savingId === contact.id
              const isVisible = contact.is_active

              return (
                <div
                  key={contact.id}
                  className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                    isVisible
                      ? 'bg-zinc-950/80 border-white/10 hover:border-emerald-500/40 hover:bg-zinc-900/60 shadow-lg'
                      : 'bg-zinc-950/40 border-dashed border-white/10 opacity-70 hover:opacity-100 hover:border-amber-500/40'
                  }`}
                >
                  {/* Left: Icon & Channel Details */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                      isVisible
                        ? 'bg-zinc-900 border-white/10 text-white'
                        : 'bg-zinc-900/50 border-white/5 text-zinc-500'
                    }`}>
                      {renderIcon(contact.type, contact.icon, 'w-5 h-5')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm sm:text-base ${isVisible ? 'text-white' : 'text-zinc-400 line-through'}`}>
                          {contact.label}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono uppercase bg-white/5 border-white/10 text-zinc-400">
                          {contact.type}
                        </Badge>
                        {isVisible ? (
                          <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            VISIBLE
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px] font-mono flex items-center gap-1">
                            <EyeOff className="w-3 h-3 text-amber-400" />
                            HIDDEN
                          </Badge>
                        )}
                      </div>

                      <p className={`text-xs sm:text-sm font-mono truncate mt-1 ${isVisible ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {contact.value}
                      </p>
                    </div>
                  </div>

                  {/* Right: Visibility Switch & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                    {/* The Prominent Visibility Switch */}
                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10">
                      <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5 select-none">
                        {isVisible ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-zinc-400">Hidden</span>
                          </>
                        )}
                      </span>

                      <Switch
                        checked={isVisible}
                        disabled={isSaving}
                        onCheckedChange={() => toggleVisibility(contact.id, isVisible)}
                        className="data-[state=checked]:bg-emerald-500"
                        title={isVisible ? 'Click to hide this channel' : 'Click to make this channel visible'}
                      />
                    </div>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(contact)}
                        className="h-9 w-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10"
                        title="Edit details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteContact(contact.id, contact.label)}
                        className="h-9 w-9 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete channel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Live Preview Card */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Live Preview: Public Visitor View
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {visibleCount} channels active on /contact
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#030303] border border-zinc-800/80">
          <div className="text-center max-w-md mx-auto mb-6">
            <h4 className="text-xl font-bold text-white">Let&apos;s Connect</h4>
            <p className="text-xs text-zinc-400 mt-1">Direct channels and social profiles to get in touch.</p>
          </div>

          {visibleCount === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-mono">
              [ All channels hidden — Visitors will see the paused channels notice ]
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts.filter(c => c.is_active).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-white">
                      {renderIcon(c.type, c.icon, 'w-4 h-4')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{c.label}</p>
                      <p className="text-[11px] text-zinc-400 truncate font-mono">{c.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Channel Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingContact ? 'Edit Contact Channel' : 'Add New Contact Channel'}
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">
              Configure details and public visibility for this channel.
            </DialogDescription>
          </DialogHeader>

          {/* Quick Presets for New Channels */}
          {!editingContact && (
            <div className="space-y-2 pt-1">
              <Label className="text-xs font-mono uppercase text-zinc-400">Quick Start Presets</Label>
              <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {PRESET_CHANNELS.map(preset => (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors text-xs text-zinc-300 hover:text-white"
                  >
                    {renderIcon(preset.type, preset.icon, 'w-3.5 h-3.5 shrink-0 text-emerald-400')}
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSaveContact} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="channel-type" className="text-xs text-zinc-300">Channel Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
                >
                  <SelectTrigger id="channel-type" className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel-label" className="text-xs text-zinc-300">Display Label</Label>
                <Input
                  id="channel-label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Email or Telegram"
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel-value" className="text-xs text-zinc-300">Contact Value / Link / Handle</Label>
              <Input
                id="channel-value"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="e.g. hello@peakdeth.com or +855 12 345 678"
                required
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>

            {/* Visibility Toggle Inside Dialog */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-white flex items-center gap-2">
                  {formData.is_active ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
                  Public Visibility
                </Label>
                <p className="text-xs text-zinc-400">
                  {formData.is_active ? 'Visible to all visitors immediately' : 'Hidden from public visitors'}
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingContact ? 'Save Changes' : 'Create Channel'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
