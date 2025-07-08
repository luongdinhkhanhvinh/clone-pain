'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { CustomerFormDrawer } from "@/components/cart/customer-form-drawer"
import { LanguageSelector } from "@/components/ui/language-selector"
import { Search, MapPin } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <LanguageSelector />
            </div>
            <div className="flex items-center gap-6">
              <Link href="#" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
                {t('header.findStore')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Silklux Logo"
              width={120}
              height={40}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-700 hover:text-slate-900 font-medium">
                  {t('navigation.woodColors')}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white border-white">
                  <div className="grid gap-3 p-8 w-[500px]">
                    <NavigationMenuLink asChild>
                      <Link href="/colors" className="block p-4 hover:bg-slate-50 rounded-sm transition-colors">
                        <div className="font-display font-medium text-slate-900 mb-1">{t('navigation.exploreColors')}</div>
                        <p className="text-sm text-slate-600">{t('header.exploreColorsDesc')}</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/color-match" className="block p-4 hover:bg-slate-50 rounded-sm transition-colors">
                        <div className="font-display font-medium text-slate-900 mb-1">{t('navigation.colorMatching')}</div>
                        <p className="text-sm text-slate-600">{t('header.colorMatchingDesc')}</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/wood-colors" className="block p-4 hover:bg-slate-50 rounded-sm transition-colors">
                        <div className="font-display font-medium text-slate-900 mb-1">{t('navigation.colorFamilies')}</div>
                        <p className="text-sm text-slate-600">{t('header.colorFamiliesDesc')}</p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-700 hover:text-slate-900 font-medium">
                  {t('navigation.products')}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white border-white">
                  <div className="grid gap-3 p-8 w-[500px]">
                    <NavigationMenuLink asChild>
                      <Link href="/products" className="block p-4 hover:bg-slate-50 rounded-sm transition-colors">
                        <div className="font-display font-medium text-slate-900 mb-1">{t('navigation.allProducts')}</div>
                        <p className="text-sm text-slate-600">{t('header.allProductsDesc')}</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/products?category=Interior+wood"
                        className="block p-4 hover:bg-slate-50 rounded-sm transition-colors"
                      >
                        <div className="font-display font-medium text-slate-900 mb-1">{t('navigation.interiorwood')}</div>
                        <p className="text-sm text-slate-600">Premium interior wood collections</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/products?category=Exterior+wood"
                        className="block p-4 hover:bg-slate-50 rounded-sm transition-colors"
                      >
                        <div className="font-display font-medium text-slate-900 mb-1">{t('navigation.exteriorwood')}</div>
                        <p className="text-sm text-slate-600">Weather-resistant exterior solutions</p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem> */}

              <NavigationMenuItem>
                <Link href="/wood-ideas" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-sm bg-background px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50">
                    {t('navigation.designIdeas')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/professionals" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-sm bg-background px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50">
                    {t('navigation.forProfessionals')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <Input
                placeholder={t('header.searchPlaceholder')}
                className="w-56 border-slate-200 focus:border-slate-400 rounded-sm"
              />
            </div>

            <CustomerFormDrawer />

            <Button className="hidden lg:block" size="default">
              {t('header.shopOnline')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
