'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

interface Article {
  id: string
  title: string
  titleVi: string | null
  slug: string
  excerpt: string | null
  excerptVi: string | null
  content: string | null
  contentVi: string | null
  status: 'draft' | 'published' | 'archived'
  authorId: string | null
  publishedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState<Partial<Article>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const res = await fetch('/api/articles', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('Failed to fetch articles')
      const json = await res.json()
      setArticles(json.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching articles:', error)
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.titleVi?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'archived': return 'destructive'
      default: return 'secondary'
    }
  }

  const handleAddArticle = () => {
    setEditingArticle(null)
    setFormData({ status: 'draft' })
    setIsDialogOpen(true)
  }
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setFormData({ ...article })
    setIsDialogOpen(true)
  }
  const handleDeleteArticle = (article: Article) => {
    setDeleteTarget(article)
  }
  const confirmDeleteArticle = async () => {
    if (!deleteTarget) return
    setFormLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/articles/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      })
      if (res.ok) {
        setDeleteTarget(null)
        await fetchArticles()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete article')
      }
    } catch (e) {
      alert('Network error')
    } finally {
      setFormLoading(false)
    }
  }
  const handleFormChange = (field: keyof Article, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('admin_token')
      const isEdit = !!editingArticle
      const url = isEdit ? `/api/articles/${editingArticle!.id}` : '/api/articles'
      const method = isEdit ? 'PUT' : 'POST'
      const body = { ...formData }
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        await fetchArticles()
        setIsDialogOpen(false)
        setEditingArticle(null)
        setFormData({})
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save article')
      }
    } catch (e) {
      setError('Network error')
    } finally {
      setFormLoading(false)
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
        <Button onClick={handleAddArticle}>
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
                      {new Date(article.updatedAt || article.createdAt || '').toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditArticle(article)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteArticle(article)}>
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
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingArticle ? 'Edit Article' : 'Add Article'}</DialogTitle>
              <DialogDescription>
                {editingArticle ? 'Edit the article details.' : 'Add a new article.'}
              </DialogDescription>
            </DialogHeader>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <form onSubmit={handleFormSubmit} className="space-y-2">
              <Input
                placeholder="Title"
                value={formData.title || ''}
                onChange={e => handleFormChange('title', e.target.value)}
                required
              />
              <Input
                placeholder="Title (Vietnamese)"
                value={formData.titleVi || ''}
                onChange={e => handleFormChange('titleVi', e.target.value)}
              />
              <Input
                placeholder="Slug"
                value={formData.slug || ''}
                onChange={e => handleFormChange('slug', e.target.value)}
                required
              />
              <Input
                placeholder="Excerpt"
                value={formData.excerpt || ''}
                onChange={e => handleFormChange('excerpt', e.target.value)}
              />
              <Input
                placeholder="Excerpt (Vietnamese)"
                value={formData.excerptVi || ''}
                onChange={e => handleFormChange('excerptVi', e.target.value)}
              />
              <Input
                placeholder="Content"
                value={formData.content || ''}
                onChange={e => handleFormChange('content', e.target.value)}
              />
              <Input
                placeholder="Content (Vietnamese)"
                value={formData.contentVi || ''}
                onChange={e => handleFormChange('contentVi', e.target.value)}
              />
              <select
                className="w-full border rounded p-2"
                value={formData.status || 'draft'}
                onChange={e => handleFormChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <Input
                placeholder="Author ID"
                value={formData.authorId || ''}
                onChange={e => handleFormChange('authorId', e.target.value)}
              />
              <Input
                placeholder="Published At (ISO)"
                value={formData.publishedAt || ''}
                onChange={e => handleFormChange('publishedAt', e.target.value)}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={formLoading}>Cancel</Button>
                <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : (editingArticle ? 'Save' : 'Add')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {deleteTarget && (
        <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Article</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete article "{deleteTarget.title}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteArticle} disabled={formLoading}>
                {formLoading ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
