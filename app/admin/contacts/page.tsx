"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  MessageSquare,
} from 'lucide-react'

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
  source: string
  status: string
  assignedTo?: string
  notes?: string
  metadata?: any
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface StatusCount {
  status: string
  count: number
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([])
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
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedSource, setSelectedSource] = useState<string>('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: '',
    assignedTo: '',
    notes: '',
  })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContacts()
  }, [pagination.page, searchTerm, selectedStatus, selectedSource])

  const fetchContacts = async () => {
    try {
      // Mock data for demo purposes
      setTimeout(() => {
        const mockContacts = [
          {
            id: 1,
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            email: 'nguyenvana@email.com',
            phone: '0901234567',
            subject: 'Inquiry about Jet Black panels',
            message: 'I would like to know more about the Jet Black wood panels for my living room project.',
            status: 'new' as const,
            source: 'contact_form' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            firstName: 'Trần',
            lastName: 'Thị B',
            email: 'tranthib@email.com',
            phone: '0912345678',
            subject: 'Sample request for Summer White',
            message: 'Can I get a sample of the Summer White wood panel? I need to see the actual color.',
            status: 'in_progress' as const,
            source: 'sample_request' as const,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 3,
            firstName: 'Lê',
            lastName: 'Văn C',
            email: 'levanc@email.com',
            phone: '0923456789',
            subject: 'Professional application',
            message: 'I am an interior designer and would like to become a professional partner.',
            status: 'resolved' as const,
            source: 'professional_application' as const,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 4,
            firstName: 'Phạm',
            lastName: 'Thị D',
            email: 'phamthid@email.com',
            subject: 'Color consultation',
            message: 'I need help choosing the right color for my bedroom renovation.',
            status: 'closed' as const,
            source: 'color_inquiry' as const,
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ]

        // Apply filters
        let filteredData = mockContacts

        if (searchTerm) {
          filteredData = filteredData.filter(contact =>
            contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }

        if (selectedStatus && selectedStatus !== 'all') {
          filteredData = filteredData.filter(contact => contact.status === selectedStatus)
        }

        if (selectedSource && selectedSource !== 'all') {
          filteredData = filteredData.filter(contact => contact.source === selectedSource)
        }

        setContacts(filteredData)
        setPagination({
          page: 1,
          limit: 20,
          total: filteredData.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        })

        // Mock status counts
        setStatusCounts([
          { status: 'new', count: 1 },
          { status: 'in_progress', count: 1 },
          { status: 'resolved', count: 1 },
          { status: 'closed', count: 1 },
        ])

        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setError('Network error')
      setLoading(false)
    }
  }

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact)
    setUpdateData({
      status: contact.status,
      assignedTo: contact.assignedTo || '',
      notes: contact.notes || '',
    })
    setIsViewDialogOpen(true)
  }

  const handleUpdateContact = async () => {
    if (!selectedContact) return

    setUpdateLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/contacts/${selectedContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        await fetchContacts()
        setIsViewDialogOpen(false)
        setSelectedContact(null)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update contact')
      }
    } catch (error) {
      console.error('Error updating contact:', error)
      setError('Network error')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteContact = async (contact: Contact) => {
    if (!confirm(`Are you sure you want to delete the contact from ${contact.firstName} ${contact.lastName}?`)) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchContacts()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete contact')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Network error')
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
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

  const formatSource = (source: string) => {
    return source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries and contact form submissions</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusCounts.map((statusCount) => (
          <Card key={statusCount.status}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {formatStatus(statusCount.status)}
                  </p>
                  <p className="text-2xl font-bold">{statusCount.count}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(statusCount.status)}>
                  {formatStatus(statusCount.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="contact_form">Contact Form</SelectItem>
                <SelectItem value="color_inquiry">Color Inquiry</SelectItem>
                <SelectItem value="professional_application">Professional Application</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500 flex items-center">
              Showing {contacts.length} of {pagination.total} contacts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({pagination.total})</CardTitle>
          <CardDescription>
            Customer inquiries and contact form submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </div>
                      )}
                      {contact.company && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {contact.company}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">
                      {contact.subject || 'No subject'}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {contact.message.substring(0, 50)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSourceBadgeVariant(contact.source)}>
                      {formatSource(contact.source)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(contact.status)}>
                      {formatStatus(contact.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contact.assignedTo ? (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {contact.assignedTo}
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
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
                        <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View & Update
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteContact(contact)}
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
          
          {contacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No contacts found
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

      {/* View Contact Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              View and update contact information and status
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{selectedContact.firstName} {selectedContact.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{selectedContact.phone}</p>
                  </div>
                )}
                {selectedContact.company && (
                  <div>
                    <Label className="text-sm font-medium">Company</Label>
                    <p className="text-sm">{selectedContact.company}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Source</Label>
                  <Badge variant={getSourceBadgeVariant(selectedContact.source)}>
                    {formatSource(selectedContact.source)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Subject */}
              {selectedContact.subject && (
                <div>
                  <Label className="text-sm font-medium">Subject</Label>
                  <p className="text-sm mt-1">{selectedContact.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Metadata */}
              {selectedContact.metadata && Object.keys(selectedContact.metadata).length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Additional Information</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <pre className="text-xs">{JSON.stringify(selectedContact.metadata, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Update Form */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-medium mb-4">Update Contact</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={updateData.status}
                      onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      value={updateData.assignedTo}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, assignedTo: e.target.value }))}
                      placeholder="Enter assignee name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Internal Notes</Label>
                    <Textarea
                      id="notes"
                      value={updateData.notes}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add internal notes..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button onClick={handleUpdateContact} disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Contact'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
