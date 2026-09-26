'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CloudinaryUpload } from '@/components/cloudinary-upload'
import { Sparkles, Save, Loader2, Image as ImageIcon, Check } from 'lucide-react'
import { toast } from 'sonner'
import { BrandLogoData } from './admin-brand-logo'

const PRESET_LOGOS = [
  { label: 'White Monogram', url: '/images/logo/logo_white.png' },
  { label: 'Black Monogram', url: '/images/logo/logo_black.png' },
]

export function BrandLogoCard() {
  const [logo, setLogo] = useState<BrandLogoData>({
    url: '/images/logo/logo_white.png',
    text: 'PD',
  })
  const [formUrl, setFormUrl] = useState('')
  const [formId, setFormId] = useState('')
  const [formText, setFormText] = useState('PD')
  const [saving, setSaving] = useState(false)

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
      if (e.detail && isMounted) {
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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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

      if (!res.ok) throw new Error('Failed to update brand logo')
      const json = await res.json()

      if (json.logo) {
        setLogo(json.logo)
        window.dispatchEvent(new CustomEvent('brand_logo_updated', { detail: json.logo }))
      }

      toast.success('Brand logo updated and synced everywhere!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to update logo')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="bg-zinc-900/60 border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <CardHeader className="bg-gradient-to-r from-amber-950/20 to-zinc-900/40 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <span>Brand Logo & Admin Identity</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Global Header & Sidebar
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Upload your official logo for the website header, Admin Panel top-left corner, and browser display.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Preview: Dark + Light Canvas */}
          <div className="md:col-span-4 space-y-3">
            <Label className="text-xs text-zinc-300 font-medium">Live Canvas Previews</Label>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 flex flex-col items-center justify-center min-h-[110px] text-center shadow-inner">
                <span className="text-[10px] text-zinc-500 font-mono mb-2">Dark Background</span>
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

              <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-300 flex flex-col items-center justify-center min-h-[110px] text-center shadow-inner">
                <span className="text-[10px] text-zinc-500 font-mono mb-2">Light Background</span>
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

          {/* Right Controls: Upload & URL */}
          <div className="md:col-span-8 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300 font-medium">Upload Logo (PNG, SVG, WebP)</Label>
              <CloudinaryUpload
                folder="logo"
                currentImageUrl={formUrl}
                onUploadComplete={(result) => {
                  setFormUrl(result.image_url)
                  setFormId(result.image_id)
                  toast.success('Logo uploaded! Click "Save Brand Logo" to apply.')
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">Direct Logo Image URL</Label>
                <Input
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/... or /images/logo/logo_white.png"
                  className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">Monogram / Fallback Text</Label>
                <Input
                  value={formText}
                  onChange={(e) => setFormText(e.target.value.toUpperCase())}
                  placeholder="PD"
                  maxLength={6}
                  className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg uppercase font-bold tracking-wider"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-1 pt-1">
              <Label className="text-[11px] text-zinc-400">Default Presets</Label>
              <div className="flex gap-2">
                {PRESET_LOGOS.map((preset) => (
                  <Button
                    key={preset.url}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormUrl(preset.url)}
                    className={`h-7 text-xs rounded-lg border-white/10 ${
                      formUrl === preset.url ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-zinc-400'
                    }`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                onClick={() => handleSave()}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg h-9 px-5 text-xs font-semibold"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                Save Brand Logo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
