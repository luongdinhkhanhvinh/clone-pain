"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, User, Mail } from "lucide-react"

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
    alert("Đơn hàng mẫu màu đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.")
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
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="font-display text-xl">Đặt mẫu màu</SheetTitle>
                  </SheetHeader>

                  <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="py-4">
                      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div>
                            <h3 className="font-medium">{color.name}</h3>
                            <p className="text-sm text-slate-600">{color.code}</p>
                            <p className="text-sm font-medium">$5.99 - Mẫu 2oz</p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Personal Information */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">Họ</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Tên</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Số điện thoại</Label>
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
                          <Label htmlFor="address">Địa chỉ</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">Thành phố</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">Tỉnh/Thành</Label>
                            <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn tỉnh/thành" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hanoi">Hà Nội</SelectItem>
                                <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                                <SelectItem value="danang">Đà Nẵng</SelectItem>
                                <SelectItem value="haiphong">Hải Phòng</SelectItem>
                                <SelectItem value="cantho">Cần Thơ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="zipCode">Mã bưu điện</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          />
                        </div>

                        {/* Project Information */}
                        <div>
                          <Label htmlFor="projectType">Loại dự án</Label>
                          <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại dự án" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential">Nhà ở</SelectItem>
                              <SelectItem value="commercial">Thương mại</SelectItem>
                              <SelectItem value="industrial">Công nghiệp</SelectItem>
                              <SelectItem value="renovation">Cải tạo</SelectItem>
                              <SelectItem value="new-construction">Xây dựng mới</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="message">Ghi chú</Label>
                          <Textarea
                            id="message"
                            placeholder="Mô tả chi tiết về dự án của bạn..."
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            rows={3}
                          />
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                          <Mail className="w-4 h-4 mr-2" />
                          Đặt mẫu màu
                        </Button>
                      </form>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
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
