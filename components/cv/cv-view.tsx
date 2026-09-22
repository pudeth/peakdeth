'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowLeft,
  Share2,
  Check,
  Maximize2,
  X,
} from 'lucide-react'
import { CVDocument } from './cv-document'
import { cvData as defaultCvData, CVData } from '@/data/cv-data'

interface CVViewProps {
  initialData?: CVData
}

export function CVView({ initialData }: CVViewProps) {
  const [data, setData] = useState<CVData>(initialData || defaultCvData)
  const [scale, setScale] = useState<number>(100)
  const [autoScale, setAutoScale] = useState<number>(1)
  const [fullscreenZoom, setFullscreenZoom] = useState<number>(1)
  const [copied, setCopied] = useState<boolean>(false)
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState<boolean>(false)

  // Automatically compute scales so the 820px side-by-side A4 document fits mobile screens and fullscreen perfectly
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return
      const screenWidth = window.innerWidth || document.documentElement.clientWidth || 820
      const screenHeight = window.innerHeight || document.documentElement.clientHeight || 1160

      // Inline view scale (standard reading with margins)
      const padding = screenWidth < 640 ? 16 : 32
      const available = Math.max(280, screenWidth - padding)
      if (available < 820) {
        setAutoScale(Math.min(1, Math.max(0.2, available / 820)))
      } else {
        setAutoScale(1)
      }

      // Fullscreen view scale: maximize screen area (edge-to-edge on mobile, viewport-fitted on desktop)
      if (screenWidth < 640) {
        const availableMobile = Math.max(300, screenWidth - 8)
        setFullscreenZoom(Math.min(1.2, availableMobile / 820))
      } else {
        const availableW = screenWidth - 48
        const availableH = screenHeight - 110
        const scaleW = availableW / 820
        const scaleH = availableH / 1160
        setFullscreenZoom(Math.min(1.05, Math.min(scaleW, scaleH)))
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentZoom = (scale / 100) * autoScale

  // Fetch latest dynamic data on client mount and when window regains focus
  useEffect(() => {
    let isMounted = true

    const fetchLatestCV = async () => {
      try {
        const res = await fetch(`/api/cv?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (json?.cv && isMounted) {
            setData(json.cv)
          }
        }
      } catch (err) {
        // Silently use current data on network error
      }
    }

    fetchLatestCV()

    const onFocus = () => {
      fetchLatestCV()
    }

    window.addEventListener('focus', onFocus)
    return () => {
      isMounted = false
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  const handlePrint = () => {
    // Open the dedicated print page in a new tab.
    // That page renders just the CV with proper A4 CSS and auto-triggers window.print().
    window.open('/cv/print', '_blank')
  }

  const openFullscreenModal = () => {
    setIsFullscreenModalOpen(true)
  }

  const closeFullscreenModal = () => {
    setIsFullscreenModalOpen(false)
  }

  // Keyboard shortcut: Esc to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenModalOpen) {
        setIsFullscreenModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreenModalOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFullscreenModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreenModalOpen])

  // Reset scale to 100% before printing, restore after
  useEffect(() => {
    const beforePrint = () => {
      setScale(100)
    }
    const afterPrint = () => {
      // Optionally restore previous scale; here we keep 100% for consistency
    }
    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', afterPrint)
    return () => {
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint', afterPrint)
    }
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.name} - CV / Resume`,
          text: `${data.name} - ${data.roleTitle}`,
          url: window.location.href,
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const zoomIn = () => setScale((prev) => Math.min(prev + 10, 130))
  const zoomOut = () => setScale((prev) => Math.max(prev - 10, 70))
  const resetZoom = () => setScale(100)

  return (
    <div
      className="cv-print-root min-h-screen bg-[#090d13] text-slate-100 pt-3 sm:pt-6 pb-20 px-2 sm:px-4 print:p-0 print:bg-white print:text-black transition-all duration-300"
    >
      {/* ── Sticky Toolbar (hidden when printing) ── */}
      <div
        className="no-print max-w-5xl mx-auto mb-4 sm:mb-6 sticky top-2 sm:top-4 z-30 px-2 sm:px-0 transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 bg-[#141820]/95 backdrop-blur-md rounded-xl border border-slate-800/80 shadow-2xl">

          {/* Left: Back / Exit + Candidate Title */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors flex-shrink-0 shadow-sm"
              title="Return to Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Site</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 flex-shrink-0" />

            <div className="min-w-0 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden md:inline-block flex-shrink-0" />
              <h1 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                <span className="truncate">{data.name}</span>
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-[#df862b]/20 text-[#df862b] border border-[#df862b]/30 flex-shrink-0 hidden sm:inline">
                  Popup View
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Actions (Zoom, Fullscreen, Print, Share, Close) */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Zoom Controls (Works on both Mobile & Desktop) */}
            <div className="flex items-center gap-1 bg-slate-900 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-800 text-xs text-slate-400">
              <button onClick={zoomOut} title="Zoom Out" className="p-1 hover:text-white transition-colors cursor-pointer">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] sm:text-[11px] w-8 sm:w-9 text-center font-mono">{scale}%</span>
              <button onClick={zoomIn} title="Zoom In" className="p-1 hover:text-white transition-colors cursor-pointer">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button onClick={resetZoom} title="Reset Zoom" className="p-1 hover:text-white transition-colors border-l border-slate-800 ml-0.5 sm:ml-1 pl-1 sm:pl-1.5 cursor-pointer">
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Fullscreen Button — opens focused popup with CV and Print only */}
            <button
              onClick={openFullscreenModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 transition-all border border-slate-800 hover:border-slate-700 shadow-sm cursor-pointer"
              title="Open Fullscreen CV View"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#df862b]" />
              <span className="hidden md:inline">Fullscreen</span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold bg-[#df862b] hover:bg-[#c97521] text-white shadow-lg shadow-[#df862b]/20 transition-all hover:scale-[1.02] cursor-pointer"
              title="Print or Save as A4 PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">Print / Save PDF</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
              title="Share Link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Close / Return to site X button */}
            <Link
              href="/"
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors border border-slate-800"
              title="Close View"
            >
              <X className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>


      {/* ── CV Document (Side-by-Side A4 format across Mobile & Desktop) ── */}
      <main className="cv-main-container w-full max-w-5xl mx-auto flex justify-center overflow-x-auto pb-16 px-2 sm:px-4 print:p-0 print:m-0 print:max-w-none">
        <div
          className="relative shrink-0"
          style={{
            width: `${Math.round(820 * currentZoom)}px`,
            height: `${Math.round(1160 * currentZoom)}px`,
            minWidth: `${Math.round(820 * currentZoom)}px`,
            minHeight: `${Math.round(1160 * currentZoom)}px`,
          }}
        >
          {/* Ambient presentation glow backdrop */}
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#df862b]/15 via-amber-600/5 to-transparent blur-xl sm:blur-2xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div
            style={{
              width: '820px',
              height: '1160px',
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `scale(${currentZoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease-out',
            }}
          >
            <CVDocument data={data} />
          </div>
        </div>
      </main>

      {/* ── Focused Fullscreen CV Popup Modal (Edge-to-Edge A4 + Studio Close Button) ── */}
      {isFullscreenModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) closeFullscreenModal()
          }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl overflow-y-auto overscroll-contain flex flex-col items-center py-2 sm:py-5 px-1 sm:px-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Floating Controls Bar: Chic Indicator + Premium Studio Close Button */}
          <div className="sticky top-2 sm:top-4 z-50 w-full max-w-[840px] flex items-center justify-between gap-3 mb-2.5 sm:mb-4 px-2 sm:px-2 pointer-events-none">
            {/* Left: Subtle A4 Fullscreen indicator badge */}
            <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-900 text-slate-300 border border-white/10 backdrop-blur-xl shadow-xl transition-all">
              <span className="w-2 h-2 rounded-full bg-[#df862b] animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider text-slate-200 uppercase font-semibold">A4 Fullscreen View</span>
            </div>

            {/* Right: Studio Glass Close Button */}
            <button
              onClick={closeFullscreenModal}
              className="pointer-events-auto group inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/90 hover:bg-rose-950/80 active:scale-95 text-slate-200 hover:text-white border border-white/15 hover:border-rose-500/40 backdrop-blur-2xl shadow-2xl shadow-black/80 transition-all duration-200 cursor-pointer"
              title="Close Fullscreen (Esc)"
              aria-label="Close Fullscreen"
            >
              <span className="text-xs font-semibold tracking-wide group-hover:text-rose-200 transition-colors">Close</span>
              <div className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-rose-500/30 flex items-center justify-center transition-colors">
                <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </div>
            </button>
          </div>

          {/* The Pristine Fullscreen CV Document */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="pb-16 relative shrink-0 transition-all duration-200"
            style={{
              width: `${Math.round(820 * fullscreenZoom)}px`,
              height: `${Math.round(1160 * fullscreenZoom)}px`,
              minWidth: `${Math.round(820 * fullscreenZoom)}px`,
              minHeight: `${Math.round(1160 * fullscreenZoom)}px`,
            }}
          >
            <div
              className="absolute -inset-3 sm:-inset-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#df862b]/25 via-amber-600/10 to-transparent blur-xl sm:blur-3xl pointer-events-none -z-10"
              aria-hidden="true"
            />
            <div
              style={{
                width: '820px',
                height: '1160px',
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `scale(${fullscreenZoom})`,
                transformOrigin: 'top left',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <CVDocument data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

