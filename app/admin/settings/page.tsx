'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Save, Globe, Mail, Shield, Database, Bell } from 'lucide-react'

interface Settings {
  general: {
    siteName: string
    siteNameVi: string
    siteDescription: string
    siteDescriptionVi: string
    contactEmail: string
    supportPhone: string
    address: string
    addressVi: string
  }
  features: {
    enableRegistration: boolean
    enableComments: boolean
    enableNewsletter: boolean
    enableAnalytics: boolean
    enableSampleOrders: boolean
    enableProfessionalProgram: boolean
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  seo: {
    metaTitle: string
    metaTitleVi: string
    metaDescription: string
    metaDescriptionVi: string
    keywords: string
    keywordsVi: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Mock data for demo purposes
      setTimeout(() => {
        const mockSettings: Settings = {
          general: {
            siteName: 'Wood Panel Pro',
            siteNameVi: 'Ván Gỗ Chuyên Nghiệp',
            siteDescription: 'Premium wood panel solutions for modern spaces',
            siteDescriptionVi: 'Giải pháp ván gỗ cao cấp cho không gian hiện đại',
            contactEmail: 'contact@woodpanel.com',
            supportPhone: '+84 901 234 567',
            address: '123 Wood Street, District 1, Ho Chi Minh City',
            addressVi: '123 Đường Gỗ, Quận 1, TP. Hồ Chí Minh',
          },
          features: {
            enableRegistration: false,
            enableComments: true,
            enableNewsletter: true,
            enableAnalytics: true,
            enableSampleOrders: true,
            enableProfessionalProgram: true,
          },
          email: {
            smtpHost: 'smtp.gmail.com',
            smtpPort: 587,
            smtpUser: 'noreply@woodpanel.com',
            smtpPassword: '••••••••',
            fromEmail: 'noreply@woodpanel.com',
            fromName: 'Wood Panel Pro',
          },
          seo: {
            metaTitle: 'Wood Panel Pro - Premium Wood Panel Solutions',
            metaTitleVi: 'Ván Gỗ Chuyên Nghiệp - Giải Pháp Ván Gỗ Cao Cấp',
            metaDescription: 'Discover premium wood panels with natural finishes. High-quality wood panel colors and professional-grade products.',
            metaDescriptionVi: 'Khám phá ván gỗ cao cấp với hoàn thiện tự nhiên. Màu ván gỗ chất lượng cao và sản phẩm chuyên nghiệp.',
            keywords: 'wood panels, interior design, home renovation, premium wood',
            keywordsVi: 'ván gỗ, thiết kế nội thất, cải tạo nhà, gỗ cao cấp',
          },
        }
        setSettings(mockSettings)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Mock save operation
      setTimeout(() => {
        setSaving(false)
        alert('Settings saved successfully!')
      }, 1000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaving(false)
    }
  }

  const updateSettings = (section: keyof Settings, field: string, value: any) => {
    if (!settings) return
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading settings...</div>
      </div>
    )
  }

  if (!settings) {
    return <div>Error loading settings</div>
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'features', label: 'Features', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'seo', label: 'SEO', icon: Database },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex space-x-6">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Name (English)</label>
                    <Input
                      value={settings.general.siteName}
                      onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Name (Vietnamese)</label>
                    <Input
                      value={settings.general.siteNameVi}
                      onChange={(e) => updateSettings('general', 'siteNameVi', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site Description (English)</label>
                  <Textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site Description (Vietnamese)</label>
                  <Textarea
                    value={settings.general.siteDescriptionVi}
                    onChange={(e) => updateSettings('general', 'siteDescriptionVi', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <Input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSettings('general', 'contactEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Support Phone</label>
                    <Input
                      value={settings.general.supportPhone}
                      onChange={(e) => updateSettings('general', 'supportPhone', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'features' && (
            <Card>
              <CardHeader>
                <CardTitle>Feature Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <p className="text-sm text-gray-500">
                        {key === 'enableRegistration' && 'Allow users to register accounts'}
                        {key === 'enableComments' && 'Enable comments on articles'}
                        {key === 'enableNewsletter' && 'Enable newsletter subscription'}
                        {key === 'enableAnalytics' && 'Enable Google Analytics tracking'}
                        {key === 'enableSampleOrders' && 'Allow customers to order samples'}
                        {key === 'enableProfessionalProgram' && 'Enable professional partner program'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateSettings('features', key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Host</label>
                    <Input
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Port</label>
                    <Input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Username</label>
                    <Input
                      value={settings.email.smtpUser}
                      onChange={(e) => updateSettings('email', 'smtpUser', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SMTP Password</label>
                    <Input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'seo' && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Title (English)</label>
                    <Input
                      value={settings.seo.metaTitle}
                      onChange={(e) => updateSettings('seo', 'metaTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Title (Vietnamese)</label>
                    <Input
                      value={settings.seo.metaTitleVi}
                      onChange={(e) => updateSettings('seo', 'metaTitleVi', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description (English)</label>
                  <Textarea
                    value={settings.seo.metaDescription}
                    onChange={(e) => updateSettings('seo', 'metaDescription', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description (Vietnamese)</label>
                  <Textarea
                    value={settings.seo.metaDescriptionVi}
                    onChange={(e) => updateSettings('seo', 'metaDescriptionVi', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
