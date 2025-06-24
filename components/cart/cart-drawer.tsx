"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CartItem } from "./cart-item"
import { ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CartDrawer() {
  const { state, dispatch } = useCart()

  return (
    <Sheet open={state.isOpen} onOpenChange={() => dispatch({ type: "TOGGLE_CART" })}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-700 hover:text-slate-900">
          <ShoppingCart className="w-4 h-4" />
          {state.itemCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-slate-900"
            >
              {state.itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Shopping Cart</SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <ShoppingCart className="w-16 h-16 text-slate-300" />
            <div className="space-y-2">
              <h3 className="font-display text-lg text-slate-900">Your cart is empty</h3>
              <p className="text-slate-600">Add some premium paint products to get started</p>
            </div>
            <Button asChild onClick={() => dispatch({ type: "CLOSE_CART" })}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {state.items.map((item) => (
                  <CartItem key={`${item.id}-${item.finish}-${item.size}`} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal ({state.itemCount} items)</span>
                  <span className="font-medium">${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-display font-medium">
                  <span>Total</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout" onClick={() => dispatch({ type: "CLOSE_CART" })}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={() => dispatch({ type: "CLOSE_CART" })}>
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
