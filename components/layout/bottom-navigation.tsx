'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Palette, Package, Lightbulb, Users, User } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { CustomerFormDrawer } from "@/components/cart/customer-form-drawer"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const { t } = useLanguage()
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: t('navigation.home', 'common'),
      isActive: pathname === "/"
    },
    {
      href: "/colors",
      icon: Palette,
      label: t('navigation.woodColors', 'common'),
      isActive: pathname.startsWith("/colors")
    },
    // {
    //   href: "/products",
    //   icon: Package,
    //   label: t('navigation.products', 'common'),
    //   isActive: pathname.startsWith("/products")
    // },
    {
      href: "/wood-ideas",
      icon: Lightbulb,
      label: t('navigation.designIdeas', 'common'),
      isActive: pathname.startsWith("/wood-ideas")
    },
    // {
    //   href: "/professionals",
    //   icon: Users,
    //   label: t('navigation.forProfessionals', 'common'),
    //   isActive: pathname.startsWith("/professionals")
    // }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "bottom-nav-item",
                item.isActive && "active"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight text-center px-1">
                {item.label}
              </span>
            </Link>
          )
        })}
        
        {/* Login/Profile Tab */}
        <div className="flex flex-col items-center justify-center space-y-1 text-xs text-gray-600">
          <CustomerFormDrawer />
          <span className="text-[10px] leading-tight text-center px-1">
            {t('cart.customerInfo', 'components')}
          </span>
        </div>
      </div>
    </div>
  )
}
