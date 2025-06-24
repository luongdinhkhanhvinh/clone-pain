"use client"

import { useState } from "react"
import Image from "next/image"
import { useCart, type CartItem as CartItemType } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Minus, Plus } from "lucide-react"

interface CartItemProps {
  item: CartItemType
  showImage?: boolean
}

export function CartItem({ item, showImage = true }: CartItemProps) {
  const { dispatch } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateQuantity = async (newQuantity: number) => {
    setIsUpdating(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: newQuantity } })
    setIsUpdating(false)
  }

  const removeItem = () => {
    dispatch({ type: "REMOVE_ITEM", payload: item.id })
  }

  return (
    <div className="flex gap-4 p-4 bg-white border border-slate-200 rounded-sm">
      {showImage && (
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-sm" />
          {item.hex && (
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: item.hex }}
            />
          )}
        </div>
      )}

      <div className="flex-1 space-y-2">
        <div>
          <h3 className="font-display font-medium text-slate-900">{item.name}</h3>
          <p className="text-sm text-slate-600">{item.code}</p>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {item.finish}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {item.size}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(Math.max(0, item.quantity - 1))}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.quantity + 1)}
              disabled={isUpdating}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            <div className="text-sm text-slate-600">${item.price.toFixed(2)} each</div>
          </div>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={removeItem}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
