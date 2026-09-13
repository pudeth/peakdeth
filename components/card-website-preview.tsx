'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

interface CardWebsitePreviewProps {
  url: string
  title: string
  onOpenPreview?: () => void
  showTopBar?: boolean
  className?: string
  viewportWidth?: number
}

const DEFAULT_VIEWPORT_WIDTH = 1200

export function CardWebsitePreview({
  url,
  title,
  onOpenPreview,
  showTopBar = false,
  className = '',
  viewportWidth = DEFAULT_VIEWPORT_WIDTH,
}: CardWebsitePreviewProps) {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [scale, setScale] = useState(0.25)
  const [virtualHeight, setVirtualHeight] = useState(1200)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = containerRef.current.offsetHeight
        if (width > 0) {
          const s = width / viewportWidth
          setScale(s)
          if (height > 0 && s > 0) {
            setVirtualHeight(Math.max(600, Math.round(height / s)))
          }
        }
      }
    }
    updateDimensions()
    const ro = new ResizeObserver(updateDimensions)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [isMounted, viewportWidth])

  const isExternal = Boolean(url && (url.startsWith('http://') || url.startsWith('https://')))
  const iframeSrc = isExternal ? `/api/proxy-site?url=${encodeURIComponent(url)}` : url

  return (
    <div
      suppressHydrationWarning
      onClick={(e) => {
        if (onOpenPreview) {
          e.stopPropagation()
          onOpenPreview()
        }
      }}
      className={`w-full h-full flex flex-col bg-zinc-950 overflow-hidden relative select-none ${className}`}
    >
      {/* Optional Mini Browser Top Bar */}
      {showTopBar && (
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-zinc-900 border-b border-white/5 text-xs shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 shrink-0" />
            <span className="ml-1 font-mono text-[10px] text-zinc-400 flex items-center gap-1 truncate">
              <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[130px]">{t.services.liveSystemBadge}</span>
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        </div>
      )}

      {/* Screen Viewport filling the full remaining space */}
      <div
        ref={containerRef}
        suppressHydrationWarning
        className="relative w-full flex-1 min-h-0 overflow-hidden bg-zinc-950"
      >
        {/* Loading Spinner / Placeholder */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/90 text-zinc-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span className="text-xs font-mono">{t.services.loadingPreview}</span>
          </div>
        )}

        {isMounted ? (
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
            }}
            suppressHydrationWarning
            className="absolute top-0 left-0 border-0 bg-white pointer-events-none select-none"
            style={{
              width: `${viewportWidth}px`,
              height: `${virtualHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            loading="lazy"
            tabIndex={-1}
            title={`${title} preview`}
          />
        ) : null}

        {/* Subtle bottom shadow to smooth card bottom */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
