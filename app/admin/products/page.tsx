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

  // Thêm các state cho form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const { data } = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ isActive: true, stock: 0 });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete product "${product.name}"?`)) return;
    try {
      setFormLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        await fetchProducts();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      const isEdit = !!editingProduct;
      const url = isEdit ? `/api/products/${editingProduct!.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';
      const body: any = { ...formData };
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        await fetchProducts();
        setIsDialogOpen(false);
        setEditingProduct(null);
        setFormData({});
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save product');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setFormLoading(false);
    }
  };

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
        <Button onClick={handleAddProduct}>
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
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product)}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <form onSubmit={handleFormSubmit} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold mb-2">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="space-y-2">
              <Input
                placeholder="Name"
                value={formData.name || ''}
                onChange={e => handleFormChange('name', e.target.value)}
                required
              />
              <Input
                placeholder="Name (Vietnamese)"
                value={formData.nameVi || ''}
                onChange={e => handleFormChange('nameVi', e.target.value)}
              />
              <Input
                placeholder="SKU"
                value={formData.sku || ''}
                onChange={e => handleFormChange('sku', e.target.value)}
                required
              />
              <Input
                placeholder="Description"
                value={formData.description || ''}
                onChange={e => handleFormChange('description', e.target.value)}
              />
              <Input
                placeholder="Description (Vietnamese)"
                value={formData.descriptionVi || ''}
                onChange={e => handleFormChange('descriptionVi', e.target.value)}
              />
              <Input
                placeholder="Price"
                type="number"
                value={formData.price || ''}
                onChange={e => handleFormChange('price', Number(e.target.value))}
                required
              />
              <Input
                placeholder="Category ID"
                value={formData.categoryId || ''}
                onChange={e => handleFormChange('categoryId', e.target.value)}
              />
              <Input
                placeholder="Color ID"
                value={formData.colorId || ''}
                onChange={e => handleFormChange('colorId', e.target.value)}
              />
              <Input
                placeholder="Stock"
                type="number"
                value={formData.stock || 0}
                onChange={e => handleFormChange('stock', Number(e.target.value))}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={e => handleFormChange('isActive', e.target.checked)}
                />
                Active
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={formLoading}>Cancel</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : (editingProduct ? 'Save' : 'Add')}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
