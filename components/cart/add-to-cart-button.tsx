"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { User, Mail } from "lucide-react"
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
  selectedProduct: string
  finish: string
  size: string
}

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    code: string
    image: string
    category: string
    hex?: string
  }
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [finish, setFinish] = useState("Eggshell")
  const [size, setSize] = useState("1 Gallon")
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
    selectedProduct: product.name,
    finish: "Eggshell",
    size: "1 Gallon",
  })

  const finishes = ["Flat", "Eggshell", "Satin", "Semi-Gloss", "Gloss"]
  const sizes = [
    { label: "Sample (2 oz)", value: "Sample" },
    { label: "Quart", value: "Quart"},
    { label: "1 Gallon", value: "1 Gallon" },
    { label: "5 Gallon", value: "5 Gallon" },
  ]

  const selectedSize = sizes.find((s) => s.value === size)

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    alert(t('cart.orderSuccess', 'components'))
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
      selectedProduct: product.name,
      finish: "Eggshell",
      size: "1 Gallon",
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="finish" className="text-sm font-medium text-slate-700">
            {t('cart.finish', 'components')}
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
            {t('cart.size', 'components')}
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
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="w-full" size="lg">
            <User className="w-4 h-4 mr-2" />
            {t('cart.orderNow', 'components')}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg bg-white flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="font-display text-xl">{t('cart.orderInfo', 'components')}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 bg-white">
            <div className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('cart.orderFor', 'components')}: {product.name}
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    {finish} - {size}
                  </p>
                </CardHeader>
                <CardContent>
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
                      {t('cart.submitOrder', 'components')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
