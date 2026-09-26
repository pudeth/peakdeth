'use client'

import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Check, Clock, Sparkles, ChevronDown } from 'lucide-react'

interface PeriodPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  accentColor?: 'amber' | 'blue'
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 25 }, (_, i) => CURRENT_YEAR + 3 - i) // 2029 down to 2005
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const QUICK_PRESETS = [
  `${CURRENT_YEAR - 2} — Present`,
  `${CURRENT_YEAR - 1} — Present`,
  `${CURRENT_YEAR} — Present`,
  `2020 — 2024`,
  `2021 — 2025`,
  `2019 — 2023`,
  `${CURRENT_YEAR}`,
  `${CURRENT_YEAR - 1}`,
]

export function PeriodPicker({
  value,
  onChange,
  placeholder = 'e.g. 2020 — 2024',
  accentColor = 'amber',
}: PeriodPickerProps) {
  const [open, setOpen] = useState(false)
  const [startYear, setStartYear] = useState<string>(String(CURRENT_YEAR - 4))
  const [startMonth, setStartMonth] = useState<string>('')
  const [endYear, setEndYear] = useState<string>('Present')
  const [endMonth, setEndMonth] = useState<string>('')
  const [includeMonths, setIncludeMonths] = useState(false)

  // Try parsing current value on popover open
  useEffect(() => {
    if (!value) return
    const parts = value.split(/[—–-]/).map((p) => p.trim())
    if (parts.length >= 2) {
      // Start part
      const startTokens = parts[0].split(' ')
      if (startTokens.length === 2 && MONTHS.includes(startTokens[0])) {
        setStartMonth(startTokens[0])
        setStartYear(startTokens[1])
        setIncludeMonths(true)
      } else if (startTokens[0]) {
        setStartYear(startTokens[0])
      }

      // End part
      const endTokens = parts[1].split(' ')
      if (endTokens[0]?.toLowerCase() === 'present') {
        setEndYear('Present')
        setEndMonth('')
      } else if (endTokens.length === 2 && MONTHS.includes(endTokens[0])) {
        setEndMonth(endTokens[0])
        setEndYear(endTokens[1])
        setIncludeMonths(true)
      } else if (endTokens[0]) {
        setEndYear(endTokens[0])
      }
    } else if (parts.length === 1 && parts[0]) {
      setStartYear(parts[0])
      setEndYear('')
    }
  }, [value, open])

  const handleApply = (sYear: string, sMonth: string, eYear: string, eMonth: string, withMonths: boolean) => {
    let startStr = ''
    if (withMonths && sMonth) {
      startStr = `${sMonth} ${sYear}`
    } else {
      startStr = sYear
    }

    let endStr = ''
    if (eYear === 'Present') {
      endStr = 'Present'
    } else if (eYear) {
      if (withMonths && eMonth) {
        endStr = `${eMonth} ${eYear}`
      } else {
        endStr = eYear
      }
    }

    const formatted = endStr ? `${startStr} — ${endStr}` : startStr
    onChange(formatted)
    setOpen(false)
  }

  const handlePresetClick = (preset: string) => {
    onChange(preset)
    setOpen(false)
  }

  const isAmber = accentColor === 'amber'
  const focusBorder = isAmber ? 'focus:border-amber-500/50' : 'focus:border-blue-500/50'
  const focusRing = isAmber ? 'focus:ring-amber-500/30' : 'focus:ring-blue-500/30'
  const iconColor = isAmber ? 'text-amber-400' : 'text-blue-400'
  const activeBg = isAmber
    ? 'bg-amber-500 text-zinc-950 font-bold'
    : 'bg-blue-600 text-white font-bold'

  return (
    <div className="relative font-sans">
      <div className="relative flex items-center">
        {/* Text Input allowing direct typing or pasting */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`bg-zinc-950/80 border-white/10 text-white placeholder:text-zinc-600 rounded-xl pr-10 h-10 text-xs ${focusBorder} focus:ring-1 ${focusRing} transition-all`}
        />

        {/* Popover Date Trigger Button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`absolute right-1.5 p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:${iconColor} transition-colors`}
              title="Open Date & Year Selector"
            >
              <Calendar className={`w-4 h-4 ${iconColor}`} />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={6}
            className="w-80 p-4 bg-zinc-950 border border-white/10 shadow-2xl rounded-2xl text-slate-100 z-50 backdrop-blur-xl space-y-4"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${iconColor}`} />
                <span className="text-xs font-bold text-white tracking-wide">Select Year / Period</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {value || 'Not set'}
              </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Quick Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border text-left truncate transition-all ${
                      value === preset
                        ? `${activeBg} border-transparent shadow-sm`
                        : 'bg-zinc-900/80 hover:bg-zinc-800 border-white/5 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range Picker */}
            <div className="space-y-3 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Custom Range
                </span>
                <label className="flex items-center gap-1.5 text-[10px] text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMonths}
                    onChange={(e) => setIncludeMonths(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Include Months</span>
                </label>
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400">Start Date</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {includeMonths && (
                    <select
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                      className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none focus:border-amber-400"
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  )}
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className={`bg-zinc-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none focus:border-amber-400 ${
                      !includeMonths ? 'col-span-2' : ''
                    }`}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">End Date</span>
                  <button
                    type="button"
                    onClick={() => setEndYear('Present')}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono transition-colors ${
                      endYear === 'Present'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    ● Present / Ongoing
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {includeMonths && endYear !== 'Present' && (
                    <select
                      value={endMonth}
                      onChange={(e) => setEndMonth(e.target.value)}
                      className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none focus:border-amber-400"
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className={`bg-zinc-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none focus:border-amber-400 ${
                      !includeMonths || endYear === 'Present' ? 'col-span-2' : ''
                    }`}
                  >
                    <option value="Present">Present (Ongoing)</option>
                    <option value="">Single Year (None)</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Apply & Cancel */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setOpen(false)
                }}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
              >
                Clear
              </button>

              <Button
                type="button"
                size="sm"
                onClick={() => handleApply(startYear, startMonth, endYear, endMonth, includeMonths)}
                className={`h-7 px-3 text-xs rounded-lg ${activeBg}`}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Apply Period
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
