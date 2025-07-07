"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'

interface Color {
  id: number
  name: string
  nameVi: string
  code: string
  hexColor: string
  description?: string
  descriptionVi?: string
  marketingCopy?: string
  marketingCopyVi?: string
  imageUrl?: string
  popularity: number
  isActive: boolean
  createdAt: string
  category?: {
    id: number
    name: string
    nameVi: string
  }
}

interface Category {
  id: number
  name: string
  nameVi: string
}

interface ColorFormData {
  name: string
  nameVi: string
  code: string
  hexColor: string
  categoryId: number | null
  description: string
  descriptionVi: string
  marketingCopy: string
  marketingCopyVi: string
  imageUrl: string
  popularity: number
  isActive: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<Color | null>(null)
  const [formData, setFormData] = useState<ColorFormData>({
    name: '',
    nameVi: '',
    code: '',
    hexColor: '#000000',
    categoryId: null,
    description: '',
    descriptionVi: '',
    marketingCopy: '',
    marketingCopyVi: '',
    imageUrl: '',
    popularity: 0,
    isActive: true,
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchColors()
  }, [pagination.page, searchTerm, selectedCategory])

  const fetchCategories = async () => {
    try {
      // Mock categories data
      const mockCategories = [
        {
          id: 1,
          name: 'Premium Wood Panels',
          nameVi: 'Ván Gỗ Cao Cấp',
          slug: 'premium-wood-panels',
          isActive: true,
        },
        {
          id: 2,
          name: 'Standard Wood Panels',
          nameVi: 'Ván Gỗ Tiêu Chuẩn',
          slug: 'standard-wood-panels',
          isActive: true,
        },
      ]
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchColors = async () => {
    try {
      // Mock data for demo purposes
      setTimeout(() => {
        const mockColors = [
          {
            id: 1,
            name: 'Jet Black',
            nameVi: 'Đen Tuyền',
            code: 'JB-001',
            hexColor: '#1a1a1a',
            imageUrl: '/colors/JetBlack.png',
            description: 'Deep, rich black with sophisticated elegance',
            descriptionVi: 'Màu đen sâu, phong phú với vẻ thanh lịch tinh tế',
            categoryId: 1,
            popularity: 85,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Summer White',
            nameVi: 'Trắng Mùa Hè',
            code: 'SW-002',
            hexColor: '#f8f8f8',
            imageUrl: '/colors/SummerWhite.png',
            description: 'Clean, bright white perfect for modern spaces',
            descriptionVi: 'Màu trắng sạch, sáng hoàn hảo cho không gian hiện đại',
            categoryId: 1,
            popularity: 90,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: 'Chocolate',
            nameVi: 'Sô-cô-la',
            code: 'CH-003',
            hexColor: '#7b3f00',
            imageUrl: '/colors/Chocolate.png',
            description: 'Rich chocolate brown for warm, cozy environments',
            descriptionVi: 'Màu nâu sô-cô-la đậm đà cho môi trường ấm áp, ấm cúng',
            categoryId: 2,
            popularity: 70,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

        setColors(mockColors)
        setPagination({
          page: 1,
          limit: 20,
          total: mockColors.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        })
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching colors:', error)
      setError('Network error')
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ColorFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      nameVi: '',
      code: '',
      hexColor: '#000000',
      categoryId: null,
      description: '',
      descriptionVi: '',
      marketingCopy: '',
      marketingCopyVi: '',
      imageUrl: '',
      popularity: 0,
      isActive: true,
    })
    setEditingColor(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      const url = editingColor 
        ? `/api/colors/${editingColor.id}`
        : '/api/colors'
      
      const method = editingColor ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchColors()
        setIsDialogOpen(false)
        resetForm()
      } else {
        setError(data.error || 'Failed to save color')
      }
    } catch (error) {
      console.error('Error saving color:', error)
      setError('Network error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (color: Color) => {
    setEditingColor(color)
    setFormData({
      name: color.name,
      nameVi: color.nameVi,
      code: color.code,
      hexColor: color.hexColor,
      categoryId: color.category?.id || null,
      description: color.description || '',
      descriptionVi: color.descriptionVi || '',
      marketingCopy: color.marketingCopy || '',
      marketingCopyVi: color.marketingCopyVi || '',
      imageUrl: color.imageUrl || '',
      popularity: color.popularity,
      isActive: color.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (color: Color) => {
    if (!confirm(`Are you sure you want to delete "${color.name}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/colors/${color.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchColors()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete color')
      }
    } catch (error) {
      console.error('Error deleting color:', error)
      alert('Network error')
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Colors</h1>
          <p className="text-gray-600 mt-2">Manage your wood panel color collection</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingColor ? 'Edit Color' : 'Add New Color'}
              </DialogTitle>
              <DialogDescription>
                {editingColor 
                  ? 'Update the color information below.'
                  : 'Create a new color for your wood panel collection.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name (English)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Color name in English"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameVi">Name (Vietnamese)</Label>
                    <Input
                      id="nameVi"
                      value={formData.nameVi}
                      onChange={(e) => handleInputChange('nameVi', e.target.value)}
                      placeholder="Tên màu tiếng Việt"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="code">Color Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      placeholder="CTB-001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hexColor">Hex Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="hexColor"
                        type="color"
                        value={formData.hexColor}
                        onChange={(e) => handleInputChange('hexColor', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.hexColor}
                        onChange={(e) => handleInputChange('hexColor', e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="popularity">Popularity</Label>
                    <Input
                      id="popularity"
                      type="number"
                      value={formData.popularity}
                      onChange={(e) => handleInputChange('popularity', parseInt(e.target.value) || 0)}
                      placeholder="0-100"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    value={formData.categoryId?.toString() || ''}
                    onValueChange={(value) => handleInputChange('categoryId', value ? parseInt(value) : '')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name} ({category.nameVi})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/color-image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="description">Description (English)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Color description in English"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionVi">Description (Vietnamese)</Label>
                    <Textarea
                      id="descriptionVi"
                      value={formData.descriptionVi}
                      onChange={(e) => handleInputChange('descriptionVi', e.target.value)}
                      placeholder="Mô tả màu tiếng Việt"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="marketingCopy">Marketing Copy (English)</Label>
                    <Textarea
                      id="marketingCopy"
                      value={formData.marketingCopy}
                      onChange={(e) => handleInputChange('marketingCopy', e.target.value)}
                      placeholder="Marketing description in English"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="marketingCopyVi">Marketing Copy (Vietnamese)</Label>
                    <Textarea
                      id="marketingCopyVi"
                      value={formData.marketingCopyVi}
                      onChange={(e) => handleInputChange('marketingCopyVi', e.target.value)}
                      placeholder="Mô tả marketing tiếng Việt"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingColor ? 'Update' : 'Create'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search colors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500 flex items-center">
              Showing {colors.length} of {pagination.total} colors
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Colors ({pagination.total})</CardTitle>
          <CardDescription>
            Manage your wood panel color collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Popularity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colors.map((color) => (
                <TableRow key={color.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: color.hexColor }}
                      />
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {color.hexColor}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{color.name}</div>
                      <div className="text-sm text-gray-500">{color.nameVi}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {color.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    {color.category ? (
                      <div>
                        <div className="text-sm">{color.category.name}</div>
                        <div className="text-xs text-gray-500">{color.category.nameVi}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No category</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(color.popularity, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm">{color.popularity}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={color.isActive ? 'default' : 'secondary'}>
                      {color.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(color)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(color)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {colors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No colors found
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
