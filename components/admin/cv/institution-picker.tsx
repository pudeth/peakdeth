'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Building2, Check, Search, GraduationCap, School, MapPin } from 'lucide-react'

interface InstitutionPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  accentColor?: 'blue' | 'amber' | 'emerald'
}

interface InstitutionOption {
  name: string
  short?: string
  province: string
  khmerName?: string
  category: 'Primary School' | 'High School' | 'University & College' | 'Tech Academy'
  badge?: string
}

const REAL_INSTITUTIONS: InstitutionOption[] = [
  // ──────────────────────────────────────────────
  // ── 1. BATTAMBANG PROVINCE (ខេត្តបាត់ដំបង) ──
  // ──────────────────────────────────────────────
  // Battambang Primary Schools (បឋមសិក្សាបាត់ដំបង)
  { name: 'Sdao Santepheap Primary School, Battambang', short: 'Sdao Santepheap Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាស្តៅសន្តិភាព', category: 'Primary School', badge: 'Rattanak Mondol' },
  { name: 'Sdao Primary School, Battambang', short: 'Sdao Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាស្តៅ', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Sotthearoth Primary School, Battambang', short: 'Sotthearoth Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាសុធារស', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Wat Kandal Primary School, Battambang', short: 'Wat Kandal Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាវត្តកណ្តាល', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Wat Piphit Primary School, Battambang', short: 'Wat Piphit Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាវត្តពិភិទ្ធរង្សី', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Wat Damrei Sor Primary School, Battambang', short: 'Damrei Sor Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាវត្តដំរីស', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Chamkar Samraong Primary School, Battambang', short: 'Chamkar Samraong Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាចំការសំរោង', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Prek Preah Sdech Primary School, Battambang', short: 'Prek Preah Sdech Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាព្រែកព្រះស្តេច', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Svay Por Primary School, Battambang', short: 'Svay Por Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាស្វាយប៉ោ', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Tuol Ta Ek Primary School, Battambang', short: 'Tuol Ta Ek Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាទួលតាឯក', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Ochar Primary School, Battambang', short: 'Ochar Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាអូរចារ', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Wat Sangke Primary School, Battambang', short: 'Wat Sangke Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាវត្តសង្កែ', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Moung Ruessei Primary School, Battambang', short: 'Moung Ruessei Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាមោងឫស្សី', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Thma Koul Primary School, Battambang', short: 'Thma Koul Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាថ្មគោល', category: 'Primary School', badge: 'Battambang Pri' },
  { name: 'Bavel Primary School, Battambang', short: 'Bavel Pri', province: 'Battambang', khmerName: 'សាលាបឋមសិក្សាបវេល', category: 'Primary School', badge: 'Battambang Pri' },

  // Battambang High Schools (វិទ្យាល័យបាត់ដំបង)
  { name: 'Sdao Santepheap High School, Battambang', short: 'Sdao Santepheap High', province: 'Battambang', khmerName: 'វិទ្យាល័យស្តៅសន្តិភាព / អនុវិទ្យាល័យស្តៅសន្តិភាព', category: 'High School', badge: 'Rattanak Mondol' },
  { name: 'Rattanak Mondol High School, Battambang', short: 'Rattanak Mondol High', province: 'Battambang', khmerName: 'វិទ្យាល័យរតនមណ្ឌល', category: 'High School', badge: 'Battambang High' },
  { name: 'Treng High School, Battambang', short: 'Treng High', province: 'Battambang', khmerName: 'វិទ្យាល័យត្រែង', category: 'High School', badge: 'Battambang High' },
  { name: 'Preah Monivong High School, Battambang', short: 'Monivong High', province: 'Battambang', khmerName: 'វិទ្យាល័យព្រះមុនីវង្ស', category: 'High School', badge: 'Battambang High' },
  { name: 'Net Yang High School, Battambang', short: 'Net Yang High', province: 'Battambang', khmerName: 'វិទ្យាល័យនេតយ៉ង់', category: 'High School', badge: 'Battambang High' },
  { name: 'Sangkat Battambang High School', short: 'Sangkat BTB High', province: 'Battambang', khmerName: 'វិទ្យាល័យសង្កាត់បាត់ដំបង', category: 'High School', badge: 'Battambang High' },
  { name: 'Phnom Sampov High School, Battambang', short: 'Phnom Sampov High', province: 'Battambang', khmerName: 'វិទ្យាល័យភ្នំសំពៅ', category: 'High School', badge: 'Battambang High' },
  { name: 'Thma Koul High School, Battambang', short: 'Thma Koul High', province: 'Battambang', khmerName: 'វិទ្យាល័យថ្មគោល', category: 'High School', badge: 'Battambang High' },
  { name: 'Moung Ruessei High School, Battambang', short: 'Moung Ruessei High', province: 'Battambang', khmerName: 'វិទ្យាល័យមោងឫស្សី', category: 'High School', badge: 'Battambang High' },
  { name: 'Bavel High School, Battambang', short: 'Bavel High', province: 'Battambang', khmerName: 'វិទ្យាល័យបវេល', category: 'High School', badge: 'Battambang High' },
  { name: 'Rotanak High School, Battambang', short: 'Rotanak High', province: 'Battambang', khmerName: 'វិទ្យាល័យរតនៈ', category: 'High School', badge: 'Battambang High' },
  { name: 'Hun Sen Chamkar Samraong High School, Battambang', short: 'Chamkar Samraong High', province: 'Battambang', khmerName: 'វិទ្យាល័យហ៊ុនសែនចំការសំរោង', category: 'High School', badge: 'Battambang High' },

  // Battambang Universities & Colleges (សាកលវិទ្យាល័យបាត់ដំបង)
  { name: 'National University of Battambang (NUBB)', short: 'NUBB / UBB', province: 'Battambang', khmerName: 'សាកលវិទ្យាល័យជាតិនៃបាត់ដំបង', category: 'University & College', badge: 'Public Univ' },
  { name: 'Battambang Institute of Technology (BIT)', short: 'BIT', province: 'Battambang', khmerName: 'វិទ្យាស្ថានបច្ចេកវិទ្យាបាត់ដំបង', category: 'University & College', badge: 'Tech Institute' },
  { name: 'University of Management and Economics (UME), Battambang', short: 'UME BTB', province: 'Battambang', khmerName: 'សាកលវិទ្យាល័យគ្រប់គ្រង និងសេដ្ឋកិច្ច បាត់ដំបង', category: 'University & College', badge: 'Private Univ' },
  { name: 'Build Bright University (BBU) - Battambang Campus', short: 'BBU BTB', province: 'Battambang', khmerName: 'សាកលវិទ្យាល័យបៀលប្រាយ បាត់ដំបង', category: 'University & College', badge: 'Private Univ' },
  { name: 'Western University (WU) - Battambang Campus', short: 'Western BTB', province: 'Battambang', khmerName: 'សាកលវិទ្យាល័យវេស្ទើន បាត់ដំបង', category: 'University & College', badge: 'Private Univ' },
  { name: 'Dewey International University (DIU), Battambang', short: 'DIU', province: 'Battambang', khmerName: 'សាកលវិទ្យាល័យអន្តរជាតិ ឌូវី', category: 'University & College', badge: 'International Univ' },
  { name: 'Regional Teacher Training Center (RTTC) Battambang', short: 'RTTC BTB', province: 'Battambang', khmerName: 'សាលាគរុកោសល្យភូមិភាគបាត់ដំបង', category: 'University & College', badge: 'Teacher College' },
  { name: 'National Polytechnic Institute of Battambang (NPIB)', short: 'NPIB', province: 'Battambang', khmerName: 'វិទ្យាស្ថានជាតិពហុបច្ចេកទេសបាត់ដំបង', category: 'University & College', badge: 'Polytechnic' },

  // ──────────────────────────────────────────────
  // ── 2. PHNOM PENH & OTHER PROVINCES ──
  // ──────────────────────────────────────────────
  // Primary Schools
  { name: 'Wat Koh Primary School, Phnom Penh', short: 'Wat Koh', province: 'Phnom Penh', khmerName: 'សាលាបឋមសិក្សាវត្តកោះ', category: 'Primary School', badge: 'Phnom Penh Pri' },
  { name: 'Bak Touk Primary School, Phnom Penh', short: 'Bak Touk Pri', province: 'Phnom Penh', khmerName: 'សាលាបឋមសិក្សាបាក់ទូក', category: 'Primary School', badge: 'Phnom Penh Pri' },
  { name: 'Preah Norodom Primary School, Phnom Penh', short: 'Norodom Pri', province: 'Phnom Penh', khmerName: 'សាលាបឋមសិក្សាព្រះនរោត្តម', category: 'Primary School', badge: 'Phnom Penh Pri' },
  { name: 'Chaktomuk Primary School, Phnom Penh', short: 'Chaktomuk Pri', province: 'Phnom Penh', khmerName: 'សាលាបឋមសិក្សាចតុមុខ', category: 'Primary School', badge: 'Phnom Penh Pri' },
  { name: 'Tuol Kork Primary School, Phnom Penh', short: 'Tuol Kork Pri', province: 'Phnom Penh', khmerName: 'សាលាបឋមសិក្សាទួលគោក', category: 'Primary School', badge: 'Phnom Penh Pri' },
  { name: 'Kolab 1 Primary School, Phnom Penh', short: 'Kolab 1', province: 'Phnom Penh', khmerName: 'សាលាបឋមសិក្សាកូឡាប១', category: 'Primary School', badge: 'Phnom Penh Pri' },
  { name: 'Wat Bo Primary School, Siem Reap', short: 'Wat Bo Pri', province: 'Siem Reap', khmerName: 'សាលាបឋមសិក្សាវត្តបូព៌', category: 'Primary School', badge: 'Siem Reap Pri' },
  { name: 'Ang Duong Primary School, Siem Reap', short: 'Ang Duong Pri', province: 'Siem Reap', khmerName: 'សាលាបឋមសិក្សាអង់ឌួង', category: 'Primary School', badge: 'Siem Reap Pri' },
  { name: 'Wat Dei Dos Primary School, Kampong Cham', short: 'Dei Dos Pri', province: 'Kampong Cham', khmerName: 'សាលាបឋមសិក្សាវត្តដីដុះ', category: 'Primary School', badge: 'Kampong Cham Pri' },
  { name: 'Krong Kampot Primary School, Kampot', short: 'Kampot Pri', province: 'Kampot', khmerName: 'សាលាបឋមសិក្សាក្រុងកំពត', category: 'Primary School', badge: 'Kampot Pri' },
  { name: 'Ta Khmau Primary School, Kandal', short: 'Ta Khmau Pri', province: 'Kandal', khmerName: 'សាលាបឋមសិក្សាតាខ្មៅ', category: 'Primary School', badge: 'Kandal Pri' },
  { name: 'Sovannaphumi School (Primary Section)', short: 'Sovannaphumi', province: 'Phnom Penh / Provinces', khmerName: 'សាលាសុវណ្ណភូមិ', category: 'Primary School', badge: 'Bilingual Pri' },
  { name: 'Beltei International School (Primary Section)', short: 'Beltei Pri', province: 'Phnom Penh', khmerName: 'សាលាប៊ែលធីអន្តរជាតិ', category: 'Primary School', badge: 'Bilingual Pri' },

  // High Schools
  { name: 'Lycée Sisowath (Sisowath High School), Phnom Penh', short: 'Sisowath', province: 'Phnom Penh', khmerName: 'វិទ្យាល័យព្រះស៊ីសុវត្ថិ', category: 'High School', badge: 'Phnom Penh High' },
  { name: 'Bak Touk High School, Phnom Penh', short: 'Bak Touk High', province: 'Phnom Penh', khmerName: 'វិទ្យាល័យបាក់ទូក', category: 'High School', badge: 'Phnom Penh High' },
  { name: 'Preah Yukunthor High School, Phnom Penh', short: 'Yukunthor', province: 'Phnom Penh', khmerName: 'វិទ្យាល័យព្រះយុគន្ធរ', category: 'High School', badge: 'Phnom Penh High' },
  { name: 'Santhor Mok High School, Phnom Penh', short: 'Santhor Mok', province: 'Phnom Penh', khmerName: 'វិទ្យាល័យសន្ធរម៉ុក', category: 'High School', badge: 'Phnom Penh High' },
  { name: '10 Makara 1979 High School, Siem Reap', short: '10 Makara High', province: 'Siem Reap', khmerName: 'វិទ្យាល័យ១០មករា១៩៧៩', category: 'High School', badge: 'Siem Reap High' },
  { name: 'Hun Sen Kampong Cham High School, Kampong Cham', short: 'Hun Sen KPC', province: 'Kampong Cham', khmerName: 'វិទ្យាល័យហ៊ុនសែនកំពង់ចាម', category: 'High School', badge: 'Kampong Cham High' },

  // Universities
  { name: 'Royal University of Phnom Penh (RUPP)', short: 'RUPP', province: 'Phnom Penh', khmerName: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ', category: 'University & College', badge: 'Public Univ' },
  { name: 'Institute of Technology of Cambodia (ITC)', short: 'ITC', province: 'Phnom Penh', khmerName: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា', category: 'University & College', badge: 'Engineering' },
  { name: 'Cambodia Academy of Digital Technology (CADT)', short: 'CADT', province: 'Phnom Penh', khmerName: 'បណ្ឌិត្យសភាបច្ចេកវិទ្យាឌីជីថលកម្ពុជា', category: 'University & College', badge: 'Digital / Tech' },
  { name: 'Paragon International University', short: 'Paragon', province: 'Phnom Penh', khmerName: 'សាកលវិទ្យាល័យផារ៉ាហ្គន', category: 'University & College', badge: 'Private Univ' },
  { name: 'American University of Phnom Penh (AUPP)', short: 'AUPP', province: 'Phnom Penh', khmerName: 'សាកលវិទ្យាល័យអាមេរិកាំងភ្នំពេញ', category: 'University & College', badge: 'American Accredited' },
  { name: 'National University of Management (NUM)', short: 'NUM', province: 'Phnom Penh', khmerName: 'សាកលវិទ្យាល័យជាតិគ្រប់គ្រង', category: 'University & College', badge: 'Business / Tech' },
  { name: 'Norton University', short: 'Norton', province: 'Phnom Penh', khmerName: 'សាកលវិទ្យាល័យន័រតុន', category: 'University & College', badge: 'Private Univ' },
  { name: 'Pannasastra University of Cambodia (PUC)', short: 'PUC', province: 'Phnom Penh', khmerName: 'សាកលវិទ្យាល័យបញ្ញាសាស្ត្រ', category: 'University & College', badge: 'English Medium' },
  { name: 'Kirirom Institute of Technology (KIT)', short: 'KIT', province: 'Kampong Speu', khmerName: 'វិទ្យាស្ថានបច្ចេកវិទ្យាគិរីរម្យ', category: 'University & College', badge: 'Software / AI' },
  { name: 'University of Puthisastra (UP)', short: 'UP', province: 'Phnom Penh', khmerName: 'សាកលវិទ្យាល័យពុទ្ធិសាស្ត្រ', category: 'University & College', badge: 'Health / Tech' },
  { name: 'Build Bright University (BBU)', short: 'BBU', province: 'Phnom Penh / Provinces', khmerName: 'សាកលវិទ្យាល័យបៀលប្រាយ', category: 'University & College', badge: 'Multi-campus' },
  { name: 'National Polytechnic Institute of Cambodia (NPIC)', short: 'NPIC', province: 'Phnom Penh', khmerName: 'វិទ្យាស្ថានជាតិពហុបច្ចេកទេស', category: 'University & College', badge: 'Polytechnic' },

  // Tech Academies
  { name: 'Harvard Division of Continuing Education (CS50)', short: 'CS50', province: 'Cambridge, MA, USA', khmerName: 'វគ្គសិក្សាកុំព្យូទ័រហារវ៉ាដ', category: 'Tech Academy', badge: 'Harvard' },
  { name: 'Meta Professional Developer Academy', short: 'Meta', province: 'Online / Global', khmerName: 'វិទ្យាស្ថានមេតា', category: 'Tech Academy', badge: 'Meta' },
  { name: 'Google Cloud Certified Architecture', short: 'GCP', province: 'Online / Global', khmerName: 'ហ្គូហ្គលខ្លោដ', category: 'Tech Academy', badge: 'Google' },
  { name: 'AWS Certified Solutions Training', short: 'AWS', province: 'Online / Global', khmerName: 'អាម៉ាហ្សូនខ្លោដ', category: 'Tech Academy', badge: 'Amazon' },
  { name: 'FreeCodeCamp Full-Stack Academy', short: 'FCC', province: 'Online / Global', khmerName: 'សាលាកូដឥតគិតថ្លៃ', category: 'Tech Academy', badge: 'Open Source' },
]

const QUICK_INSTITUTION_PILLS = [
  'Sdao Santepheap Primary School, Battambang',
  'Sdao Santepheap High School, Battambang',
  'Preah Monivong High School, Battambang',
  'National University of Battambang (NUBB)',
  'Net Yang High School, Battambang',
  'Sotthearoth Primary School, Battambang',
  'Royal University of Phnom Penh (RUPP)',
  'CADT',
]

export function InstitutionPicker({
  value,
  onChange,
  placeholder = 'e.g. Preah Monivong High School or National University of Battambang',
  accentColor = 'blue',
}: InstitutionPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'primary' | 'high' | 'university' | 'tech'>('all')
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<'all' | 'Battambang' | 'Phnom Penh' | 'Siem Reap'>('all')

  const filtered = REAL_INSTITUTIONS.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      (inst.short && inst.short.toLowerCase().includes(search.toLowerCase())) ||
      (inst.khmerName && inst.khmerName.includes(search)) ||
      (inst.province && inst.province.toLowerCase().includes(search.toLowerCase()))

    // Filter by Province
    if (selectedProvinceFilter !== 'all') {
      if (!inst.province.toLowerCase().includes(selectedProvinceFilter.toLowerCase())) {
        return false
      }
    }

    // Filter by Level
    if (activeTab === 'primary') return matchesSearch && inst.category === 'Primary School'
    if (activeTab === 'high') return matchesSearch && inst.category === 'High School'
    if (activeTab === 'university') return matchesSearch && inst.category === 'University & College'
    if (activeTab === 'tech') return matchesSearch && inst.category === 'Tech Academy'
    return matchesSearch
  })

  const handleSelect = (name: string) => {
    onChange(name)
    setOpen(false)
    setSearch('')
  }

  const isBlue = accentColor === 'blue'
  const focusBorder = isBlue ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'
  const focusRing = isBlue ? 'focus:ring-blue-500/30' : 'focus:ring-amber-500/30'
  const iconColor = isBlue ? 'text-blue-400' : 'text-amber-400'
  const activeBg = isBlue
    ? 'bg-blue-600 text-white font-bold'
    : 'bg-amber-500 text-zinc-950 font-bold'

  return (
    <div className="space-y-1.5 font-sans">
      <div className="relative flex items-center">
        {/* Direct Text Input */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`bg-zinc-950/80 border-white/10 text-white placeholder:text-zinc-600 rounded-xl pr-10 h-10 text-xs ${focusBorder} focus:ring-1 ${focusRing} transition-all`}
        />

        {/* Popover Trigger */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`absolute right-1.5 p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:${iconColor} transition-colors`}
              title="Select real primary school, high school, or university"
            >
              <School className={`w-4 h-4 ${iconColor}`} />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={6}
            className="w-96 p-4 bg-zinc-950 border border-white/10 shadow-2xl rounded-2xl text-slate-100 z-50 backdrop-blur-xl space-y-3.5 max-w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <School className={`w-4 h-4 ${iconColor}`} />
                <span className="text-xs font-bold text-white tracking-wide">
                  School & University Selector
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[120px]">
                {value || 'Not set'}
              </span>
            </div>

            {/* Province Shortcut Bar: Battambang Priority */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px] font-mono">
              <span className="text-zinc-500 shrink-0 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-amber-400" /> Province:
              </span>
              <button
                type="button"
                onClick={() => setSelectedProvinceFilter('all')}
                className={`px-2 py-0.5 rounded-md border shrink-0 transition-all ${
                  selectedProvinceFilter === 'all'
                    ? 'bg-zinc-800 border-white/20 text-white font-semibold'
                    : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvinceFilter('Battambang')}
                className={`px-2.5 py-0.5 rounded-md border shrink-0 transition-all flex items-center gap-1 ${
                  selectedProvinceFilter === 'Battambang'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-sm'
                    : 'bg-zinc-900 border-white/5 text-amber-400/90 hover:text-amber-300'
                }`}
              >
                📍 Battambang (បាត់ដំបង)
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvinceFilter('Phnom Penh')}
                className={`px-2 py-0.5 rounded-md border shrink-0 transition-all ${
                  selectedProvinceFilter === 'Phnom Penh'
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 font-semibold'
                    : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Phnom Penh
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvinceFilter('Siem Reap')}
                className={`px-2 py-0.5 rounded-md border shrink-0 transition-all ${
                  selectedProvinceFilter === 'Siem Reap'
                    ? 'bg-zinc-800 border-white/20 text-white font-semibold'
                    : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Siem Reap
              </button>
            </div>

            {/* Level Filter Tabs: All, Primary, High School, University, Tech */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-white/5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'all' ? 'bg-zinc-800 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('primary')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'primary' ? 'bg-zinc-800 text-amber-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
                title="Primary Schools in Battambang & Cambodia"
              >
                🏫 Primary
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('high')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'high' ? 'bg-zinc-800 text-emerald-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
                title="High Schools (Bac II)"
              >
                🎓 High
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('university')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'university' ? 'bg-zinc-800 text-blue-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
                title="Universities & Higher Education"
              >
                🏛️ Univ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tech')}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  activeTab === 'tech' ? 'bg-zinc-800 text-purple-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
                title="Tech & Digital Academies"
              >
                💻 Tech
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Battambang schools, Monivong, NUBB, ភាសាខ្មែរ..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Categorized List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {['Primary School', 'High School', 'University & College', 'Tech Academy'].map(
                (category) => {
                  const items = filtered.filter((i) => i.category === category)
                  if (items.length === 0) return null

                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                          {category} ({items.length})
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {items.map((inst) => {
                          const isSelected = value.toLowerCase() === inst.name.toLowerCase()
                          return (
                            <button
                              key={inst.name}
                              type="button"
                              onClick={() => handleSelect(inst.name)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left group ${
                                isSelected
                                  ? `${activeBg} shadow-sm`
                                  : 'hover:bg-zinc-800/80 text-zinc-300 hover:text-white'
                              }`}
                            >
                              <div className="flex flex-col truncate pr-2">
                                <span className="truncate font-medium">{inst.name}</span>
                                {inst.khmerName && (
                                  <span className={`text-[10px] truncate ${isSelected ? 'text-zinc-950' : 'text-zinc-500'}`}>
                                    {inst.khmerName} • <span className="font-mono text-amber-400/80">{inst.province}</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                                {inst.badge && (
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                                    isSelected
                                      ? 'bg-white/20 border-white/30 text-white'
                                      : 'bg-white/5 border-white/10 text-zinc-400'
                                  }`}>
                                    {inst.badge}
                                  </span>
                                )}
                                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                }
              )}

              {filtered.length === 0 && (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No matching schools found for this filter. You can type any custom school name directly into the input!
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
                  Clear field
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Quick Select Popular University & Primary School Pills with Battambang items */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1">
          <School className="w-2.5 h-2.5 text-amber-400" /> Popular:
        </span>
        {QUICK_INSTITUTION_PILLS.map((pill) => {
          const isSelected = value.toLowerCase() === pill.toLowerCase()
          return (
            <button
              key={pill}
              type="button"
              onClick={() => onChange(pill)}
              className={`text-[10px] px-2 py-0.5 rounded-md border transition-all truncate max-w-[210px] ${
                isSelected
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 font-semibold'
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
