"use client"

import { useState } from "react"
import { useCart, type CartItem } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Check } from "lucide-react"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    code: string
    price: number
    image: string
    category: string
    hex?: string
  }
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { dispatch } = useCart()
  const [finish, setFinish] = useState("Eggshell")
  const [size, setSize] = useState("1 Gallon")
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const finishes = ["Flat", "Eggshell", "Satin", "Semi-Gloss", "Gloss"]
  const sizes = [
    { label: "Sample (2 oz)", value: "Sample", price: 5.99 },
    { label: "Quart", value: "Quart", price: product.price * 0.3 },
    { label: "1 Gallon", value: "1 Gallon", price: product.price },
    { label: "5 Gallon", value: "5 Gallon", price: product.price * 4.5 },
  ]

  const selectedSize = sizes.find((s) => s.value === size)
  const finalPrice = selectedSize?.price || product.price

  const handleAddToCart = async () => {
    setIsAdding(true)

    const cartItem: Omit<CartItem, "quantity"> = {
      id: `${product.id}-${finish}-${size}`,
      name: product.name,
      code: product.code,
      price: finalPrice,
      image: product.image,
      category: product.category,
      finish,
      size,
      hex: product.hex,
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    dispatch({ type: "ADD_ITEM", payload: cartItem })
    dispatch({ type: "OPEN_CART" })

    setIsAdding(false)
    setJustAdded(true)

    // Reset the "just added" state after 2 seconds
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="finish" className="text-sm font-medium text-slate-700">
            Finish
          </Label>
          <Select value={finish} onValueChange={setFinish}>
            <SelectTrigger id="finish">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {finishes.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="size" className="text-sm font-medium text-slate-700">
            Size
          </Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  <div className="flex justify-between items-center w-full">
                    <span>{s.label}</span>
                    <span className="ml-2 text-slate-600">${s.price.toFixed(2)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-sm">
        <div>
          <div className="font-display font-medium text-slate-900">
            {selectedSize?.label} - {finish}
          </div>
          <div className="text-sm text-slate-600">{product.name}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-display font-medium text-slate-900">${finalPrice.toFixed(2)}</div>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full"
        size="lg"
        variant={justAdded ? "secondary" : "default"}
      >
        {isAdding ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Adding to Cart...
          </>
        ) : justAdded ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
