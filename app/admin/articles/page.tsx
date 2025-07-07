'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'

interface Article {
  id: number
  title: string
  titleVi: string
  slug: string
  excerpt: string
  excerptVi: string
  content: string
  contentVi: string
  status: 'draft' | 'published' | 'archived'
  authorId: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      // Mock data for demo purposes
      setTimeout(() => {
        const mockArticles = [
          {
            id: 1,
            title: 'Wood Panel Installation Guide',
            titleVi: 'Hướng Dẫn Lắp Đặt Ván Gỗ',
            slug: 'wood-panel-installation-guide',
            excerpt: 'Complete guide for installing wood panels',
            excerptVi: 'Hướng dẫn đầy đủ về lắp đặt ván gỗ',
            content: 'Full installation guide content...',
            contentVi: 'Nội dung hướng dẫn lắp đặt đầy đủ...',
            status: 'published' as const,
            authorId: 1,
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Choosing the Right Wood Panel Color',
            titleVi: 'Chọn Màu Ván Gỗ Phù Hợp',
            slug: 'choosing-right-wood-panel-color',
            excerpt: 'Tips for selecting the perfect wood panel color',
            excerptVi: 'Mẹo chọn màu ván gỗ hoàn hảo',
            content: 'Color selection guide content...',
            contentVi: 'Nội dung hướng dẫn chọn màu...',
            status: 'published' as const,
            authorId: 1,
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 3,
            title: 'Wood Panel Maintenance Tips',
            titleVi: 'Mẹo Bảo Dưỡng Ván Gỗ',
            slug: 'wood-panel-maintenance-tips',
            excerpt: 'How to maintain your wood panels',
            excerptVi: 'Cách bảo dưỡng ván gỗ của bạn',
            content: 'Maintenance tips content...',
            contentVi: 'Nội dung mẹo bảo dưỡng...',
            status: 'draft' as const,
            authorId: 1,
            publishedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
        setArticles(mockArticles)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching articles:', error)
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.titleVi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'archived': return 'destructive'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading articles...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Articles Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Published</th>
                  <th className="text-left p-2">Updated</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-gray-500">{article.titleVi}</div>
                        <div className="text-xs text-gray-400 mt-1">{article.excerpt}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">
                      {article.publishedAt 
                        ? new Date(article.publishedAt).toLocaleDateString('vi-VN')
                        : '-'
                      }
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(article.updatedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
