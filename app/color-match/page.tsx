"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Camera } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const suggestedColors = [
  { name: "White Dove", code: "OC-17", hex: "#F8F6F0", match: "95%" },
  { name: "Cloud White", code: "OC-130", hex: "#F7F4F2", match: "92%" },
  { name: "Classic Gray", code: "OC-23", hex: "#9B9B9B", match: "88%" },
  { name: "Revere Pewter", code: "HC-172", hex: "#A69B8C", match: "85%" },
]

const complementaryColors = [
  { name: "Hale Navy", code: "HC-154", hex: "#1B2951" },
  { name: "Soft Fern", code: "2144-40", hex: "#B8C5A6" },
  { name: "Crimson Red", code: "2020-10", hex: "#B91C1C" },
  { name: "Sunshine Yellow", code: "2019-30", hex: "#FDE047" },
]

export default function ColorMatchPage() {
  const { t } = useLanguage()
  const [selectedColor, setSelectedColor] = useState("#F8F6F0")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title', 'color-match')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description', 'color-match')}
          </p>
        </div>

        <Tabs defaultValue="match" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="match">{t('tabs.match', 'color-match')}</TabsTrigger>
            <TabsTrigger value="coordinate">{t('tabs.coordinate', 'color-match')}</TabsTrigger>
            <TabsTrigger value="inspiration">{t('tabs.inspiration', 'color-match')}</TabsTrigger>
          </TabsList>

          {/* Color Match Tab */}
          <TabsContent value="match" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    {t('upload.title', 'color-match')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded"
                          className="max-w-full h-48 object-cover mx-auto rounded-lg"
                        />
                        <Button variant="outline" onClick={() => setUploadedImage(null)}>
                          {t('buttons.removeImage')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <Button asChild>
                              <span>Upload Image</span>
                            </Button>
                          </Label>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                        <p className="text-sm text-gray-600">Upload a photo to find matching paint colors</p>
                      </div>
                    )}
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-4">
                    <Label>Or select a color directly:</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                      <div>
                        <Input
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          placeholder="#FFFFFF"
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Matching Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suggestedColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{color.name}</h3>
                          <p className="text-sm text-gray-600">{color.code}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-green-600">{color.match} match</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Color Coordination Tab */}
          <TabsContent value="coordinate" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Select Base Color</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {suggestedColors.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.hex)}
                      >
                        <div className="w-full h-full flex items-end p-2">
                          <div className="bg-white bg-opacity-90 rounded px-2 py-1">
                            <p className="text-xs font-medium">{color.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Complementary Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complementaryColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{color.name}</h3>
                          <p className="text-sm text-gray-600">{color.code}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Add to Palette
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Color Inspiration Tab */}
          <TabsContent value="inspiration" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Modern Minimalist", colors: ["#FFFFFF", "#F5F5F5", "#E5E5E5", "#9CA3AF"] },
                { title: "Warm Earth Tones", colors: ["#8B4513", "#D2691E", "#F4A460", "#DEB887"] },
                { title: "Ocean Blues", colors: ["#1E3A8A", "#3B82F6", "#60A5FA", "#DBEAFE"] },
                { title: "Forest Greens", colors: ["#064E3B", "#059669", "#10B981", "#A7F3D0"] },
                { title: "Sunset Palette", colors: ["#DC2626", "#F97316", "#FBBF24", "#FEF3C7"] },
                { title: "Monochrome Gray", colors: ["#111827", "#4B5563", "#9CA3AF", "#F3F4F6"] },
              ].map((palette, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-4 h-32">
                      {palette.colors.map((color, colorIndex) => (
                        <div key={colorIndex} className="w-full h-full" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{palette.title}</h3>
                      <Button size="sm" variant="outline" className="mt-2">
                        Use This Palette
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
