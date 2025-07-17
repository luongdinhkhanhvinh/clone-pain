"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart3,
  Users,
  Package,
  Palette,
  FileText,
  Mail,
  TrendingUp,
  TrendingDown,
  Eye,
  Tag,
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  categories: { total: number; active: number }
  colors: { total: number; active: number; popular: number }
  products: { total: number; active: number; inStock: number }
  articles: { total: number; published: number; draft: number }
  contacts: { total: number; new: number; inProgress: number; resolved: number }
}

interface RecentContact {
  id: number
  firstName: string
  lastName: string
  email: string
  subject: string
  status: string
  source: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch song song các API
      const [catRes, colorRes, prodRes, artRes, contactRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/colors'),
        fetch('/api/products'),
        fetch('/api/articles'),
        fetch('/api/contacts'),
      ])
      const [catData, colorData, prodData, artData, contactData] = await Promise.all([
        catRes.json(), colorRes.json(), prodRes.json(), artRes.json(), contactRes.json()
      ])
      // Categories
      const categories = catData.data || []
      const activeCategories = categories.filter((c: any) => c.status !== 'inactive').length
      // Colors
      const colors = colorData.data || colorData.data?.colors || []
      const activeColors = colors.filter((c: any) => c.status !== 'inactive').length
      const popularColors = colors.filter((c: any) => c.isPopular || c.popular).length
      // Products
      const products = prodData.data || prodData.data?.products || []
      const activeProducts = products.filter((p: any) => p.status !== 'inactive').length
      const inStockProducts = products.filter((p: any) => (p.stock ?? 1) > 0).length
      // Articles
      const articles = artData.data || []
      const publishedArticles = articles.filter((a: any) => a.status === 'published').length
      const draftArticles = articles.filter((a: any) => a.status === 'draft').length
      // Contacts
      const contacts = contactData.data || []
      const newContacts = contacts.filter((c: any) => c.status === 'new').length
      const inProgressContacts = contacts.filter((c: any) => c.status === 'in_progress').length
      const resolvedContacts = contacts.filter((c: any) => c.status === 'resolved').length
      // Tổng hợp stats
      setStats({
        categories: {
          total: categories.length,
          active: activeCategories,
        },
        colors: {
          total: colors.length,
          active: activeColors,
          popular: popularColors,
        },
        products: {
          total: products.length,
          active: activeProducts,
          inStock: inStockProducts,
        },
        articles: {
          total: articles.length,
          published: publishedArticles,
          draft: draftArticles,
        },
        contacts: {
          total: contacts.length,
          new: newContacts,
          inProgress: inProgressContacts,
          resolved: resolvedContacts,
        },
      })
      // Recent contacts (3 mới nhất)
      const sortedContacts = [...contacts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setRecentContacts(sortedContacts.slice(0, 3))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'destructive'
      case 'in_progress': return 'default'
      case 'resolved': return 'secondary'
      case 'closed': return 'outline'
      default: return 'default'
    }
  }

  const getSourceBadgeVariant = (source: string) => {
    switch (source) {
      case 'contact_form': return 'default'
      case 'color_inquiry': return 'secondary'
      case 'professional_application': return 'outline'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your Silklux business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.categories.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.categories.active} active categories
            </p>
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/categories">Manage Categories</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colors</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.colors.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.colors.popular} popular colors
            </p>
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/colors">Manage Colors</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.products.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.products.inStock} in stock
            </p>
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products">Manage Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.articles.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.articles.published} published, {stats?.articles.draft} drafts
            </p>
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/articles">Manage Articles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.contacts.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.contacts.new} new inquiries
            </p>
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/contacts">Manage Contacts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              Growth this month
            </p>
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
          <CardDescription>Latest customer inquiries and contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {contact.subject || 'No subject'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSourceBadgeVariant(contact.source)}>
                      {contact.source?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(contact.status)}>
                      {contact.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/contacts/${contact.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {recentContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent contacts found
            </div>
          )}
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/admin/contacts">View All Contacts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
