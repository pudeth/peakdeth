'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Eye, CreditCard, Sparkles, Globe, Smartphone, Cpu, Lock } from 'lucide-react'
import { WebsitePreviewModal } from '@/components/website-preview-modal'
import { CardWebsitePreview } from '@/components/card-website-preview'
import { useLanguage } from '@/lib/i18n/language-context'

export interface ServiceItem {
  _id: string
  number: number
  title: string
  description: string
  icon?: string
  link?: string | null
}

export function Services({ services: initialServices }: { services: ServiceItem[] }) {
  const { t } = useLanguage()
  const [items, setItems] = useState<ServiceItem[]>(initialServices || [])
  const [activePreview, setActivePreview] = useState<{ url: string; title: string } | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const syncFromCache = () => {
      try {
        const cached = localStorage.getItem('site_services_cache')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Check for stale cache that had duplicate weppage-1 links or old Management System title
            const links = parsed.map((s: any) => s?.link).filter(Boolean)
            const weppageCount = links.filter((l: string) => typeof l === 'string' && l.includes('weppage-1.onrender.com')).length
            const isStale = weppageCount > 1 || parsed.some((s: any) => s?.title === 'Management System' || s?.link === 'https://weppage-1.onrender.com/')

            if (isStale) {
              localStorage.removeItem('site_services_cache')
              return
            }

            const isOldService = (title?: string) =>
              !title || /photography|videography|retouching|portrait|wedding|event|commercial & editorial/i.test(title)

            const validServices = parsed.filter((s: any) => s.is_active !== false && !isOldService(s.title) && s.show_on_homepage !== false)
            if (validServices.length > 0) {
              setItems(
                validServices.map((s: any) => ({
                  _id: s.id || s._id,
                  number: s.number,
                  title: s.title,
                  description: s.description,
                  icon: s.icon,
                  link: s.link,
                }))
              )
            }
          }
        }
      } catch {}
    }

    syncFromCache()
    window.addEventListener('storage', syncFromCache)
    window.addEventListener('focus', syncFromCache)
    return () => {
      window.removeEventListener('storage', syncFromCache)
      window.removeEventListener('focus', syncFromCache)
    }
  }, [])

  if (!items || items.length === 0) return null

  const getLocalizedService = (service: ServiceItem) => {
    const lower = (service.title || '').toLowerCase()
    if (lower.includes('pos') || lower.includes('billing')) {
      return {
        title: t.services.cards.posTitle,
        description: t.services.cards.posDesc,
        accent: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
        glow: 'group-hover:border-cyan-500/40 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]',
        tags: t.services.cards.posTags,
      }
    }
    if (lower.includes('diamond') || lower.includes('top-up') || lower.includes('top up') || lower.includes('mlbb') || lower.includes('game')) {
      return {
        title: t.services.cards.topupTitle,
        description: t.services.cards.topupDesc,
        accent: 'text-purple-400',
        badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        glow: 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]',
        tags: t.services.cards.topupTags,
      }
    }
    // Check mobile BEFORE web/app so "Mobile App" never matches "app" inside web
    if (lower.includes('mobile') || lower.includes('ios') || lower.includes('android')) {
      return {
        title: t.services.cards.mobileTitle,
        description: t.services.cards.mobileDesc,
        accent: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        glow: 'group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]',
        tags: t.services.cards.mobileTags,
      }
    }
    if (lower.includes('web') || lower.includes('store') || lower.includes('phone') || lower.includes('app') || lower.includes('site')) {
      return {
        title: t.services.cards.webTitle,
        description: t.services.cards.webDesc,
        accent: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        glow: 'group-hover:border-emerald-500/40 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.12)]',
        tags: t.services.cards.webTags,
      }
    }
    // Position-based intelligent fallback
    if (service.number === 2) {
      return {
        title: t.services.cards.topupTitle,
        description: t.services.cards.topupDesc,
        accent: 'text-purple-400',
        badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        glow: 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]',
        tags: t.services.cards.topupTags,
      }
    }
    if (service.number === 4) {
      return {
        title: t.services.cards.mobileTitle,
        description: t.services.cards.mobileDesc,
        accent: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        glow: 'group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]',
        tags: t.services.cards.mobileTags,
      }
    }
    return {
      title: service.title,
      description: service.description,
      accent: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      glow: 'group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]',
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

  return (
    <>
      <section id="services" suppressHydrationWarning className="bg-zinc-950/60 border border-white/[0.08] rounded-3xl p-6 sm:p-10 hover:border-white/[0.14] transition-all duration-500 relative flex flex-col h-full scroll-mt-24 shadow-2xl backdrop-blur-xl">
        <div id="developer" className="absolute -top-24 pointer-events-none" />
        <div id="coding" className="absolute -top-24 pointer-events-none" />
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.services.badge}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase mb-2">
              {t.services.title}
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              {t.services.subtitle}
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline-flex items-center gap-2 bg-emerald-500/10 px-3.5 py-2 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.services.interactiveTag}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.slice(0, 4).map((service, index) => {
            const localized = getLocalizedService(service)

            return (
              <motion.div
                key={service._id}
                suppressHydrationWarning
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => {
                  if (service.link) {
                    setActivePreview({ url: service.link, title: localized.title })
                  }
                }}
                className={`group relative h-auto min-h-[290px] sm:h-[490px] rounded-2xl bg-zinc-950 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:border-white/20 transition-all duration-500 flex flex-col overflow-hidden ${localized.glow} ${service.link ? 'cursor-pointer' : ''}`}
              >
                {/* Desktop & Mobile Browser Window Header */}
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

                {/* MOBILE VIEW (< sm): Clean, Instant, Zero Janky Background Iframes */}
                <div className="flex sm:hidden flex-col justify-between p-5 flex-1 min-h-0 bg-zinc-950">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center shrink-0">
                        {renderServiceIcon(service, 'w-4 h-4')}
                      </div>
                      <h3 suppressHydrationWarning className="text-base font-bold text-white truncate">
                        {localized.title}
                      </h3>
                    </div>

                    <p suppressHydrationWarning className="text-zinc-300 text-xs leading-relaxed mb-4 line-clamp-4">
                      {localized.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
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

                  {/* Mobile Actions Bar */}
                  {service.link ? (
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActivePreview({ url: service.link!, title: localized.title })
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-xs font-semibold text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.services.previewBtn}</span>
                      </button>

                      <a
                        href={service.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                        title={t.services.openNewWindow}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                      <span className="font-mono text-[11px] flex items-center gap-1.5 text-amber-400 font-medium select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {t.services.availableForBuild}
                      </span>

                      <a
                        href="/contact"
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-black text-xs font-semibold text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <span>{t.services.inquireBtn}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* DESKTOP VIEW (>= sm): Normal Window Viewport with Scaled Web View */}
                <div className="hidden sm:flex relative flex-1 w-full min-h-0 overflow-hidden bg-zinc-950">
                  {service.link ? (
                    <CardWebsitePreview
                      url={service.link}
                      title={localized.title}
                      onOpenPreview={() => setActivePreview({ url: service.link!, title: localized.title })}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black select-none">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pb-2 border-b border-white/5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          NODE #{String(service.number).padStart(2, '0')}
                        </span>
                        <span className="text-zinc-500">LATENCY: 12ms</span>
                      </div>
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
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                        <span className="text-amber-400 font-medium">NODE ONLINE</span>
                        <span className="text-emerald-400">UPTIME 99.98%</span>
                      </div>
                    </div>
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
                    {service.link ? (
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
                    ) : (
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                        <span className="font-mono text-[11px] flex items-center gap-1.5 text-amber-400 font-medium select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {t.services.availableForBuild}
                        </span>

                        <a
                          href="/contact"
                          className="px-2.5 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500 hover:text-black text-[11px] font-semibold tracking-wide text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span>{t.services.inquireBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Normal Window Bottom Bar (Desktop) */}
                <div className="hidden sm:flex px-3.5 py-2 bg-zinc-950/90 border-t border-white/10 items-center justify-between text-[11px] text-zinc-400 shrink-0 select-none z-30 font-mono">
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

          {/* 4th Column Companion Card when fewer than 4 services exist */}
          {items.length < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: items.length * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-auto min-h-[290px] sm:h-[490px] rounded-2xl bg-zinc-950 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* Desktop & Mobile Window Titlebar */}
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

              {/* MOBILE VIEW (< sm): Clean Companion Card */}
              <div className="flex sm:hidden flex-col justify-between p-5 flex-1 min-h-0 bg-zinc-950">
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="text-base font-bold text-white truncate">
                      {t.services.cards.mobileTitle}
                    </h3>
                  </div>

                  <p className="text-zinc-300 text-xs leading-relaxed mb-4 line-clamp-4">
                    {t.services.cards.mobileDesc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
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

                {/* Mobile Companion Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-mono text-[11px] flex items-center gap-1.5 text-amber-400 font-medium select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {t.services.availableForBuild}
                  </span>

                  <a
                    href="/contact"
                    className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-black text-xs font-semibold text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>{t.services.inquireBtn}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* DESKTOP VIEW (>= sm): Console Viewport + Hover Overlay */}
              <div className="hidden sm:flex relative flex-1 w-full min-h-0 overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black select-none flex-col">
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

                    <a
                      href="/contact"
                      className="px-2.5 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500 hover:text-black text-[11px] font-semibold tracking-wide text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>{t.services.inquireBtn}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Window Bottom Status Bar (Desktop) */}
              <div className="hidden sm:flex px-3.5 py-2 bg-zinc-950/90 border-t border-white/10 items-center justify-between text-[11px] text-zinc-400 shrink-0 select-none z-30 font-mono">
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


      {/* Interactive Website Interface Preview Modal */}
      {activePreview && (
        <WebsitePreviewModal
          isOpen={!!activePreview}
          onClose={() => setActivePreview(null)}
          url={activePreview.url}
          title={activePreview.title}
        />
      )}
    </>
  )
}


