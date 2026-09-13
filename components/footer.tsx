'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/language-context'

export function Footer() {
  const { language } = useLanguage()
  const [copyright, setCopyright] = useState('© 2026 Peak Deth. All rights reserved.')
  const [madeByName, setMadeByName] = useState<string | undefined>(undefined)
  const [madeByUrl, setMadeByUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Check localStorage cache first
    try {
      const cached = localStorage.getItem('site_settings_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.footer_copyright) {
          setCopyright(parsed.footer_copyright.replace(/Rithy\s+Chanvirak/gi, 'Peak Deth'))
        }
        if (parsed.footer_made_by_name) {
          setMadeByName(parsed.footer_made_by_name.replace(/Rithy\s+Chanvirak/gi, 'Peak Deth'))
        }
        if (parsed.footer_made_by_url) {
          setMadeByUrl(parsed.footer_made_by_url)
        }
      }
    } catch {}

    // Then check Supabase
    async function fetchFooterSettings() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['footer_copyright', 'footer_made_by_name', 'footer_made_by_url'])

        if (data && data.length > 0) {
          const map: Record<string, string> = {}
          data.forEach((item: any) => {
            map[item.key] = item.value
          })
          if (map['footer_copyright']) {
            setCopyright(map['footer_copyright'].replace(/Rithy\s+Chanvirak/gi, 'Peak Deth'))
          }
          if (map['footer_made_by_name']) {
            setMadeByName(map['footer_made_by_name'].replace(/Rithy\s+Chanvirak/gi, 'Peak Deth'))
          }
          if (map['footer_made_by_url']) {
            setMadeByUrl(map['footer_made_by_url'])
          }
        }
      } catch {}
    }

    fetchFooterSettings()
  }, [])

  const displayCopyright =
    language === 'km'
      ? copyright
          .replace(/©\s*\d{4}\s*Peak\s*Deth/gi, '© 2026 ពាក្យ ដេត')
          .replace(/All\s*rights\s*reserved\.?/gi, 'រក្សាសិទ្ធិគ្រប់យ៉ាង។')
          .replace(/Peak\s*Deth/gi, 'ពាក្យ ដេត')
      : copyright

  const displayMadeByName =
    language === 'km' && madeByName
      ? madeByName.replace(/Peak\s*Deth/gi, 'ពាក្យ ដេត')
      : madeByName

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#030303] pt-8 pb-28 md:pb-8 text-sm text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className={language === 'km' ? 'font-khmer' : ''}>{displayCopyright}</p>
        
        {displayMadeByName && (
          <p className="flex items-center gap-1.5">
            <span>{language === 'km' ? 'គេហទំព័រដោយ' : 'Site by'}</span>
            {madeByUrl ? (
              <a 
                href={madeByUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {displayMadeByName}
              </a>
            ) : (
              <span className="font-medium text-zinc-400">{displayMadeByName}</span>
            )}
          </p>
        )}
      </div>
    </footer>
  )
}
