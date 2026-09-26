'use client'

import React, { useState, useRef } from 'react'
import { X, Plus, Layers, Check, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TechStackInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const PRESET_STACKS = [
  'Next.js',
  'TypeScript',
  'React',
  'React Native',
  'Tailwind CSS',
  'Node.js',
  'PostgreSQL',
  'Supabase',
  'Docker',
  'Python',
  'Prisma',
  'GraphQL',
  'REST API',
  'Redis',
]

export function TechStackInput({
  value,
  onChange,
  placeholder = 'Type tech and press Enter (or comma)...',
}: TechStackInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Parse comma-separated string into unique tags
  const tags = value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const updateTags = (newTags: string[]) => {
    // Deduplicate case-insensitively
    const seen = new Set<string>()
    const deduped: string[] = []
    for (const t of newTags) {
      const lower = t.toLowerCase()
      if (!seen.has(lower)) {
        seen.add(lower)
        deduped.push(t)
      }
    }
    onChange(deduped.join(', '))
  }

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim().replace(/^,+|,+$/g, '')
    if (!trimmed) return
    if (!tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      updateTags([...tags, trimmed])
    }
    setInputValue('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    updateTags(tags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase()))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault()
      handleRemoveTag(tags[tags.length - 1])
    }
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-2.5 font-sans">
      {/* ── Interactive Tags Field Box ── */}
      <div
        onClick={handleContainerClick}
        className="min-h-[48px] p-2 bg-zinc-950/90 border border-white/10 hover:border-white/20 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/30 rounded-xl flex flex-wrap items-center gap-1.5 transition-all cursor-text shadow-inner"
      >
        {/* Rendered Tag Chips inside input box */}
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-600/10 border border-amber-500/30 text-amber-300 text-xs font-medium shadow-sm group select-none animate-in fade-in zoom-in-95 duration-150"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveTag(tag)
              }}
              className="text-amber-400/60 hover:text-red-400 hover:bg-red-500/10 rounded p-0.5 transition-colors"
              title={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Text Input inside the box */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value
            if (val.includes(',')) {
              const parts = val.split(',')
              parts.forEach((p) => handleAddTag(p))
            } else {
              setInputValue(val)
            }
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              handleAddTag(inputValue)
            }
          }}
          placeholder={tags.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[130px] bg-transparent border-none text-xs text-white placeholder:text-zinc-600 focus:outline-none py-1 px-1.5"
        />

        {/* Clear All button when tags present */}
        {tags.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 px-2 py-0.5 rounded hover:bg-white/5 ml-auto transition-colors font-mono"
            title="Clear all technologies"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Subtitle / Quick Add Section ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 px-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
            <Plus className="w-3 h-3 text-amber-400" /> Quick Add:
          </span>

          {PRESET_STACKS.map((tech) => {
            const isSelected = tags.some((t) => t.toLowerCase() === tech.toLowerCase())
            return (
              <button
                key={tech}
                type="button"
                onClick={() => (isSelected ? handleRemoveTag(tech) : handleAddTag(tech))}
                className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-all duration-150 flex items-center gap-1 font-medium ${
                  isSelected
                    ? 'bg-amber-400/20 border-amber-400/40 text-amber-300 shadow-sm'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 border-white/10 hover:border-white/20 text-zinc-400 hover:text-white'
                }`}
              >
                {isSelected ? (
                  <Check className="w-2.5 h-2.5 text-amber-400" />
                ) : (
                  <span className="text-zinc-500 text-[10px]">+</span>
                )}
                <span>{tech}</span>
              </button>
            )
          })}
        </div>

        {tags.length > 0 && (
          <span className="text-[10px] text-zinc-500 font-mono">
            {tags.length} {tags.length === 1 ? 'tech' : 'technologies'} attached
          </span>
        )}
      </div>
    </div>
  )
}
