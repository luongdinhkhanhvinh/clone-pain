"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CartItem } from "@/components/cart/cart-item"
import { ShoppingCart, ArrowRight, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { state, dispatch } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <ShoppingCart className="w-24 h-24 text-slate-300 mx-auto" />
            <div className="space-y-4">
              <h1 className="text-3xl font-display font-medium text-slate-900">Your Cart is Empty</h1>
              <p className="text-lg text-slate-600">
                Discover our premium paint collection and add some exceptional colors to your cart.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/colors">Explore Colors</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-medium text-slate-900 mb-2">Shopping Cart</h1>
          <p className="text-slate-600">
            {state.itemCount} {state.itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-xl font-medium text-slate-900">Items</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                className="text-slate-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {state.items.map((item) => (
                <CartItem key={`${item.id}-${item.finish}-${item.size}`} item={item} showImage={true} />
              ))}
            </div>

            {/* Continue Shopping */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-medium text-slate-900 mb-1">Continue Shopping</h3>
                    <p className="text-sm text-slate-600">Discover more premium paint products</p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal ({state.itemCount} items)</span>
                    <span className="font-medium">${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-medium">${(state.total * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-display font-medium">
                    <span>Total</span>
                    <span>${(state.total * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>

                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    Free shipping on orders over $50
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">Why Choose Benjamin Moore</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Premium quality guaranteed",
                  "Expert color consultation",
                  "Professional-grade products",
                  "135+ years of excellence",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                    <span className="text-slate-600">{benefit}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <h3 className="font-display font-medium text-slate-900">Need Help?</h3>
                  <p className="text-sm text-slate-600">Our color experts are here to assist you</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
