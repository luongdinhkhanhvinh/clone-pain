'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Users, Eye, ShoppingCart, MessageSquare } from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalVisitors: number
    totalPageViews: number
    totalContacts: number
    totalSamples: number
    visitorGrowth: number
    contactGrowth: number
  }
  popularColors: Array<{
    id: number
    name: string
    nameVi: string
    views: number
    samples: number
  }>
  trafficSources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  monthlyStats: Array<{
    month: string
    visitors: number
    contacts: number
    samples: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Mock data for demo purposes
      setTimeout(() => {
        const mockAnalytics: AnalyticsData = {
          overview: {
            totalVisitors: 12547,
            totalPageViews: 45632,
            totalContacts: 234,
            totalSamples: 156,
            visitorGrowth: 15.3,
            contactGrowth: 8.7,
          },
          popularColors: [
            { id: 1, name: 'Jet Black', nameVi: 'Đen Tuyền', views: 2341, samples: 45 },
            { id: 2, name: 'Summer White', nameVi: 'Trắng Mùa Hè', views: 2156, samples: 38 },
            { id: 3, name: 'Chocolate', nameVi: 'Sô-cô-la', views: 1876, samples: 29 },
            { id: 4, name: 'Jungle Green', nameVi: 'Xanh Rừng', views: 1654, samples: 22 },
            { id: 5, name: 'Warm Grey', nameVi: 'Xám Ấm', views: 1432, samples: 18 },
          ],
          trafficSources: [
            { source: 'Direct', visitors: 4521, percentage: 36.1 },
            { source: 'Google Search', visitors: 3876, percentage: 30.9 },
            { source: 'Social Media', visitors: 2341, percentage: 18.7 },
            { source: 'Referrals', visitors: 1234, percentage: 9.8 },
            { source: 'Email', visitors: 575, percentage: 4.6 },
          ],
          monthlyStats: [
            { month: 'Jan', visitors: 8234, contacts: 45, samples: 28 },
            { month: 'Feb', visitors: 9156, contacts: 52, samples: 31 },
            { month: 'Mar', visitors: 10234, contacts: 48, samples: 29 },
            { month: 'Apr', visitors: 11456, contacts: 61, samples: 35 },
            { month: 'May', visitors: 12547, contacts: 67, samples: 42 },
          ],
        }
        setAnalytics(mockAnalytics)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return <div>Error loading analytics data</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalVisitors.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{analytics.overview.visitorGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalPageViews.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {(analytics.overview.totalPageViews / analytics.overview.totalVisitors).toFixed(1)} pages per visitor
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalContacts}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{analytics.overview.contactGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sample Requests</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalSamples}</div>
            <div className="text-xs text-muted-foreground">
              {((analytics.overview.totalSamples / analytics.overview.totalContacts) * 100).toFixed(1)}% conversion rate
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularColors.map((color, index) => (
                <div key={color.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <div className="font-medium">{color.name}</div>
                      <div className="text-sm text-gray-500">{color.nameVi}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{color.views} views</div>
                    <div className="text-sm text-gray-500">{color.samples} samples</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="font-medium">{source.source}</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">{source.visitors.toLocaleString()}</div>
                    <Badge variant="secondary">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-left p-2">Visitors</th>
                  <th className="text-left p-2">Contacts</th>
                  <th className="text-left p-2">Samples</th>
                  <th className="text-left p-2">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.monthlyStats.map((stat) => (
                  <tr key={stat.month} className="border-b">
                    <td className="p-2 font-medium">{stat.month}</td>
                    <td className="p-2">{stat.visitors.toLocaleString()}</td>
                    <td className="p-2">{stat.contacts}</td>
                    <td className="p-2">{stat.samples}</td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {((stat.contacts / stat.visitors) * 100).toFixed(2)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
