"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import {
  Home,
  Cpu,
  Code,
  Image as ImageIcon,
  Film,
  User,
  Send,
  FileText,
  ChevronRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Header() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Dynamic navigation links based on active language
  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/developer", label: t.nav.services },
    { href: "/cv", label: t.nav.cv },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/videos", label: t.nav.videos },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ]

  // Enhanced navigation items for mobile drawer
  const navItems = [
    { href: "/", label: t.nav.home, tag: t.mobileNavTags.home, icon: Home },
    { href: "/developer", label: t.nav.services, tag: t.mobileNavTags.services, icon: Code },
    { href: "/cv", label: t.nav.cv, tag: t.mobileNavTags.cv, icon: FileText },
    { href: "/gallery", label: t.nav.gallery, tag: t.mobileNavTags.gallery, icon: ImageIcon },
    { href: "/videos", label: t.nav.videos, tag: t.mobileNavTags.videos, icon: Film },
    { href: "/about", label: t.nav.about, tag: t.mobileNavTags.about, icon: User },
    { href: "/contact", label: t.nav.contact, tag: t.mobileNavTags.contact, icon: Send },
  ]



  // Detect scroll state with IntersectionObserver
  useEffect(() => {
    // On non-homepage, always show scrolled state
    if (pathname !== '/') {
      setIsScrolled(true)
      return
    }

    // On homepage, use IntersectionObserver to detect hero section
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "-80px 0px 0px 0px" // Trigger slightly before hero leaves viewport
      }
    )

    const heroSection = document.querySelector('section')
    if (heroSection) {
      observer.observe(heroSection)
    }

    return () => observer.disconnect()
  }, [pathname])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-[background-color,backdrop-filter,box-shadow,border-bottom-color] duration-500 ease-out will-change-[background-color,backdrop-filter]",
        isScrolled ? "nav-scrolled" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className={cn(
          "flex items-center justify-between transition-[height,gap] duration-500 ease-out",
          isScrolled ? "h-16" : "h-20"
        )}>
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "text-white font-bold hover:opacity-80 transition-[font-size,opacity] duration-500 ease-out uppercase",
              /[\u1780-\u17FF]/.test(t.header.brandName)
                ? "tracking-normal sm:tracking-wide font-medium"
                : "tracking-[0.3em] sm:tracking-[0.5em]",
              isScrolled ? "text-sm sm:text-base md:text-lg" : "text-base sm:text-lg md:text-xl lg:text-2xl"
            )}
            style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
            aria-label={`${t.header.brandName} - Home`}
          >
            <span>{t.header.brandName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={cn(
            "hidden md:flex items-center transition-[gap] duration-500 ease-out",
            isScrolled ? "gap-6" : "gap-8"
          )}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={cn(
                  "font-medium tracking-wide transition-[font-size,color] duration-300 ease-out relative group",
                  isScrolled ? "text-sm" : "text-base",
                  pathname === link.href
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
                style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-white transition-[width] duration-300 ease-out",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}

            {/* Desktop Language Selector */}
            <div className="pl-2 border-l border-white/10">
              <LanguageSwitcher align="right" />
            </div>
          </div>

          {/* Mobile Actions: Compact Language Switcher + Modern Mobile Menu Sheet */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="h-9 px-3 rounded-full bg-white/[0.06] border border-white/15 hover:border-white/30 hover:bg-white/[0.12] backdrop-blur-md text-white flex items-center gap-2 transition-all duration-300 shadow-sm active:scale-95 group"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium tracking-wider text-zinc-300 group-hover:text-white uppercase">
                    {t.header.menuLabel}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="bg-[#08090b]/95 backdrop-blur-3xl border-t border-x border-white/[0.12] rounded-t-[32px] max-w-lg mx-auto p-6 pb-8 text-white shadow-[0_-20px_50px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto"
              >
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>

                {/* Dynamic Island Drag Handle */}
                <div className="w-10 h-1 rounded-full bg-white/25 mx-auto mb-5" />

                {/* Ambient Edge Glows */}
                <div className="pointer-events-none absolute -top-10 right-0 w-44 h-44 bg-rose-500/15 blur-3xl rounded-full" />
                <div className="pointer-events-none absolute -top-10 left-0 w-44 h-44 bg-emerald-500/15 blur-3xl rounded-full" />

                <div className="relative z-10">
                  {/* Header Profile Info */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div>
                      <div
                        className={cn(
                          "text-lg font-bold text-white uppercase",
                          /[\u1780-\u17FF]/.test(t.header.brandName) ? "tracking-normal font-medium" : "tracking-[0.12em]"
                        )}
                        style={{ fontFamily: '"Kantumruy Pro", sans-serif' }}
                      >
                        {t.header.brandName}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {t.header.role}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>AVAILABLE</span>
                    </div>
                  </div>

                  {/* Language Switcher in Mobile Drawer */}
                  <div className="mt-4 pb-3 border-b border-white/[0.08]">
                    <LanguageSwitcher variant="drawer" />
                  </div>

                  {/* Streamlined Navigation Links */}
                  <nav className="grid grid-cols-2 gap-2 mt-4">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          onClick={closeMobileMenu}
                          className={cn(
                            "group relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300",
                            isActive
                              ? "bg-white/[0.10] border-white/25 text-white shadow-md"
                              : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 text-zinc-400 hover:text-white"
                          )}
                        >
                          <div
                            className={cn(
                              "p-2 rounded-xl border transition-all duration-300",
                              isActive
                                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                                : "bg-white/[0.04] border-white/5 text-zinc-400 group-hover:text-white"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span
                            className={cn(
                              "text-xs font-medium tracking-wide",
                              isActive ? "text-white" : "text-zinc-200 group-hover:text-white"
                            )}
                          >
                            {item.label}
                          </span>
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                {/* Bottom Quick CTA */}
                <div className="relative z-10 pt-4 border-t border-white/[0.08] mt-5">
                  <Link
                    href="/contact"
                    onClick={closeMobileMenu}
                    className="w-full py-3 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.01] active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                    <span>{t.header.startProject}</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}