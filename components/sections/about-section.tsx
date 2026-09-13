'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Sparkles, Code2, Camera, CheckCircle2, User, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import type { AboutContentData } from '@/lib/site-content'

interface AboutSectionProps {
  about?: AboutContentData | null
}

export function AboutSection({ about }: AboutSectionProps) {
  const { language, t } = useLanguage()
  const isKhmer = language === 'km'

  const displayName = about?.name || 'Peak Deth'
  const displayTitle = about?.title || (isKhmer ? 'ស្ថាបត្យកម្មប្រព័ន្ធ & ការរចនារូបភាពបែបភាពយន្ត' : 'Full-Stack Programming & Cinematic Photography Design')
  const displayTagline = about?.tagline || (isKhmer ? t.aboutPage.tagline : 'Full-Stack Programming & Cinematic Photography Design')
  const displayBio = about?.bio || (isKhmer ? t.aboutPage.bio : 'A multidisciplinary Full-Stack Developer and Visual Artist bridging high-performance software engineering with cinematic photography and design. Dedicated to architecting robust enterprise systems, bespoke POS solutions, and modern mobile & web apps, while capturing evocative visual narratives and crafting refined aesthetic designs.')

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl p-6 sm:p-10 lg:p-12 shadow-2xl">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Profile / Portrait Visual */}
        <div className="lg:col-span-4 flex flex-col items-center sm:items-start lg:items-center">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-700" />

            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden border border-white/20 bg-zinc-900 shadow-2xl flex items-center justify-center">
              {about?.profile_image_url ? (
                <Image
                  src={about.profile_image_url}
                  alt={displayName}
                  fill
                  sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-zinc-800 to-zinc-950">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-emerald-400" />
                  </div>
                  <span className="text-white font-bold text-lg">{displayName}</span>
                  <span className="text-zinc-400 text-xs mt-1">Full-Stack & Visual Artist</span>
                </div>
              )}

              {/* Live Status Badge */}
              <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isKhmer ? 'អាចទទួលគម្រោងថ្មី' : 'Available for Work'}
                </span>
                <span className="text-zinc-400 font-mono text-[10px]">Phnom Penh</span>
              </div>
            </div>
          </div>

          {/* Quick Dual Tag */}
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
              <Code2 className="w-3 h-3" /> Full-Stack
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <Camera className="w-3 h-3" /> Photography
            </span>
          </div>
        </div>

        {/* Right: Narrative & Biography */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-semibold text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isKhmer ? 'អំពីអ្នកអភិវឌ្ឍន៍ & សិល្បកររូបភាព' : 'About the Engineer & Photographer'}</span>
            </div>

            {/* Title / Name */}
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug ${isKhmer ? 'font-khmer' : ''}`}>
              {displayTitle}
            </h2>

            {/* Tagline */}
            <p className={`text-base sm:text-lg text-emerald-400/90 font-medium italic ${isKhmer ? 'font-khmer' : ''}`}>
              &ldquo;{displayTagline}&rdquo;
            </p>
          </div>

          {/* Bio text */}
          <div className={`text-sm sm:text-base text-zinc-300/90 leading-relaxed space-y-3 ${isKhmer ? 'font-khmer' : ''}`}>
            <p>{displayBio}</p>
          </div>

          {/* Key Competencies Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-white/5">
              <div className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>POS & Systems</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Enterprise billing & analytics</p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-white/5">
              <div className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Web & Mobile</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Next.js & React Native</p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-white/5 col-span-2 sm:col-span-1">
              <div className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cinematics</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">High-end visual storytelling</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3.5 flex-wrap">
            <Link
              href="/about"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition duration-200 shadow-lg ${isKhmer ? 'font-khmer font-bold' : ''}`}
            >
              <span>{isKhmer ? 'មើលប្រវត្តិរូបពេញលេញ' : 'Read Full Story & Credentials'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-semibold text-sm transition duration-200 ${isKhmer ? 'font-khmer font-bold' : ''}`}
            >
              <span>{isKhmer ? 'ទំនាក់ទំនង' : 'Get in Touch'}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
