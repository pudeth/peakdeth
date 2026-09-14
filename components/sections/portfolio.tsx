'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ImageIcon,
  FolderOpen,
  Camera,
  Film,
  Aperture,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react'
import { CollectionCardSkeletonPortfolio } from '@/components/collection-card-skeleton'
import { getBlurPlaceholderDataUrl, getThumbnailFromSource } from '@/lib/cloudinary'
import type { CollectionWithStats } from '@/lib/collections'
import { useLanguage } from '@/lib/i18n/language-context'

export function Portfolio({
  collections: rawCollections,
  loading = false,
  showTitle = true,
}: {
  collections: CollectionWithStats[]
  loading?: boolean
  showTitle?: boolean
}) {
  const { t } = useLanguage()

  const photoSkills = [
    {
      title: t.portfolio.skills.portraitTitle,
      badge: t.portfolio.skills.portraitBadge,
      desc: t.portfolio.skills.portraitDesc,
      icon: Camera,
      accent: 'text-emerald-400',
      border: 'hover:border-emerald-500/30',
    },
    {
      title: t.portfolio.skills.eventTitle,
      badge: t.portfolio.skills.eventBadge,
      desc: t.portfolio.skills.eventDesc,
      icon: Aperture,
      accent: 'text-cyan-400',
      border: 'hover:border-cyan-500/30',
    },
    {
      title: t.portfolio.skills.cinemaTitle,
      badge: t.portfolio.skills.cinemaBadge,
      desc: t.portfolio.skills.cinemaDesc,
      icon: Film,
      accent: 'text-purple-400',
      border: 'hover:border-purple-500/30',
    },
    {
      title: t.portfolio.skills.colorTitle,
      badge: t.portfolio.skills.colorBadge,
      desc: t.portfolio.skills.colorDesc,
      icon: Sparkles,
      accent: 'text-amber-400',
      border: 'hover:border-amber-500/30',
    },
  ]

  // Strictly display only Main Categories (root collections where parent_id is not set)
  const collections = (rawCollections || []).filter((c) => !c.parent_id)

  if (!loading && (!collections || collections.length === 0)) return null

  return (
    <section className="bg-zinc-950/60 border border-white/[0.08] rounded-3xl p-6 sm:p-10 hover:border-white/[0.14] transition-all duration-500 shadow-2xl backdrop-blur-xl relative flex flex-col h-full">
      {/* Section Title - conditionally shown */}
      {showTitle && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.portfolio.badge}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase mb-2">
              {t.portfolio.title}
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              {t.portfolio.subtitle}
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-xs sm:text-sm font-mono text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 shrink-0 group px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20"
          >
            <span>{t.portfolio.exploreBtn}</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* Photography & Cameraman Skills Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {photoSkills.map((skill, index) => {
          const Icon = skill.icon
          return (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.06] ${skill.border} transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/10 ${skill.accent} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-zinc-200 transition-colors">
                  {skill.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">
                  {skill.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.05]">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                  {skill.badge}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Camera Gear & Telemetry Strip */}
      <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.portfolio.telemetry.bodyLabel} <strong className="text-zinc-200">{t.portfolio.telemetry.bodyValue}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Aperture className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.portfolio.telemetry.lensLabel} <strong className="text-zinc-200">{t.portfolio.telemetry.lensValue}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>{t.portfolio.telemetry.workflowLabel} <strong className="text-zinc-200">{t.portfolio.telemetry.workflowValue}</strong></span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3]">
              <CollectionCardSkeletonPortfolio />
            </div>
          ))
        ) : (
          collections.slice(0, 9).map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/20 hover:shadow-2xl transition-all duration-500 aspect-[4/3]"
          >
            {/* Force cache bust */}
            <Link href={`/collection/${collection.slug}`} className="block h-full">
              <div className="h-full relative overflow-hidden rounded-2xl">
                {/* Image Collage or Fallback */}
                {(() => {
                  const previewImages =
                    collection.previewPhotos && collection.previewPhotos.length > 0
                      ? collection.previewPhotos
                      : collection.cover_image_url
                      ? [collection.cover_image_url]
                      : []
                  
                  if (previewImages.length > 0) {
                    return previewImages.slice(0, 3).reverse().map((url: string, i: number, arr: string[]) => {
                      const offset = arr.length - 1 - i
                      
                      let transformClass = 'z-30 group-hover:scale-105'
                      if (offset === 1) transformClass = 'z-20 scale-[0.92] -translate-y-3 opacity-80 shadow-lg'
                      if (offset === 2) transformClass = 'z-10 scale-[0.84] -translate-y-6 opacity-60 shadow-xl'
                      
                      return (
                        <Image
                          key={`${url}-${i}`}
                          src={getThumbnailFromSource(url, 1200)}
                          alt={collection.title}
                          fill
                          unoptimized={url?.startsWith('http')}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className={`object-cover absolute inset-0 transition-transform duration-700 ease-out ${transformClass}`}
                          placeholder="blur"
                          blurDataURL={getBlurPlaceholderDataUrl(64, 48)}
                        />
                      )
                    })
                  }

                  return (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-black text-zinc-400 gap-2.5 border border-white/5">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-emerald-500/30 transition-all duration-300">
                        <FolderOpen className="w-7 h-7 stroke-[1.5] text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">Empty Album</span>
                    </div>
                  )
                })()}

                {/* Base Scrim Gradient (always slightly visible for contrast) & Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:opacity-60 sm:group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none" />

                {/* Content */}
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end translate-y-1 sm:translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-40 pointer-events-none">
                  <h3
                    className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg"
                    style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
                  >
                    {collection.title}
                  </h3>

                  {/* Stats Badges */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 shadow-sm">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] font-mono font-medium text-white">{collection.totalPhotos} {t.portfolio.photosCount}</span>
                    </div>
                    {collection.subAlbums > 0 && (
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 shadow-sm">
                        <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] font-mono font-medium text-white">{collection.subAlbums} {t.portfolio.albumsCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Corner Action Arrow */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border border-white/15 z-40">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))
        )}

        {/* Companion Card 1 to fill empty space when collections < 3 */}
        {!loading && collections && collections.length > 0 && collections.length < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: collections.length * 0.1 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/60 via-zinc-950 to-black border border-dashed border-white/15 hover:border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between aspect-[4/3] transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold block mb-1">
                {t.portfolio.companionBook.tag}
              </span>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                {t.portfolio.companionBook.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {t.portfolio.companionBook.desc}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors pt-4 border-t border-white/10"
            >
              <span>{t.portfolio.companionBook.btn}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        )}

        {/* Companion Card 2: Visual Archive Explorer when only 1 main category exists */}
        {!loading && collections && collections.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/60 via-zinc-950 to-black border border-dashed border-white/15 hover:border-cyan-500/40 p-6 sm:p-8 flex flex-col justify-between aspect-[4/3] transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <FolderOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold block mb-1">
                {t.portfolio.companionArchive.tag}
              </span>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                {t.portfolio.companionArchive.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {t.portfolio.companionArchive.desc}
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors pt-4 border-t border-white/10"
            >
              <span>{t.portfolio.companionArchive.btn}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>

  )
}
