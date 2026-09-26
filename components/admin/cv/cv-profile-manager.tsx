'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { CVData } from '@/data/cv-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CloudinaryUpload } from '@/components/cloudinary-upload'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Instagram, 
  Save, 
  Loader2, 
  ExternalLink,
  Sparkles,
  Camera,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'

interface CVProfileManagerProps {
  cvData: CVData
  onUpdate: (patch: Partial<CVData>) => Promise<void>
  saving?: boolean
}

export function CVProfileManager({ cvData, onUpdate, saving = false }: CVProfileManagerProps) {
  const [form, setForm] = useState({
    name: cvData.name || '',
    roleTitle: cvData.roleTitle || '',
    photoUrl: cvData.photoUrl || '',
    summary: cvData.summary || '',
    phone: cvData.phone || '',
    email: cvData.email || '',
    location: cvData.location || '',
    websiteUrl: cvData.website?.url || '',
    websiteLabel: cvData.website?.label || '',
    socialLabel: cvData.social?.label || '',
    socialUrl: cvData.social?.url || '',
  })

  // Keep form in sync when parent cvData updates
  useEffect(() => {
    setForm({
      name: cvData.name || '',
      roleTitle: cvData.roleTitle || '',
      photoUrl: cvData.photoUrl || '',
      summary: cvData.summary || '',
      phone: cvData.phone || '',
      email: cvData.email || '',
      location: cvData.location || '',
      websiteUrl: cvData.website?.url || '',
      websiteLabel: cvData.website?.label || '',
      socialLabel: cvData.social?.label || '',
      socialUrl: cvData.social?.url || '',
    })
  }, [cvData])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Full Name is required')
      return
    }

    const websiteUrlClean = form.websiteUrl.trim()
    const websiteLabelClean = form.websiteLabel.trim() || websiteUrlClean.replace(/^https?:\/\//, '').replace(/\/$/, '')

    const socialHandleClean = form.socialLabel.trim()
    const socialUrlClean = form.socialUrl.trim() || (socialHandleClean ? `https://instagram.com/${socialHandleClean.replace(/^@/, '')}` : '')

    const patch: Partial<CVData> = {
      name: form.name.trim().toUpperCase(),
      roleTitle: form.roleTitle.trim().toUpperCase(),
      photoUrl: form.photoUrl.trim() || cvData.photoUrl,
      summary: form.summary.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      location: form.location.trim(),
      website: websiteUrlClean
        ? {
            label: websiteLabelClean,
            url: websiteUrlClean.startsWith('http') ? websiteUrlClean : `https://${websiteUrlClean}`,
          }
        : cvData.website,
      social: socialHandleClean
        ? {
            platform: 'Instagram',
            label: socialHandleClean.startsWith('@') ? socialHandleClean : `@${socialHandleClean}`,
            url: socialUrlClean,
          }
        : cvData.social,
    }

    await onUpdate(patch)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ── Top Header / Quick Action Bar ── */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>CV Profile & Contact Channels</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Synced
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Manage your identity, avatar, executive statement, and public communication channels shown on your CV.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 px-3 text-xs border-white/10 text-zinc-300 hover:text-white rounded-xl"
          >
            <a href="/cv" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              View CV
            </a>
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg h-9 px-4 text-xs font-semibold"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            Save & Sync CV
          </Button>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Live Sidebar Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-zinc-900/60 border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-950/20 to-zinc-900/40 border-b border-white/5 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Profile Photo (CV Avatar)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-center">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div
                  className="relative rounded-full overflow-hidden flex-shrink-0 shadow-2xl"
                  style={{
                    width: '136px',
                    height: '136px',
                    border: '3px solid #df862b',
                    boxShadow: '0 0 0 4px rgba(223,134,43,0.25), 0 12px 28px rgba(0,0,0,0.7)',
                    backgroundColor: '#1f2430',
                  }}
                >
                  {form.photoUrl ? (
                    <Image
                      src={form.photoUrl}
                      alt={form.name || 'CV Avatar'}
                      fill
                      className="object-cover object-top"
                      sizes="136px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400 mt-2 font-mono">136x136 A4 Avatar Scale</span>
              </div>

              {/* Cloudinary Uploader */}
              <div className="pt-2 text-left">
                <Label className="text-xs text-zinc-300 mb-1.5 block">Upload New Photo</Label>
                <CloudinaryUpload
                  folder="profile"
                  cropAspect={1}
                  currentImageUrl={form.photoUrl}
                  onUploadComplete={(result) => {
                    setForm((prev) => ({
                      ...prev,
                      photoUrl: result.image_url,
                    }))
                    toast.success('Photo uploaded! Click "Save & Sync CV" to apply.')
                  }}
                />
              </div>

              {/* Manual URL Input */}
              <div className="text-left space-y-1 pt-1">
                <Label className="text-[11px] text-zinc-400">Or Paste Direct Image URL</Label>
                <Input
                  value={form.photoUrl}
                  onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Identity, Summary, and Contact Channels (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Identity & Headline */}
          <Card className="bg-zinc-900/60 border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="bg-gradient-to-r from-zinc-800/40 to-zinc-900/40 border-b border-white/5 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Executive Identity & Title
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 font-medium">Full Name (CV Header)</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. PEAK DETH"
                    className="h-9 text-xs bg-zinc-950/70 border-white/10 text-white font-semibold rounded-xl"
                  />
                  <span className="text-[10px] text-zinc-500">Rendered in high-contrast executive bold</span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 font-medium">Professional Role Title / Subtitle</Label>
                  <Input
                    value={form.roleTitle}
                    onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                    placeholder="e.g. FULL-STACK SOFTWARE ARCHITECT & CINEMATIC DESIGNER"
                    className="h-9 text-xs bg-zinc-950/70 border-white/10 text-white rounded-xl"
                  />
                  <span className="text-[10px] text-zinc-500">Displays directly below your name on the CV header</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-zinc-300 font-medium">Executive Summary / Professional Bio</Label>
                  <span className="text-[11px] font-mono text-zinc-500">{form.summary.length} characters</span>
                </div>
                <Textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Summarize your engineering background, visual expertise, core domains, and impact..."
                  rows={4}
                  className="text-xs bg-zinc-950/70 border-white/10 text-white leading-relaxed rounded-xl resize-y"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Details Grid */}
          <Card className="bg-zinc-900/60 border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-950/20 to-zinc-900/40 border-b border-white/5 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                CV Contact Details (Left Column)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    Phone Number
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+855 68656263"
                    className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Public Email Address
                  </Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="peakmao007@gmail.com"
                    className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Location / City
                  </Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Phnom Penh, Cambodia"
                    className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    Website URL
                  </Label>
                  <Input
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    placeholder="https://peakdeth.vercel.app"
                    className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    Website Display Label
                  </Label>
                  <Input
                    value={form.websiteLabel}
                    onChange={(e) => setForm({ ...form, websiteLabel: e.target.value })}
                    placeholder="peakdeth.vercel.app"
                    className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-amber-400" />
                    Instagram Handle / Social
                  </Label>
                  <Input
                    value={form.socialLabel}
                    onChange={(e) => setForm({ ...form, socialLabel: e.target.value })}
                    placeholder="@peakdeth"
                    className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Save Button Row */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg h-9 px-5 text-xs font-semibold"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                  Save All Profile Changes & Sync CV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
