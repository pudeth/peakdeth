'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Search,
  Image as ImageIcon,
  FolderOpen,
  ArrowUpRight,
  X,
  Layers,
  Star,
  Eye,
  Sparkles,
  Grid,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FullscreenPhotoPreview } from '@/components/fullscreen-photo-preview'
import { getBlurPlaceholderDataUrl, getThumbnailFromSource } from '@/lib/cloudinary'
import { useLanguage } from '@/lib/i18n/language-context'
import type { CollectionWithStats, GalleryPhoto } from '@/lib/collections'

interface GalleryViewProps {
  collections: CollectionWithStats[]
  photos?: GalleryPhoto[]
  totalPhotosCount: number
}

export function GalleryView({
  collections,
  photos = [],
  totalPhotosCount,
}: GalleryViewProps) {
  const { t, language } = useLanguage()
  const isKhmer = language === 'km'

  // View mode tab: 'albums' | 'photos'
  const [activeTab, setActiveTab] = useState<'albums' | 'photos'>('albums')

  // Album filtering states
  const [albumSearchTerm, setAlbumSearchTerm] = useState('')
  const [albumFilterType, setAlbumFilterType] = useState<'all' | 'main' | 'sub' | 'featured'>('all')

  // Photo filtering states
  const [photoSearchTerm, setPhotoSearchTerm] = useState('')
  const [photoAlbumFilter, setPhotoAlbumFilter] = useState<string>('all')
  const [photoSortBy, setPhotoSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')
  const [photoRenderCount, setPhotoRenderCount] = useState(48)

  // Lightbox preview states
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Stats counts
  const featuredCount = useMemo(() => collections.filter((c) => c.featured).length, [collections])
  const mainCount = useMemo(() => collections.filter((c) => !c.parent_id).length, [collections])
  const subCount = useMemo(() => collections.filter((c) => !!c.parent_id).length, [collections])

  // Filtered collections
  const filteredCollections = useMemo(() => {
    let list = [...collections]

    if (albumFilterType === 'featured') {
      list = list.filter((c) => c.featured)
    } else if (albumFilterType === 'main') {
      list = list.filter((c) => !c.parent_id)
    } else if (albumFilterType === 'sub') {
      list = list.filter((c) => !!c.parent_id)
    }

    if (albumSearchTerm.trim()) {
      const searchLower = albumSearchTerm.toLowerCase().trim()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description?.toLowerCase().includes(searchLower) ||
          c.parentTitle?.toLowerCase().includes(searchLower)
      )
    }

    return list
  }, [collections, albumSearchTerm, albumFilterType])

  // Filtered and sorted photos
  const filteredPhotos = useMemo(() => {
    let list = [...photos]

    if (photoAlbumFilter !== 'all') {
      list = list.filter((p) => p.collection_id === photoAlbumFilter)
    }

    if (photoSearchTerm.trim()) {
      const searchLower = photoSearchTerm.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.collection_title?.toLowerCase().includes(searchLower) ||
          p.location?.toLowerCase().includes(searchLower)
      )
    }

    list.sort((a, b) => {
      if (photoSortBy === 'name') {
        return (a.title || '').localeCompare(b.title || '')
      }
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
      return photoSortBy === 'newest' ? timeB - timeA : timeA - timeB
    })

    return list
  }, [photos, photoAlbumFilter, photoSearchTerm, photoSortBy])

  const visiblePhotos = useMemo(
    () => filteredPhotos.slice(0, photoRenderCount),
    [filteredPhotos, photoRenderCount]
  )

  // Prepare photos list for FullscreenPhotoPreview
  const previewPhotosList = useMemo(() => {
    return filteredPhotos.map((p) => ({
      _id: p.id,
      title: p.title || '',
      imageUrl: p.image_url,
      imageId: p.image_id || '',
      alt: p.alt || p.title || 'Photo',
      slug: { current: p.id },
      camera: p.camera,
      lens: p.lens,
      settings: p.settings,
      location: p.location,
      captureDate: p.date_taken,
    }))
  }, [filteredPhotos])

  const handleOpenPhoto = (index: number) => {
    setCurrentPhotoIndex(index)
    setFullscreenOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-28 space-y-10">

        {/* Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-semibold text-zinc-300 backdrop-blur-md ${isKhmer ? 'font-khmer' : ''}`}>
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.galleryPage.badge}</span>
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight ${isKhmer ? 'font-khmer font-bold' : ''}`}
            style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
          >
            {t.galleryPage.title}
          </h1>

          <p className={`text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto ${isKhmer ? 'font-khmer' : ''}`}>
            {t.galleryPage.subtitleTemplate
              .replace('{collections}', String(collections.length))
              .replace('{photos}', String(totalPhotosCount))}
          </p>

          {/* Primary View Switcher Tabs (Albums vs All Photos) */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setActiveTab('albums')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isKhmer ? 'font-khmer' : ''
                } ${
                  activeTab === 'albums'
                    ? 'bg-white text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FolderOpen className="w-4 h-4 text-emerald-500" />
                <span>{t.galleryPage.tabAlbums}</span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${
                  activeTab === 'albums' ? 'bg-zinc-200 text-zinc-900 font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {collections.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isKhmer ? 'font-khmer' : ''
                } ${
                  activeTab === 'photos'
                    ? 'bg-white text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4 text-cyan-400" />
                <span>{t.galleryPage.tabPhotos}</span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${
                  activeTab === 'photos' ? 'bg-zinc-200 text-zinc-900 font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {totalPhotosCount}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* TAB 1: ALBUMS VIEW */}
        {activeTab === 'albums' && (
          <div className="space-y-10">
            {/* Search & Category Filter Bar */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5 backdrop-blur-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    placeholder={t.galleryPage.searchPlaceholder}
                    value={albumSearchTerm}
                    onChange={(e) => setAlbumSearchTerm(e.target.value)}
                    className={`pl-10 pr-9 h-11 text-xs sm:text-sm rounded-2xl border-zinc-800 bg-zinc-900/90 text-white placeholder:text-zinc-500 focus:border-zinc-600 ${isKhmer ? 'font-khmer' : ''}`}
                  />
                  {albumSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setAlbumSearchTerm('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setAlbumFilterType('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${isKhmer ? 'font-khmer' : ''} ${
                      albumFilterType === 'all'
                        ? 'bg-white text-black shadow-md font-bold'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t.galleryPage.filterAll} ({collections.length})
                  </button>

                  {mainCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAlbumFilterType('main')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${isKhmer ? 'font-khmer' : ''} ${
                        albumFilterType === 'main'
                          ? 'bg-white text-black shadow-md font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t.galleryPage.filterMainAlbums} ({mainCount})
                    </button>
                  )}

                  {subCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAlbumFilterType('sub')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${isKhmer ? 'font-khmer' : ''} ${
                        albumFilterType === 'sub'
                          ? 'bg-white text-black shadow-md font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-3 h-3 text-cyan-400" />
                      {t.galleryPage.filterSubAlbums} ({subCount})
                    </button>
                  )}

                  {featuredCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAlbumFilterType('featured')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${isKhmer ? 'font-khmer' : ''} ${
                        albumFilterType === 'featured'
                          ? 'bg-amber-400 text-black shadow-md font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {t.galleryPage.filterFeatured} ({featuredCount})
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Albums Grid */}
            {filteredCollections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredCollections.map((collection, index) => {
                  const previewImages =
                    collection.previewPhotos && collection.previewPhotos.length > 0
                      ? collection.previewPhotos
                      : collection.cover_image_url
                      ? [collection.cover_image_url]
                      : []

                  return (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/collection/${collection.slug}`} className="group block h-full">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900/60 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/20">
                          {/* Preview Collage */}
                          {previewImages.length > 0 ? (
                            previewImages
                              .slice(0, 3)
                              .reverse()
                              .map((url: string, i: number, arr: string[]) => {
                                const offset = arr.length - 1 - i
                                const isTop = offset === 0

                                let transformClass = 'z-30 group-hover:scale-105'
                                if (offset === 1)
                                  transformClass = 'z-20 scale-[0.92] -translate-y-3 opacity-80 shadow-lg'
                                if (offset === 2)
                                  transformClass = 'z-10 scale-[0.84] -translate-y-6 opacity-60 shadow-xl'

                                return (
                                  <Image
                                    key={`${url}-${i}`}
                                    src={getThumbnailFromSource(url, 1200)}
                                    alt={collection.title}
                                    fill
                                    unoptimized={url?.startsWith('http')}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className={`object-cover absolute inset-0 transition-transform duration-700 ease-out ${transformClass}`}
                                    loading={index < 3 && isTop ? 'eager' : 'lazy'}
                                    priority={index < 3 && isTop}
                                    placeholder="blur"
                                    blurDataURL={getBlurPlaceholderDataUrl(64, 48)}
                                  />
                                )
                              })
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800/40 text-zinc-500 gap-2">
                              <FolderOpen className="w-12 h-12 stroke-[1.5] text-white/30" />
                              <span className={`text-[11px] uppercase tracking-widest font-light text-white/40 ${isKhmer ? 'font-khmer' : ''}`}>
                                {t.galleryPage.albumFallback}
                              </span>
                            </div>
                          )}

                          {/* Base Scrim Gradient (ALWAYS VISIBLE for contrast) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-30 pointer-events-none transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/50" />

                          {/* Album Details (ALWAYS VISIBLE so cards never appear empty) */}
                          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end z-40 pointer-events-none">
                            {/* Breadcrumb for sub-album */}
                            {collection.parentTitle && (
                              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-mono">
                                <span className="text-emerald-400 font-semibold">{collection.parentTitle}</span>
                                <span className="text-white/40">›</span>
                                <span className="text-zinc-300 font-medium">{collection.title}</span>
                              </div>
                            )}

                            <h3
                              className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2 drop-shadow-md group-hover:text-zinc-100 transition-colors"
                              style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
                            >
                              {collection.title}
                            </h3>

                            {/* Stats Badges */}
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 shadow-sm">
                                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                                <span className={`text-xs font-medium text-white ${isKhmer ? 'font-khmer' : ''}`}>
                                  {collection.totalPhotos} {t.galleryPage.photosLabel}
                                </span>
                              </div>

                              {collection.subAlbums > 0 && (
                                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 shadow-sm">
                                  <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                                  <span className={`text-xs font-medium text-white ${isKhmer ? 'font-khmer' : ''}`}>
                                    {collection.subAlbums} {t.galleryPage.albumsLabel}
                                  </span>
                                </div>
                              )}

                              {collection.featured && (
                                <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/30 text-amber-300 text-[10px] font-mono font-medium">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>{t.galleryPage.filterFeatured}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Top Corner Arrow */}
                          <div className="absolute top-4 right-4 z-40 pointer-events-none">
                            <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border border-white/15">
                              <ArrowUpRight className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="p-16 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 max-w-lg mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <FolderOpen className="w-7 h-7" />
                </div>
                <h3 className={`text-lg font-bold text-white ${isKhmer ? 'font-khmer' : ''}`}>
                  {t.galleryPage.emptyTitle}
                </h3>
                <p className={`text-xs sm:text-sm text-zinc-400 leading-relaxed ${isKhmer ? 'font-khmer' : ''}`}>
                  {albumSearchTerm || albumFilterType !== 'all'
                    ? t.galleryPage.emptyNoMatch
                    : t.galleryPage.emptyNoCreated}
                </p>
                {(albumSearchTerm || albumFilterType !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAlbumSearchTerm('')
                      setAlbumFilterType('all')
                    }}
                    className={`rounded-xl border-zinc-800 text-xs font-semibold ${isKhmer ? 'font-khmer' : ''}`}
                  >
                    {t.galleryPage.resetFilters}
                  </Button>
                )}
              </div>
            )}

            {/* Quick Preview of Recent Photos on Albums Tab */}
            {photos.length > 0 && (
              <section className="pt-10 border-t border-zinc-900 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2
                      className={`text-2xl font-bold text-white flex items-center gap-2.5 ${isKhmer ? 'font-khmer' : ''}`}
                      style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
                    >
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <span>{isKhmer ? 'រូបថតថ្មីៗ' : 'Recent Photographs'}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      {isKhmer ? `រូបភាពចុងក្រោយបង្អស់ក្នុងចំណោម ${totalPhotosCount} សន្លឹក` : `Latest captures from across all ${totalPhotosCount} photographs`}
                    </p>
                  </div>

                  <Button
                    onClick={() => setActiveTab('photos')}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 self-start sm:self-auto"
                  >
                    <span>{isKhmer ? `មើលរូបថតទាំងអស់ (${totalPhotosCount})` : `View All Photos (${totalPhotosCount})`}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* 8-Photo Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {photos.slice(0, 8).map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setActiveTab('photos')
                        handleOpenPhoto(index)
                      }}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group bg-zinc-900 border border-white/10 hover:border-emerald-500/40"
                    >
                      <Image
                        src={getThumbnailFromSource(photo.image_url, 600)}
                        alt={photo.title || 'Photo'}
                        fill
                        unoptimized={photo.image_url?.startsWith('http')}
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL={getBlurPlaceholderDataUrl(64, 48)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                      {photo.collection_title && (
                        <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300 truncate">
                          {photo.collection_title}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB 2: ALL PHOTOS VIEW */}
        {activeTab === 'photos' && (
          <div className="space-y-8">
            {/* Photos Controls Bar */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5 backdrop-blur-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    placeholder={isKhmer ? 'ស្វែងរកតាមចំណងជើងរូបថត ឬអាល់ប៊ុម...' : 'Search photos by title or album...'}
                    value={photoSearchTerm}
                    onChange={(e) => setPhotoSearchTerm(e.target.value)}
                    className={`pl-10 pr-9 h-11 text-xs sm:text-sm rounded-2xl border-zinc-800 bg-zinc-900/90 text-white placeholder:text-zinc-500 focus:border-zinc-600 ${isKhmer ? 'font-khmer' : ''}`}
                  />
                  {photoSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setPhotoSearchTerm('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs text-zinc-400 hidden sm:inline ${isKhmer ? 'font-khmer' : ''}`}>
                    {isKhmer ? 'តម្រៀបតាម:' : 'Sort:'}
                  </span>
                  <div className="inline-flex rounded-xl bg-zinc-900 border border-zinc-800 p-1">
                    <button
                      type="button"
                      onClick={() => setPhotoSortBy('newest')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        photoSortBy === 'newest' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isKhmer ? 'ថ្មីបំផុត' : 'Newest'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoSortBy('oldest')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        photoSortBy === 'oldest' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isKhmer ? 'ចាស់បំផុត' : 'Oldest'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoSortBy('name')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        photoSortBy === 'name' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isKhmer ? 'ឈ្មោះ' : 'Name'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Album Filter Chips */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <span className={`text-xs text-zinc-400 shrink-0 ${isKhmer ? 'font-khmer' : ''}`}>
                  {t.galleryPage.filterByAlbum}:
                </span>
                <button
                  type="button"
                  onClick={() => setPhotoAlbumFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    photoAlbumFilter === 'all'
                      ? 'bg-emerald-400 text-black shadow-md font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.galleryPage.allPhotosFilter} ({photos.length})
                </button>
                {collections.map((col) => {
                  const countForCol = photos.filter((p) => p.collection_id === col.id).length
                  if (countForCol === 0 && col.subAlbums > 0) return null
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setPhotoAlbumFilter(col.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                        photoAlbumFilter === col.id
                          ? 'bg-white text-black shadow-md font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {col.title} ({countForCol})
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Photos Counter */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-2">
              <span>
                {t.galleryPage.showingPhotosCount
                  .replace('{count}', String(visiblePhotos.length))
                  .replace('{total}', String(filteredPhotos.length))}
              </span>
              {photoAlbumFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setPhotoAlbumFilter('all')}
                  className="text-emerald-400 hover:underline"
                >
                  {isKhmer ? 'សម្អាតតម្រង' : 'Clear filter'}
                </button>
              )}
            </div>

            {/* Photos Grid */}
            {visiblePhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
                {visiblePhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
                    onClick={() => handleOpenPhoto(index)}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/10 hover:border-white/25 hover:shadow-xl transition-all duration-300"
                  >
                    <Image
                      src={getThumbnailFromSource(photo.image_url, 800)}
                      alt={photo.title || 'Photo'}
                      fill
                      unoptimized={photo.image_url?.startsWith('http')}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading={index < 8 ? 'eager' : 'lazy'}
                      placeholder="blur"
                      blurDataURL={getBlurPlaceholderDataUrl(64, 48)}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 sm:p-4 z-20">
                      <div className="flex justify-end">
                        <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        {photo.collection_title && (
                          <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1.5">
                            {photo.collection_title}
                          </span>
                        )}
                        <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                          {photo.title || 'Photograph'}
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 max-w-lg mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <h3 className={`text-lg font-bold text-white ${isKhmer ? 'font-khmer' : ''}`}>
                  {isKhmer ? 'រកមិនឃើញរូបថតទេ' : 'No photos found'}
                </h3>
                <p className={`text-xs sm:text-sm text-zinc-400 leading-relaxed ${isKhmer ? 'font-khmer' : ''}`}>
                  {photoSearchTerm || photoAlbumFilter !== 'all'
                    ? (isKhmer ? 'គ្មានរូបថតណាដែលត្រូវនឹងការស្វែងរក ឬតម្រងសកម្មឡើយ។' : 'No photos match your current search or album filter.')
                    : (isKhmer ? 'រូបថតនឹងបង្ហាញនៅទីនេះនៅពេលបានបង្ហោះ។' : 'Photos will appear here once uploaded.')}
                </p>
                {(photoSearchTerm || photoAlbumFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPhotoSearchTerm('')
                      setPhotoAlbumFilter('all')
                    }}
                    className={`rounded-xl border-zinc-800 text-xs font-semibold ${isKhmer ? 'font-khmer' : ''}`}
                  >
                    {t.galleryPage.resetFilters}
                  </Button>
                )}
              </div>
            )}

            {/* Load More Button */}
            {visiblePhotos.length < filteredPhotos.length && (
              <div className="text-center pt-6">
                <Button
                  onClick={() => setPhotoRenderCount((prev) => prev + 48)}
                  className="px-8 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-sm font-semibold shadow-xl"
                >
                  <span>{t.galleryPage.loadMorePhotos}</span>
                  <span className="ml-2 text-xs font-mono text-zinc-400">
                    (+{Math.min(48, filteredPhotos.length - visiblePhotos.length)})
                  </span>
                </Button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Lightbox Preview */}
      {fullscreenOpen && previewPhotosList.length > 0 && (
        <FullscreenPhotoPreview
          photo={previewPhotosList[currentPhotoIndex] || previewPhotosList[0]}
          relatedPhotos={previewPhotosList}
          currentIndex={currentPhotoIndex}
          isOpen={fullscreenOpen}
          onClose={() => setFullscreenOpen(false)}
          onNavigate={(direction: 'prev' | 'next') => {
            if (direction === 'next') {
              setCurrentPhotoIndex((prev) => (prev + 1) % previewPhotosList.length)
            } else {
              setCurrentPhotoIndex((prev) =>
                prev === 0 ? previewPhotosList.length - 1 : prev - 1
              )
            }
          }}
        />
      )}
    </div>
  )
}
