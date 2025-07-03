"use client"

import type React from "react"

import { useLanguage } from "@/components/providers/language-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Award,
  BookOpen,
  Calculator,
  CheckCircle,
  DollarSign,
  Download,
  Mail,
  MapPin,
  Palette,
  Phone,
  Star,
  TrendingUp,
  Truck,
  Users
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Professional products will be generated dynamically with translations


export default function ProfessionalsPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    businessType: "",
    experience: "",
    message: "",
  })

  const benefits = [
    {
      icon: DollarSign,
      title: t('benefits.tradeDiscount.title', 'professionals'),
      description: t('benefits.tradeDiscount.description', 'professionals'),
    },
    {
      icon: Truck,
      title: t('benefits.fastDelivery.title', 'professionals'),
      description: t('benefits.fastDelivery.description', 'professionals'),
    },
    {
      icon: Users,
      title: t('benefits.technicalSupport.title', 'professionals'),
      description: t('benefits.technicalSupport.description', 'professionals'),
    },
    {
      icon: BookOpen,
      title: t('benefits.trainingPrograms.title', 'professionals'),
      description: t('benefits.trainingPrograms.description', 'professionals'),
    },
    {
      icon: Calculator,
      title: t('tools.title', 'professionals'),
      description: t('benefits.marketingSupport.description', 'professionals'),
    },
    {
      icon: Award,
      title: t('benefits.recognitionPrograms.title', 'professionals'),
      description: t('benefits.recognitionPrograms.description', 'professionals'),
    },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const professionalProducts = [
    {
      name: t('products.advanceWaterborne.name', 'professionals'),
      category: t('products.advanceWaterborne.category', 'professionals'),
      description: t('products.advanceWaterborne.description', 'professionals'),
      features: [
        t('products.advanceWaterborne.features.selfLeveling', 'professionals'),
        t('products.advanceWaterborne.features.excellentFlow', 'professionals'),
        t('products.advanceWaterborne.features.durableFinish', 'professionals'),
        t('products.advanceWaterborne.features.lowOdor', 'professionals')
      ],
      coverage: t('products.advanceWaterborne.coverage', 'professionals'),
      price: t('products.contactForPricing', 'professionals'),
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      name: t('products.auraGrandEntrance.name', 'professionals'),
      category: t('products.auraGrandEntrance.category', 'professionals'),
      description: t('products.auraGrandEntrance.description', 'professionals'),
      features: [
        t('products.auraGrandEntrance.features.fadeResistant', 'professionals'),
        t('products.auraGrandEntrance.features.selfPriming', 'professionals'),
        t('products.auraGrandEntrance.features.mildewResistant', 'professionals'),
        t('products.auraGrandEntrance.features.easyCleanup', 'professionals')
      ],
      coverage: t('products.auraGrandEntrance.coverage', 'professionals'),
      price: t('products.contactForPricing', 'professionals'),
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      name: t('products.corotechV160.name', 'professionals'),
      category: t('products.corotechV160.category', 'professionals'),
      description: t('products.corotechV160.description', 'professionals'),
      features: [
        t('products.corotechV160.features.highDurability', 'professionals'),
        t('products.corotechV160.features.chemicalResistant', 'professionals'),
        t('products.corotechV160.features.easyMaintenance', 'professionals'),
        t('products.corotechV160.features.vocCompliant', 'professionals')
      ],
      coverage: t('products.corotechV160.coverage', 'professionals'),
      price: t('products.contactForPricing', 'professionals'),
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">{t('hero.title', 'professionals')}</h1>
              <p className="text-xl mb-8 text-gray-300">
                {t('hero.description', 'professionals')}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  {t('buttons.joinTradeProgram')}
                </Button>
                <Button
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  {t('buttons.findRep')}
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/profess/chuyengia.jpg/?height=400&width=600"
                alt={t('hero.imageAlt', 'professionals')}
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="benefits" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="benefits">{t('benefits.title', 'professionals')}</TabsTrigger>
            <TabsTrigger value="products">{t('navigation.products')}</TabsTrigger>
            {/* <TabsTrigger value="training">{t('benefits.trainingPrograms.title', 'professionals')}</TabsTrigger> */}
            <TabsTrigger value="tools">{t('tools.title', 'professionals')}</TabsTrigger>
            <TabsTrigger value="join">{t('form.title', 'professionals')}</TabsTrigger>
          </TabsList>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('benefits.title', 'professionals')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('benefits.description', 'professionals')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <benefit.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Success Stories</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: t('testimonials.mikesWooding.name', 'professionals'),
                    location: t('testimonials.mikesWooding.location', 'professionals'),
                    testimonial: t('testimonials.mikesWooding.testimonial', 'professionals'),
                    rating: 5,
                  },
                  {
                    name: t('testimonials.eliteContractors.name', 'professionals'),
                    location: t('testimonials.eliteContractors.location', 'professionals'),
                    testimonial: t('testimonials.eliteContractors.testimonial', 'professionals'),
                    rating: 5,
                  },
                  {
                    name: t('testimonials.precisionWooding.name', 'professionals'),
                    location: t('testimonials.precisionWooding.location', 'professionals'),
                    testimonial: t('testimonials.precisionWooding.testimonial', 'professionals'),
                    rating: 5,
                  },
                ].map((story, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4 italic">"{story.testimonial}"</p>
                      <div>
                        <p className="font-semibold">{story.name}</p>
                        <p className="text-sm text-gray-500">{story.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('products.title', 'professionals')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('products.description', 'professionals')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {professionalProducts.map((product, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-6 space-y-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{t('products.coverage', 'professionals')}: {product.coverage}</p>
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="font-semibold text-gray-900">{product.price}</span>
                        <Button size="sm">{t('products.getQuote', 'professionals')}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Product Categories */}
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              {[
                { name: t('products.categories.interiorWoods.name', 'professionals'), count: t('products.categories.interiorWoods.count', 'professionals'), icon: "🏠" },
                { name: t('products.categories.exteriorWoods.name', 'professionals'), count: t('products.categories.exteriorWoods.count', 'professionals'), icon: "🏢" },
                { name: t('products.categories.commercialCoatings.name', 'professionals'), count: t('products.categories.commercialCoatings.count', 'professionals'), icon: "🏭" },
                { name: t('products.categories.specialtyFinishes.name', 'professionals'), count: t('products.categories.specialtyFinishes.count', 'professionals'), icon: "✨" },
              ].map((category, index) => (
                <Card key={index} className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('tools.title', 'professionals')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('tools.description', 'professionals')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: t('tools.calculator.title', 'professionals'),
                  description: t('tools.calculator.description', 'professionals'),
                  icon: Calculator,
                  link: "/tools/calculator",
                },
                {
                  title: t('tools.colorVisualizer.title', 'professionals'),
                  description: t('tools.colorVisualizer.description', 'professionals'),
                  icon: Palette,
                  link: "/tools/visualizer",
                },
                {
                  title: t('tools.projectEstimator.title', 'professionals'),
                  description: t('tools.projectEstimator.description', 'professionals'),
                  icon: TrendingUp,
                  link: "/tools/estimator",
                },
                {
                  title: t('tools.technicalDataSheets.title', 'professionals'),
                  description: t('tools.technicalDataSheets.description', 'professionals'),
                  icon: Download,
                  link: "/tools/datasheets",
                },
              ].map((tool, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <tool.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={tool.link}>{t('tools.accessTool', 'professionals')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mobile App */}
            <Card className="bg-gray-900 text-white">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{t('tools.mobileApp.title', 'professionals')}</h3>
                    <p className="text-gray-300 mb-6">
                      {t('tools.mobileApp.description', 'professionals')}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{t('tools.mobileApp.features.colorMatching', 'professionals')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{t('tools.mobileApp.features.projectManagement', 'professionals')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{t('tools.mobileApp.features.offlineAccess', 'professionals')}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button className="bg-white text-gray-900 hover:bg-gray-100">{t('tools.downloadIOS', 'professionals')}</Button>
                      <Button className="border-white text-white hover:bg-white hover:text-gray-900">
                        {t('tools.downloadAndroid', 'professionals')}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      alt={t('tools.mobileAppAlt', 'professionals')}
                      width={300}
                      height={400}
                      className="mx-auto"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Join Program Tab */}
          <TabsContent value="join" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('form.title', 'professionals')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('form.description', 'professionals')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Application Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('form.applicationTitle', 'professionals')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t('form.firstName', 'professionals')}</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t('form.lastName', 'professionals')}</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">{t('form.company', 'professionals')}</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">{t('form.email', 'professionals')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('form.phone', 'professionals')}</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="businessType">{t('form.businessType', 'professionals')}</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => handleInputChange("businessType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.selectBusinessType', 'professionals')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wooder">{t('form.businessTypes.wooder', 'professionals')}</SelectItem>
                          <SelectItem value="contractor">{t('form.businessTypes.contractor', 'professionals')}</SelectItem>
                          <SelectItem value="designer">{t('form.businessTypes.designer', 'professionals')}</SelectItem>
                          <SelectItem value="architect">{t('form.businessTypes.architect', 'professionals')}</SelectItem>
                          <SelectItem value="retailer">{t('form.businessTypes.retailer', 'professionals')}</SelectItem>
                          <SelectItem value="other">{t('form.businessTypes.other', 'professionals')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience">{t('form.experience', 'professionals')}</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => handleInputChange("experience", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.selectExperience', 'professionals')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">{t('form.experienceOptions.1-2', 'professionals')}</SelectItem>
                          <SelectItem value="3-5">{t('form.experienceOptions.3-5', 'professionals')}</SelectItem>
                          <SelectItem value="6-10">{t('form.experienceOptions.6-10', 'professionals')}</SelectItem>
                          <SelectItem value="10+">{t('form.experienceOptions.10+', 'professionals')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">{t('form.message', 'professionals')}</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder={t('form.messagePlaceholder', 'professionals')}
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      {t('form.submit', 'professionals')}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('contact.needHelp', 'professionals')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{t('contact.professionalSupport', 'professionals')}</p>
                        <p className="text-gray-600">1-800-SilkLux</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{t('contact.emailSupport', 'professionals')}</p>
                        <p className="text-gray-600">professionals@silkLux.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{t('contact.findRepresentative', 'professionals')}</p>
                        <Button variant="link" className="p-0 h-auto text-blue-600">
                          {t('contact.locateRep', 'professionals')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('requirements.title', 'professionals')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {t('requirements.businessLicense', 'professionals')}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {t('requirements.professionalExperience', 'professionals')}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {t('requirements.minimumVolume', 'professionals')}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {t('requirements.qualityStandards', 'professionals')}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
