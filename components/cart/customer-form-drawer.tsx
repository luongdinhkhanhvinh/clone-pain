"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

interface CustomerFormData {
  username: string
  password: string
}

export function CustomerFormDrawer() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>({
    username: "",
    password: "",
  })

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Customer form submitted:", formData)
    alert(t('cart.orderSuccess', 'components'))
    setIsOpen(false)
    setFormData({
      username: "",
      password: "",
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <User className="w-5 h-5" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-xl">{t('cart.customerFormTitle', 'components')}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('cart.customerFormDescription', 'components')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">{t('cart.username', 'components')}</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">{t('cart.password', 'components')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <User className="w-4 h-4 mr-2" />
                  {t('cart.submitInfo', 'components')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
