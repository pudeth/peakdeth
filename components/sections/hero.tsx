'use client'

import { motion } from 'motion/react'
import { DefenseNameDisplay } from '@/components/defense-name-display'
import { ArrowDown, ArrowUpRight, Camera, Cpu, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'

interface HeroData {
  _id: string
  title?: string
  subtitle?: string
  backgroundImage?: { asset: { _ref: string }; alt?: string }
  overlayOpacity?: number
}

export function Hero({ data }: { data: HeroData | null }) {
  const { t, language } = useLanguage()
  const targetTitle =
    !data?.title || data.title === 'RITHY CHANVIRAK' || data.title === 'PEAK DETH'
      ? t.header.brandName
      : data.title
  const rawSubtitle = data?.subtitle || ''
  
  // Display localized subtitle when language is not English, or if rawSubtitle is the default
  const subtitle =
    language !== 'en'
      ? t.hero.subtitle
      : rawSubtitle && !/capturing moments/i.test(rawSubtitle)
      ? rawSubtitle
      : t.hero.subtitle

  const bgImage = data?.backgroundImage?.asset?._ref

  const scrollToContent = () => {
    const mainElem =
      document.getElementById('services-section') ||
      document.getElementById('services') ||
      document.getElementById('portfolio-section')
    if (mainElem) {
      mainElem.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({
        top: window.innerHeight - 60,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section
      suppressHydrationWarning
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303] select-none pt-16 sm:pt-24 pb-24 sm:pb-10 px-3.5 sm:px-6 lg:px-8"
    >
      {/* 1. Background Cinematic Photo with Atmospheric Slow Breath */}
      <div className="absolute inset-0 select-none overflow-hidden pointer-events-none">
        {bgImage ? (
          <motion.div
            animate={{ scale: [1.02, 1.05, 1.02] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImage})`,
              imageRendering: 'auto'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
        )}
      </div>

      {/* 2. Background Scrims & Ambient Lighting Mesh */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: data?.overlayOpacity ?? 0.6 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#030303] pointer-events-none" />
      
      {/* Ambient Radial Mesh Glows */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[380px] bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 blur-[45px] sm:blur-[140px] rounded-full z-0 transform-gpu" />

      {/* 3. Luxury Viewfinder Console Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl w-full mx-auto p-4 sm:p-10 md:p-12 rounded-3xl border border-white/[0.1] bg-zinc-950/60 backdrop-blur-md sm:backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] transition-all duration-500 hover:border-white/[0.18]"
      >
        {/* Subtle Optical Corner Reticles */}
        <span className="absolute top-3 left-3 text-white/30 text-xs font-mono select-none pointer-events-none">＋</span>
        <span className="absolute top-3 right-3 text-white/30 text-xs font-mono select-none pointer-events-none">＋</span>
        <span className="absolute bottom-3 left-3 text-white/30 text-xs font-mono select-none pointer-events-none">＋</span>
        <span className="absolute bottom-3 right-3 text-white/30 text-xs font-mono select-none pointer-events-none">＋</span>

        {/* Console Header: Status & Location */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs font-mono tracking-wider uppercase mb-3 sm:mb-8 border-b border-white/[0.08] pb-2.5 sm:pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-300 text-[10px] sm:text-xs">
              {t.hero.availableBadge}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span>{t.hero.location}</span>
          </div>
        </div>

        {/* Viewfinder Center Content */}
        <div className="text-center space-y-3.5 sm:space-y-6">
          {/* Main Title Reveal */}
          <div className="py-2 flex items-center justify-center">
            <DefenseNameDisplay name={targetTitle} />
          </div>

          {/* Dual Craft Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-mono"
          >
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.hero.craftDev}</span>
            </span>
            <span className="text-zinc-600 hidden xs:inline">•</span>
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.hero.craftPhoto}</span>
            </span>
          </motion.div>

          {/* Clean Editorial Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-zinc-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed drop-shadow"
            style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
          >
            {subtitle}
          </motion.p>

          {/* Responsive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-row items-center justify-center gap-2.5 sm:gap-3 pt-3"
          >
            {/* Primary CTA */}
            <button
              onClick={scrollToContent}
              type="button"
              title={t.hero.ctaSystems}
              aria-label={t.hero.ctaSystems}
              className="w-11 h-11 sm:w-auto sm:h-auto sm:px-6 sm:py-3 rounded-xl bg-white text-zinc-950 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)]"
            >
              <span className="hidden sm:inline">{t.hero.ctaSystems}</span>
              <ArrowDown className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-zinc-950 sm:text-zinc-600" />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => {
                const el = document.getElementById('portfolio-section') || document.getElementById('services-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              type="button"
              title={t.hero.ctaVisual}
              aria-label={t.hero.ctaVisual}
              className="w-11 h-11 sm:w-auto sm:h-auto sm:px-6 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm tracking-wide border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Camera className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="hidden sm:inline">{t.hero.ctaVisual}</span>
            </button>

            {/* Tertiary CTA */}
            <Link
              href="/contact"
              title={t.hero.ctaContact}
              aria-label={t.hero.ctaContact}
              className="w-11 h-11 sm:w-auto sm:h-auto sm:px-6 sm:py-3 rounded-xl bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm tracking-wide border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="hidden sm:inline">{t.hero.ctaContact}</span>
              <ArrowUpRight className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-white" />
            </Link>
          </motion.div>
        </div>

        {/* Viewfinder Telemetry Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono tracking-wider text-zinc-400 mt-4 sm:mt-8 pt-2.5 sm:pt-4 border-t border-white/[0.08] gap-2 sm:gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-zinc-500">{t.hero.telemetryEng}</span>
            <span className="text-zinc-200">{t.hero.telemetryEngItems}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.hero.telemetryStatus}</span>
          </div>
        </div>
      </motion.div>

      {/* 4. Continuous Connecting Line Flowing Down Into Body */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 hidden md:flex flex-col items-center cursor-pointer group mt-4 pb-2"
        onClick={scrollToContent}
      >
        <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase group-hover:text-emerald-400 transition-colors mb-2">
          {t.hero.scrollExplore}
        </span>
        
        {/* Animated Connecting Line with Pulsing Light Beam */}
        <div className="w-px h-12 sm:h-14 bg-gradient-to-b from-white/30 via-white/15 to-transparent relative overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}
