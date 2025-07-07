'use client'

import { usePathname } from 'next/navigation'
import { MobileLayout } from './mobile-layout'
import { LanguageProvider } from '@/components/providers/language-provider'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current path is admin route
  const isAdminRoute = pathname?.startsWith('/admin')
  
  if (isAdminRoute) {
    // For admin routes, only wrap with LanguageProvider (no MobileLayout)
    return (
      <LanguageProvider>
        {children}
      </LanguageProvider>
    )
  }
  
  // For non-admin routes, use the full MobileLayout
  return (
    <LanguageProvider>
      <MobileLayout>
        {children}
      </MobileLayout>
    </LanguageProvider>
  )
}
