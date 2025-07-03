"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, User, Mail } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

interface CustomerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  projectType: string
  message: string
  selectedColor: string
}

interface ColorCardProps {
  color: {
    id: number
    code: string
    name: string
    description: string
    hex: string
    image: string
    orderPercentage: string
    introduction: string
    category: string
    popular: boolean
  }
  size?: "small" | "large"
  showCategory?: boolean
}

export function ColorCard({ color, size = "small", showCategory = false }: ColorCardProps) {
  const { t } = useLanguage()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    projectType: "",
    message: "",
    selectedColor: color.name,
  })

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Color sample order submitted:", {
      ...formData,
      color: {
        name: color.name,
        code: color.code,
        hex: color.hex,
        price: 5.99,
      },
    })
    // Handle form submission logic here
    alert(t('colorCard.orderSuccess', 'components'))
    setIsOpen(false)
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      projectType: "",
      message: "",
      selectedColor: color.name,
    })
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
          <div className={`w-full ${cardHeight} relative overflow-hidden`}>
            <Image
              src={color.image}
              alt={color.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                onClick={toggleFavorite}
              >
                <Heart className={`w-3 h-3 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <User className="w-3 h-3" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg flex flex-col">
                  <SheetHeader className="flex-shrink-0">
                    <SheetTitle className="font-display text-xl">{t('colorCard.orderSample', 'components')}</SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto py-4">
                    <div className="py-4">
                      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border-2 border-white shadow-sm overflow-hidden relative">
                            <Image
                              src={color.image}
                              alt={color.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{color.name}</h3>
                            <p className="text-sm text-slate-600">{color.code}</p>
                            <p className="text-sm font-medium">{t('colorCard.samplePrice', 'components')}</p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Personal Information */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">{t('colorCard.form.firstName', 'components')}</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">{t('colorCard.form.lastName', 'components')}</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">{t('colorCard.form.email', 'components')}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">{t('colorCard.form.phone', 'components')}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                          />
                        </div>

                        {/* Address Information */}
                        <div>
                          <Label htmlFor="address">{t('colorCard.form.address', 'components')}</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">{t('colorCard.form.city', 'components')}</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">{t('colorCard.form.state', 'components')}</Label>
                            <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('colorCard.form.selectState', 'components')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hanoi">{t('colorCard.form.states.hanoi', 'components')}</SelectItem>
                                <SelectItem value="hcm">{t('colorCard.form.states.hcm', 'components')}</SelectItem>
                                <SelectItem value="danang">{t('colorCard.form.states.danang', 'components')}</SelectItem>
                                <SelectItem value="haiphong">{t('colorCard.form.states.haiphong', 'components')}</SelectItem>
                                <SelectItem value="cantho">{t('colorCard.form.states.cantho', 'components')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="zipCode">{t('colorCard.form.zipCode', 'components')}</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          />
                        </div>

                        {/* Project Information */}
                        <div>
                          <Label htmlFor="projectType">{t('colorCard.form.projectType', 'components')}</Label>
                          <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('colorCard.form.selectProject', 'components')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential">{t('colorCard.form.projectTypes.residential', 'components')}</SelectItem>
                              <SelectItem value="commercial">{t('colorCard.form.projectTypes.commercial', 'components')}</SelectItem>
                              <SelectItem value="industrial">{t('colorCard.form.projectTypes.industrial', 'components')}</SelectItem>
                              <SelectItem value="renovation">{t('colorCard.form.projectTypes.renovation', 'components')}</SelectItem>
                              <SelectItem value="new-construction">{t('colorCard.form.projectTypes.newConstruction', 'components')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="message">{t('colorCard.form.message', 'components')}</Label>
                          <Textarea
                            id="message"
                            placeholder={t('colorCard.form.projectDescription', 'components')}
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            rows={3}
                          />
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                          <Mail className="w-4 h-4 mr-2" />
                          {t('colorCard.form.submitOrder', 'components')}
                        </Button>
                      </form>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {color.popular && (
              <Badge className="absolute bottom-2 left-2 bg-white text-gray-900 text-xs">{t('colorCard.popular', 'components')}</Badge>
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
            <p className="text-xs text-gray-500 mt-1">{color.description}</p>
            {color.orderPercentage && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-blue-600 font-medium">
                  {color.orderPercentage}
                </span>
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
