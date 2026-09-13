'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { Language, TranslationDictionary, translations } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationDictionary
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'site_language_preference'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null
      if (savedLang && (savedLang === 'en' || savedLang === 'km' || savedLang === 'zh')) {
        setLanguageState(savedLang)
        document.documentElement.lang = savedLang
      }
    } catch {
      // Ignore localStorage errors in SSR or restricted privacy modes
    }
    setMounted(true)
  }, [])

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
      document.documentElement.lang = newLang
    } catch {
      // Ignore localStorage errors
    }
  }

  const t = useMemo(() => {
    return translations[language] || translations.en
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback if rendered outside of provider
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: translations.en,
    }
  }
  return context
}
