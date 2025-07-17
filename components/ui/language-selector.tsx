'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Loader2 } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Việt Nam', flag: '🇻🇳' },
]

export function LanguageSelector() {
  const { locale, setLocale, isLoading } = useLanguage()
  const [isChanging, setIsChanging] = useState(false)
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  const handleLanguageChange = async (languageCode: string) => {
    if (isLoading || isChanging || languageCode === locale) return
    
    try {
      setIsChanging(true)
      await setLocale(languageCode)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-2" disabled={isLoading || isChanging}>
          {(isLoading || isChanging) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={locale === language.code ? 'bg-accent' : ''}
            disabled={isLoading || isChanging}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
            {(isLoading || isChanging) && locale === language.code && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
