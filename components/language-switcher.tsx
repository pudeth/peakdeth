'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { Language } from '@/lib/i18n/translations'
import { cn } from '@/lib/utils'

interface LanguageOption {
  code: Language
  label: string
  nativeName: string
  badge: string
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    badge: 'EN',
  },
  {
    code: 'km',
    label: 'Khmer',
    nativeName: 'ភាសាខ្មែរ',
    badge: 'KH',
  },
  {
    code: 'zh',
    label: 'Chinese',
    nativeName: '中文',
    badge: 'ZH',
  },
]

interface LanguageSwitcherProps {
  className?: string
  align?: 'left' | 'right'
  variant?: 'pill' | 'compact' | 'drawer'
}

export function LanguageSwitcher({
  className,
  align = 'right',
  variant = 'pill',
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Drawer variant for mobile menu sheet: a clean 3-button segmented tab
  if (variant === 'drawer') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Language / ភាសា / 语言</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {currentOption.nativeName}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl backdrop-blur-md">
          {LANGUAGES.map((item) => {
            const isSelected = language === item.code
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={cn(
                  'relative py-2 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex flex-col items-center justify-center gap-0.5',
                  isSelected
                    ? 'bg-white text-zinc-950 font-semibold shadow-md shadow-black/20'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                )}
              >
                <span>{item.nativeName}</span>
                <span
                  className={cn(
                    'text-[9px] font-mono tracking-wider uppercase',
                    isSelected ? 'text-zinc-600' : 'text-zinc-500'
                  )}
                >
                  {item.badge}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Desktop or Compact Floating Pill
  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select Language"
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 shadow-sm backdrop-blur-md text-xs font-medium tracking-wide',
          isOpen
            ? 'bg-white/[0.14] border-white/30 text-white ring-2 ring-white/10'
            : 'bg-white/[0.06] border-white/15 hover:border-white/30 hover:bg-white/[0.10] text-zinc-200 hover:text-white'
        )}
      >
        <Globe className="w-3.5 h-3.5 text-zinc-300" />
        <span className="font-semibold">{currentOption.nativeName}</span>
        <span className="text-[10px] text-zinc-400 font-mono">({currentOption.badge})</span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-zinc-400 transition-transform duration-300',
            isOpen ? 'rotate-180 text-white' : ''
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'absolute top-full mt-2 w-48 z-50 p-1.5 rounded-2xl bg-[#08090b]/95 backdrop-blur-2xl border border-white/15 shadow-[0_12px_35px_rgba(0,0,0,0.85)]',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 border-b border-white/[0.06] mb-1">
              Select Language
            </div>

            <div className="space-y-1">
              {LANGUAGES.map((item) => {
                const isSelected = language === item.code
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code)
                      setIsOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200',
                      isSelected
                        ? 'bg-white/[0.12] text-white font-medium border border-white/10'
                        : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-[13px]">{item.nativeName}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{item.label}</span>
                    </div>

                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500">{item.badge}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
