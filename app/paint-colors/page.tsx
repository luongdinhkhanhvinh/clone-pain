"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { ColorCard } from "@/components/colors/color-card"

// Color families data
const colorFamilies = [
  {
    name: "Red",
    description: "Bold, energetic reds from soft pink to deep burgundy",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-red-500",
    textColor: "text-white",
    colors: [
      { name: "Caliente", code: "AF-290", hex: "#AF3E3E" },
      { name: "Raspberry Blush", code: "2008-30", hex: "#D4A5A5" },
      { name: "Dinner Party", code: "AF-300", hex: "#8E3E3E" },
      { name: "Cranberry Cocktail", code: "2083-20", hex: "#A13E3E" },
      { name: "Ravishing Red", code: "2008-10", hex: "#C23B3B" },
      { name: "Shy Cherry", code: "2007-20", hex: "#C25E5E" },
    ],
  },
  {
    name: "Orange",
    description: "Warm, vibrant oranges from soft coral to burnt sienna",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-orange-500",
    textColor: "text-white",
    colors: [
      { name: "Pumpkin Spice", code: "AF-130", hex: "#E67E22" },
      { name: "Tangerine Dream", code: "2012-30", hex: "#F39C12" },
      { name: "Autumn Cover", code: "2170-30", hex: "#D35400" },
      { name: "Coral Reef", code: "2013-40", hex: "#F1948A" },
      { name: "Persimmon", code: "2088-40", hex: "#E59866" },
      { name: "Firenze", code: "AF-225", hex: "#BA4A00" },
    ],
  },
  {
    name: "Yellow",
    description: "Cheerful yellows from pale butter to golden amber",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-yellow-400",
    textColor: "text-gray-900",
    colors: [
      { name: "Sunshine", code: "2021-30", hex: "#F7DC6F" },
      { name: "Lemon Sorbet", code: "2019-60", hex: "#F9E79F" },
      { name: "Golden Retriever", code: "2165-30", hex: "#F4D03F" },
      { name: "Yellow Hibiscus", code: "357", hex: "#F1C40F" },
      { name: "Buttercup", code: "2154-40", hex: "#F8C471" },
      { name: "Hawthorne Yellow", code: "HC-4", hex: "#F0E68C" },
    ],
  },
  {
    name: "Green",
    description: "Refreshing greens from soft sage to deep forest",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-green-600",
    textColor: "text-white",
    colors: [
      { name: "October Mist", code: "1495", hex: "#C5B8A5" },
      { name: "Soft Fern", code: "2144-40", hex: "#B8C5A6" },
      { name: "Guilford Green", code: "HC-116", hex: "#A3B18A" },
      { name: "Backwoods", code: "2145-10", hex: "#588157" },
      { name: "Forest Green", code: "2047-10", hex: "#355E3B" },
      { name: "Jade Garden", code: "2056-30", hex: "#52796F" },
    ],
  },
  {
    name: "Blue",
    description: "Serene blues from pale sky to deep navy",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-blue-600",
    textColor: "text-white",
    colors: [
      { name: "Aegean Teal", code: "2136-40", hex: "#4A90A4" },
      { name: "Blue Danube", code: "2062-30", hex: "#1B4F72" },
      { name: "Hale Navy", code: "HC-154", hex: "#1B2951" },
      { name: "Van Deusen Blue", code: "HC-156", hex: "#34495E" },
      { name: "Blue Note", code: "2129-30", hex: "#2874A6" },
      { name: "Breath of Fresh Air", code: "806", hex: "#AED6F1" },
    ],
  },
  {
    name: "Purple",
    description: "Regal purples from soft lavender to deep plum",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-purple-600",
    textColor: "text-white",
    colors: [
      { name: "Wisteria", code: "1390", hex: "#D7BDE2" },
      { name: "Lavender Mist", code: "2070-60", hex: "#BB8FCE" },
      { name: "Autumn Purple", code: "2073-20", hex: "#7D3C98" },
      { name: "Shadow Purple", code: "2117-30", hex: "#5B2C6F" },
      { name: "Elderberry Wine", code: "2074-10", hex: "#4A235A" },
      { name: "Gentle Violet", code: "2071-20", hex: "#A569BD" },
    ],
  },
  {
    name: "Gray",
    description: "Sophisticated grays from light silver to charcoal",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-gray-500",
    textColor: "text-white",
    colors: [
      { name: "Stonington Gray", code: "HC-170", hex: "#8B9AAF" },
      { name: "Gray Owl", code: "OC-52", hex: "#D0D3D4" },
      { name: "Coventry Gray", code: "HC-169", hex: "#95A5A6" },
      { name: "Chelsea Gray", code: "HC-168", hex: "#7F8C8D" },
      { name: "Kendall Charcoal", code: "HC-166", hex: "#566573" },
      { name: "Metropolitan", code: "AF-690", hex: "#ABB2B9" },
    ],
  },
  {
    name: "Neutral",
    description: "Versatile neutrals from warm beige to cool taupe",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-stone-500",
    textColor: "text-white",
    colors: [
      { name: "Revere Pewter", code: "HC-172", hex: "#A69B8C" },
      { name: "Edgecomb Gray", code: "HC-173", hex: "#D7CEC7" },
      { name: "Manchester Tan", code: "HC-81", hex: "#C9BEA0" },
      { name: "Cotswold", code: "AF-150", hex: "#D4C5A0" },
      { name: "Shaker Beige", code: "HC-45", hex: "#C4B7A6" },
      { name: "Pale Oak", code: "OC-20", hex: "#E8E0D5" },
    ],
  },
  {
    name: "White",
    description: "Pure whites from crisp bright to soft warm",
    image: "/placeholder.svg?height=300&width=300",
    bgColor: "bg-gray-100",
    textColor: "text-gray-900",
    colors: [
      { name: "White Dove", code: "OC-17", hex: "#F8F6F0" },
      { name: "Simply White", code: "OC-117", hex: "#FDFEF9" },
      { name: "Cloud White", code: "OC-130", hex: "#F7F4F2" },
      { name: "Chantilly Lace", code: "OC-65", hex: "#FEFEFE" },
      { name: "Swiss Coffee", code: "OC-45", hex: "#F2EFE6" },
      { name: "Decorator's White", code: "OC-149", hex: "#F4F4F4" },
    ],
  },
]

export default function PaintColorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")

  const toggleFavorite = (colorCode: string) => {
    setFavorites((prev) =>
      prev.includes(colorCode) ? prev.filter((code) => code !== colorCode) : [...prev, colorCode],
    )
  }

  const toggleFamily = (familyName: string) => {
    setExpandedFamily(expandedFamily === familyName ? null : familyName)
  }

  const filteredFamilies = colorFamilies.filter((family) => {
    if (activeTab !== "all" && activeTab !== family.name.toLowerCase()) {
      return false
    }

    if (searchTerm === "") {
      return true
    }

    const matchesFamily = family.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesColors = family.colors.some(
      (color) =>
        color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return matchesFamily || matchesColors
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Paint Colors</h1>
          <p className="text-lg text-gray-600">
            Explore our extensive collection of premium paint colors organized by color family
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search colors by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              {colorFamilies.map((family) => (
                <TabsTrigger key={family.name} value={family.name.toLowerCase()} className="text-xs">
                  {family.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Color Families */}
        <div className="space-y-6">
          {filteredFamilies.map((family) => (
            <Collapsible
              key={family.name}
              open={expandedFamily === family.name}
              onOpenChange={() => toggleFamily(family.name)}
              className="border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <div className={`${family.bgColor} ${family.textColor} cursor-pointer`}>
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: family.colors[0].hex }}></div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{family.name}</h2>
                        <p className="text-sm opacity-90">{family.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20">{family.colors.length} Colors</Badge>
                      {expandedFamily === family.name ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-6 bg-white">
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {family.colors.map((color) => (
                      <ColorCard
                        key={color.code}
                        color={{
                          name: color.name,
                          code: color.code,
                          hex: color.hex,
                          category: family.name,
                        }}
                        size="small"
                      />
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" asChild>
                      <Link href={`/colors?family=${family.name.toLowerCase()}`}>View All {family.name} Colors</Link>
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Featured Collections */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Color Collections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Historical Collection",
                description: "Timeless colors inspired by America's historic landmarks",
                colors: ["#D7CEC7", "#C9BEA0", "#A69B8C", "#8B9AAF", "#566573", "#1B2951"],
              },
              {
                name: "Color Trends 2024",
                description: "This year's most inspiring and on-trend color palette",
                colors: ["#4A90A4", "#C5B8A5", "#D4A5A5", "#A3B18A", "#1B4F72", "#D4C5A0"],
              },
              {
                name: "Coastal Collection",
                description: "Serene blues and soft neutrals inspired by the seaside",
                colors: ["#AED6F1", "#F8F6F0", "#4A90A4", "#D7CEC7", "#2874A6", "#F7F4F2"],
              },
            ].map((collection, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4 h-8">
                    {collection.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex-1 first:rounded-l-lg last:rounded-r-lg"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{collection.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{collection.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/colors?collection=${collection.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      Explore Collection
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
