"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Check } from "lucide-react"

interface ColorCardProps {
  color: {
    name: string
    code: string
    hex: string
    category: string
    popular?: boolean
  }
  size?: "small" | "large"
  showCategory?: boolean
}

export function ColorCard({ color, size = "small", showCategory = false }: ColorCardProps) {
  const { dispatch } = useCart()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddSample = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const cartItem = {
      id: `${color.code}-sample`,
      name: `${color.name} Sample`,
      code: color.code,
      price: 5.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Paint Sample",
      finish: "Sample",
      size: "2 oz",
      hex: color.hex,
    }

    dispatch({ type: "ADD_ITEM", payload: cartItem })

    setIsAdding(false)
    setJustAdded(true)

    // Reset after 2 seconds
    setTimeout(() => setJustAdded(false), 2000)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  const cardHeight = size === "large" ? "h-48" : "h-32"

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/colors/${color.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <div className={`w-full ${cardHeight} relative`} style={{ backgroundColor: color.hex }}>
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                onClick={toggleFavorite}
              >
                <Heart className={`w-3 h-3 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                onClick={handleAddSample}
                disabled={isAdding}
              >
                {isAdding ? (
                  <div className="w-3 h-3 border border-gray-600 border-t-transparent rounded-full animate-spin" />
                ) : justAdded ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <ShoppingCart className="w-3 h-3" />
                )}
              </Button>
            </div>

            {color.popular && (
              <Badge className="absolute bottom-2 left-2 bg-white text-gray-900 text-xs">Popular</Badge>
            )}

            {showCategory && (
              <Badge variant="secondary" className="absolute top-2 left-2 text-xs bg-white/90 backdrop-blur-sm">
                {color.category}
              </Badge>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm">{color.name}</h3>
            <p className="text-xs text-gray-600">{color.code}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
