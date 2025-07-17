'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Shield, User } from 'lucide-react'

interface AdminUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'editor'
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Thêm các state cho form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<Partial<AdminUser & { password?: string }>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const { data } = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'manager': return 'default'
      case 'editor': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />
      case 'manager': return <User className="h-3 w-3" />
      case 'editor': return <Edit className="h-3 w-3" />
      default: return <User className="h-3 w-3" />
    }
  }

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Never'
    
    const now = new Date()
    const loginDate = new Date(lastLogin)
    const diffInHours = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return loginDate.toLocaleDateString('vi-VN')
  }

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ role: 'editor', isActive: true });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({ ...user });
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`Are you sure you want to delete user ${user.email}?`)) return;
    try {
      setFormLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        await fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
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
      const isEdit = !!editingUser;
      const url = isEdit ? `/api/users/${editingUser!.id}` : '/api/users';
      const method = isEdit ? 'PUT' : 'POST';
      const body: any = { ...formData };
      if (!isEdit && !body.password) {
        setError('Password is required');
        setFormLoading(false);
        return;
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        await fetchUsers();
        setIsDialogOpen(false);
        setEditingUser(null);
        setFormData({});
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save user');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
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
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Last Login</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={getRoleColor(user.role)} className="flex items-center gap-1 w-fit">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user)} disabled={user.role === 'admin'}>
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

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full system access</li>
                <li>• User management</li>
                <li>• System settings</li>
                <li>• All content management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Manager
                </Badge>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Content management</li>
                <li>• Analytics access</li>
                <li>• Contact management</li>
                <li>• Limited user access</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Edit className="h-3 w-3" />
                  Editor
                </Badge>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Content editing</li>
                <li>• Basic analytics</li>
                <li>• Contact viewing</li>
                <li>• No user management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <form onSubmit={handleFormSubmit} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold mb-2">{editingUser ? 'Edit User' : 'Add User'}</h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="space-y-2">
              <Input
                placeholder="Email"
                value={formData.email || ''}
                onChange={e => handleFormChange('email', e.target.value)}
                required
              />
              <Input
                placeholder="Full Name"
                value={(formData as any).fullName || ''}
                onChange={e => handleFormChange('fullName', e.target.value)}
              />
              <Input
                placeholder="Role (admin, manager, editor)"
                value={formData.role || ''}
                onChange={e => handleFormChange('role', e.target.value)}
                required
              />
              {!editingUser && (
                <Input
                  placeholder="Password"
                  type="password"
                  value={formData.password || ''}
                  onChange={e => handleFormChange('password', e.target.value)}
                  required
                />
              )}
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
              <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : (editingUser ? 'Save' : 'Add')}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
