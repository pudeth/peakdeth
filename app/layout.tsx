import type { Metadata } from "next";
import "@fontsource/kantumruy-pro/300.css";
import "@fontsource/kantumruy-pro/400.css";
import "@fontsource/kantumruy-pro/500.css";
import "@fontsource/kantumruy-pro/600.css";
import "@fontsource/kantumruy-pro/700.css";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL('https://peakdeth.com'),
  title: {
    default: 'Peak Deth - POS, Management System, Website & Mobile App',
    template: '%s | Peak Deth',
  },
  description: 'Digital solutions, POS systems, Management Systems, modern websites, and mobile applications developed by Peak Deth.',
  keywords: ['POS', 'management system', 'website', 'mobile app', 'software development', 'web design', 'Peak Deth'],
  openGraph: {
    title: 'Peak Deth - POS, Management System, Website & Mobile App',
    description: 'Digital solutions, POS systems, Management Systems, modern websites, and mobile applications.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Peak Deth',
    images: [{ url: '/images/logo/logo_white.png', width: 1200, height: 630, alt: 'Peak Deth Digital Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peak Deth - POS, Management System, Website & Mobile App',
    description: 'Digital solutions, POS systems, Management Systems, modern websites, and mobile applications.',
    images: ['/images/logo/logo_white.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Web App Manifest is served via Next.js metadata from app/manifest.json */}
      </head>
      <body
        className="font-sans antialiased min-h-screen flex flex-col"
      >
        <LayoutWrapper footer={<Footer />}>{children}</LayoutWrapper>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
