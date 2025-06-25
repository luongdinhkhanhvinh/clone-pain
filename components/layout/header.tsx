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
import { Search, MapPin } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <span className="text-slate-300">English - United States</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">Español - Estados Unidos</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
                Find a Store
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
              src="logo.png"
              alt="SilkLux Logo"
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
                  Paint Colors
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white border-white">
                  <div className="grid gap-3 p-8 w-[500px]">
                    <NavigationMenuLink asChild>
                      <Link href="/colors" className="block p-4 hover:bg-slate-50 rounded-sm transition-colors">
                        <div className="font-display font-medium text-slate-900 mb-1">Explore Colors</div>
                        <p className="text-sm text-slate-600">Browse our complete collection of premium colors</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/color-match" className="block p-4 hover:bg-slate-50 rounded-sm transition-colors">
                        <div className="font-display font-medium text-slate-900 mb-1">Color Matching</div>
                        <p className="text-sm text-slate-600">Professional color matching and coordination</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/paint-colors" className="block p-4 hover:bg-slate-50 rounded-sm transition-colors">
                        <div className="font-display font-medium text-slate-900 mb-1">Color Families</div>
                        <p className="text-sm text-slate-600">Organized by color categories and families</p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-700 hover:text-slate-900 font-medium">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white border-white">
                  <div className="grid gap-3 p-8 w-[500px]">
                    <NavigationMenuLink asChild>
                      <Link href="/products" className="block p-4 hover:bg-slate-50 rounded-sm transition-colors">
                        <div className="font-display font-medium text-slate-900 mb-1">All Products</div>
                        <p className="text-sm text-slate-600">Complete range of premium paint products</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/products?category=Interior+Paint"
                        className="block p-4 hover:bg-slate-50 rounded-sm transition-colors"
                      >
                        <div className="font-display font-medium text-slate-900 mb-1">Interior Paint</div>
                        <p className="text-sm text-slate-600">Premium interior paint collections</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/products?category=Exterior+Paint"
                        className="block p-4 hover:bg-slate-50 rounded-sm transition-colors"
                      >
                        <div className="font-display font-medium text-slate-900 mb-1">Exterior Paint</div>
                        <p className="text-sm text-slate-600">Weather-resistant exterior solutions</p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/paint-ideas" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-sm bg-background px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Design Ideas
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/professionals" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-sm bg-background px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    For Professionals
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
                placeholder="Search colors, products..."
                className="w-56 border-slate-200 focus:border-slate-400 rounded-sm"
              />
            </div>

            <CustomerFormDrawer />

            <Button className="hidden lg:block" size="default">
              Shop Online
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
