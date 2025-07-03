"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Star, Heart } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"

interface ProductCardProps {
  product: {
    id: number
    name: string
    category: string
    type: string
    rating: number
    reviews: number
    image: string
    features: string[]
    colors: number
    coverage: string
    description: string
    baseColor: {
      id: number
      code: string
      name: string
      description: string
      hex: string
      image: string
      orderPercentage: string
    }
    availableColors: Array<{
      id: number
      code: string
      name: string
      hex: string
      image: string
    }>
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
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
              {product.rating} ({product.reviews} {t('productCard.reviews', 'components')})
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
              <p>{t('productCard.coverage', 'components')}: {product.coverage}</p>
              <p>Available in {product.colors} {t('productCard.colors', 'components')}</p>
            </div>

            {/* Base Color Display */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Màu chính:</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-gray-200 overflow-hidden relative">
                  <Image
                    src={product.baseColor.image}
                    alt={product.baseColor.name}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {product.baseColor.name} ({product.baseColor.orderPercentage})
                </span>
              </div>
            </div>

            {/* Available Colors Preview */}
            {product.availableColors.length > 1 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Màu có sẵn:</div>
                <div className="flex gap-1">
                  {product.availableColors.slice(0, 6).map((color) => (
                    <div
                      key={color.id}
                      className="w-4 h-4 rounded border border-gray-200 overflow-hidden relative"
                      title={color.name}
                    >
                      <Image
                        src={color.image}
                        alt={color.name}
                        fill
                        className="object-cover"
                        sizes="16px"
                      />
                    </div>
                  ))}
                  {product.availableColors.length > 6 && (
                    <div className="text-xs text-gray-500 ml-1">
                      +{product.availableColors.length - 6}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600 ml-1">per {t('productCard.gallon', 'components')}</span>
              </div>
            </div>
            <AddToCartButton
              product={{
                id: product.id.toString(),
                name: product.name,
                code: `PROD-${product.id}`,
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
