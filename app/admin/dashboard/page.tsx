'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Image as ImageIcon, Video, FolderOpen, ArrowUpRight, Clock,
  Activity, Settings, Zap, Camera, Upload, Edit3, Globe, AlertCircle, RefreshCw, Phone, Home, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import NextImage from 'next/image'
import { getThumbnailUrl } from '@/lib/cloudinary'
import type { Photo } from '@/types/database'
import { motion } from 'motion/react'

interface ActivityItem {
  id: string
  type: 'photo' | 'video' | 'collection'
  title: string
  created_at: string
}

export default function DashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({ photos: 0, videos: 0, collections: 0 })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)

      let photosList: Photo[] = []
      let collectionsList: any[] = []
      let videosList: any[] = []

      // 1. Fetch from local APIs (works seamlessly in local mode and syncs with Supabase)
      try {
        const [photosRes, collectionsRes, videosRes] = await Promise.allSettled([
          fetch('/api/photos'),
          fetch('/api/collections'),
          fetch('/api/videos'),
        ])

        if (photosRes.status === 'fulfilled' && photosRes.value.ok) {
          const data = await photosRes.value.json()
          if (Array.isArray(data.photos)) photosList = data.photos
        }

        if (collectionsRes.status === 'fulfilled' && collectionsRes.value.ok) {
          const data = await collectionsRes.value.json()
          if (Array.isArray(data.collections)) collectionsList = data.collections
        }

        if (videosRes.status === 'fulfilled' && videosRes.value.ok) {
          const data = await videosRes.value.json()
          if (Array.isArray(data.videos)) videosList = data.videos
        }
      } catch (e) {
        console.warn('Local API fetch error in dashboard, trying Supabase fallback:', e)
      }

      // 2. Fallback to direct Supabase if API returned empty and Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder')
      if (!isPlaceholder && (photosList.length === 0 || collectionsList.length === 0 || videosList.length === 0)) {
        try {
          const [photosData, videosData, collectionsData] = await Promise.all([
            supabase.from('photos').select('*').order('created_at', { ascending: false }),
            supabase.from('videos').select('*').order('created_at', { ascending: false }),
            supabase.from('collections').select('*').order('created_at', { ascending: false }),
          ])

          if (photosData.data && photosList.length === 0) photosList = photosData.data
          if (videosData.data && videosList.length === 0) videosList = videosData.data
          if (collectionsData.data && collectionsList.length === 0) collectionsList = collectionsData.data
        } catch {}
      }

      setStats({
        photos: photosList.length,
        videos: videosList.length,
        collections: collectionsList.length,
      })

      const activity: ActivityItem[] = []
      photosList.slice(0, 6).forEach(p => {
        activity.push({
          id: p.id,
          type: 'photo',
          title: p.title || 'Untitled Photo',
          created_at: p.created_at || new Date().toISOString(),
        })
      })

      videosList.slice(0, 6).forEach(v => {
        activity.push({
          id: v.id,
          type: 'video',
          title: v.title || 'Untitled Video',
          created_at: v.created_at || new Date().toISOString(),
        })
      })

      collectionsList.slice(0, 6).forEach(c => {
        activity.push({
          id: c.id,
          type: 'collection',
          title: c.title || 'Untitled Album',
          created_at: c.created_at || new Date().toISOString(),
        })
      })

      activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setRecentActivity(activity.slice(0, 8))

      setRecentPhotos(photosList.slice(0, 6))

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const statCards = [
    { label: 'Photos', value: stats.photos, icon: ImageIcon, href: '/admin/dashboard/photos', color: 'from-blue-500/20 to-cyan-500/5' },
    { label: 'Videos', value: stats.videos, icon: Video, href: '/admin/dashboard/videos', color: 'from-purple-500/20 to-pink-500/5' },
    { label: 'Albums', value: stats.collections, icon: FolderOpen, href: '/admin/dashboard/collections', color: 'from-amber-500/20 to-orange-500/5' },
  ]

  const quickActions = [
    { title: 'Manage Homepage', icon: Home, href: '/admin/dashboard/homepage' },
    { title: 'Upload Photos', icon: Upload, href: '/admin/dashboard/collections' },
    { title: 'Add Video', icon: Video, href: '/admin/dashboard/videos' },
    { title: 'About & Profile', icon: User, href: '/admin/dashboard/content' },
    { title: 'Contact Channels', icon: Phone, href: '/admin/dashboard/contact' },
  ]

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 bg-white/5 rounded-2xl" />
          <Skeleton className="h-32 bg-white/5 rounded-2xl" />
          <Skeleton className="h-32 bg-white/5 rounded-2xl" />
        </div>
        <Skeleton className="h-24 bg-white/5 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            {greeting}, Admin.
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Here&apos;s an overview of your portfolio content and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-zinc-300 rounded-full px-5 h-10" asChild>
            <Link href="/admin/dashboard/content">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full px-5 h-10" asChild>
            <Link href="/" target="_blank">
              <Globe className="w-4 h-4 mr-2" />
              View Live Site
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchDashboardData} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br ${stat.color} border border-white/5 hover:border-white/20 transition-all duration-300 group`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <stat.icon className="w-16 h-16 text-white" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <p className="text-sm font-medium text-white/70">{stat.label}</p>
                <p className="text-4xl md:text-5xl font-light text-white tracking-tight">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Homepage Quick Manager Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-zinc-900/80 to-zinc-950 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Home className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Homepage Control Center</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                New Feature
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Customize Hero title, Developer live systems, featured albums, motion videos, and CTA banner in one place.
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shrink-0">
          <Link href="/admin/dashboard/homepage" className="flex items-center gap-1.5">
            <span>Edit Homepage</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-zinc-500 mr-2 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Quick Actions:
        </span>
        {quickActions.map((action, i) => (
          <Link key={action.title} href={action.href}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (i * 0.05) }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/5 hover:bg-white/10 hover:border-white/15 transition-all text-sm text-zinc-300 hover:text-white cursor-pointer"
            >
              <action.icon className="w-4 h-4 opacity-70" />
              {action.title}
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Recent Photos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-zinc-400" />
              Recent Uploads
            </h2>
            <Link href="/admin/dashboard/photos" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group">
              View all <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {recentPhotos.length > 0 ? (
              recentPhotos.map((photo, i) => (
                <motion.div 
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                >
                  <Link
                    href="/admin/dashboard/photos"
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 block hover:border-white/20 transition-all"
                  >
                    <NextImage
                      src={photo.image_id ? getThumbnailUrl(photo.image_id, 300) : photo.image_url}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="text-white text-sm font-medium truncate drop-shadow-md">{photo.title}</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                <ImageIcon className="w-8 h-8 text-zinc-500 mb-3" />
                <p className="text-zinc-400 text-sm">No photos uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-zinc-400" />
              Activity Log
            </h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-1">
            {recentActivity.length > 0 ? (
              <div className="flex flex-col">
                {recentActivity.map((item, i) => {
                  const Icon = item.type === 'photo' ? ImageIcon : item.type === 'video' ? Video : FolderOpen
                  return (
                    <motion.div
                      key={`${item.id}-${i}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (i * 0.05) }}
                      className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-zinc-300" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-zinc-200 truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">{item.type}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {getTimeAgo(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-zinc-500 text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`
  return date.toLocaleDateString()
}
