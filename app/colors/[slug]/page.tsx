"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import {
  Heart,
  Share2,
  Download,
  Palette,
  Eye,
  Calculator,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Mock data for the color detail page
const colorData = {
  name: "Cotswold",
  code: "AF-150",
  hex: "#D4C5A0",
  rgb: "rgb(212, 197, 160)",
  lrv: 58,
  family: "Neutral",
  undertones: ["Warm", "Beige", "Gray"],
  description:
    "A sophisticated neutral with warm undertones that brings timeless elegance to any space. This versatile beige works beautifully in both traditional and contemporary settings.",
  colorStory:
    "Inspired by the rolling hills and stone cottages of the English countryside, Cotswold captures the essence of natural limestone and weathered stone. This warm neutral has been a favorite among designers for its ability to create serene, sophisticated spaces.",
  popularity: "Very Popular",
  tags: ["Neutral", "Warm", "Versatile", "Classic"],
}

const complementaryColors = [
  { name: "White Dove", code: "OC-17", hex: "#F8F6F0" },
  { name: "Revere Pewter", code: "HC-172", hex: "#A69B8C" },
  { name: "Classic Gray", code: "OC-23", hex: "#9B9B9B" },
  { name: "Stonington Gray", code: "HC-170", hex: "#8B9AAF" },
  { name: "Hale Navy", code: "HC-154", hex: "#1B2951" },
  { name: "Forest Green", code: "2047-10", hex: "#355E3B" },
]

const roomInspiration = [
  {
    room: "Living Room",
    image: "/placeholder.svg?height=300&width=400",
    description: "Creates a warm, inviting atmosphere perfect for gathering",
  },
  {
    room: "Bedroom",
    image: "/placeholder.svg?height=300&width=400",
    description: "Promotes relaxation with its calming, neutral presence",
  },
  {
    room: "Kitchen",
    image: "/placeholder.svg?height=300&width=400",
    description: "Pairs beautifully with both warm and cool cabinet colors",
  },
  {
    room: "Dining Room",
    image: "/placeholder.svg?height=300&width=400",
    description: "Sophisticated backdrop for entertaining and family meals",
  },
]

const availableProducts = [
  {
    name: "Aura Interior Paint",
    type: "Premium Interior",
    price: 109.99,
    coverage: "400-450 sq ft",
    features: ["Zero VOC", "Washable", "Color Lock Technology"],
    rating: 4.9,
  },
  {
    name: "Advance Interior Paint",
    type: "Premium Interior",
    price: 89.99,
    coverage: "350-400 sq ft",
    features: ["Self-leveling", "Durable finish", "Low VOC"],
    rating: 4.8,
  },
  {
    name: "Regal Select Interior",
    type: "Standard Interior",
    price: 69.99,
    coverage: "350-400 sq ft",
    features: ["Easy cleanup", "Good coverage", "Mildew resistant"],
    rating: 4.6,
  },
]

export default function ColorDetailPage() {
  const [selectedFinish, setSelectedFinish] = useState("Eggshell")
  const [selectedProduct, setSelectedProduct] = useState("Aura Interior Paint")
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/colors" className="hover:text-gray-900">
              Paint Colors
            </Link>
            <span>/</span>
            <span className="text-gray-900">{colorData.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Color Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Color Display */}
          <div className="space-y-6">
            <div className="relative">
              <div
                className="w-full h-96 rounded-lg shadow-lg border-4 border-white"
                style={{ backgroundColor: colorData.hex }}
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setIsFavorited(!isFavorited)}>
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Color Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">HEX</p>
                  <p className="font-mono font-semibold">{colorData.hex}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">RGB</p>
                  <p className="font-mono font-semibold">{colorData.rgb}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">LRV</p>
                  <p className="font-semibold">{colorData.lrv}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Family</p>
                  <p className="font-semibold">{colorData.family}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Color Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{colorData.name}</h1>
                <Badge variant="secondary">{colorData.code}</Badge>
                <Badge className="bg-green-100 text-green-800">{colorData.popularity}</Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {colorData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-lg text-gray-700 mb-6">{colorData.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Undertones</h3>
                  <div className="flex gap-2">
                    {colorData.undertones.map((undertone, index) => (
                      <Badge key={index} variant="secondary">
                        {undertone}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Color Story</h3>
                  <p className="text-gray-600">{colorData.colorStory}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Visualize in Room
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Paint Calculator
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Find Coordinating Colors
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Find in Store
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Shop Products</TabsTrigger>
            <TabsTrigger value="coordinating">Coordinating Colors</TabsTrigger>
            <TabsTrigger value="inspiration">Room Inspiration</TabsTrigger>
            <TabsTrigger value="details">Technical Details</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Available Products</h2>
              <div className="flex gap-4">
                <Select value={selectedFinish} onValueChange={setSelectedFinish}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Finish" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Eggshell">Eggshell</SelectItem>
                    <SelectItem value="Satin">Satin</SelectItem>
                    <SelectItem value="Semi-Gloss">Semi-Gloss</SelectItem>
                    <SelectItem value="Gloss">Gloss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {availableProducts.map((product, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.type}</p>
                        <div className="flex items-center gap-2 mt-2">
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
                          <span className="text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Coverage: {product.coverage}</p>
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <AddToCartButton
                        product={{
                          id: `${colorData.code}-${product.name.toLowerCase().replace(/\s+/g, "-")}`,
                          name: `${colorData.name} - ${product.name}`,
                          code: colorData.code,
                          price: product.price,
                          image: "/placeholder.svg?height=300&width=300",
                          category: product.type,
                          hex: colorData.hex,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coordinating Colors Tab */}
          <TabsContent value="coordinating" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Colors That Work Well Together</h2>
              <p className="text-gray-600 mb-8">These colors complement {colorData.name} beautifully</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {complementaryColors.map((color, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-full h-32" style={{ backgroundColor: color.hex }}></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm">{color.name}</h3>
                      <p className="text-xs text-gray-600">{color.code}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Suggested Color Schemes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Warm Neutral Palette",
                    colors: [colorData.hex, "#F8F6F0", "#A69B8C", "#8B956A"],
                    description: "Perfect for creating cozy, inviting spaces",
                  },
                  {
                    name: "Sophisticated Contrast",
                    colors: [colorData.hex, "#1B2951", "#F8F6F0", "#D4AF37"],
                    description: "Bold navy creates dramatic contrast with gold accents",
                  },
                ].map((scheme, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex gap-2 mb-4">
                        {scheme.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <h4 className="font-semibold mb-2">{scheme.name}</h4>
                      <p className="text-sm text-gray-600">{scheme.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Room Inspiration Tab */}
          <TabsContent value="inspiration" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">See {colorData.name} in Action</h2>
              <p className="text-gray-600 mb-8">Discover how this color transforms different spaces</p>
            </div>

            {/* Featured Room */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={roomInspiration[selectedRoom].image || "/placeholder.svg"}
                    alt={`${colorData.name} in ${roomInspiration[selectedRoom].room}`}
                    width={800}
                    height={400}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{roomInspiration[selectedRoom].room}</h3>
                    <p className="text-lg">{roomInspiration[selectedRoom].description}</p>
                  </div>
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedRoom(selectedRoom > 0 ? selectedRoom - 1 : roomInspiration.length - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedRoom(selectedRoom < roomInspiration.length - 1 ? selectedRoom + 1 : 0)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {roomInspiration.map((room, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${selectedRoom === index ? "ring-2 ring-blue-500" : "hover:shadow-lg"}`}
                  onClick={() => setSelectedRoom(index)}
                >
                  <CardContent className="p-0">
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={room.room}
                      width={200}
                      height={150}
                      className="w-full h-24 object-cover rounded-t-lg"
                    />
                    <div className="p-3">
                      <p className="font-semibold text-sm">{room.room}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Technical Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Color Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color Code:</span>
                    <span className="font-semibold">{colorData.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HEX Value:</span>
                    <span className="font-mono">{colorData.hex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RGB Value:</span>
                    <span className="font-mono">{colorData.rgb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Light Reflectance Value:</span>
                    <span className="font-semibold">{colorData.lrv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color Family:</span>
                    <span className="font-semibold">{colorData.family}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Best For:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Living rooms and bedrooms</li>
                      <li>• Dining rooms and hallways</li>
                      <li>• Home offices and studies</li>
                      <li>• Accent walls</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Lighting Considerations:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Appears warmer in natural light</li>
                      <li>• May look cooler under fluorescent lighting</li>
                      <li>• Test in your specific lighting conditions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Professional Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Primer Recommendations:</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Use a high-quality primer when painting over dark colors or new drywall to ensure true color
                      representation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Finish Selection:</h4>
                    <p className="text-sm text-gray-600">
                      Eggshell or satin finishes work best for walls, while semi-gloss is recommended for trim and
                      doors.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
