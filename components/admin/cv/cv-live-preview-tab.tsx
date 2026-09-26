'use client'

import React, { useState, useEffect } from 'react'
import { CVData } from '@/data/cv-data'
import { CVDocument } from '@/components/cv/cv-document'
import { CVProfileManager } from './cv-profile-manager'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Printer, 
  ExternalLink, 
  RefreshCw, 
  User,
  Sliders,
  Sparkles
} from 'lucide-react'

interface CVLivePreviewTabProps {
  cvData: CVData
  onRefresh?: () => Promise<void>
  onUpdateProfile?: (patch: Partial<CVData>) => Promise<void>
  saving?: boolean
}

export function CVLivePreviewTab({ 
  cvData, 
  onRefresh, 
  onUpdateProfile, 
  saving = false 
}: CVLivePreviewTabProps) {
  const [scale, setScale] = useState(0.85)
  const [refreshing, setRefreshing] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)

  // Auto-fit scale on mount according to container width
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = Math.min(window.innerWidth - 300, 1100)
      if (containerWidth < 900) {
        setScale(Math.max(0.4, (containerWidth - 60) / 820))
      } else {
        setScale(0.85)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleZoomIn = () => setScale((prev) => Math.min(1.2, +(prev + 0.1).toFixed(2)))
  const handleZoomOut = () => setScale((prev) => Math.max(0.4, +(prev - 0.1).toFixed(2)))
  const handleResetZoom = () => setScale(0.85)

  const handleRefresh = async () => {
    if (!onRefresh) return
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setTimeout(() => setRefreshing(false), 400)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Control Bar ── */}
      <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
              <span>Interactive CV Live Preview</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                A4 Executive
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Updates made across all sections reflect here in real-time.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {onUpdateProfile && (
            <Button
              variant={showProfileEditor ? "default" : "outline"}
              size="sm"
              onClick={() => setShowProfileEditor(!showProfileEditor)}
              className={`h-9 px-3 text-xs rounded-xl transition-all ${
                showProfileEditor 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg' 
                  : 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <User className="w-3.5 h-3.5 mr-1.5" />
              {showProfileEditor ? 'Close Profile Editor' : 'Quick Edit Profile & Contacts'}
            </Button>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center bg-zinc-950/60 border border-white/10 rounded-xl p-1 gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-7 w-7 p-0 text-zinc-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-[11px] font-mono text-zinc-300 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-7 w-7 p-0 text-zinc-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="h-7 w-7 p-0 text-zinc-400 hover:text-white"
              title="Reset Zoom (85%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-9 px-3 text-xs border-white/10 text-zinc-300 hover:text-white rounded-xl"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 px-3 text-xs border-white/10 text-zinc-300 hover:text-white rounded-xl"
          >
            <a href="/cv" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              Open Page
            </a>
          </Button>

          <Button
            size="sm"
            onClick={() => window.open('/cv/print', '_blank')}
            className="h-9 px-3 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* ── Quick Profile Editor (Expandable) ── */}
      {showProfileEditor && onUpdateProfile && (
        <div className="p-4 sm:p-6 rounded-3xl bg-zinc-950/90 border border-amber-500/20 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick Edit CV Header, Photo & Channels
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowProfileEditor(false)}
              className="h-7 text-xs text-zinc-400 hover:text-white"
            >
              Done
            </Button>
          </div>
          <CVProfileManager 
            cvData={cvData} 
            onUpdate={onUpdateProfile} 
            saving={saving} 
          />
        </div>
      )}

      {/* ── Document View Canvas ── */}
      <div className="w-full overflow-x-auto overflow-y-auto py-8 px-4 rounded-3xl bg-zinc-950/80 border border-white/10 flex justify-center items-start min-h-[900px] shadow-2xl backdrop-blur-md">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            width: '820px',
            marginBottom: `${(1160 * scale) - 1160}px`,
          }}
        >
          <CVDocument data={cvData} interactive={false} />
        </div>
      </div>
    </div>
  )
}
