'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Paintbrush, Users, Lightbulb, ArrowRight, CheckCircle } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"


export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      {/* Promotional Banner */}
      <div className="bg-stone-100 border-b border-stone-200">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-sm text-stone-700">
              <span className="font-medium">{t('banner.exclusiveOffer', 'home')}</span>
              <span className="ml-2">{t('banner.discount', 'home')}</span>
              <Link
                href="#"
                className="ml-4 text-slate-900 underline underline-offset-4 hover:no-underline font-medium"
              >
                {t('banner.shopCollection', 'home')}
              </Link>
              <span className="mx-2 text-stone-400">|</span>
              <Link href="#" className="text-slate-900 underline underline-offset-4 hover:no-underline">
                {t('banner.viewTerms', 'home')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="outline" className="border-slate-300 text-slate-700 font-medium">
                  {t('hero.badge', 'home')}
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-display font-medium text-slate-900 leading-[1.1] tracking-tight">
                  {t('hero.title', 'home')}
                  <br />
                  <span className="text-stone-600">{t('hero.subtitle', 'home')}</span>
                </h1>
                <p className="text-xl text-stone-600 leading-relaxed max-w-lg">
                  {t('hero.description', 'home')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="premium" className="group">
                  {t('hero.exploreLuxury', 'home')}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button asChild variant="outline" size="lg" className="border-slate-300">
                  <Link href="/colors">{t('hero.browseColors', 'home')}</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-slate-900">3,500+</div>
                  <div className="text-sm text-stone-600 uppercase tracking-wide">{t('hero.luxuryColors', 'home')}</div>
                </div>
                <div className="w-px h-12 bg-stone-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-slate-900">{t('hero.premium', 'home')}</div>
                  <div className="text-sm text-stone-600 uppercase tracking-wide">{t('hero.silkFinishes', 'home')}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=700&width=600"
                  alt={t('hero.imageAlt', 'home')}
                  width={600}
                  height={700}
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-6 rounded-sm shadow-lg border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-stone-200 rounded-sm"></div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-slate-900">{t('hero.colorName', 'home')}</h3>
                      <p className="text-stone-600">{t('hero.colorCode', 'home')}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {t('hero.signatureColor', 'home')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-medium text-slate-900 mb-6">{t('features.title', 'home')}</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              {t('features.description', 'home')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Palette,
                title: t('features.curatedPalette.title', 'home'),
                description: t('features.curatedPalette.description', 'home'),
                color: "text-blue-600",
              },
              {
                icon: Paintbrush,
                title: t('features.silkFormulation.title', 'home'),
                description: t('features.silkFormulation.description', 'home'),
                color: "text-green-600",
              },
              {
                icon: Users,
                title: t('features.designExpertise.title', 'home'),
                description: t('features.designExpertise.description', 'home'),
                color: "text-purple-600",
              },
              {
                icon: Lightbulb,
                title: t('features.innovation.title', 'home'),
                description: t('features.innovation.description', 'home'),
                color: "text-orange-600",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Colors Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-medium text-slate-900 mb-6">{t('signatureCollection.title', 'home')}</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              {t('signatureCollection.description', 'home')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: t('signatureCollection.colors.silkGray', 'home'), code: "SLX-23", color: "bg-gray-400", category: t('signatureCollection.categories.neutral', 'home') },
              { name: t('signatureCollection.colors.pearlDove', 'home'), code: "SLX-17", color: "bg-gray-100", category: t('signatureCollection.categories.white', 'home') },
              { name: t('signatureCollection.colors.midnightSilk', 'home'), code: "SLX-154", color: "bg-blue-900", category: t('signatureCollection.categories.blue', 'home') },
              { name: t('signatureCollection.colors.silkPewter', 'home'), code: "SLX-172", color: "bg-gray-300", category: t('signatureCollection.categories.neutral', 'home') },
              { name: t('signatureCollection.colors.onyxLuxury', 'home'), code: "SLX-10", color: "bg-gray-900", category: t('signatureCollection.categories.black', 'home') },
              { name: t('signatureCollection.colors.silkFern', 'home'), code: "SLX-40", color: "bg-green-200", category: t('signatureCollection.categories.green', 'home') },
            ].map((color, index) => (
              <Card key={index} className="group cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className={`w-full h-32 ${color.color} relative group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Badge variant="secondary" className="absolute top-3 left-3 text-xs bg-white/90 backdrop-blur-sm">
                      {color.category}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-medium text-slate-900">{color.name}</h3>
                    <p className="text-sm text-stone-600">{color.code}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/colors">
                {t('buttons.viewComplete')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Professional Services Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  {t('professionalServices.badge', 'home')}
                </Badge>
                <h2 className="text-4xl font-display font-medium leading-tight">
                  {t('professionalServices.title', 'home')}
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  {t('professionalServices.description', 'home')}
                </p>
              </div>

              <div className="space-y-4">
                {[
                  t('professionalServices.services.0', 'home'),
                  t('professionalServices.services.1', 'home'),
                  t('professionalServices.services.2', 'home'),
                  t('professionalServices.services.3', 'home'),
                ].map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{service}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  {t('buttons.scheduleConsultation')}
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link href="/professionals">{t('navigation.forProfessionals')}</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt={t('professionalServices.imageAlt', 'home')}
                width={500}
                height={600}
                className="rounded-sm shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
