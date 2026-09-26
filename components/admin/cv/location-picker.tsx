'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { MapPin, Check, Search, Globe, Building2, Laptop } from 'lucide-react'

interface LocationPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  accentColor?: 'emerald' | 'blue' | 'amber'
}

interface LocationOption {
  label: string
  khmerName?: string
  category: 'Cambodia Provinces' | 'Remote / Hybrid' | 'International Hubs'
  flag?: string
}

// All 25 Provinces & Capital of Cambodia + popular districts
const CAMBODIA_25_PROVINCES: LocationOption[] = [
  { label: 'Phnom Penh, Cambodia', khmerName: 'រាជធានីភ្នំពេញ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Kandal, Cambodia', khmerName: 'ខេត្តកណ្តាល', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Siem Reap, Cambodia', khmerName: 'ខេត្តសៀមរាប', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Battambang, Cambodia', khmerName: 'ខេត្តបាត់ដំបង', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Kampong Cham, Cambodia', khmerName: 'ខេត្តកំពង់ចាម', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Kampong Chhnang, Cambodia', khmerName: 'ខេត្តកំពង់ឆ្នាំង', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Kampong Speu, Cambodia', khmerName: 'ខេត្តកំពង់ស្ពឺ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Kampong Thom, Cambodia', khmerName: 'ខេត្តកំពង់ធំ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Kampot, Cambodia', khmerName: 'ខេត្តកំពត', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Preah Sihanouk (Sihanoukville), Cambodia', khmerName: 'ខេត្តព្រះសីហនុ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Kep, Cambodia', khmerName: 'ខេត្តកែប', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Koh Kong, Cambodia', khmerName: 'ខេត្តកោះកុង', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Kratie, Cambodia', khmerName: 'ខេត្តក្រចេះ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Prey Veng, Cambodia', khmerName: 'ខេត្តព្រៃវែង', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Pursat, Cambodia', khmerName: 'ខេត្តពោធិ៍សាត់', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Svay Rieng, Cambodia', khmerName: 'ខេត្តស្វាយរៀង', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Takeo, Cambodia', khmerName: 'ខេត្តតាកែវ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Tboung Khmum, Cambodia', khmerName: 'ខេត្តត្បូងឃ្មុំ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Banteay Meanchey, Cambodia', khmerName: 'ខេត្តបន្ទាយមានជ័យ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Oddar Meanchey, Cambodia', khmerName: 'ខេត្តឧត្តរមានជ័យ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Preah Vihear, Cambodia', khmerName: 'ខេត្តព្រះវិហារ', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Stung Treng, Cambodia', khmerName: 'ខេត្តស្ទឹងត្រែង', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Ratanakiri, Cambodia', khmerName: 'ខេត្តរតនគិរី', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Mondulkiri, Cambodia', khmerName: 'ខេត្តមណ្ឌលគិរី', category: 'Cambodia Provinces', flag: '🇰🇭' },
  { label: 'Pailin, Cambodia', khmerName: 'ខេត្តប៉ៃលិន', category: 'Cambodia Provinces', flag: '🇰🇭' },
]

const REMOTE_AND_GLOBAL_LOCATIONS: LocationOption[] = [
  // Remote & Work Modes
  { label: 'Remote (Worldwide)', category: 'Remote / Hybrid', flag: '🌐' },
  { label: 'Remote (Cambodia)', category: 'Remote / Hybrid', flag: '🇰🇭' },
  { label: 'Hybrid (Phnom Penh, Cambodia)', category: 'Remote / Hybrid', flag: '🏢' },
  { label: 'On-site (Phnom Penh)', category: 'Remote / Hybrid', flag: '📍' },

  // International Tech Hubs
  { label: 'Singapore', category: 'International Hubs', flag: '🇸🇬' },
  { label: 'Bangkok, Thailand', category: 'International Hubs', flag: '🇹🇭' },
  { label: 'Kuala Lumpur, Malaysia', category: 'International Hubs', flag: '🇲🇾' },
  { label: 'Tokyo, Japan', category: 'International Hubs', flag: '🇯🇵' },
  { label: 'San Francisco, CA, USA', category: 'International Hubs', flag: '🇺🇸' },
  { label: 'London, United Kingdom', category: 'International Hubs', flag: '🇬🇧' },
]

const ALL_LOCATIONS: LocationOption[] = [
  ...CAMBODIA_25_PROVINCES,
  ...REMOTE_AND_GLOBAL_LOCATIONS,
]

const POPULAR_PROVINCE_PILLS = [
  'Phnom Penh, Cambodia',
  'Kandal, Cambodia',
  'Siem Reap, Cambodia',
  'Battambang, Cambodia',
  'Kampot, Cambodia',
  'Remote (Worldwide)',
]

export function LocationPicker({
  value,
  onChange,
  placeholder = 'e.g. Phnom Penh, Cambodia (or any of 25 provinces)',
  accentColor = 'emerald',
}: LocationPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'cambodia' | 'remote' | 'global'>('all')

  const filteredLocations = ALL_LOCATIONS.filter((loc) => {
    const matchesSearch =
      loc.label.toLowerCase().includes(search.toLowerCase()) ||
      (loc.khmerName && loc.khmerName.includes(search))

    if (activeTab === 'cambodia') return matchesSearch && loc.category === 'Cambodia Provinces'
    if (activeTab === 'remote') return matchesSearch && loc.category === 'Remote / Hybrid'
    if (activeTab === 'global') return matchesSearch && loc.category === 'International Hubs'
    return matchesSearch
  })

  const handleSelect = (locLabel: string) => {
    onChange(locLabel)
    setOpen(false)
    setSearch('')
  }

  const isEmerald = accentColor === 'emerald'
  const isBlue = accentColor === 'blue'
  const focusBorder = isEmerald
    ? 'focus:border-emerald-500/50'
    : isBlue
    ? 'focus:border-blue-500/50'
    : 'focus:border-amber-500/50'
  const focusRing = isEmerald
    ? 'focus:ring-emerald-500/30'
    : isBlue
    ? 'focus:ring-blue-500/30'
    : 'focus:ring-amber-500/30'
  const iconColor = isEmerald
    ? 'text-emerald-400'
    : isBlue
    ? 'text-blue-400'
    : 'text-amber-400'
  const activeBg = isEmerald
    ? 'bg-emerald-500 text-zinc-950 font-bold'
    : isBlue
    ? 'bg-blue-600 text-white font-bold'
    : 'bg-amber-500 text-zinc-950 font-bold'

  return (
    <div className="space-y-1.5 font-sans">
      <div className="relative flex items-center">
        {/* Text Input allowing direct typing or pasting */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`bg-zinc-950/80 border-white/10 text-white placeholder:text-zinc-600 rounded-xl pr-10 h-10 text-xs ${focusBorder} focus:ring-1 ${focusRing} transition-all`}
        />

        {/* Popover Location Trigger Button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`absolute right-1.5 p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:${iconColor} transition-colors`}
              title="Select real province or location"
            >
              <MapPin className={`w-4 h-4 ${iconColor}`} />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={6}
            className="w-88 p-4 bg-zinc-950 border border-white/10 shadow-2xl rounded-2xl text-slate-100 z-50 backdrop-blur-xl space-y-3.5 max-w-[350px]"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${iconColor}`} />
                <span className="text-xs font-bold text-white tracking-wide">
                  Cambodia 25 Provinces & Locations
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[120px]">
                {value || 'Not set'}
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-white/5 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'all' ? 'bg-zinc-800 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cambodia')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'cambodia' ? 'bg-zinc-800 text-emerald-400 font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇰🇭 25 Provinces
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('remote')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'remote' ? 'bg-zinc-800 text-amber-400 font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🌐 Remote
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('global')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'global' ? 'bg-zinc-800 text-blue-400 font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🌏 Global
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search province (English or ភាសាខ្មែរ)..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Categorized Options */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {['Cambodia Provinces', 'Remote / Hybrid', 'International Hubs'].map((category) => {
                const items = filteredLocations.filter((l) => l.category === category)
                if (items.length === 0) return null

                return (
                  <div key={category} className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block px-1">
                      {category} ({items.length})
                    </span>
                    <div className="space-y-0.5">
                      {items.map((loc) => {
                        const isSelected = value.toLowerCase() === loc.label.toLowerCase()
                        return (
                          <button
                            key={loc.label}
                            type="button"
                            onClick={() => handleSelect(loc.label)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left ${
                              isSelected
                                ? `${activeBg} shadow-sm`
                                : 'hover:bg-zinc-800/80 text-zinc-300 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className="text-xs shrink-0">{loc.flag}</span>
                              <span className="truncate">{loc.label}</span>
                              {loc.khmerName && (
                                <span className={`text-[10px] truncate ${isSelected ? 'text-zinc-950 font-normal' : 'text-zinc-500'}`}>
                                  {loc.khmerName}
                                </span>
                              )}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {filteredLocations.length === 0 && (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No matching province found. You can type any custom district or location directly in the input!
                </div>
              )}
            </div>

            {/* Clear Button */}
            {value && (
              <div className="pt-2 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    setOpen(false)
                  }}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Clear location
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Quick Select Location Pills directly underneath */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" /> Popular:
        </span>
        {POPULAR_PROVINCE_PILLS.map((pill) => {
          const isSelected = value.toLowerCase() === pill.toLowerCase()
          return (
            <button
              key={pill}
              type="button"
              onClick={() => onChange(pill)}
              className={`text-[10px] px-2 py-0.5 rounded-md border transition-all truncate max-w-[170px] ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                  : 'bg-zinc-900/60 hover:bg-zinc-800 border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {pill}
            </button>
          )
        })}
      </div>
    </div>
  )
}
