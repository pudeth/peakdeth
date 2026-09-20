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
} from 'lucide-react'
import { CVDocument } from './cv-document'
import { cvData as defaultCvData, CVData } from '@/data/cv-data'

interface CVViewProps {
  initialData?: CVData
}

export function CVView({ initialData }: CVViewProps) {
  const [data, setData] = useState<CVData>(initialData || defaultCvData)
  const [scale, setScale] = useState<number>(100)
  const [copied, setCopied] = useState<boolean>(false)

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
    <div className="cv-print-root min-h-screen bg-[#090d13] text-slate-100 pt-28 sm:pt-32 pb-20 px-3 sm:px-6 print:p-0 print:bg-white print:text-black">
      {/* Top Control Bar (Sticky below Header, hidden when printing) */}
      <div className="no-print max-w-5xl mx-auto mb-8 sticky top-20 z-30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-[#141820]/95 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-2xl">
          {/* Back button & Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div>
              <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{data.name}</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-[#df862b]/20 text-[#df862b] border border-[#df862b]/30">
                  CV / Resume
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Actions (Zoom, Print / Save PDF, Share) */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs text-slate-400">
              <button
                onClick={zoomOut}
                title="Zoom Out"
                className="p-1 hover:text-white transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] w-9 text-center font-mono">{scale}%</span>
              <button
                onClick={zoomIn}
                title="Zoom In"
                className="p-1 hover:text-white transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetZoom}
                title="Reset Zoom"
                className="p-1 hover:text-white transition-colors border-l border-slate-800 ml-1 pl-1.5"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Print / Save A4 PDF button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#df862b] hover:bg-[#c97521] text-white shadow-lg shadow-[#df862b]/20 transition-all hover:scale-[1.02]"
              title="Print or Save as A4 PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
              title="Share Link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Direct Interactive CV View */}
      <main className="cv-main-container max-w-5xl mx-auto flex justify-center overflow-x-auto pb-12 print:p-0 print:m-0 print:max-w-none">
        <div
          className="cv-scale-wrapper transition-transform origin-top w-full flex justify-center"
          style={{ transform: `scale(${scale / 100})` }}
        >
          <CVDocument data={data} />
        </div>
      </main>
    </div>
  )
}
