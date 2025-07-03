"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { ProductCard } from "@/components/products/product-card"
import { useLanguage } from "@/components/providers/language-provider"
import { generatedProducts, generatedProductCategories, generatedProductTypes } from "@/data/generated-products"

// Using imported wood panel products data

export default function ProductsPage() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [selectedType, setSelectedType] = useState("All Types")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = generatedProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory
    const matchesType = selectedType === "All Types" || product.type === selectedType
    return matchesCategory && matchesType
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title', 'products')}</h1>
          <p className="text-lg text-gray-600">{t('description', 'products')}</p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? t('filters.hideFilters', 'products') : t('filters.showFilters', 'products')}
            </Button>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('filters.category', 'products')} />
              </SelectTrigger>
              <SelectContent>
                {generatedProductCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('filters.type', 'products')} />
              </SelectTrigger>
              <SelectContent>
                {generatedProductTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('filters.sortBy', 'products')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">{t('filters.featured', 'products')}</SelectItem>
                <SelectItem value="name">{t('filters.name', 'products')}</SelectItem>
                <SelectItem value="price-low">{t('filters.priceLow', 'products')}</SelectItem>
                <SelectItem value="price-high">{t('filters.priceHigh', 'products')}</SelectItem>
                <SelectItem value="rating">{t('filters.rating', 'products')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {sortedProducts.length} of {generatedProducts.length} products
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  )
}
