"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { ErrorBoundary } from "@/components/error-boundary"
import { ScrollToTop } from "@/components/scroll-to-top"
import { NavigationProgress } from "@/components/navigation-progress"
import { ImageProtection } from "@/components/image-protection"
import { useScrollRestoration } from "@/hooks/use-scroll-restoration"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

import { LanguageProvider } from "@/lib/i18n/language-context"

export function LayoutWrapper({
  children,
  footer,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')
  const isAdminRoute = pathname?.startsWith('/admin')

  // Enable scroll restoration
  useScrollRestoration()

  // Don't show header for studio or admin routes
  if (isStudioRoute || isAdminRoute) {
    return <>{children}</>
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <NavigationProgress />
        <ImageProtection />
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          {footer}
          <ScrollToTop />
          <MobileBottomNav />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  )
}