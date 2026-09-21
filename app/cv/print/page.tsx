'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Printer, ArrowLeft, X, Sparkles } from 'lucide-react'
import { CVDocument } from '@/components/cv/cv-document'
import { cvData as defaultCvData, CVData } from '@/data/cv-data'

// CV design width in px (matches maxWidth: 820px in cv-document.tsx)
const CV_NATURAL_WIDTH = 820
// A4 at 96 dpi: 210mm = 793.7px
const A4_WIDTH_PX = 793.7
// Scale factor so 820px → 793.7px on A4
const PRINT_ZOOM = (A4_WIDTH_PX / CV_NATURAL_WIDTH).toFixed(6) // ~0.968537

export default function PrintCVPage() {
  const [data, setData] = useState<CVData>(defaultCvData)
  const [ready, setReady] = useState(false)

  // Fetch the latest dynamic CV data
  useEffect(() => {
    fetch('/api/cv?t=' + Date.now(), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.cv) setData(json.cv)
        setReady(true)
      })
      .catch(() => setReady(true))
  }, [])

  // Auto-trigger print once data + render is ready
  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => {
      window.print()
    }, 900)
    return () => clearTimeout(timer)
  }, [ready])

  return (
    <>
      <style>{`
        /* ─── Page / @page ─────────────────────────────── */
        @page {
          size: A4 portrait;
          margin: 0mm;
        }

        * { box-sizing: border-box; }

        /* ─── SCREEN: Deep luxury studio canvas ────────── */
        @media screen {
          html, body {
            background-color: #0b0f17;
            background-image: radial-gradient(circle at 50% 10%, rgba(223, 134, 43, 0.08) 0%, transparent 60%);
            margin: 0;
            padding: 0 16px 40px 16px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .cv-wrapper-screen {
            width: ${CV_NATURAL_WIDTH}px;
            max-width: 100%;
            box-shadow: 0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06);
            border-radius: 12px;
          }
        }

        /* ─── PRINT: scale CV to fit A4 exactly ────────── */
        @media print {
          .cv-print-topbar { display: none !important; }

          html {
            zoom: ${PRINT_ZOOM};
          }

          html, body {
            width: ${CV_NATURAL_WIDTH}px;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden;
            background: #ffffff !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .cv-wrapper-screen {
            width: ${CV_NATURAL_WIDTH}px;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          /* Force 12-column two-column layout (overrides md: breakpoint) */
          #cv-printable-document .grid {
            display: grid !important;
            grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
          }

          /* Preserve all colours & backgrounds */
          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ── Floating Executive Topbar (Hidden in Print) ── */}
      <header className="cv-print-topbar w-full max-w-[820px] my-4 px-3 py-2.5 bg-[#141824]/90 backdrop-blur-md rounded-xl border border-white/10 shadow-xl flex items-center justify-between gap-3 text-slate-200">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/cv"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to CV View</span>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-1.5 truncate text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-medium text-slate-300 hidden sm:inline">A4 Document Ready</span>
            <span className="text-[11px] text-slate-500 hidden md:inline">• Print dialog opens automatically</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#df862b] hover:bg-[#c97521] shadow-lg shadow-[#df862b]/25 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={() => window.close()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── CV Document ── */}
      <div className="cv-wrapper-screen">
        <CVDocument data={data} />
      </div>
    </>
  )
}

