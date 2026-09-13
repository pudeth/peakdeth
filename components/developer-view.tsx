'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import {
  Code,
  Cpu,
  Globe,
  Smartphone,
  Sparkles,
  CreditCard,
  Layers,
  Search,
  X,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Zap,
  Lock,
  ExternalLink
} from 'lucide-react'
import { WebsitePreviewModal } from '@/components/website-preview-modal'
import { CardWebsitePreview } from '@/components/card-website-preview'
import { useLanguage } from '@/lib/i18n/language-context'
import type { ServiceItem } from '@/lib/services'
import Link from 'next/link'

interface DeveloperViewProps {
  services: ServiceItem[]
}

export function DeveloperView({ services: initialServices }: DeveloperViewProps) {
  const { t } = useLanguage()
  const [items] = useState<ServiceItem[]>(initialServices || [])
  const [activePreview, setActivePreview] = useState<{ url: string; title: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | 'pos' | 'topup' | 'web' | 'mobile'>('all')

  const getLocalizedService = (service: ServiceItem) => {
    const lower = (service.title || '').toLowerCase()
    if (lower.includes('pos')) {
      return {
        title: t.services.cards.posTitle,
        description: t.services.cards.posDesc,
        category: 'pos',
        accent: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
        glow: 'group-hover:border-cyan-500/40 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
        tags: t.services.cards.posTags,
      }
    }
    if (lower.includes('diamond') || lower.includes('top-up') || lower.includes('top up')) {
      return {
        title: t.services.cards.topupTitle,
        description: t.services.cards.topupDesc,
        category: 'topup',
        accent: 'text-purple-400',
        badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        glow: 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
        tags: t.services.cards.topupTags,
      }
    }
    if (lower.includes('web') || lower.includes('store') || lower.includes('site')) {
      return {
        title: t.services.cards.webTitle,
        description: t.services.cards.webDesc,
        category: 'web',
        accent: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        glow: 'group-hover:border-emerald-500/40 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
        tags: t.services.cards.webTags,
      }
    }
    return {
      title: t.services.cards.mobileTitle || service.title,
      description: t.services.cards.mobileDesc || service.description,
      category: 'mobile',
      accent: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      glow: 'group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      tags: t.services.cards.mobileTags,
    }
  }

  const renderServiceIcon = (service: ServiceItem, iconClass = 'w-4 h-4') => {
    const title = (service.title || '').toLowerCase()
    const icon = (service.icon || '').toLowerCase()

    if (title.includes('pos') || title.includes('billing') || icon === '💳' || icon === 'pos') {
      return <CreditCard className={`${iconClass} text-cyan-400`} />
    }
    if (title.includes('diamond') || title.includes('top-up') || title.includes('top up') || title.includes('game') || title.includes('mlbb') || icon === '💎' || icon === 'diamond') {
      return <Sparkles className={`${iconClass} text-purple-400`} />
    }
    if (title.includes('mobile') || title.includes('ios') || title.includes('android') || icon === '📱' || icon === 'mobile') {
      return <Smartphone className={`${iconClass} text-amber-400`} />
    }
    if (title.includes('web') || title.includes('site') || title.includes('store') || icon === '🌐' || icon === 'web') {
      return <Globe className={`${iconClass} text-emerald-400`} />
    }
    if (service.icon && service.icon !== '📸' && !service.icon.includes('camera') && service.icon !== 'default') {
      return <span className="text-xs select-none">{service.icon}</span>
    }
    return <Cpu className={`${iconClass} text-zinc-300`} />
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const loc = getLocalizedService(item)
      const matchesCategory = filterCategory === 'all' || loc.category === filterCategory
      const matchesSearch =
        searchTerm.trim() === '' ||
        loc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [items, filterCategory, searchTerm])

  const skillCapabilities = [
    {
      title: 'Full-Stack Web Architecture',
      badge: 'Next.js 15 • React 19 • TypeScript',
      desc: 'High-speed server rendered and client hydrated web apps with Turbopack, Tailwind CSS v4, and modern SEO architecture.',
      icon: Globe,
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'POS & Transaction Billing Systems',
      badge: 'Real-time Sync • Multi-Branch',
      desc: 'Point of sale platforms with automated inventory tracking, invoice generation, QR code payments, and analytics dashboards.',
      icon: CreditCard,
      accent: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Gaming & Automated Top-Up Gateways',
      badge: 'Instant Validation • API Automation',
      desc: 'Instant user account ID lookup, game currency balance verification, automated webhook notifications, and payment processing.',
      icon: Sparkles,
      accent: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Mobile App & Custom System Engineering',
      badge: 'iOS & Android • Cloud APIs',
      desc: 'Native-feel mobile apps, microservice cloud APIs, automated CI/CD deployment, and high-security role-based access control.',
      icon: Smartphone,
      accent: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-28 space-y-16">

        {/* Page Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400 backdrop-blur-md uppercase tracking-wider"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.services.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight uppercase"
            style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
          >
            {t.services.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto"
          >
            {t.services.subtitle}
          </motion.p>

          {/* Key Engineering Telemetry Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2.5 flex-wrap pt-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Interactive Demos
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300">
              <Terminal className="w-3 h-3 text-cyan-400" />
              Next.js 15 & Turbopack
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Enterprise POS & APIs
            </span>
          </motion.div>
        </section>

        {/* Search & Filter Controls */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search systems, frameworks, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 h-11 text-xs sm:text-sm rounded-xl border border-white/10 bg-zinc-900/90 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: `All (${items.length})` },
                { id: 'pos', label: 'POS & Billing' },
                { id: 'topup', label: 'Game Top-Up' },
                { id: 'web', label: 'Web Systems' },
                { id: 'mobile', label: 'Mobile & OS' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setFilterCategory(filter.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium font-mono transition-all duration-200 ${
                    filterCategory === filter.id
                      ? 'bg-emerald-500 text-black font-semibold shadow-md'
                      : 'bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Live Systems Showcase Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Interactive Software & Systems
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              Showing {filteredItems.length} of {items.length} {items.length === 1 ? 'system' : 'systems'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((service, index) => {
              const localized = getLocalizedService(service)

              return (
                <motion.div
                  key={service._id}
                  suppressHydrationWarning
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  onClick={() => {
                    if (service.link) {
                      setActivePreview({ url: service.link, title: localized.title })
                    }
                  }}
                  className={`group relative h-[470px] sm:h-[490px] rounded-2xl bg-zinc-950 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:border-white/20 transition-all duration-500 flex flex-col overflow-hidden ${localized.glow} ${service.link ? 'cursor-pointer' : ''}`}
                >
                  {/* Desktop Browser Window Header */}
                  <div className="px-3.5 py-2.5 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between shrink-0 select-none z-30">
                    {/* Traffic Lights */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 group-hover:bg-rose-500 transition-colors" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 group-hover:bg-amber-500 transition-colors" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-colors" />
                    </div>

                    {/* Center URL / System Badge Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-950/80 border border-white/10 text-[11px] font-mono text-zinc-400 max-w-[170px] truncate shadow-inner">
                      <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        {service.link
                          ? service.link.replace(/^https?:\/\//, '').replace(/\/$/, '')
                          : localized.title}
                      </span>
                    </div>

                    {/* Right Status & Number */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-[11px] font-black text-white/90 px-1.5 py-0.5 rounded bg-zinc-800 border border-white/15 group-hover:text-emerald-400 transition-colors">
                        {String(service.number).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Normal Window Viewport (Desktop Web View) */}
                  <div className="relative flex-1 w-full min-h-0 overflow-hidden bg-zinc-950">
                    {service.link ? (
                      <CardWebsitePreview
                        url={service.link}
                        title={localized.title}
                        onOpenPreview={() => setActivePreview({ url: service.link!, title: localized.title })}
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-950" />
                    )}

                    {/* Text & Actions Overlay - HIDDEN by default, SHOWS BACK on hover */}
                    <div className="absolute inset-0 z-40 bg-zinc-950/92 backdrop-blur-md p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                      {/* Content: Title, Description, Tags */}
                      <div className="my-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center">
                            {renderServiceIcon(service, 'w-4 h-4')}
                          </div>
                          <h3 suppressHydrationWarning className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {localized.title}
                          </h3>
                        </div>

                        <p suppressHydrationWarning className="text-zinc-300 text-xs leading-relaxed mb-4 line-clamp-4">
                          {localized.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {localized.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${localized.badgeBg}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Actions Bar */}
                      {service.link && (
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                          <span className="font-mono text-[11px] flex items-center gap-1.5 text-emerald-400 font-medium select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {t.services.liveSystemBadge}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActivePreview({ url: service.link!, title: localized.title })
                              }}
                              className="px-2.5 py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-[11px] font-semibold tracking-wide text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{t.services.previewBtn}</span>
                            </button>

                            <a
                              href={service.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 transition-colors"
                              title={t.services.openNewWindow}
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Normal Window Bottom Bar */}
                  <div className="px-3.5 py-2 bg-zinc-950/90 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0 select-none z-30 font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-zinc-300 font-medium truncate">{localized.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>{t.services.previewBtn}</span>
                    </span>
                  </div>
                </motion.div>
              )
            })}

            {/* 4th Companion Card if fewer than 4 services */}
            {filteredItems.length < 4 && filterCategory === 'all' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                className="group relative h-[470px] sm:h-[490px] rounded-2xl bg-zinc-950 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all duration-500 flex flex-col overflow-hidden"
              >
                {/* Desktop Window Titlebar */}
                <div className="px-3.5 py-2.5 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between shrink-0 select-none z-30">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 group-hover:bg-rose-500 transition-colors" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 group-hover:bg-amber-500 transition-colors" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-colors" />
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-950/80 border border-white/10 text-[11px] font-mono text-zinc-400 max-w-[170px] truncate shadow-inner">
                    <Cpu className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">cloud-node.console</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-mono text-[11px] font-black text-amber-400 px-1.5 py-0.5 rounded bg-zinc-800 border border-white/15 group-hover:text-amber-300 transition-colors">
                      04
                    </span>
                  </div>
                </div>

                {/* Desktop Console Viewport */}
                <div className="relative flex-1 w-full min-h-0 overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black select-none">
                  <div className="h-full p-4 flex flex-col justify-between">
                    {/* System telemetry bar */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pb-2 border-b border-white/5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        CLUSTER-NODE #04
                      </span>
                      <span className="text-zinc-500">LATENCY: 14ms</span>
                    </div>

                    {/* KPI Cards */}
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-zinc-900/90 border border-white/10 shadow-lg">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                          <span className="font-mono">Real-time Cloud Node</span>
                          <span className="text-amber-400 font-mono text-[10px]">+24.8%</span>
                        </div>
                        <div className="text-lg font-bold text-white font-mono">$128,490</div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
                          <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-[82%] rounded-full" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-white/5">
                          <span className="text-[10px] text-zinc-500 block font-mono">App Sync</span>
                          <span className="text-xs font-bold text-emerald-400 font-mono">99.9% Live</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-white/5">
                          <span className="text-[10px] text-zinc-500 block font-mono">Native Build</span>
                          <span className="text-xs font-bold text-amber-300 font-mono">Custom OS</span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Chart Bars */}
                    <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 flex items-end justify-between h-16 gap-1 px-2">
                      {[35, 60, 50, 75, 65, 90, 80].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-gradient-to-t from-amber-500/40 to-amber-400 rounded-t-sm"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[8px] font-mono text-zinc-600">D{i + 1}</span>
                        </div>
                      ))}
                    </div>

                    {/* Desktop console status bar */}
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                      <span className="text-amber-400 font-medium">NODE ONLINE</span>
                      <span className="text-emerald-400">UPTIME 99.98%</span>
                    </div>
                  </div>

                  {/* Text & Actions Overlay - HIDDEN by default, SHOWS BACK on hover */}
                  <div className="absolute inset-0 z-40 bg-zinc-950/92 backdrop-blur-md p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <div className="my-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-amber-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                          {t.services.cards.mobileTitle}
                        </h3>
                      </div>

                      <p className="text-zinc-300 text-xs leading-relaxed mb-4 line-clamp-4">
                        {t.services.cards.mobileDesc}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {t.services.cards.mobileTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md border bg-amber-500/10 text-amber-300 border-amber-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                      <span className="font-mono text-[11px] flex items-center gap-1.5 text-amber-400 font-medium select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {t.services.availableForBuild}
                      </span>

                      <Link
                        href="/contact"
                        className="px-2.5 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500 hover:text-black text-[11px] font-semibold tracking-wide text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{t.services.inquireBtn}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Window Bottom Status Bar */}
                <div className="px-3.5 py-2 bg-zinc-950/90 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0 select-none z-30 font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-zinc-300 font-medium truncate">{t.services.cards.mobileTitle}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-amber-400" />
                    <span>{t.services.availableForBuild}</span>
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Core Developer Skills & Architecture Breakdown */}
        <section className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              Core Engineering Competencies
            </h2>
            <p className="text-sm text-zinc-400">
              Battle-tested full-stack methodologies applied across commercial applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {skillCapabilities.map((skill, index) => {
              const Icon = skill.icon
              return (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-lg"
                >
                  <div className="space-y-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${skill.bg}`}>
                      <Icon className={`w-5 h-5 ${skill.accent}`} />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-zinc-400 block mb-1">
                        {skill.badge}
                      </span>
                      <h3 className="text-base font-bold text-white mb-2">
                        {skill.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Interactive Website Interface Preview Modal */}
      {activePreview && (
        <WebsitePreviewModal
          isOpen={!!activePreview}
          onClose={() => setActivePreview(null)}
          url={activePreview.url}
          title={activePreview.title}
        />
      )}
    </div>
  )
}
