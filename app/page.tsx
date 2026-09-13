import { Hero } from "@/components/sections/hero"
import { Portfolio } from "@/components/sections/portfolio"
import { Videos } from "@/components/sections/videos"
import { Services } from "@/components/sections/services"
import { TechMarquee } from "@/components/sections/tech-marquee"
import { CtaSection } from "@/components/sections/cta-section"
import { AboutSection } from "@/components/sections/about-section"
import { getFeaturedCollections } from "@/lib/collections"
import { getAboutContent } from "@/lib/site-content"

// Force dynamic rendering and revalidate on every request since we use Supabase cookies
export const revalidate = 0

function isConnectionOrPlaceholderError(error: unknown): boolean {
  if (!error) return false
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) return true
  const msg = typeof error === 'string' ? error : (error as { message?: string })?.message || ''
  return msg.includes('fetch failed') || msg.includes('Failed to fetch')
}

const DEFAULT_SERVICES = [
  {
    _id: 'service-1',
    number: 1,
    title: 'POS',
    description: 'Point of sale software with real-time inventory tracking, smart billing, payments, and sales analytics.',
    icon: 'pos',
    link: 'https://weppage-1.onrender.com/home.html'
  },
  {
    _id: 'service-2',
    number: 2,
    title: 'Top-Up Diamond',
    description: 'Mobile Legends Bang Bang diamond top-up platform with instant account validation and automated payments.',
    icon: 'diamond',
    link: 'https://mlbb-topup-jet.vercel.app/'
  },
  {
    _id: 'service-3',
    number: 3,
    title: 'Website',
    description: 'High-performance responsive websites, e-commerce platforms, web applications, and modern digital interfaces.',
    icon: 'web',
    link: 'https://weppage-1.onrender.com/home.html'
  },
  {
    _id: 'service-4',
    number: 4,
    title: 'Mobile App',
    description: 'Native and cross-platform mobile apps for iOS and Android with intuitive UI/UX and seamless performance.',
    icon: 'mobile',
    link: 'https://weppage-1.onrender.com/'
  }
]

export default async function HomePage() {
  // Fetch content from database
  const [heroData, services, featuredCollections, featuredVideos, aboutData] = await Promise.all([
    fetchHeroContent(),
    fetchServices(),
    getFeaturedCollections(),
    fetchFeaturedVideos(),
    fetchAboutContent()
  ])

  async function fetchHeroContent() {
    try {
      const { getHeroContent } = await import('@/lib/site-content')
      const hero = await getHeroContent()

      return {
        _id: hero.id || 'hero-1',
        title: (!hero.title || hero.title === 'RITHY CHANVIRAK') ? 'PEAK DETH' : hero.title,
        subtitle: hero.subtitle || 'POS, Management System, Website & Mobile App Development',
        backgroundImage: hero.background_image_url ? {
          asset: { _ref: hero.background_image_url }
        } : undefined,
        overlayOpacity: hero.overlay_opacity ?? 0.5
      }
    } catch (error) {
      if (!isConnectionOrPlaceholderError(error)) {
        console.error('Error fetching hero content:', error)
      }
      return {
        _id: 'hero-1',
        title: 'PEAK DETH',
        subtitle: 'POS, Management System, Website & Mobile App Development',
        backgroundImage: undefined,
        overlayOpacity: 0.5
      }
    }
  }

  async function fetchServices() {
    try {
      const { getServices } = await import('@/lib/services')
      return await getServices({ onlyHomepage: true })
    } catch (error) {
      if (!isConnectionOrPlaceholderError(error)) {
        console.error('Error fetching services (catch block):', error)
      }
      return DEFAULT_SERVICES
    }
  }

  async function fetchFeaturedVideos() {
    try {
      let videos: any[] = []
      try {
        const { getStoredVideos } = await import('@/lib/videos-storage')
        const stored = await getStoredVideos()
        if (stored && stored.length > 0) {
          const active = stored.filter(v => v.is_active)
          const feat = active.filter(v => v.featured)
          videos = feat.length > 0 ? feat.slice(0, 8) : active.slice(0, 4)
        }
      } catch {}

      if (videos.length === 0) {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()

        const { data: featured, error } = await supabase
          .from('videos')
          .select('*')
          .eq('featured', true)
          .eq('is_active', true)
          .order('order', { ascending: true })
          .limit(8)

        if (!error && featured && featured.length > 0) {
          videos = featured
        } else {
          const { data: recent } = await supabase
            .from('videos')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(4)
          videos = recent || []
        }
      }

      return videos.map(video => ({
        _id: video.id,
        title: video.title,
        slug: { current: video.slug },
        videoUrl: video.video_url,
        videoType: video.video_type,
        thumbnailUrl: video.thumbnail_url,
        category: video.category,
        year: video.year
      }))
    } catch (error) {
      if (!isConnectionOrPlaceholderError(error)) {
        console.error('Error fetching featured videos:', error)
      }
      return []
    }
  }



  async function fetchAboutContent() {
    try {
      const { getAboutContent } = await import('@/lib/site-content')
      return await getAboutContent()
    } catch (error) {
      if (!isConnectionOrPlaceholderError(error)) {
        console.error('Error fetching about content:', error)
      }
      return null
    }
  }

  return (
    <>
      <Hero data={heroData} />
      
      {/* Tech Stack & Competencies Continuous Ribbon */}
      <TechMarquee />

      {/* Anchor Target for Smooth Scroll */}
      <div id="services-section" className="scroll-mt-20 pt-10" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 space-y-12">
        {/* Services & Live Systems */}
        <section>
          <Services services={services} />
        </section>

        {/* Featured About Profile Section (controlled via Admin) */}
        {aboutData?.show_on_homepage === true && (
          <section id="about-section" className="scroll-mt-24">
            <AboutSection about={aboutData} />
          </section>
        )}

        {/* Featured Collections if present */}
        {featuredCollections && featuredCollections.length > 0 && (
          <section id="portfolio-section" className="scroll-mt-24">
            <Portfolio collections={featuredCollections} showTitle={true} />
          </section>
        )}

        {/* Videos if present */}
        {featuredVideos && featuredVideos.length > 0 && (
          <section className="scroll-mt-24">
            <Videos videos={featuredVideos} />
          </section>
        )}

        {/* High-Conversion Pre-Footer Call to Action */}
        <section>
          <CtaSection />
        </section>
      </main>
    </>
  )
}

