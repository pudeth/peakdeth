'use client'

import Image from 'next/image'
import { Award, Camera, ArrowUpRight, CheckCircle2, MapPin, Film, Briefcase, ChevronRight, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'

interface Experience {
  title: string
  organization: string
  period: string
  description?: string
}

interface AwardType {
  title: string
  organization: string
  year: string
}

interface EquipmentCategory {
  category: string
  items: string[]
}

interface Skill {
  _key: string
  name: string
  icon?: string
}

interface AboutData {
  title?: string
  name?: string
  tagline?: string
  bio?: string
  profile_image_url?: string
  experience?: Experience[]
  skills?: Skill[]
  awards?: AwardType[]
  equipment?: EquipmentCategory[]
}

const DEFAULT_ABOUT_DATA: AboutData = {
  title: 'Full-Stack Software Architecture & Cinematic Photography Design',
  name: 'Peak Deth',
  tagline: 'Full-Stack Programming & Cinematic Photography Design',
  bio: 'A multidisciplinary Full-Stack Developer and Visual Artist bridging high-performance software engineering with cinematic photography and design. Dedicated to architecting robust enterprise systems, bespoke POS solutions, and modern mobile & web apps, while capturing evocative visual narratives and crafting refined aesthetic designs.',
  profile_image_url: undefined,
  experience: [
    {
      title: 'Senior Systems Architect & Full-Stack Engineer',
      organization: 'Peak Deth Solutions',
      period: '2022 — Present',
      description: 'Designing and deploying bespoke POS systems, ERP/CRM management software, high-performance web applications, and iOS/Android solutions.'
    },
    {
      title: 'Digital Systems Developer',
      organization: 'Enterprise Technology Group',
      period: '2020 — 2022',
      description: 'Engineered automated workflows, real-time inventory management databases, and customer-facing responsive applications.'
    }
  ],
  skills: [
    { _key: 's1', name: 'POS & Billing Systems', icon: '💳' },
    { _key: 's2', name: 'Enterprise Management (ERP/CRM)', icon: '📊' },
    { _key: 's3', name: 'Web Architecture & Next.js', icon: '🌐' },
    { _key: 's4', name: 'Mobile App Development (React Native / iOS / Android)', icon: '📱' },
    { _key: 's5', name: 'Real-Time Databases & Cloud APIs', icon: '⚡' },
    { _key: 's6', name: 'UI/UX Interface Design', icon: '🎨' }
  ],
  awards: [
    {
      title: 'Excellence in Enterprise System Architecture',
      organization: 'Tech Innovations Summit',
      year: '2025'
    },
    {
      title: 'Outstanding Digital Solution Deployment',
      organization: 'Cambodia Business Software Awards',
      year: '2024'
    }
  ],
  equipment: [
    {
      category: 'Development Environment & Hardware',
      items: [
        'Apple Silicon M-Series Workstations',
        'Multi-Display 4K HDR Color-Calibrated Setup',
        'Physical iOS & Android Device Testing Rig'
      ]
    },
    {
      category: 'Cloud Infrastructure & Tooling',
      items: [
        'Vercel & Supabase Cloud Infrastructures',
        'Docker & Microservice Orchestration',
        'Automated CI/CD Pipelines'
      ]
    }
  ]
}

const LOCALIZED_SKILLS: Record<string, { km: string; zh: string }> = {
  'POS & Billing Systems': {
    km: 'ប្រព័ន្ធ POS & ការគិតប្រាក់',
    zh: 'POS 收银与账务系统',
  },
  'Enterprise Management (ERP/CRM)': {
    km: 'ការគ្រប់គ្រងសហគ្រាស (ERP/CRM)',
    zh: '企业级管理系统 (ERP/CRM)',
  },
  'Web Architecture & Next.js': {
    km: 'ស្ថាបត្យកម្មគេហទំព័រ & Next.js',
    zh: '现代化 Web 架构与 Next.js',
  },
  'Mobile App Development (React Native / iOS / Android)': {
    km: 'ការអភិវឌ្ឍកម្មវិធីទូរស័ព្ទ (iOS & Android)',
    zh: '跨平台移动应用开发 (iOS & Android)',
  },
  'Real-Time Databases & Cloud APIs': {
    km: 'មូលដ្ឋានទិន្នន័យ Real-Time & Cloud APIs',
    zh: '实时数据库与云端 API',
  },
  'UI/UX Interface Design': {
    km: 'ការរចនាបទប្រព័ន្ធ UI/UX',
    zh: 'UI/UX 交互与界面设计',
  },
}

const LOCALIZED_EXPERIENCES: Record<string, {
  km: { title: string; period?: string; description?: string };
  zh: { title: string; period?: string; description?: string };
}> = {
  'Senior Systems Architect & Full-Stack Engineer': {
    km: {
      title: 'ស្ថាបត្យករប្រព័ន្ធជាន់ខ្ពស់ & វិស្វករ Full-Stack',
      period: '2022 — បច្ចុប្បន្ន',
      description: 'រៀបចំរចនាសម្ព័ន្ធ និងដាក់ឱ្យប្រើប្រាស់ប្រព័ន្ធ POS តាមតម្រូវការ, កម្មវិធីគ្រប់គ្រងសហគ្រាស ERP/CRM, វេបសាយទំនើបល្បឿនលឿន និងដំណោះស្រាយទូរស័ព្ទ iOS/Android។',
    },
    zh: {
      title: '高级系统架构师 & 全栈工程师',
      period: '2022 — 至今',
      description: '设计并部署定制化 POS 系统、企业 ERP/CRM 管理软件、高性能现代化网站及 iOS/Android 移动端应用。',
    },
  },
  'Digital Systems Developer': {
    km: {
      title: 'អ្នកអភិវឌ្ឍន៍ប្រព័ន្ធឌីជីថល',
      period: '2020 — 2022',
      description: 'បង្កើតលំហូរការងារស្វ័យប្រវត្តិ ប្រព័ន្ធទិន្នន័យគ្រប់គ្រងស្តុកតាមពេលវេលាជាក់ស្តែង និងកម្មវិធីឆ្លើយតបរហ័សសម្រាប់អតិថិជន។',
    },
    zh: {
      title: '数字化系统开发工程师',
      period: '2020 — 2022',
      description: '开发自动化业务流程、实时库存管理数据库以及面向客户的快速响应型应用程序。',
    },
  },
}

const LOCALIZED_AWARDS: Record<string, {
  km: { title: string };
  zh: { title: string };
}> = {
  'Excellence in Enterprise System Architecture': {
    km: { title: 'ឆ្នើមក្នុងការរៀបចំស្ថាបត្យកម្មប្រព័ន្ធសហគ្រាស' },
    zh: { title: '企业系统架构卓越奖' },
  },
  'Outstanding Digital Solution Deployment': {
    km: { title: 'ការដាក់ឱ្យដំណើរការដំណោះស្រាយឌីជីថលឆ្នើម' },
    zh: { title: '杰出数字化解决方案部署奖' },
  },
}

const LOCALIZED_EQUIPMENT: Record<string, {
  km: { category: string; items: Record<string, string> };
  zh: { category: string; items: Record<string, string> };
}> = {
  'Development Environment & Hardware': {
    km: {
      category: 'បរិស្ថានអភិវឌ្ឍន៍ & ផ្នែករឹង (Hardware)',
      items: {
        'Apple Silicon M-Series Workstations': 'ម៉ាស៊ីនការងារ Apple Silicon M-Series',
        'Multi-Display 4K HDR Color-Calibrated Setup': 'អេក្រង់ 4K HDR ច្រើនផ្ទាំងក្រិតពណ៌ស្តង់ដារ',
        'Physical iOS & Android Device Testing Rig': 'ឧបករណ៍តេស្តផ្ទាល់លើទូរស័ព្ទ iOS & Android',
      },
    },
    zh: {
      category: '开发环境与硬件工作站',
      items: {
        'Apple Silicon M-Series Workstations': 'Apple Silicon M 系列专业工作站',
        'Multi-Display 4K HDR Color-Calibrated Setup': '多屏 4K HDR 专业校色显示系统',
        'Physical iOS & Android Device Testing Rig': '真实 iOS 与 Android 多端物理真机测试架',
      },
    },
  },
  'Cloud Infrastructure & Tooling': {
    km: {
      category: 'ហេដ្ឋារចនាសម្ព័ន្ធ Cloud & ឧបករណ៍បច្ចេកវិទ្យា',
      items: {
        'Vercel & Supabase Cloud Infrastructures': 'ហេដ្ឋារចនាសម្ព័ន្ធ Cloud Vercel & Supabase',
        'Docker & Microservice Orchestration': 'Docker & ការគ្រប់គ្រង Microservice',
        'Automated CI/CD Pipelines': 'ប្រព័ន្ធ CI/CD ស្វ័យប្រវត្តិ',
      },
    },
    zh: {
      category: '云端基础设施与工程工具',
      items: {
        'Vercel & Supabase Cloud Infrastructures': 'Vercel 与 Supabase 云原生技术架构',
        'Docker & Microservice Orchestration': 'Docker 与微服务容器化协同编排',
        'Automated CI/CD Pipelines': '自动化持续集成与部署 (CI/CD) 流程',
      },
    },
  },
}

async function getAboutData(): Promise<AboutData> {
  try {
    let aboutContent: any = null
    try {
      const res = await fetch(`/api/content/about?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        if (json.about) {
          aboutContent = json.about
        }
      }
    } catch {}

    const supabase = createClient()

    if (!aboutContent) {
      const { data, error: aboutError } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
      if (!aboutError && data && data.length > 0) {
        aboutContent = data[0]
      }
    }

    if (!aboutContent) {
      return DEFAULT_ABOUT_DATA
    }

    // Fetch related data
    const [experienceRes, skillsRes, awardsRes, equipmentCategoriesRes] = await Promise.all([
      supabase.from('about_experience').select('*').eq('about_content_id', aboutContent.id).order('order'),
      supabase.from('about_skills').select('*').eq('about_content_id', aboutContent.id).order('order'),
      supabase.from('about_awards').select('*').eq('about_content_id', aboutContent.id).order('order'),
      supabase.from('about_equipment_categories').select('*').eq('about_content_id', aboutContent.id).order('order')
    ])

    // Fetch equipment items for all categories
    const equipmentCategories = equipmentCategoriesRes.data || []
    const categoryIds = equipmentCategories.map(c => c.id)

    const { data: allEquipmentItems } = categoryIds.length > 0
      ? await supabase
        .from('about_equipment_items')
        .select('*')
        .in('equipment_category_id', categoryIds)
        .order('order')
      : { data: [] }

    // Group items by category
    const itemsByCategory = new Map<string, string[]>()
    for (const item of allEquipmentItems || []) {
      const list = itemsByCategory.get(item.equipment_category_id) || []
      list.push(item.item)
      itemsByCategory.set(item.equipment_category_id, list)
    }

    const equipmentWithItems = equipmentCategories.map(category => ({
      category: category.category,
      items: itemsByCategory.get(category.id) || []
    }))

    const experience = experienceRes.data && experienceRes.data.length > 0
      ? experienceRes.data.map(exp => ({
          title: exp.title,
          organization: exp.organization,
          period: exp.period,
          description: exp.description
        }))
      : DEFAULT_ABOUT_DATA.experience

    const skills = skillsRes.data && skillsRes.data.length > 0
      ? skillsRes.data.map(skill => ({
          _key: skill.id,
          name: skill.name,
          icon: skill.icon
        }))
      : DEFAULT_ABOUT_DATA.skills

    const awards = awardsRes.data && awardsRes.data.length > 0
      ? awardsRes.data.map(award => ({
          title: award.title,
          organization: award.organization,
          year: award.year
        }))
      : DEFAULT_ABOUT_DATA.awards

    const equipment = equipmentWithItems.length > 0
      ? equipmentWithItems
      : DEFAULT_ABOUT_DATA.equipment

    return {
      title: aboutContent.title || DEFAULT_ABOUT_DATA.title,
      name: aboutContent.name || DEFAULT_ABOUT_DATA.name,
      tagline: aboutContent.tagline || DEFAULT_ABOUT_DATA.tagline,
      bio: aboutContent.bio || DEFAULT_ABOUT_DATA.bio,
      profile_image_url: aboutContent.profile_image_url || aboutContent.image_url || undefined,
      experience,
      skills,
      awards,
      equipment
    }
  } catch {
    return DEFAULT_ABOUT_DATA
  }
}

export default function AboutPage() {
  const { t, language } = useLanguage()
  const isKhmer = language === 'km'
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAboutData().then(data => {
      setAboutData(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030303] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 aspect-[4/5] rounded-3xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-8 w-48 bg-zinc-900" />
            <Skeleton className="h-14 w-full bg-zinc-900" />
            <Skeleton className="h-28 w-full bg-zinc-900" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Skeleton className="h-20 w-full bg-zinc-900" />
              <Skeleton className="h-20 w-full bg-zinc-900" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-2">About</h1>
          <p className="text-zinc-500 text-sm mb-6">Profile information is currently being updated.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const paragraphs = aboutData.bio ? aboutData.bio.split('\n\n').filter(Boolean) : []

  return (
    <main className="min-h-screen bg-[#030303] text-zinc-100">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-28 space-y-20 sm:space-y-28">

        {/* Section 1: Hero Profile & Artistic Bio */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* Left: Editorial Portrait Card */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-2xl">
              {aboutData.profile_image_url ? (
                <Image
                  src={aboutData.profile_image_url}
                  alt={`${aboutData.name || 'Photographer'} portrait`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-600">
                  <Camera className="w-16 h-16 mb-2" />
                  <span className="text-xs uppercase tracking-widest">Portrait</span>
                </div>
              )}

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Bottom Card Over Portrait */}
              <div className="absolute bottom-4 inset-x-4 p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-base font-bold text-white tracking-tight ${isKhmer ? 'font-khmer' : ''}`}>
                      {isKhmer ? 'ពាក្យ ដេត' : (aboutData.name && aboutData.name !== 'Rithy Chanvirak' ? aboutData.name : 'Peak Deth')}
                    </h3>
                    <p className={`text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5 ${isKhmer ? 'font-khmer' : ''}`}>
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {t.aboutPage.location}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 ${isKhmer ? 'font-khmer' : ''}`}>
                    {t.aboutPage.travels}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio & Artistic Vision */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Header Label */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 ${isKhmer ? 'font-khmer' : ''}`}>
                <Film className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.aboutPage.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] ${isKhmer ? 'font-khmer font-bold' : ''}`}>
                {isKhmer ? t.aboutPage.title : (aboutData.title || t.aboutPage.title)}
              </h1>

              {/* Tagline / Subheading */}
              <p className={`text-lg sm:text-xl text-zinc-300 font-medium leading-relaxed ${isKhmer ? 'font-khmer' : ''}`}>
                &ldquo;{isKhmer ? t.aboutPage.tagline : (aboutData.tagline || t.aboutPage.tagline)}&rdquo;
              </p>

              {/* Bio Paragraphs */}
              <div className={`space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed ${isKhmer ? 'font-khmer' : ''}`}>
                <p>{isKhmer ? t.aboutPage.bio : (aboutData.bio || t.aboutPage.bio)}</p>
              </div>
            </div>

            {/* Quick Stats / Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-zinc-800/80">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/70">
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">4+</div>
                <div className={`text-xs text-zinc-400 mt-0.5 ${isKhmer ? 'font-khmer' : ''}`}>{t.aboutPage.yearsLabel}</div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/70">
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">50+</div>
                <div className={`text-xs text-zinc-400 mt-0.5 ${isKhmer ? 'font-khmer' : ''}`}>{t.aboutPage.setsLabel}</div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100%</div>
                <div className={`text-xs text-zinc-400 mt-0.5 ${isKhmer ? 'font-khmer' : ''}`}>{t.aboutPage.craftLabel}</div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all duration-300 shadow-xl group ${isKhmer ? 'font-khmer font-bold' : ''}`}
              >
                <span>{t.aboutPage.initiateProject}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href="/gallery"
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-semibold hover:bg-zinc-800 hover:text-white transition-colors ${isKhmer ? 'font-khmer' : ''}`}
              >
                {t.aboutPage.viewWorks}
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Disciplines & Specialized Skills */}
        {aboutData.skills && aboutData.skills.length > 0 && (
          <section className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest text-zinc-500 ${isKhmer ? 'font-khmer' : ''}`}>{t.aboutPage.disciplinesTag}</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 ${isKhmer ? 'font-khmer font-bold' : ''}`}>
                  {t.aboutPage.disciplinesTitle}
                </h2>
              </div>
              <p className={`text-xs sm:text-sm text-zinc-400 max-w-sm ${isKhmer ? 'font-khmer' : ''}`}>
                {t.aboutPage.disciplinesSub}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {aboutData.skills.map((skill) => {
                const localizedSkillName = (language === 'km' || language === 'zh')
                  ? (LOCALIZED_SKILLS[skill.name]?.[language] || skill.name)
                  : skill.name

                return (
                  <div
                    key={skill._key}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white text-sm">
                      {skill.icon || <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold text-white truncate ${isKhmer ? 'font-khmer' : ''}`}>
                      {localizedSkillName}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Section 3: Professional Experience & Career Milestones */}
        {aboutData.experience && aboutData.experience.length > 0 && (
          <section className="space-y-8">
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest text-zinc-500 ${isKhmer ? 'font-khmer' : ''}`}>{t.aboutPage.trajectoryTag}</span>
              <h2 className={`text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 ${isKhmer ? 'font-khmer font-bold' : ''}`}>
                {t.aboutPage.trajectoryTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {aboutData.experience.map((exp, idx) => {
                const localizedExp = (language === 'km' || language === 'zh')
                  ? LOCALIZED_EXPERIENCES[exp.title]?.[language]
                  : undefined
                const expTitle = localizedExp?.title || exp.title
                const expPeriod = localizedExp?.period || exp.period
                const expDesc = localizedExp?.description || exp.description

                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 ${isKhmer ? 'font-khmer' : ''}`}>
                          {expPeriod}
                        </span>
                        <Briefcase className="w-4 h-4 text-zinc-600" />
                      </div>

                      <h3 className={`text-lg sm:text-xl font-bold text-white tracking-tight ${isKhmer ? 'font-khmer' : ''}`}>
                        {expTitle}
                      </h3>
                      <p className={`text-sm font-medium text-zinc-400 mt-1 ${isKhmer ? 'font-khmer' : ''}`}>
                        {exp.organization}
                      </p>

                      {expDesc && (
                        <p className={`text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed ${isKhmer ? 'font-khmer' : ''}`}>
                          {expDesc}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Section 4: Awards & Recognition */}
        {aboutData.awards && aboutData.awards.length > 0 && (
          <section className="space-y-8">
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest text-zinc-500 ${isKhmer ? 'font-khmer' : ''}`}>{t.aboutPage.accoladesTag}</span>
              <h2 className={`text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 ${isKhmer ? 'font-khmer font-bold' : ''}`}>
                {t.aboutPage.accoladesTitle}
              </h2>
            </div>

            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950 overflow-hidden divide-y divide-zinc-800/60 shadow-xl">
              {aboutData.awards.map((award, idx) => {
                const localizedAward = (language === 'km' || language === 'zh')
                  ? LOCALIZED_AWARDS[award.title]?.[language]
                  : undefined
                const awardTitle = localizedAward?.title || award.title

                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 hover:bg-zinc-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-lg font-bold text-white tracking-tight ${isKhmer ? 'font-khmer' : ''}`}>
                          {awardTitle}
                        </h3>
                        <p className={`text-xs sm:text-sm text-zinc-400 mt-0.5 ${isKhmer ? 'font-khmer' : ''}`}>
                          {award.organization}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 self-start sm:self-center">
                      {award.year}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Section 5: Production Gear & Technical Arsenal */}
        {aboutData.equipment && aboutData.equipment.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest text-zinc-500 ${isKhmer ? 'font-khmer' : ''}`}>{t.aboutPage.equipmentTag}</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 ${isKhmer ? 'font-khmer font-bold' : ''}`}>
                  {t.aboutPage.equipmentTitle}
                </h2>
              </div>
              <p className={`text-xs sm:text-sm text-zinc-400 max-w-sm ${isKhmer ? 'font-khmer' : ''}`}>
                {t.aboutPage.equipmentSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {aboutData.equipment.map((cat, idx) => {
                const localizedCat = (language === 'km' || language === 'zh')
                  ? LOCALIZED_EQUIPMENT[cat.category]?.[language]
                  : undefined
                const catCategory = localizedCat?.category || cat.category

                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 space-y-4"
                  >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800/80">
                      <Camera className="w-4 h-4 text-zinc-400" />
                      <h3 className={`text-sm font-bold uppercase tracking-wider text-white ${isKhmer ? 'font-khmer' : ''}`}>
                        {catCategory}
                      </h3>
                    </div>

                    <ul className="space-y-2.5">
                      {cat.items.map((item, itemIdx) => {
                        const localizedItem = localizedCat?.items?.[item] || item
                        return (
                          <li key={itemIdx} className={`text-xs sm:text-sm text-zinc-300 flex items-start gap-2.5 ${isKhmer ? 'font-khmer' : ''}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                            <span className="leading-snug">{localizedItem}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Section 6: Editorial Collaboration Callout Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-8 sm:p-14 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className={`text-2xl sm:text-4xl font-extrabold text-white tracking-tight ${isKhmer ? 'font-khmer font-bold' : ''}`}>
              {t.aboutPage.calloutTitle}
            </h2>
            <p className={`text-sm sm:text-base text-zinc-400 leading-relaxed ${isKhmer ? 'font-khmer' : ''}`}>
              {t.aboutPage.calloutSub}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-2xl ${isKhmer ? 'font-khmer font-bold' : ''}`}
            >
              <Mail className="w-4 h-4" />
              <span>{t.aboutPage.getInTouch}</span>
            </Link>
            <Link
              href="/videos"
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold text-sm hover:bg-zinc-800 hover:text-white transition-colors ${isKhmer ? 'font-khmer' : ''}`}
            >
              <span>{t.aboutPage.exploreFilms}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}