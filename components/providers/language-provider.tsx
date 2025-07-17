'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

interface LanguageContextType {
  locale: string
  setLocale: (locale: string) => Promise<void>
  t: (key: string, namespace?: string) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface TranslationCache {
  timestamp: number
  data: Record<string, any>
}

const translations: Record<string, Record<string, TranslationCache>> = {
  en: {},
  vi: {}
}

const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

const NAMESPACES = [
  'common',
  'home',
  'colors',
  'products',
  'professionals',
  'color-match',
  'wood-colors',
  'wood-ideas',
  'components'
]

// Load translations dynamically with caching
const loadTranslations = async (locale: string, namespace: string = 'common') => {
  const now = Date.now()
  const cached = translations[locale][namespace]

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return true
  }

  try {
    const response = await fetch(`/locales/${locale}/${namespace}.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    translations[locale][namespace] = {
      timestamp: now,
      data
    }
    return true
  } catch (error) {
    console.error(`Failed to load translations for ${locale}/${namespace}:`, error)
    return false
  }
}

const getNestedValue = (obj: any, path: string): string => {
  const value = path.split('.').reduce((current, key) => current?.[key], obj)
  return value !== undefined ? value : path
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState('en')
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const loadAllTranslations = useCallback(async (targetLocale: string) => {
    setIsLoading(true)
    setRetryCount(0)

    const loadWithRetry = async (attempt: number = 0): Promise<boolean> => {
      if (attempt >= 3) return false

      try {
        const results = await Promise.all(
          NAMESPACES.map(namespace => loadTranslations(targetLocale, namespace))
        )
        return results.every(result => result)
      } catch (error) {
        console.error(`Failed to load translations (attempt ${attempt + 1}):`, error)
        return loadWithRetry(attempt + 1)
      }
    }

    try {
      const success = await loadWithRetry()
      if (!success) {
        console.error('Failed to load translations after multiple attempts')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 
                       (navigator.language.startsWith('vi') ? 'vi' : 'en')
    setLocaleState(savedLocale)
    loadAllTranslations(savedLocale)
  }, [])

  const setLocale = async (newLocale: string) => {
    if (newLocale === locale || isLoading) return
    
    setIsLoading(true)
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    
    await loadAllTranslations(newLocale)
  }

  const t = (key: string, namespace: string = 'common'): string => {
    if (isLoading) return key
    
    const namespaceCache = translations[locale]?.[namespace]
    if (!namespaceCache?.data) {
      console.warn(`Missing namespace: ${namespace} for locale: ${locale}`)
      return key
    }
    
    const value = getNestedValue(namespaceCache.data, key)
    if (value === key) {
      console.warn(`Missing translation key: ${key} in namespace: ${namespace} for locale: ${locale}`)
    }
    return value
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isLoading }}>
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
