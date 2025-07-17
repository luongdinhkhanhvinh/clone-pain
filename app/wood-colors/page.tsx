"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { ColorCard } from "@/components/colors/color-card"
import { useLanguage } from "@/components/providers/language-provider"

export default function woodColorsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [colors, setColors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchColors = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/colors")
        const json = await res.json()
        if (res.ok && json.data && Array.isArray(json.data)) {
          setColors(json.data)
        } else if (res.ok && json.data && Array.isArray(json.data.colors)) {
          setColors(json.data.colors)
        } else {
          setError("No color data found")
        }
      } catch (e) {
        setError("Failed to fetch colors")
      } finally {
        setLoading(false)
      }
    }
    fetchColors()
  }, [])

  useEffect(() => {
    // Lấy danh sách category từ dữ liệu colors
    const cats = Array.from(new Set(colors.map((c) => c.category || "Other")))
    setCategories(["all", ...cats.map((c) => c.toLowerCase())])
  }, [colors])

  const toggleFavorite = (colorCode: string) => {
    setFavorites((prev) =>
      prev.includes(colorCode) ? prev.filter((code) => code !== colorCode) : [...prev, colorCode],
    )
  }

  const toggleFamily = (familyName: string) => {
    setExpandedFamily(expandedFamily === familyName ? null : familyName)
  }

  // Group colors by category
  const groupedFamilies = (colors as any[]).reduce((acc: Record<string, any[]>, color: any) => {
    const cat = color.category || "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(color)
    return acc
  }, {} as Record<string, any[]>)

  // Filter theo tab/category
  const filteredFamilies = Object.entries(groupedFamilies)
    .filter(([cat]) => activeTab === "all" || cat.toLowerCase() === activeTab)
    .map(([cat, colorsArr]) => ({
      name: cat,
      description: t(`colorFamilies.${cat.toLowerCase()}.description`, 'wood-colors'),
      colors: (colorsArr as any[]).filter((color: any) => {
        if (searchTerm === "") return true
        return (
          color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          color.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }),
    }))
    .filter((family) => family.colors.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title', 'wood-colors')}</h1>
          <p className="text-lg text-gray-600">
            {t('description', 'wood-colors')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('header.searchPlaceholder')}
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
              {categories.filter((cat) => cat !== "all").map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Loading/Error */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading colors...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            {filteredFamilies.map((family) => (
              <Collapsible
                key={family.name}
                open={expandedFamily === family.name}
                onOpenChange={() => toggleFamily(family.name)}
                className="border rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div className="bg-gray-200 text-gray-900 cursor-pointer">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: family.colors[0]?.hex || family.colors[0]?.hexCode }}></div>
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
                          color={color}
                          size="small"
                        />
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}

        {/* Featured Collections giữ nguyên như cũ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('featuredCollections.title', 'wood-colors')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: t('featuredCollections.historical.name', 'wood-colors'),
                description: t('featuredCollections.historical.description', 'wood-colors'),
                colors: ["#D7CEC7", "#C9BEA0", "#A69B8C", "#8B9AAF", "#566573", "#1B2951"],
              },
              {
                name: t('featuredCollections.trends2024.name', 'wood-colors'),
                description: t('featuredCollections.trends2024.description', 'wood-colors'),
                colors: ["#4A90A4", "#C5B8A5", "#D4A5A5", "#A3B18A", "#1B4F72", "#D4C5A0"],
              },
              {
                name: t('featuredCollections.coastal.name', 'wood-colors'),
                description: t('featuredCollections.coastal.description', 'wood-colors'),
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
                      {t('interface.exploreCollection', 'wood-colors')}
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
