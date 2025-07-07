'use client'

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Wood Panel Logo"
                width={120}
                height={40}
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.products')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/products" className="hover:text-white">
                  {t('navigation.interiorwood')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  {t('navigation.exteriorwood')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  {t('navigation.luxuryFinishes')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  {t('navigation.primers')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  {t('navigation.specialtyProducts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.colors')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/colors" className="hover:text-white">
                  {t('navigation.exploreColors')}
                </Link>
              </li>
              <li>
                <Link href="/color-match" className="hover:text-white">
                  {t('navigation.colorMatching')}
                </Link>
              </li>
              <li>
                <Link href="/colors" className="hover:text-white">
                  {t('footer.popularColors')}
                </Link>
              </li>
              <li>
                <Link href="/wood-ideas" className="hover:text-white">
                  {t('footer.colorTrends')}
                </Link>
              </li>
              <li>
                <Link href="/wood-ideas" className="hover:text-white">
                  {t('navigation.designIdeas')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.stayConnected')}</h3>
            <p className="text-gray-300">{t('footer.newsletterDesc')}</p>
            <div className="flex gap-2">
              <Input
                placeholder={t('footer.emailPlaceholder')}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button>{t('footer.subscribe')}</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">{t('footer.copyright')}</p>
          <div className="flex gap-6 text-sm text-gray-300 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="#" className="hover:text-white">
              {t('footer.termsOfUse')}
            </Link>
            <Link href="#" className="hover:text-white">
              {t('footer.contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
