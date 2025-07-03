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
  const [selectedCategory, setSelectedCategory] = useState(t('categories.allProducts', 'products'))
  const [selectedType, setSelectedType] = useState(t('types.allTypes', 'products'))
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = generatedProducts.filter((product) => {
    const matchesCategory = selectedCategory === t('categories.allProducts', 'products') || product.category === selectedCategory
    const matchesType = selectedType === t('types.allTypes', 'products') || product.type === selectedType
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('title', 'products')}</h2>
          <p className="text-mg text-gray-600">{t('description', 'products')}</p>
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
              <SelectContent defaultValue={"featured"}>
                <SelectItem value="featured">{t('filters.featured', 'products')}</SelectItem>
                <SelectItem value="name">{t('filters.name', 'products')}</SelectItem>
                <SelectItem value="price-low">{t('filters.priceLow', 'products')}</SelectItem>
                <SelectItem value="price-high">{t('filters.priceHigh', 'products')}</SelectItem>
                <SelectItem value="rating">{t('filters.rating', 'products')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            {t('filters.showing', 'products')} {sortedProducts.length} {t('filters.of', 'products')} {generatedProducts.length} {t('filters.products', 'products')}
          </div>
        </div>

        {/* Featured Products Section */}
        {selectedCategory === t('categories.allProducts', 'products') && (
          <div className="mb-12 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sections.featuredProducts', 'products')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {generatedProducts
                .filter((product) => product.rating >= 4.7)
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        )}

        {/* All Products Grid */}
        <div className="mb-8 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === t('categories.allProducts', 'products') ? t('sections.allProducts', 'products') : selectedCategory}
            </h2>
            <p className="text-gray-600">{sortedProducts.length} {t('filters.products', 'products')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            {t('buttons.loadMore', 'products')}
          </Button>
        </div>
      </div>
    </div>
  )
}
