'use client'

import { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileHeader } from "@/components/layout/mobile-header"
import { BottomNavigation } from "@/components/layout/bottom-navigation"

interface MobileLayoutProps {
  children: ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Only on mobile */}
      <MobileHeader />

      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Main Content */}
      <main className="md:min-h-screen">
        {/* Mobile: Add padding bottom for bottom nav */}
        <div className="pb-16 md:pb-0">
          {children}
        </div>
      </main>

      {/* Desktop Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <BottomNavigation />
    </div>
  )
}
