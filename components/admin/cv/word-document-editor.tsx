'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  List, 
  ListOrdered, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Wand2,
  Sun,
  Moon,
  FileCheck
} from 'lucide-react'
import { toast } from 'sonner'

interface WordDocumentEditorProps {
  bullets: string[]
  onChange: (bullets: string[]) => void
  placeholder?: string
  authorName?: string
}

export function WordDocumentEditor({
  bullets,
  onChange,
  placeholder = 'Architected, developed, or optimized core business software systems...',
  authorName = 'PEAK DETH',
}: WordDocumentEditorProps) {
  const [listType, setListType] = useState<'bullet' | 'number'>('bullet')
  const [isRawMode, setIsRawMode] = useState<boolean>(false)
  const [paperTheme, setPaperTheme] = useState<'white' | 'dark'>('white')
  const [rawText, setRawText] = useState<string>(bullets.join('\n'))
  const itemRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  // Keep rawText synchronized when bullets change externally
  useEffect(() => {
    setRawText(bullets.join('\n'))
  }, [bullets])

  const handleUpdateItem = (index: number, text: string) => {
    const updated = [...bullets]
    updated[index] = text
    onChange(updated)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Insert new bullet below
      const updated = [...bullets]
      updated.splice(index + 1, 0, '')
      onChange(updated)
      setTimeout(() => {
        itemRefs.current[index + 1]?.focus()
      }, 50)
    } else if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault()
      const updated = bullets.filter((_, idx) => idx !== index)
      onChange(updated)
      setTimeout(() => {
        const prevIndex = Math.max(0, index - 1)
        itemRefs.current[prevIndex]?.focus()
      }, 50)
    }
  }

  const handleAddBullet = () => {
    const updated = [...bullets, '']
    onChange(updated)
    setTimeout(() => {
      itemRefs.current[updated.length - 1]?.focus()
    }, 50)
  }

  const handleRemoveBullet = (index: number) => {
    if (bullets.length <= 1) {
      onChange([''])
      return
    }
    const updated = bullets.filter((_, idx) => idx !== index)
    onChange(updated)
  }

  const handleMoveBullet = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= bullets.length) return
    const updated = [...bullets]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    onChange(updated)
  }

  // Intelligent auto-splitter (Word Smart Paragraph Split)
  const handleAutoSplit = () => {
    const textToSplit = isRawMode ? rawText : bullets.join(' ')
    if (!textToSplit.trim()) {
      toast.error('Please enter some text to format')
      return
    }

    const parts = textToSplit
      .replace(/•/g, '\n')
      .replace(/ - /g, '\n')
      .replace(/(\. )([A-Z])/g, '.\n$2')
      .split('\n')
      .map((p) => p.replace(/^[\s•\-\*]+/, '').trim())
      .filter((p) => p.length > 2)

    if (parts.length > 0) {
      onChange(parts)
      setIsRawMode(false)
      toast.success(`Formatted into ${parts.length} distinct document milestone points!`)
    }
  }

  const handleRawChange = (text: string) => {
    setRawText(text)
    const lines = text
      .split('\n')
      .map((l) => l.replace(/^[\s•\-\*]+/, '').trim())
      .filter((l) => l.length > 0)
    onChange(lines.length > 0 ? lines : [''])
  }

  // Calculate statistics
  const totalCharacters = bullets.join(' ').length
  const totalWords = bullets.join(' ').trim().split(/\s+/).filter(Boolean).length
  const validMilestones = bullets.filter((b) => b.trim()).length

  const isWhitePaper = paperTheme === 'white'

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-zinc-950 font-sans transition-all duration-300">
      {/* ── 1. MICROSOFT WORD RIBBON TOOLBAR ── */}
      <div className="bg-[#185abd] text-white px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-blue-700/50">
        {/* Left: Author Name & Document Title */}
        <div className="flex items-center gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide text-white uppercase">{authorName}</span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono font-medium">
                CV_Experience.docx
              </span>
            </div>
            <p className="text-[10px] text-blue-100 hidden sm:block">Document Writing Sheet • Print Layout</p>
          </div>
        </div>

        {/* Right: Word Controls Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* List Style Toggles */}
          <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/15">
            <button
              type="button"
              onClick={() => {
                setListType('bullet')
                setIsRawMode(false)
              }}
              className={`h-7 px-2.5 text-xs rounded-md flex items-center gap-1.5 transition-all ${
                !isRawMode && listType === 'bullet'
                  ? 'bg-white text-[#185abd] font-bold shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
              title="Bulleted List"
            >
              <List className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden md:inline">Bullets</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setListType('number')
                setIsRawMode(false)
              }}
              className={`h-7 px-2.5 text-xs rounded-md flex items-center gap-1.5 transition-all ${
                !isRawMode && listType === 'number'
                  ? 'bg-white text-[#185abd] font-bold shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden md:inline">Numbered</span>
            </button>
          </div>

          {/* Quick Actions */}
          <Button
            type="button"
            size="sm"
            onClick={handleAddBullet}
            className="h-7 text-xs bg-white/20 hover:bg-white/30 text-white rounded-lg px-2.5 font-medium transition-colors border border-white/20"
            title="Add a new bullet item"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Line</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleAutoSplit}
            className="h-7 text-xs bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg px-2.5 shadow-sm transition-all"
            title="Auto-format and split text into distinct bullet items"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Auto-Split</span>
          </Button>

          {/* Paper Theme Toggle: White Paper vs Dark Paper */}
          <button
            type="button"
            onClick={() => setPaperTheme(isWhitePaper ? 'dark' : 'white')}
            className="h-7 px-2.5 text-[11px] rounded-lg transition-all border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5"
            title={isWhitePaper ? 'Switch to Dark Paper' : 'Switch to White Paper'}
          >
            {isWhitePaper ? (
              <>
                <Moon className="w-3 h-3 text-amber-300" />
                <span className="hidden md:inline">Dark Paper</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-amber-300" />
                <span className="hidden md:inline">White Paper</span>
              </>
            )}
          </button>

          {/* Raw Text Toggle */}
          <button
            type="button"
            onClick={() => setIsRawMode(!isRawMode)}
            className={`h-7 px-2.5 text-[11px] rounded-lg transition-all border font-medium ${
              isRawMode
                ? 'bg-amber-400 text-zinc-950 font-bold border-amber-300'
                : 'bg-black/25 hover:bg-black/40 text-white border-white/15'
            }`}
          >
            {isRawMode ? 'Document Page' : 'Raw Text'}
          </button>
        </div>
      </div>

      {/* ── 2. MICROSOFT WORD RULER ── */}
      <div className={`h-5 border-b flex items-center px-8 select-none overflow-hidden transition-colors ${
        isWhitePaper 
          ? 'bg-[#f3f4f6] border-gray-300 text-gray-500 font-mono text-[9px]' 
          : 'bg-zinc-900 border-white/5 text-zinc-600 font-mono text-[9px]'
      }`}>
        <div className="w-8 shrink-0 font-bold text-[8px] tracking-wider text-gray-400 uppercase">RULER</div>
        <div className="flex-1 flex justify-between tracking-widest text-[8px]">
          <span>|</span>
          <span>•</span>
          <span>1</span>
          <span>•</span>
          <span>2</span>
          <span>•</span>
          <span>3</span>
          <span>•</span>
          <span>4</span>
          <span>•</span>
          <span>5</span>
          <span>•</span>
          <span>6</span>
          <span>•</span>
          <span>7</span>
          <span>|</span>
        </div>
      </div>

      {/* ── 3. WORD DESK WORKSPACE WITH WRITING PAPER SHEET ── */}
      <div className={`p-4 sm:p-7 flex justify-center transition-colors ${
        isWhitePaper ? 'bg-[#525659]/90' : 'bg-zinc-950'
      }`}>
        {/* Floating Document Paper Page (Real Paper Writing Sheet) */}
        <div className={`w-full max-w-3xl rounded-sm sm:rounded-md transition-all duration-200 relative ${
          isWhitePaper
            ? 'bg-white text-zinc-900 shadow-[0_12px_45px_rgba(0,0,0,0.45)] border border-gray-300/80 p-6 sm:p-10'
            : 'bg-[#12131a] text-zinc-100 shadow-[0_12px_45px_rgba(0,0,0,0.6)] border border-white/10 p-6 sm:p-10'
        }`}>
          {/* Paper Header / Margins */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200/80 select-none">
            <div className="flex items-center gap-2">
              <FileCheck className={`w-4 h-4 ${isWhitePaper ? 'text-[#185abd]' : 'text-blue-400'}`} />
              <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${
                isWhitePaper ? 'text-gray-500' : 'text-zinc-500'
              }`}>
                Curriculum Vitae — Key Responsibilities & Achievements
              </span>
            </div>
            <span className={`text-[9px] font-mono ${isWhitePaper ? 'text-gray-400' : 'text-zinc-600'}`}>
              PAGE 1 OF 1 • 1.0 INCH MARGINS
            </span>
          </div>

          {isRawMode ? (
            /* Raw Textarea Mode */
            <div className="space-y-3">
              <textarea
                value={rawText}
                onChange={(e) => handleRawChange(e.target.value)}
                placeholder="Paste or write responsibilities here. Each line will become a paper bullet item..."
                rows={7}
                className={`w-full rounded-lg p-4 text-xs leading-relaxed font-mono resize-y focus:outline-none transition-all ${
                  isWhitePaper
                    ? 'bg-gray-50 border border-gray-300 text-zinc-900 focus:border-[#185abd] focus:ring-1 focus:ring-[#185abd]'
                    : 'bg-zinc-900 border border-white/10 text-zinc-100 focus:border-amber-400'
                }`}
              />
              <div className="flex items-center justify-between text-xs">
                <span className={isWhitePaper ? 'text-gray-500' : 'text-zinc-400'}>
                  Total Lines: {bullets.length}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAutoSplit}
                  className="bg-[#185abd] hover:bg-[#185abd]/90 text-white rounded px-3 text-xs"
                >
                  Apply & Format on Paper
                </Button>
              </div>
            </div>
          ) : (
            /* Writing Paper Bullet Items (Like Typing Directly on Microsoft Word Paper) */
            <div className="space-y-2">
              {bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className={`group flex items-start gap-3 p-1.5 rounded transition-colors ${
                    isWhitePaper
                      ? 'hover:bg-blue-50/50'
                      : 'hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Word Bullet Marker / Number */}
                  <div className="pt-1.5 shrink-0 flex items-center justify-center w-5 text-center select-none font-bold">
                    {listType === 'bullet' ? (
                      <span className={`text-base leading-none ${isWhitePaper ? 'text-[#185abd]' : 'text-amber-400'}`}>
                        •
                      </span>
                    ) : (
                      <span className={`text-xs font-semibold font-mono ${isWhitePaper ? 'text-[#185abd]' : 'text-amber-400'}`}>
                        {idx + 1}.
                      </span>
                    )}
                  </div>

                  {/* Document Paper Text Input */}
                  <div className="flex-1">
                    <textarea
                      ref={(el) => {
                        itemRefs.current[idx] = el
                      }}
                      value={bullet}
                      onChange={(e) => handleUpdateItem(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      placeholder={idx === 0 ? placeholder : 'Next milestone or responsibility... (Press Enter for next line)'}
                      rows={Math.max(1, Math.ceil((bullet || '').length / 80))}
                      className={`w-full bg-transparent border-none text-[13px] leading-relaxed resize-none transition-all px-1 py-1 rounded focus:outline-none ${
                        isWhitePaper
                          ? 'text-zinc-900 placeholder:text-gray-400 focus:bg-blue-50/40 focus:ring-1 focus:ring-blue-400/40 font-normal'
                          : 'text-zinc-100 placeholder:text-zinc-600 focus:bg-white/5 focus:ring-1 focus:ring-amber-500/30'
                      }`}
                    />
                  </div>

                  {/* Word Paper Margin Actions */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 pt-1 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleMoveBullet(idx, 'up')}
                      disabled={idx === 0}
                      className={`p-1 rounded disabled:opacity-20 transition-colors ${
                        isWhitePaper ? 'text-gray-400 hover:text-zinc-800 hover:bg-gray-200' : 'text-zinc-500 hover:text-white hover:bg-white/10'
                      }`}
                      title="Move line up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveBullet(idx, 'down')}
                      disabled={idx === bullets.length - 1}
                      className={`p-1 rounded disabled:opacity-20 transition-colors ${
                        isWhitePaper ? 'text-gray-400 hover:text-zinc-800 hover:bg-gray-200' : 'text-zinc-500 hover:text-white hover:bg-white/10'
                      }`}
                      title="Move line down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="p-1 rounded text-red-500/80 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Line Prompt on Paper */}
              <button
                type="button"
                onClick={handleAddBullet}
                className={`w-full mt-4 py-2 px-3 border border-dashed rounded text-left text-xs flex items-center justify-between transition-all ${
                  isWhitePaper
                    ? 'border-gray-300 hover:border-[#185abd] text-gray-500 hover:text-[#185abd] hover:bg-blue-50/30'
                    : 'border-white/15 hover:border-amber-400 text-zinc-400 hover:text-amber-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Plus className={`w-3.5 h-3.5 ${isWhitePaper ? 'text-[#185abd]' : 'text-amber-400'}`} />
                  <span>Click to add another milestone line</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] opacity-75">
                  <span>or press</span>
                  <kbd className={`px-1.5 py-0.5 rounded border ${
                    isWhitePaper ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-white/10 border-white/15 text-zinc-300'
                  }`}>
                    Enter ↵
                  </kbd>
                </div>
              </button>
            </div>
          )}

          {/* Paper Footer */}
          <div className="mt-8 pt-3 border-t border-gray-200/80 flex items-center justify-between text-[10px] select-none text-gray-400 font-mono">
            <span>Peak Deth CV Document</span>
            <span>Section: Professional Experience</span>
          </div>
        </div>
      </div>

      {/* ── 4. MICROSOFT WORD BLUE STATUS BAR ── */}
      <div className="bg-[#185abd] text-white text-[11px] px-4 py-2 flex items-center justify-between border-t border-blue-700/60 font-sans shadow-md">
        {/* Left Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Page 1 of 1</span>
          </div>
          <span className="opacity-50">|</span>
          <span>{validMilestones} milestones</span>
          <span className="opacity-50">|</span>
          <span>{totalWords} words</span>
          <span className="opacity-50 hidden sm:inline">|</span>
          <span className="hidden sm:inline">{totalCharacters} characters</span>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span>Ready • 100% Zoom</span>
          </div>
        </div>
      </div>
    </div>
  )
}
