'use client'

import {
  Code2,
  Database,
  Smartphone,
  CreditCard,
  Globe,
  Sparkles,
  Zap,
  Server,
  Camera,
  Video,
  Film,
  Aperture,
  Palette,
} from 'lucide-react'

interface SkillItem {
  name: string
  category: string
  icon: any
  accent: string
}

const SKILL_ITEMS: SkillItem[] = [
  // Developer & Architecture
  { name: 'Software Developer', category: 'Systems & Architecture', icon: Code2, accent: 'text-sky-400' },
  // Cameraman & Visual
  { name: 'Professional Cameraman', category: 'Live & Field Operator', icon: Video, accent: 'text-purple-400' },
  // Developer
  { name: 'POS & Management Systems', category: 'Enterprise Software', icon: CreditCard, accent: 'text-amber-400' },
  // Cameraman & Photography
  { name: 'Cinematography & Film', category: '4K Motion Narrative', icon: Film, accent: 'text-rose-400' },
  // Developer
  { name: 'Next.js 15 & React', category: 'Full-Stack Architecture', icon: Globe, accent: 'text-cyan-400' },
  // Photography
  { name: 'Commercial Photography', category: 'Studio & Portrait Stills', icon: Camera, accent: 'text-emerald-400' },
  // Developer
  { name: 'Mobile Apps (iOS & Android)', category: 'Cross-Platform Dev', icon: Smartphone, accent: 'text-indigo-400' },
  // Cameraman & Post
  { name: 'Color Grading & DaVinci', category: 'Post-Production', icon: Palette, accent: 'text-yellow-400' },
  // Developer
  { name: 'Supabase & PostgreSQL', category: 'Realtime Backend', icon: Database, accent: 'text-teal-400' },
  // Cameraman & Rigging
  { name: 'Gimbal & Cine Rigging', category: 'Stabilized Dynamic Capture', icon: Aperture, accent: 'text-pink-400' },
  // Developer
  { name: 'APIs & Server Architecture', category: 'High-Scale Backend', icon: Server, accent: 'text-blue-400' },
  // Photography / Lighting
  { name: 'Lighting & Scene Staging', category: 'Atmospheric Staging', icon: Sparkles, accent: 'text-amber-300' },
]

export function TechMarquee() {
  // Multiply items to ensure seamless infinite flow even on ultra-wide 4K screens
  const marqueeItems = [...SKILL_ITEMS, ...SKILL_ITEMS]


  return (
    <div className="relative w-full overflow-hidden py-4 sm:py-5 border-y border-white/[0.08] bg-gradient-to-r from-zinc-950 via-zinc-900/50 to-zinc-950 backdrop-blur-md select-none group/marquee">
      {/* Self-contained, guaranteed smooth GPU-accelerated left marquee styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marqueeToLeft {
              0% {
                transform: translate3d(0, 0, 0);
              }
              100% {
                transform: translate3d(-50%, 0, 0);
              }
            }
            .tech-marquee-content {
              display: flex;
              width: max-content;
              animation: marqueeToLeft 26s linear infinite;
              will-change: transform;
            }
            .group\\/marquee:hover .tech-marquee-content {
              animation-play-state: paused;
            }
          `,
        }}
      />

      {/* Left Edge Gradient Fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-44 bg-gradient-to-r from-[#030303] via-[#030303]/80 to-transparent z-10" />
      {/* Right Edge Gradient Fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-44 bg-gradient-to-l from-[#030303] via-[#030303]/80 to-transparent z-10" />

      {/* Marquee Track Moving Smoothly to the Left */}
      <div className="tech-marquee-content items-center gap-4">
        {marqueeItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={`${item.name}-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 group shrink-0 shadow-sm"
            >
              <div
                className={`p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.05] ${item.accent} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 tracking-wide group-hover:text-white transition-colors">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

