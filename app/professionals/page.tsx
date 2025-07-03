"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Award,
  BookOpen,
  Calculator,
  Palette,
  Phone,
  Mail,
  MapPin,
  Download,
  Star,
  CheckCircle,
  TrendingUp,
  Clock,
  DollarSign,
  Truck,
} from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const professionalProducts = [
  {
    name: "Advance Waterborne Interior Alkyd",
    category: "Premium Interior",
    description: "Self-leveling paint with the durability of oil in a waterborne formula",
    features: ["Self-leveling", "Excellent flow", "Durable finish", "Low odor"],
    coverage: "350-400 sq ft",
    price: "Contact for pricing",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Aura Grand Entrance",
    category: "Exterior Premium",
    description: "Ultra-premium exterior paint with lifetime limited warranty",
    features: ["Fade resistant", "Self-priming", "Mildew resistant", "Easy cleanup"],
    coverage: "350-400 sq ft",
    price: "Contact for pricing",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Corotech V160",
    category: "Commercial",
    description: "High-performance commercial coating for demanding environments",
    features: ["High durability", "Chemical resistant", "Easy maintenance", "VOC compliant"],
    coverage: "400-450 sq ft",
    price: "Contact for pricing",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const trainingPrograms = [
  {
    title: "Color Theory for Professionals",
    duration: "4 hours",
    format: "Online",
    level: "Intermediate",
    description: "Master color relationships and create stunning color schemes for clients",
    topics: ["Color wheel fundamentals", "Undertones and LRV", "Color psychology", "Trend forecasting"],
    price: "Free for trade members",
  },
  {
    title: "Advanced Application Techniques",
    duration: "8 hours",
    format: "In-person",
    level: "Advanced",
    description: "Learn professional application methods for flawless finishes",
    topics: ["Surface preparation", "Spray techniques", "Specialty finishes", "Problem solving"],
    price: "$299",
  },
  {
    title: "Business Development Workshop",
    duration: "6 hours",
    format: "Hybrid",
    level: "All levels",
    description: "Grow your painting business with proven strategies and tools",
    topics: ["Marketing strategies", "Pricing models", "Customer relations", "Digital tools"],
    price: "$199",
  },
]



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
                src="/placeholder.svg?height=400&width=600"
                alt="Professional painter at work"
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="benefits">{t('benefits.title', 'professionals')}</TabsTrigger>
            <TabsTrigger value="products">{t('navigation.products')}</TabsTrigger>
            <TabsTrigger value="training">{t('benefits.trainingPrograms.title', 'professionals')}</TabsTrigger>
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
                    name: "Mike's Painting Co.",
                    location: "Denver, CO",
                    testimonial:
                      "Benjamin Moore's trade program has helped us increase our margins by 25% while delivering superior quality to our clients.",
                    rating: 5,
                  },
                  {
                    name: "Elite Contractors",
                    location: "Austin, TX",
                    testimonial:
                      "The training programs have elevated our team's skills and helped us win more high-end projects.",
                    rating: 5,
                  },
                  {
                    name: "Precision Painting",
                    location: "Seattle, WA",
                    testimonial:
                      "Job site delivery and dedicated support have streamlined our operations significantly.",
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Products</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Premium paint lines designed for professional applications and demanding projects
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
                        <p className="text-sm text-gray-600">Coverage: {product.coverage}</p>
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
                        <Button size="sm">Get Quote</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Product Categories */}
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              {[
                { name: "Interior Paints", count: "25+ Products", icon: "🏠" },
                { name: "Exterior Paints", count: "20+ Products", icon: "🏢" },
                { name: "Commercial Coatings", count: "15+ Products", icon: "🏭" },
                { name: "Specialty Finishes", count: "10+ Products", icon: "✨" },
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

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Training</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Enhance your skills and grow your business with our comprehensive training programs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {trainingPrograms.map((program, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={program.format === "Online" ? "default" : "secondary"}>{program.format}</Badge>
                      <Badge variant="outline">{program.level}</Badge>
                    </div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{program.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {program.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        {program.price}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Topics Covered:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {program.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full">Enroll Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Certification Program */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-8 h-8 text-blue-600" />
                      <h3 className="text-2xl font-bold text-gray-900">Certification Program</h3>
                    </div>
                    <p className="text-gray-700 mb-6">
                      Become a Benjamin Moore Certified Professional and showcase your expertise to clients. Our
                      comprehensive certification program covers color theory, product knowledge, and application
                      techniques.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Industry-recognized certification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Marketing materials and badge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Continuing education credits</span>
                      </div>
                    </div>
                    <Button size="lg">Learn More</Button>
                  </div>
                  <div>
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Certification program"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Tools</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Access powerful tools and resources to streamline your projects and grow your business
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Paint Calculator",
                  description: "Calculate exact paint quantities for any project",
                  icon: Calculator,
                  link: "/tools/calculator",
                },
                {
                  title: "Color Visualizer",
                  description: "Show clients how colors will look in their space",
                  icon: Palette,
                  link: "/tools/visualizer",
                },
                {
                  title: "Project Estimator",
                  description: "Generate professional estimates and proposals",
                  icon: TrendingUp,
                  link: "/tools/estimator",
                },
                {
                  title: "Technical Data Sheets",
                  description: "Access detailed product specifications",
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
                      <Link href={tool.link}>Access Tool</Link>
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
                    <h3 className="text-2xl font-bold mb-4">Benjamin Moore Pro App</h3>
                    <p className="text-gray-300 mb-6">
                      Take your business mobile with our professional app. Access color tools, calculators, product
                      information, and more right from your phone or tablet.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Color matching and visualization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Project management tools</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Offline access to key features</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button className="bg-white text-gray-900 hover:bg-gray-100">Download iOS</Button>
                      <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                        Download Android
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      alt="Mobile app screenshot"
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
                  <CardTitle>Trade Program Application</CardTitle>
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
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => handleInputChange("businessType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="painter">Professional Painter</SelectItem>
                          <SelectItem value="contractor">General Contractor</SelectItem>
                          <SelectItem value="designer">Interior Designer</SelectItem>
                          <SelectItem value="architect">Architect</SelectItem>
                          <SelectItem value="retailer">Paint Retailer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => handleInputChange("experience", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us about your business and painting needs..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Professional Support</p>
                        <p className="text-gray-600">1-800-BENJAMIN</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Email Support</p>
                        <p className="text-gray-600">professionals@benjaminmoore.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Find a Representative</p>
                        <Button variant="link" className="p-0 h-auto text-blue-600">
                          Locate your local rep
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Program Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Valid business license
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Professional painting experience
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Minimum annual volume requirements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Commitment to quality standards
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
