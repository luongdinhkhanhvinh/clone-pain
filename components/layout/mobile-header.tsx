'use client'

import Link from "next/link"
import Image from "next/image"
import { LanguageSelector } from "@/components/ui/language-selector"

export function MobileHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 md:hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Wood Panel Logo"
              width={100}
              height={32}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Language Selector */}
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
}
