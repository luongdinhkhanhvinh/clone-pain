'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'

interface Product {
  id: number
  name: string
  nameVi: string
  sku: string
  description: string
  descriptionVi: string
  price: number
  categoryId: number
  colorId: number
  isActive: boolean
  stock: number
  createdAt: string
  updatedAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Mock data for demo purposes
      setTimeout(() => {
        const mockProducts = [
          {
            id: 1,
            name: 'Premium Jet Black Panel',
            nameVi: 'Tấm Ván Đen Tuyền Cao Cấp',
            sku: 'WP-JB-001',
            description: 'High-quality jet black Silklux',
            descriptionVi: 'Tấm ván gỗ đen tuyền chất lượng cao',
            price: 299000,
            categoryId: 1,
            colorId: 1,
            isActive: true,
            stock: 150,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Summer White Panel',
            nameVi: 'Tấm Ván Trắng Mùa Hè',
            sku: 'WP-SW-002',
            description: 'Clean bright white Silklux',
            descriptionVi: 'Tấm ván gỗ trắng sạch sáng',
            price: 279000,
            categoryId: 1,
            colorId: 2,
            isActive: true,
            stock: 200,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: 'Chocolate Brown Panel',
            nameVi: 'Tấm Ván Nâu Sô-cô-la',
            sku: 'WP-CH-003',
            description: 'Rich chocolate brown Silklux',
            descriptionVi: 'Tấm ván gỗ nâu sô-cô-la đậm đà',
            price: 259000,
            categoryId: 2,
            colorId: 3,
            isActive: false,
            stock: 75,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
        setProducts(mockProducts)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
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
                  <th className="text-left p-2">SKU</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-2 font-mono text-sm">{product.sku}</td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.nameVi}</div>
                      </div>
                    </td>
                    <td className="p-2">{product.price.toLocaleString('vi-VN')} ₫</td>
                    <td className="p-2">
                      <Badge variant={product.stock > 100 ? 'default' : product.stock > 50 ? 'secondary' : 'destructive'}>
                        {product.stock}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
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
