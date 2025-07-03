'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

interface LanguageContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, namespace?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translation function for client-side
const translations: Record<string, Record<string, any>> = {
  en: {},
  vi: {}
}

// Load translations dynamically
const loadTranslations = async (locale: string, namespace: string = 'common') => {
  if (!translations[locale][namespace]) {
    try {
      const response = await fetch(`/locales/${locale}/${namespace}.json`)
      const data = await response.json()
      translations[locale][namespace] = data
    } catch (error) {
      console.error(`Failed to load translations for ${locale}/${namespace}:`, error)
      translations[locale][namespace] = {}
    }
  }
}

const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState('en')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get locale from localStorage or browser
    const savedLocale = localStorage.getItem('locale') || 
                       navigator.language.startsWith('vi') ? 'vi' : 'en'
    setLocaleState(savedLocale)
    
    // Load initial translations
    Promise.all([
      loadTranslations(savedLocale, 'common'),
      loadTranslations(savedLocale, 'home'),
      loadTranslations(savedLocale, 'colors'),
      loadTranslations(savedLocale, 'products'),
      loadTranslations(savedLocale, 'professionals'),
      loadTranslations(savedLocale, 'color-match'),
      loadTranslations(savedLocale, 'paint-colors'),
      loadTranslations(savedLocale, 'paint-ideas'),
      loadTranslations(savedLocale, 'components')
    ]).then(() => setIsLoaded(true))
  }, [])

  const setLocale = async (newLocale: string) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    
    // Load translations for new locale
    await Promise.all([
      loadTranslations(newLocale, 'common'),
      loadTranslations(newLocale, 'home'),
      loadTranslations(newLocale, 'colors'),
      loadTranslations(newLocale, 'products'),
      loadTranslations(newLocale, 'professionals'),
      loadTranslations(newLocale, 'color-match'),
      loadTranslations(newLocale, 'paint-colors'),
      loadTranslations(newLocale, 'paint-ideas'),
      loadTranslations(newLocale, 'components')
    ])
  }

  const t = (key: string, namespace: string = 'common'): string => {
    if (!isLoaded) return key
    
    const namespaceData = translations[locale]?.[namespace]
    if (!namespaceData) return key
    
    return getNestedValue(namespaceData, key)
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
