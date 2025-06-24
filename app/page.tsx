import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Paintbrush, Users, Lightbulb, ArrowRight, CheckCircle } from "lucide-react"

export const metadata = {
  title: "Premium Luxury Paint & Color Solutions",
  description:
    "Discover premium luxury paint with silk-like finishes. Over 3,500 sophisticated colors and professional-grade products for discerning designers and homeowners.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Promotional Banner */}
      <div className="bg-stone-100 border-b border-stone-200">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-sm text-stone-700">
              <span className="font-medium">Exclusive Offer:</span>
              <span className="ml-2">20% off SilkLux® Luxury Finishes & Samples</span>
              <Link
                href="#"
                className="ml-4 text-slate-900 underline underline-offset-4 hover:no-underline font-medium"
              >
                Shop Collection
              </Link>
              <span className="mx-2 text-stone-400">|</span>
              <Link href="#" className="text-slate-900 underline underline-offset-4 hover:no-underline">
                View Terms
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
                  Luxury Paint Solutions
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-display font-medium text-slate-900 leading-[1.1] tracking-tight">
                  Silk-Like Luxury.
                  <br />
                  <span className="text-stone-600">Unmatched Elegance.</span>
                </h1>
                <p className="text-xl text-stone-600 leading-relaxed max-w-lg">
                  Experience our exclusive collection of over 3,500 sophisticated colors with silk-like finishes,
                  crafted for the most discerning designers and luxury homeowners.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="premium" className="group">
                  Explore Luxury Collection
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button asChild variant="outline" size="lg" className="border-slate-300">
                  <Link href="/colors">Browse Colors</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-slate-900">3,500+</div>
                  <div className="text-sm text-stone-600 uppercase tracking-wide">Luxury Colors</div>
                </div>
                <div className="w-px h-12 bg-stone-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-slate-900">Premium</div>
                  <div className="text-sm text-stone-600 uppercase tracking-wide">Silk Finishes</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=700&width=600"
                  alt="Sophisticated interior with SilkLux premium paint finish"
                  width={600}
                  height={700}
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-6 rounded-sm shadow-lg border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-stone-200 rounded-sm"></div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-slate-900">Silk Fern</h3>
                      <p className="text-stone-600">SLX-2144</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Signature Color
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
            <h2 className="text-3xl font-display font-medium text-slate-900 mb-6">The SilkLux Difference</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Discover what sets our luxury paint solutions apart in quality, innovation, and sophisticated elegance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Palette,
                title: "Curated Luxury Palette",
                description:
                  "Expertly crafted colors with silk-like finishes, developed by our team of luxury design specialists.",
                color: "text-blue-600",
              },
              {
                icon: Paintbrush,
                title: "Silk-Like Formulation",
                description:
                  "Advanced paint technology delivering exceptional silk-like texture, coverage, and luxurious finish quality.",
                color: "text-green-600",
              },
              {
                icon: Users,
                title: "Luxury Design Expertise",
                description:
                  "Dedicated support from luxury design consultants and technical specialists for every project.",
                color: "text-purple-600",
              },
              {
                icon: Lightbulb,
                title: "Innovation Excellence",
                description: "Pioneering luxury finishes and cutting-edge color technology for sophisticated spaces.",
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
            <h2 className="text-3xl font-display font-medium text-slate-900 mb-6">Signature Luxury Collection</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Explore our most coveted colors, each carefully selected for their timeless elegance and silk-like finish.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Silk Gray", code: "SLX-23", color: "bg-gray-400", category: "Neutral" },
              { name: "Pearl Dove", code: "SLX-17", color: "bg-gray-100", category: "White" },
              { name: "Midnight Silk", code: "SLX-154", color: "bg-blue-900", category: "Blue" },
              { name: "Silk Pewter", code: "SLX-172", color: "bg-gray-300", category: "Neutral" },
              { name: "Onyx Luxury", code: "SLX-10", color: "bg-gray-900", category: "Black" },
              { name: "Silk Fern", code: "SLX-40", color: "bg-green-200", category: "Green" },
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
                View Complete Collection
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
                  Luxury Design Services
                </Badge>
                <h2 className="text-4xl font-display font-medium leading-tight">
                  Elevate Your Vision with Luxury Expertise
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Partner with our luxury design specialists and color experts to bring your most sophisticated projects
                  to life with unparalleled elegance and precision.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Personalized luxury color consultation",
                  "Professional silk finish matching",
                  "Luxury project specification support",
                  "Technical application guidance",
                ].map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{service}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  Schedule Consultation
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link href="/professionals">For Professionals</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Luxury color consultation with SilkLux expert"
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
