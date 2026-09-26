'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CloudinaryUpload } from '@/components/cloudinary-upload'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Sparkles, Check, Loader2, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

export interface BrandLogoData {
  url: string
  id?: string
  alt?: string
  text?: string
}

const PRESET_LOGOS = [
  { label: 'White Monogram (Transparent)', url: '/images/logo/logo_white.png' },
  { label: 'Black Monogram (Transparent)', url: '/images/logo/logo_black.png' },
]

export function AdminBrandLogo() {
  const [logo, setLogo] = useState<BrandLogoData>({
    url: '/images/logo/logo_white.png',
    text: 'PD',
  })
  const [isOpen, setIsOpen] = useState(false)
  const [formUrl, setFormUrl] = useState('')
  const [formId, setFormId] = useState('')
  const [formText, setFormText] = useState('PD')
  const [saving, setSaving] = useState(false)

  // Fetch current logo on mount
  useEffect(() => {
    let isMounted = true

    const fetchLogo = async () => {
      try {
        const res = await fetch(`/api/content/logo?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (json?.logo && isMounted) {
            setLogo(json.logo)
            setFormUrl(json.logo.url || '')
            setFormId(json.logo.id || '')
            setFormText(json.logo.text || 'PD')
          }
        }
      } catch {}
    }

    fetchLogo()

    const handleLogoUpdated = (e: any) => {
      if (e.detail) {
        setLogo(e.detail)
        setFormUrl(e.detail.url || '')
        setFormText(e.detail.text || 'PD')
      }
    }

    window.addEventListener('brand_logo_updated', handleLogoUpdated)
    return () => {
      isMounted = false
      window.removeEventListener('brand_logo_updated', handleLogoUpdated)
    }
  }, [])

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFormUrl(logo.url || '')
    setFormId(logo.id || '')
    setFormText(logo.text || 'PD')
    setIsOpen(true)
  }

  const handleSaveLogo = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/content/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formUrl.trim(),
          id: formId.trim() || undefined,
          text: formText.trim() || 'PD',
        }),
      })

      if (!res.ok) throw new Error('Failed to update logo')
      const json = await res.json()

      if (json.logo) {
        setLogo(json.logo)
        window.dispatchEvent(new CustomEvent('brand_logo_updated', { detail: json.logo }))
      }

      toast.success('Brand logo updated successfully!')
      setIsOpen(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to update logo')
    } finally {
      setSaving(false)
    }
  }

  const isCustomImage = Boolean(logo.url && (logo.url.startsWith('http') || logo.url.startsWith('/images/')))

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Interactive Logo Avatar / Button */}
        <button
          type="button"
          onClick={handleOpenDialog}
          className="group relative w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:border-amber-400/50 flex items-center justify-center shadow-inner overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shrink-0"
          title="Click to upload or change Brand Logo"
        >
          {isCustomImage ? (
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Image
                src={logo.url}
                alt={logo.text || 'Logo'}
                width={32}
                height={32}
                className="object-contain max-h-8 max-w-8 transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          ) : (
            <span className="text-white font-bold text-sm tracking-wider group-hover:text-amber-300 transition-colors">
              {logo.text || 'PD'}
            </span>
          )}

          {/* Hover Camera Overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
            <Camera className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
        </button>

        {/* Text Details & Direct Link */}
        <Link href="/admin/dashboard" className="flex flex-col group min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white tracking-wide uppercase group-hover:text-amber-300 transition-colors truncate">
              Admin Panel
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenDialog}
            className="text-[11px] text-zinc-400 group-hover:text-amber-400/80 transition-colors text-left flex items-center gap-1"
          >
            <span>Peak Deth</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-zinc-400 group-hover:bg-amber-500/20 group-hover:text-amber-300">
              Edit Logo
            </span>
          </button>
        </Link>
      </div>

      {/* ── Dialog: Upload & Manage Logo ── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg bg-zinc-950 border border-white/15 text-white shadow-2xl rounded-3xl p-6">
          <DialogHeader className="pb-3 border-b border-white/10">
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Upload & Manage Brand Logo</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Upload your brand mark, company logo, or studio crest. It displays across the Admin Panel and website header.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-3">
            {/* Live Dual Preview */}
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300 font-medium">Logo Live Preview</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Dark Canvas */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col items-center justify-center min-h-[100px] text-center">
                  <span className="text-[10px] text-zinc-500 font-mono mb-2">On Dark Canvas</span>
                  {formUrl ? (
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <Image
                        src={formUrl}
                        alt="Logo preview dark"
                        width={64}
                        height={64}
                        className="object-contain max-h-16 max-w-16 drop-shadow-md"
                      />
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-white tracking-widest">{formText || 'PD'}</span>
                  )}
                </div>

                {/* Light Canvas */}
                <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-300 flex flex-col items-center justify-center min-h-[100px] text-center">
                  <span className="text-[10px] text-zinc-400 font-mono mb-2">On Light Canvas</span>
                  {formUrl ? (
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <Image
                        src={formUrl}
                        alt="Logo preview light"
                        width={64}
                        height={64}
                        className="object-contain max-h-16 max-w-16"
                      />
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-zinc-900 tracking-widest">{formText || 'PD'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Cloudinary Uploader */}
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300 font-medium flex items-center justify-between">
                <span>Upload New Logo Image (PNG / SVG / WebP)</span>
                <span className="text-[10px] text-amber-400">Transparent PNG recommended</span>
              </Label>
              <CloudinaryUpload
                folder="logo"
                currentImageUrl={formUrl}
                onUploadComplete={(result) => {
                  setFormUrl(result.image_url)
                  setFormId(result.image_id)
                  toast.success('Logo uploaded! Click "Save Logo" to apply.')
                }}
              />
            </div>

            {/* Direct Image URL Input */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-zinc-400">Or Paste Image URL</Label>
              <Input
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... or /images/logo/logo_white.png"
                className="h-8 text-xs bg-zinc-900 border-white/10 text-white rounded-lg"
              />
            </div>

            {/* Preset Options */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-zinc-400">Or Choose Default Preset</Label>
              <div className="flex gap-2">
                {PRESET_LOGOS.map((preset) => (
                  <Button
                    key={preset.url}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormUrl(preset.url)}
                    className={`h-7 text-[11px] rounded-lg border-white/10 ${
                      formUrl === preset.url ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-zinc-400'
                    }`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Monogram / Initials fallback */}
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300 font-medium">Initials / Fallback Text</Label>
              <Input
                value={formText}
                onChange={(e) => setFormText(e.target.value.toUpperCase())}
                placeholder="PD"
                maxLength={6}
                className="h-8 text-xs bg-zinc-900 border-white/10 text-white rounded-lg w-28 uppercase font-bold tracking-wider"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-9 px-3 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveLogo}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg h-9 px-4 text-xs font-semibold"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
                Save Logo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
