'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Home, Cpu, Code, Camera, Film, User, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [activeSection, setActiveSection] = useState<'home' | 'services'>('home')

  const navItems = [
    { href: '/', label: t.nav.home, icon: Home, exactMatch: true },
    { href: '/developer', label: t.nav.services, icon: Code },
    { href: '/gallery', label: t.nav.gallery, icon: Camera },
    { href: '/videos', label: t.nav.videos, icon: Film },
    { href: '/about', label: t.nav.about, icon: User },
    { href: '/contact', label: t.nav.contact, icon: Send },
  ]

  // Track active section on homepage dynamically based on scroll position ("Current processing")
  useEffect(() => {
    if (pathname !== '/') return

    const handleScroll = () => {
      const servicesElem =
        document.getElementById('services') ||
        document.getElementById('services-section')

      if (servicesElem) {
        const rect = servicesElem.getBoundingClientRect()
        // When Services section is in view or scrolled past hero
        if (rect.top <= 320 && rect.bottom >= 150) {
          setActiveSection('services')
          return
        }
      }

      // Scrolled back up to top/hero
      if (window.scrollY < 260) {
        setActiveSection('home')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Hide on studio and admin pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/studio')) {
    return null
  }

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href === '/') {
      if (pathname === '/') {
        e.preventDefault()
        setActiveSection('home')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }

    if (href === '/developer') {
      return
    }
  }

  return (
    <div className="fixed bottom-5 sm:bottom-7 inset-x-0 z-50 flex justify-center pointer-events-none md:hidden px-4">
      <motion.nav
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Mobile Navigation"
        className={cn(
          'pointer-events-auto relative flex items-center justify-between',
          'w-full max-w-[360px] h-[60px] px-3',
          'rounded-full bg-[#08090b]/90 backdrop-blur-2xl',
          'border border-white/[0.15]',
          'shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.2)]',
          'select-none'
        )}
      >
        {/* Atmospheric Edge Glows (Multi-tonal rim lighting like Image 2) */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-rose-500/15 to-transparent rounded-r-full pointer-events-none blur-md" />
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-emerald-500/15 to-transparent rounded-l-full pointer-events-none blur-md" />

        {/* Subtle Top Specular Sheen */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === '/'
              ? item.href === '/'
                ? activeSection === 'home'
                : item.href === '/developer'
                ? activeSection === 'services'
                : false
              : item.exactMatch
              ? pathname === item.href
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              title={item.label}
              aria-label={item.label}
              className={cn(
                'relative flex items-center justify-center flex-1 h-full',
                'active:scale-90 transition-transform group'
              )}
            >
              {/* Centered Circular Glass Disc - Inside Dock */}
              {isActive && (
                <motion.div
                  layoutId="activeNavCircle"
                  className="absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-b from-white/[0.18] via-white/[0.08] to-white/[0.02] border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35),0_0_15px_rgba(52,211,153,0.15)] -z-10 flex items-center justify-center"
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                >
                  {/* Subtle emerald ambient aura */}
                  <span className="absolute inset-0 rounded-full bg-emerald-400/10 blur-sm pointer-events-none" />
                </motion.div>
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  'w-5 h-5 transition-all duration-200',
                  isActive
                    ? 'text-white scale-105 drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]'
                    : 'text-zinc-400 group-hover:text-zinc-200'
                )}
              />
            </Link>
          )
        })}
      </motion.nav>
    </div>
  )
}
