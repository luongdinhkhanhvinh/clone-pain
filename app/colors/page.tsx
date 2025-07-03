"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Package } from "lucide-react"
import { ColorCard } from "@/components/colors/color-card"
import { useLanguage } from "@/components/providers/language-provider"
import { woodPanelColors, colorCategories } from "@/data/wood-panel-colors"

export default function ColorsPage() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState(t('categories.allColors', 'colors'))
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  // Use imported color categories with translations
  const translatedCategories = colorCategories.map(category => {
    switch(category) {
      case "All": return t('categories.allColors', 'colors')
      case "Neutral": return t('categories.neutrals', 'colors')
      case "Brown": return t('categories.browns', 'colors')
      case "Green": return t('categories.greens', 'colors')
      case "Grey": return t('categories.grays', 'colors')
      case "Beige": return t('categories.beiges', 'colors')
      case "Purple": return t('categories.purples', 'colors')
      case "Blue": return t('categories.blues', 'colors')
      case "Yellow": return t('categories.yellows', 'colors')
      case "Pink": return t('categories.pinks', 'colors')
      case "Special": return t('categories.specials', 'colors')
      default: return category
    }
  })

  const filteredColors = woodPanelColors.filter((color) => {
    const matchesCategory = selectedCategory === t('categories.allColors', 'colors') || color.category === selectedCategory
    const matchesSearch =
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title', 'colors')}</h1>
          <p className="text-lg text-gray-600">{t('description', 'colors')}</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('header.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-6 w-full">
              {colorCategories.map((category, index) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {translatedCategories[index]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Popular Colors Section */}
        {selectedCategory === t('categories.allColors', 'colors') && (
          <div className="mb-12 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('popularColors', 'colors')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {woodPanelColors
                .filter((color) => color.popular)
                .map((color) => (
                  <ColorCard key={color.code} color={color} size="large" />
                ))}
            </div>
          </div>
        )}

        {/* All Colors Grid */}
        <div className="mb-8 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === t('categories.allColors', 'colors') ? t('categories.allColors', 'colors') : selectedCategory}
            </h2>
            <p className="text-gray-600">{filteredColors.length} {t('colorsFound', 'colors')}</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredColors.map((color) => (
              <ColorCard key={color.code} color={color} size="small" />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">
              <Link href="/products">
              {t('buttons.loadMore')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
