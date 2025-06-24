"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Star, Heart } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  product: {
    id: number
    name: string
    category: string
    type: string
    price: number
    rating: number
    reviews: number
    image: string
    features: string[]
    colors: number
    coverage: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            <Badge variant={product.type === "Ultra Premium" ? "default" : "secondary"}>{product.type}</Badge>
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" onClick={() => setIsFavorited(!isFavorited)}>
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              <p>Coverage: {product.coverage}</p>
              <p>Available in {product.colors} colors</p>
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                <span className="text-sm text-gray-600 ml-1">per gallon</span>
              </div>
            </div>
            <AddToCartButton
              product={{
                id: product.id.toString(),
                name: product.name,
                code: `PROD-${product.id}`,
                price: product.price,
                image: product.image,
                category: product.category,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
