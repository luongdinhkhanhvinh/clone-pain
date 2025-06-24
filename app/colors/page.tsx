"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { ColorCard } from "@/components/colors/color-card"

const colorCategories = ["All Colors", "Whites", "Grays", "Blues", "Greens", "Reds", "Yellows", "Neutrals"]

const colors = [
  { name: "White Dove", code: "OC-17", hex: "#F8F6F0", category: "Whites", popular: true },
  { name: "Classic Gray", code: "OC-23", hex: "#9B9B9B", category: "Grays", popular: true },
  { name: "Hale Navy", code: "HC-154", hex: "#1B2951", category: "Blues", popular: true },
  { name: "Revere Pewter", code: "HC-172", hex: "#A69B8C", category: "Grays", popular: true },
  { name: "Soft Fern", code: "2144-40", hex: "#B8C5A6", category: "Greens", popular: false },
  { name: "Black Beauty", code: "2128-10", hex: "#1C1C1C", category: "Neutrals", popular: false },
  { name: "Cloud White", code: "OC-130", hex: "#F7F4F2", category: "Whites", popular: false },
  { name: "Stonington Gray", code: "HC-170", hex: "#8B9AAF", category: "Grays", popular: false },
  { name: "Naval", code: "SW-6244", hex: "#1F2937", category: "Blues", popular: false },
  { name: "Sage Green", code: "2142-30", hex: "#87A96B", category: "Greens", popular: false },
  { name: "Crimson Red", code: "2020-10", hex: "#B91C1C", category: "Reds", popular: false },
  { name: "Sunshine Yellow", code: "2019-30", hex: "#FDE047", category: "Yellows", popular: false },
]

export default function ColorsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Colors")
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredColors = colors.filter((color) => {
    const matchesCategory = selectedCategory === "All Colors" || color.category === selectedCategory
    const matchesSearch =
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.code.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (colorCode: string) => {
    setFavorites((prev) =>
      prev.includes(colorCode) ? prev.filter((code) => code !== colorCode) : [...prev, colorCode],
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Colors</h1>
          <p className="text-lg text-gray-600">Discover over 3,500 premium paint colors</p>
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

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
              {colorCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Popular Colors Section */}
        {selectedCategory === "All Colors" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Colors</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {colors
                .filter((color) => color.popular)
                .map((color) => (
                  <ColorCard key={color.code} color={color} size="large" />
                ))}
            </div>
          </div>
        )}

        {/* All Colors Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "All Colors" ? "All Colors" : selectedCategory}
            </h2>
            <p className="text-gray-600">{filteredColors.length} colors found</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredColors.map((color) => (
              <ColorCard key={color.code} color={color} size="small" />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Colors
          </Button>
        </div>
      </div>
    </div>
  )
}
