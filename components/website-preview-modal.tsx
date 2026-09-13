'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Globe,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  X,
  Lock,
  Loader2,
} from 'lucide-react'

interface WebsitePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title?: string
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export function WebsitePreviewModal({
  isOpen,
  onClose,
  url,
  title = 'Website Interface',
}: WebsitePreviewModalProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const [isLoading, setIsLoading] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)
  const [useProxy, setUseProxy] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
    }
  }, [isOpen, url])

  const handleRefresh = () => {
    setIsLoading(true)
    setIframeKey((prev) => prev + 1)
  }

  const isExternal = Boolean(url && (url.startsWith('http://') || url.startsWith('https://')))
  const activeSrc = isExternal
    ? `/api/proxy-site?url=${encodeURIComponent(url)}`
    : url

  const deviceWidthClasses: Record<DeviceMode, string> = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] max-w-full h-[90%] mx-auto rounded-xl shadow-2xl border-4 border-zinc-800',
    mobile: 'w-[390px] max-w-full h-[90%] mx-auto rounded-2xl shadow-2xl border-4 border-zinc-800',
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        aria-describedby="preview-dialog-description"
        className="max-w-[95vw] w-[1400px] h-[90vh] p-0 bg-zinc-950 border-zinc-800 flex flex-col overflow-hidden text-white rounded-2xl shadow-2xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title} - Website Interface Preview</DialogTitle>
          <DialogDescription id="preview-dialog-description">
            Live interactive website preview for {url}
          </DialogDescription>
        </DialogHeader>

        {/* Browser Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 select-none">
          {/* Mac window dots & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-600 transition-colors"
                title="Close"
              />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            <span className="text-xs font-semibold text-zinc-200 whitespace-nowrap">
              {title}
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Interface
            </span>
          </div>

          {/* Browser Address Bar - Domain Hidden */}
          <div className="flex-1 max-w-md mx-2">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate text-zinc-300 text-xs">Protected Live Interface</span>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="text-zinc-400 hover:text-white transition-colors shrink-0 ml-1"
                title="Reload interface"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Device Switcher & Actions */}
          <div className="flex items-center gap-1.5">
            {/* Device Switcher */}
            <div className="hidden md:flex items-center gap-0.5 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 mr-2">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  device === 'desktop'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  device === 'tablet'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  device === 'mobile'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Open in New Tab */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white"
            >
              <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                <span>Open</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Viewport with Iframe */}
        <div className="flex-1 bg-zinc-900/50 p-2 sm:p-4 flex items-center justify-center relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs text-zinc-400 font-mono">Loading website interface...</p>
            </div>
          )}

          <div
            className={`transition-all duration-300 relative overflow-hidden bg-white ${deviceWidthClasses[device]}`}
          >
            <iframe
              key={`${iframeKey}-${activeSrc}`}
              src={activeSrc}
              title={`${title} Preview`}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
