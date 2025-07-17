'use client'

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Heart, Share2, Download, MessageCircle, Mail } from "lucide-react"
import { ColorCard } from "@/components/colors/color-card"
import { useLanguage } from "@/components/providers/language-provider"
import { useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactFormData {
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

export default function ColorDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
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
    selectedColor: "",
  })

  const colorSlug = params.slug as string
  const [color, setColor] = useState<any | null>(null)
  const [relatedColors, setRelatedColors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchColor = async () => {
      setLoading(true)
      setError("")
      try {
        // Fetch chi tiết màu theo slug
        const res = await fetch(`/api/colors/${colorSlug}`)
        const json = await res.json()
        if (res.ok && json.data) {
          setColor(json.data)
          // Fetch all colors để lấy related
          const allRes = await fetch('/api/colors')
          const allJson = await allRes.json()
          let allColors = allJson.data
          if (allColors && Array.isArray(allColors.colors)) allColors = allColors.colors
          if (allColors && Array.isArray(allColors)) {
            setRelatedColors(
              allColors.filter((c: any) => c.category === json.data.category && c.id !== json.data.id).slice(0, 4)
            )
          } else {
            setRelatedColors([])
          }
        } else {
          setError("Không tìm thấy màu")
        }
      } catch (e) {
        setError("Lỗi khi tải dữ liệu màu")
      } finally {
        setLoading(false)
      }
    }
    fetchColor()
  }, [colorSlug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải dữ liệu màu...</div>
  }
  if (error || !color) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Không tìm thấy màu"}</h1>
          <Button onClick={() => router.push('/colors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách màu
          </Button>
        </div>
      </div>
    )
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  const handleContactInputChange = (field: keyof ContactFormData, value: string) => {
    setContactFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", {
      ...contactFormData,
      color: {
        name: color.name,
        code: color.code,
        hex: color.hex,
        description: color.description,
      },
    })
    // Handle form submission logic here
    alert("Yêu cầu tư vấn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.")
    setIsContactOpen(false)
    // Reset form
    setContactFormData({
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

  // Set initial color when component mounts
  React.useEffect(() => {
    if (color) {
      setContactFormData(prev => ({ ...prev, selectedColor: color.name }))
    }
  }, [color])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/colors')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('buttons.backToColors', 'colors')}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFavorite}
              className={isFavorited ? "text-red-500" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
              {isFavorited ? t('buttons.favorited', 'colors') : t('buttons.favorite', 'colors')}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {t('buttons.share', 'colors')}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              {t('buttons.download', 'colors')}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Color Display */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-96 w-full relative">
                <Image
                  src={color.image}
                  alt={color.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {color.popular && (
                  <Badge className="absolute top-4 left-4 bg-white text-gray-900">
                    Phổ Biến
                  </Badge>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900">{color.hex}</div>
                  <div className="text-xs text-gray-600">Mã màu HEX</div>
                </div>
              </div>
            </Card>

            {/* Color Swatches */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="h-20 w-full rounded-lg border-2 border-gray-200 overflow-hidden relative">
                  <Image
                    src={color.image}
                    alt={color.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
                <div className="text-xs text-gray-600 mt-2">Màu gốc</div>
              </div>
              <div className="text-center">
                <div className="h-20 w-full rounded-lg border-2 border-gray-200 overflow-hidden relative">
                  <Image
                    src={color.image}
                    alt={`${color.name} - 80% opacity`}
                    fill
                    className="object-cover opacity-80"
                    sizes="120px"
                  />
                </div>
                <div className="text-xs text-gray-600 mt-2">80% độ mờ</div>
              </div>
              <div className="text-center">
                <div className="h-20 w-full rounded-lg border-2 border-gray-200 overflow-hidden relative">
                  <Image
                    src={color.image}
                    alt={`${color.name} - 50% opacity`}
                    fill
                    className="object-cover opacity-50"
                    sizes="120px"
                  />
                </div>
                <div className="text-xs text-gray-600 mt-2">50% độ mờ</div>
              </div>
            </div>
          </div>

          {/* Color Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{color.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{color.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">{color.code}</Badge>
                <Badge variant="outline">{color.category}</Badge>
                {color.orderPercentage && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {color.orderPercentage}
                  </Badge>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed">{color.introduction}</p>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">{t('colorDetail.tabs.details', 'colors')}</TabsTrigger>
                <TabsTrigger value="applications">{t('colorDetail.tabs.applications', 'colors')}</TabsTrigger>
                <TabsTrigger value="combinations">{t('colorDetail.tabs.combinations', 'colors')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('colorDetail.technicalInfo', 'colors')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã màu:</span>
                      <span className="font-medium">{color.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã HEX:</span>
                      <span className="font-medium">{color.hex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-medium">{color.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ đặt hàng:</span>
                      <span className="font-medium">{color.orderPercentage}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="applications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('colorDetail.suitableApplications', 'colors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Phòng khách và khu vực tiếp khách</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Phòng ngủ và không gian nghỉ ngơi</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Văn phòng và không gian làm việc</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Khu vực ẩm ướt (cần xử lý đặc biệt)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="combinations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('colorDetail.colorCombinations', 'colors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {relatedColors.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {relatedColors.map((relatedColor) => (
                          <div key={relatedColor.id} className="text-center">
                            <div
                              className="h-16 w-full rounded-lg border-2 border-gray-200 mb-2 cursor-pointer hover:scale-105 transition-transform overflow-hidden relative"
                              onClick={() => router.push(`/colors/${relatedColor.name.toLowerCase().replace(/\s+/g, "-")}`)}
                            >
                              <Image
                                src={relatedColor.image}
                                alt={relatedColor.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="text-xs text-gray-600">{relatedColor.name}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Không có màu phối hợp nào trong cùng danh mục
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Contact Button */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('colorDetail.contactForAdvice', 'colors')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('colorDetail.consultationText', 'colors')}
                  </p>
                  <Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <SheetTrigger asChild>
                      <Button size="lg" className="w-full" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t('colorDetail.contactNow', 'colors')}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg bg-white flex flex-col">
                      <SheetHeader className="flex-shrink-0">
                        <SheetTitle className="font-display text-xl">Tư vấn màu sắc</SheetTitle>
                      </SheetHeader>

                      <div className="flex-1 overflow-y-auto py-4 bg-white">
                        <div className="py-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Tư vấn cho màu: {color.name}
                              </CardTitle>
                              <p className="text-sm text-slate-600">
                                {color.description} - {color.code}
                              </p>
                            </CardHeader>
                            <CardContent>
                              <form onSubmit={handleContactSubmit} className="space-y-4">
                                {/* Personal Information */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="firstName">{t('colorDetail.form.firstName', 'colors')}</Label>
                                    <Input
                                      id="firstName"
                                      value={contactFormData.firstName}
                                      onChange={(e) => handleContactInputChange("firstName", e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="lastName">{t('colorDetail.form.lastName', 'colors')}</Label>
                                    <Input
                                      id="lastName"
                                      value={contactFormData.lastName}
                                      onChange={(e) => handleContactInputChange("lastName", e.target.value)}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="email">{t('colorDetail.form.email', 'colors')}</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={contactFormData.email}
                                      onChange={(e) => handleContactInputChange("email", e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="phone">{t('colorDetail.form.phone', 'colors')}</Label>
                                    <Input
                                      id="phone"
                                      value={contactFormData.phone}
                                      onChange={(e) => handleContactInputChange("phone", e.target.value)}
                                      required
                                    />
                                  </div>
                                </div>

                                {/* Address Information */}
                                <div>
                                  <Label htmlFor="address">{t('colorDetail.form.address', 'colors')}</Label>
                                  <Input
                                    id="address"
                                    value={contactFormData.address}
                                    onChange={(e) => handleContactInputChange("address", e.target.value)}
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label htmlFor="city">{t('colorDetail.form.city', 'colors')}</Label>
                                    <Input
                                      id="city"
                                      value={contactFormData.city}
                                      onChange={(e) => handleContactInputChange("city", e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="state">{t('colorDetail.form.state', 'colors')}</Label>
                                    <Select value={contactFormData.state} onValueChange={(value) => handleContactInputChange("state", value)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('colorDetail.form.selectState', 'colors')} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                                        <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                                        <SelectItem value="haiphong">Hải Phòng</SelectItem>
                                        <SelectItem value="cantho">Cần Thơ</SelectItem>
                                        <SelectItem value="other">Khác</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="zipCode">{t('colorDetail.form.zipCode', 'colors')}</Label>
                                    <Input
                                      id="zipCode"
                                      value={contactFormData.zipCode}
                                      onChange={(e) => handleContactInputChange("zipCode", e.target.value)}
                                    />
                                  </div>
                                </div>

                                {/* Project Information */}
                                <div>
                                  <Label htmlFor="projectType">{t('colorDetail.form.projectType', 'colors')}</Label>
                                  <Select value={contactFormData.projectType} onValueChange={(value) => handleContactInputChange("projectType", value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('colorDetail.form.selectProject', 'colors')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="residential">Nhà ở</SelectItem>
                                      <SelectItem value="commercial">Thương mại</SelectItem>
                                      <SelectItem value="renovation">Cải tạo</SelectItem>
                                      <SelectItem value="new-construction">Xây mới</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="message">{t('colorDetail.form.message', 'colors')}</Label>
                                  <Textarea
                                    id="message"
                                    placeholder={t('colorDetail.form.messagePlaceholder', 'colors')}
                                    value={contactFormData.message}
                                    onChange={(e) => handleContactInputChange("message", e.target.value)}
                                    rows={3}
                                  />
                                </div>

                                <Button type="submit" className="w-full" size="lg">
                                  <Mail className="w-4 h-4 mr-2" />
                                  {t('colorDetail.form.submitConsultation', 'colors')}
                                </Button>
                              </form>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Colors */}
        {relatedColors.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('colorDetail.colorOfTheSame', 'colors')}: {color.category}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedColors.map((relatedColor) => (
                <ColorCard
                  key={relatedColor.id}
                  color={relatedColor}
                  size="large"
                  showCategory={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
