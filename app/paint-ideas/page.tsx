"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Bookmark, Share2, TrendingUp } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const roomCategories = [
  "All Rooms",
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Home Office",
  "Exterior",
]
const styleCategories = [
  "All Styles",
  "Modern",
  "Traditional",
  "Farmhouse",
  "Minimalist",
  "Bohemian",
  "Industrial",
  "Coastal",
]

const trendingColors = [
  { name: "Aegean Teal", code: "2136-40", hex: "#4A90A4", trend: "Ocean Inspired" },
  { name: "October Mist", code: "1495", hex: "#C5B8A5", trend: "Warm Neutrals" },
  { name: "Forest Green", code: "2047-10", hex: "#355E3B", trend: "Nature's Palette" },
  { name: "Raspberry Blush", code: "2008-30", hex: "#D4A5A5", trend: "Soft Romance" },
]

const colorSchemes = [
  {
    id: 1,
    name: "Serene Sanctuary",
    description: "Calming blues and soft whites create a peaceful retreat",
    colors: ["#E8F4F8", "#B8D4E3", "#7FB3D3", "#4A90A4"],
    room: "Bedroom",
    style: "Modern",
    image: "/placeholder.svg?height=300&width=400",
    likes: 245,
    saves: 89,
  },
  {
    id: 2,
    name: "Warm Earth Tones",
    description: "Rich terracotta and warm beiges for a cozy atmosphere",
    colors: ["#F5E6D3", "#E8C5A0", "#D4A574", "#B8956A"],
    room: "Living Room",
    style: "Traditional",
    image: "/placeholder.svg?height=300&width=400",
    likes: 312,
    saves: 156,
  },
  {
    id: 3,
    name: "Fresh Kitchen Greens",
    description: "Sage and mint greens with crisp white accents",
    colors: ["#FFFFFF", "#F0F4F0", "#C8D5C8", "#87A96B"],
    room: "Kitchen",
    style: "Farmhouse",
    image: "/placeholder.svg?height=300&width=400",
    likes: 189,
    saves: 203,
  },
  {
    id: 4,
    name: "Bold Statement Wall",
    description: "Deep navy creates drama with gold accents",
    colors: ["#F8F6F0", "#D4AF37", "#2C3E50", "#1B2951"],
    room: "Dining Room",
    style: "Modern",
    image: "/placeholder.svg?height=300&width=400",
    likes: 278,
    saves: 134,
  },
  {
    id: 5,
    name: "Spa-Like Bathroom",
    description: "Soft grays and whites for a clean, relaxing feel",
    colors: ["#FFFFFF", "#F5F5F5", "#D3D3D3", "#9B9B9B"],
    room: "Bathroom",
    style: "Minimalist",
    image: "/placeholder.svg?height=300&width=400",
    likes: 156,
    saves: 98,
  },
  {
    id: 6,
    name: "Cozy Home Office",
    description: "Warm grays with pops of energizing orange",
    colors: ["#F7F4F2", "#E5DDD5", "#D4A574", "#FF8C42"],
    room: "Home Office",
    style: "Industrial",
    image: "/placeholder.svg?height=300&width=400",
    likes: 134,
    saves: 67,
  },
]

const expertTips = [
  {
    title: "The 60-30-10 Rule",
    description: "Use 60% dominant color, 30% secondary color, and 10% accent color for balanced rooms.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Test Colors in Different Light",
    description: "Paint large swatches and observe them throughout the day in various lighting conditions.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Consider Room Function",
    description: "Choose energizing colors for workspaces and calming tones for bedrooms.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function PaintIdeasPage() {
  const { t } = useLanguage()
  const [selectedRoom, setSelectedRoom] = useState("All Rooms")
  const [selectedStyle, setSelectedStyle] = useState("All Styles")
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])
  const [saved, setSaved] = useState<number[]>([])

  const roomCategories = [
    t('rooms.livingRoom', 'paint-ideas'),
    t('rooms.bedroom', 'paint-ideas'),
    t('rooms.kitchen', 'paint-ideas'),
    t('rooms.bathroom', 'paint-ideas'),
    t('rooms.diningRoom', 'paint-ideas'),
    t('rooms.homeOffice', 'paint-ideas'),
    t('rooms.exterior', 'paint-ideas')
  ]

  const styleCategories = [
    t('styles.modern', 'paint-ideas'),
    t('styles.traditional', 'paint-ideas'),
    t('styles.farmhouse', 'paint-ideas'),
    t('styles.minimalist', 'paint-ideas'),
    t('styles.bohemian', 'paint-ideas')
  ]

  const filteredSchemes = colorSchemes.filter((scheme) => {
    const matchesRoom = selectedRoom === "All Rooms" || scheme.room === selectedRoom
    const matchesStyle = selectedStyle === "All Styles" || scheme.style === selectedStyle
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRoom && matchesStyle && matchesSearch
  })

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const toggleSaved = (id: number) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((save) => save !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title', 'paint-ideas')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description', 'paint-ideas')}
          </p>
        </div>

        <Tabs defaultValue="inspiration" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inspiration">Room Inspiration</TabsTrigger>
            <TabsTrigger value="trending">Trending Colors</TabsTrigger>
            <TabsTrigger value="schemes">Color Schemes</TabsTrigger>
            <TabsTrigger value="tips">Expert Tips</TabsTrigger>
          </TabsList>

          {/* Room Inspiration Tab */}
          <TabsContent value="inspiration" className="space-y-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  {roomCategories.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  {styleCategories.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredSchemes.length} inspiration{filteredSchemes.length !== 1 ? "s" : ""}
            </div>

            {/* Inspiration Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSchemes.map((scheme) => (
                <Card key={scheme.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={scheme.image || "/placeholder.svg"}
                        alt={scheme.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant="secondary">{scheme.room}</Badge>
                        <Badge variant="outline">{scheme.style}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="secondary" onClick={() => toggleFavorite(scheme.id)}>
                          <Heart
                            className={`w-4 h-4 ${favorites.includes(scheme.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => toggleSaved(scheme.id)}>
                          <Bookmark
                            className={`w-4 h-4 ${saved.includes(scheme.id) ? "fill-blue-500 text-blue-500" : ""}`}
                          />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.name}</h3>
                        <p className="text-gray-600">{scheme.description}</p>
                      </div>

                      {/* Color Palette */}
                      <div className="flex gap-2">
                        {scheme.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {scheme.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark className="w-4 h-4" />
                            {scheme.saves}
                          </span>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/colors?inspiration=${scheme.id}`}>Get Colors</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Colors Tab */}
          <TabsContent value="trending" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2024 Color Trends</h2>
              <p className="text-gray-600">Discover the colors shaping interior design this year</p>
            </div>

            {/* Featured Trending Color */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="mb-4 bg-orange-100 text-orange-800">Color of the Year</Badge>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Aegean Teal</h2>
                    <p className="text-lg text-gray-600 mb-6">
                      A sophisticated blue-green that brings the calming essence of ocean waters into your home. Perfect
                      for creating serene, spa-like environments.
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: "#4A90A4" }}></div>
                      <div>
                        <p className="font-semibold">Aegean Teal</p>
                        <p className="text-gray-600">2136-40</p>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/colors?featured=aegean-teal">Explore This Color</Link>
                    </Button>
                  </div>
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=400&width=500"
                      alt="Room painted in Aegean Teal"
                      width={500}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Color Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingColors.map((color, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-full h-32 rounded-lg mb-4" style={{ backgroundColor: color.hex }}></div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {color.trend}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-1">{color.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{color.code}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trend Categories */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: "Warm Neutrals",
                  description: "Cozy beiges and soft browns create inviting spaces",
                  colors: ["#F5E6D3", "#E8C5A0", "#D4A574", "#B8956A"],
                },
                {
                  title: "Bold Jewel Tones",
                  description: "Rich emeralds and sapphires make dramatic statements",
                  colors: ["#2E8B57", "#4169E1", "#8B008B", "#DC143C"],
                },
                {
                  title: "Soft Pastels",
                  description: "Gentle hues perfect for creating calm, peaceful environments",
                  colors: ["#FFE4E1", "#E0E6FF", "#F0FFF0", "#FFF8DC"],
                },
              ].map((trend, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {trend.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex-1 h-16 first:rounded-l-lg last:rounded-r-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{trend.title}</h3>
                    <p className="text-gray-600 text-sm">{trend.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Color Schemes Tab */}
          <TabsContent value="schemes" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Curated Color Schemes</h2>
              <p className="text-gray-600">Professional color combinations for every style</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Monochromatic Blues",
                  colors: ["#E3F2FD", "#90CAF9", "#42A5F5", "#1976D2"],
                  description: "Various shades of blue create depth and sophistication",
                },
                {
                  name: "Complementary Contrast",
                  colors: ["#FF5722", "#FFA726", "#4CAF50", "#81C784"],
                  description: "Orange and green opposites create vibrant energy",
                },
                {
                  name: "Analogous Harmony",
                  colors: ["#9C27B0", "#E91E63", "#F44336", "#FF5722"],
                  description: "Adjacent colors on the wheel for natural flow",
                },
                {
                  name: "Triadic Balance",
                  colors: ["#2196F3", "#4CAF50", "#FF9800", "#FFFFFF"],
                  description: "Three evenly spaced colors create dynamic balance",
                },
                {
                  name: "Split Complementary",
                  colors: ["#3F51B5", "#FF5722", "#FFC107", "#F5F5F5"],
                  description: "Base color with two adjacent to its complement",
                },
                {
                  name: "Tetradic Square",
                  colors: ["#E91E63", "#4CAF50", "#FF9800", "#2196F3"],
                  description: "Four colors forming a square on the color wheel",
                },
              ].map((scheme, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-1 mb-4 h-24">
                      {scheme.colors.map((color, colorIndex) => (
                        <div key={colorIndex} className="rounded-lg" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{scheme.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{scheme.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Use This Scheme
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Expert Tips Tab */}
          <TabsContent value="tips" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Painting Tips</h2>
              <p className="text-gray-600">Professional advice for perfect results</p>
            </div>

            {/* Featured Tips */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {expertTips.map((tip, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Image
                      src={tip.image || "/placeholder.svg"}
                      alt={tip.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                      <p className="text-gray-600">{tip.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Tips */}
            <div className="space-y-8">
              {[
                {
                  title: "Choosing the Right Finish",
                  content:
                    "Flat finishes hide imperfections but are harder to clean. Satin and eggshell are great for most rooms. Semi-gloss works well in kitchens and bathrooms.",
                },
                {
                  title: "Primer is Essential",
                  content:
                    "Always use primer when changing colors dramatically, painting over dark colors, or painting new drywall. It ensures better coverage and color accuracy.",
                },
                {
                  title: "Quality Tools Matter",
                  content:
                    "Invest in high-quality brushes and rollers. They hold more paint, provide smoother application, and leave fewer marks.",
                },
                {
                  title: "Plan Your Color Flow",
                  content:
                    "Consider how colors flow from room to room. Use a consistent color palette throughout your home for cohesive design.",
                },
              ].map((tip, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl mb-3">{tip.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
