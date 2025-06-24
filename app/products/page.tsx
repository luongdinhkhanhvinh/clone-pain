"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { ProductCard } from "@/components/products/product-card"

const products = [
  {
    id: 1,
    name: "Advance Interior Paint",
    category: "Interior Paint",
    type: "Premium",
    price: 89.99,
    rating: 4.8,
    reviews: 245,
    image: "/placeholder.svg?height=300&width=300",
    features: ["Self-leveling", "Durable finish", "Low VOC"],
    colors: 3500,
    coverage: "350-400 sq ft",
  },
  {
    id: 2,
    name: "Aura Interior Paint",
    category: "Interior Paint",
    type: "Ultra Premium",
    price: 109.99,
    rating: 4.9,
    reviews: 189,
    image: "/placeholder.svg?height=300&width=300",
    features: ["Color Lock technology", "Washable", "Zero VOC"],
    colors: 3500,
    coverage: "400-450 sq ft",
  },
  {
    id: 3,
    name: "Arborcoat Exterior Stain",
    category: "Exterior Stain",
    type: "Premium",
    price: 79.99,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    features: ["Weather protection", "Fade resistant", "Easy application"],
    colors: 75,
    coverage: "200-300 sq ft",
  },
  {
    id: 4,
    name: "Regal Select Interior Paint",
    category: "Interior Paint",
    type: "Standard",
    price: 69.99,
    rating: 4.6,
    reviews: 312,
    image: "/placeholder.svg?height=300&width=300",
    features: ["Easy cleanup", "Good coverage", "Mildew resistant"],
    colors: 3500,
    coverage: "350-400 sq ft",
  },
  {
    id: 5,
    name: "Exterior Paint - Aura",
    category: "Exterior Paint",
    type: "Ultra Premium",
    price: 119.99,
    rating: 4.8,
    reviews: 98,
    image: "/placeholder.svg?height=300&width=300",
    features: ["Fade resistant", "Self-priming", "Lifetime warranty"],
    colors: 3500,
    coverage: "350-400 sq ft",
  },
  {
    id: 6,
    name: "Primer - Fresh Start",
    category: "Primer",
    type: "Standard",
    price: 49.99,
    rating: 4.5,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=300",
    features: ["Multi-surface", "Stain blocking", "Fast drying"],
    colors: 1,
    coverage: "400-450 sq ft",
  },
]

const categories = ["All Products", "Interior Paint", "Exterior Paint", "Exterior Stain", "Primer"]
const types = ["All Types", "Ultra Premium", "Premium", "Standard"]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [selectedType, setSelectedType] = useState("All Types")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory
    const matchesType = selectedType === "All Types" || product.type === selectedType
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesCategory && matchesType && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Paint & Stain Products</h1>
          <p className="text-lg text-gray-600">Premium quality paints and stains for every project</p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
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
