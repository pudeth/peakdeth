'use client'

import { useEffect, useState } from 'react'
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

        /* ─── SCREEN: grey background, CV centred ──────── */
        @media screen {
          html, body {
            background: #374151;
            margin: 0;
            padding: 24px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .cv-print-hint {
            color: #d1d5db;
            font-family: system-ui, sans-serif;
            font-size: 14px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .cv-print-hint button {
            background: #df862b;
            color: #fff;
            border: none;
            padding: 6px 18px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
          }
          .cv-print-hint button:hover { background: #c97521; }
          .cv-wrapper-screen {
            width: ${CV_NATURAL_WIDTH}px;
            box-shadow: 0 4px 40px rgba(0,0,0,0.6);
          }
        }

        /* ─── PRINT: scale CV to fit A4 exactly ────────── */
        @media print {
          .cv-print-hint { display: none !important; }

          html {
            /* zoom 820px → 793.7px = A4 width at 96 dpi */
            zoom: ${PRINT_ZOOM};
          }

          html, body {
            width: ${CV_NATURAL_WIDTH}px;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #ffffff;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .cv-wrapper-screen {
            width: ${CV_NATURAL_WIDTH}px;
            box-shadow: none;
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

      {/* Screen hint bar */}
      <div className="cv-print-hint">
        <span>Print dialog will open automatically.</span>
        <button onClick={() => window.print()}>Print / Save PDF</button>
        <button
          onClick={() => window.close()}
          style={{ background: '#4b5563' }}
        >
          Close
        </button>
      </div>

      {/* CV document */}
      <div className="cv-wrapper-screen">
        <CVDocument data={data} />
      </div>
    </>
  )
}
