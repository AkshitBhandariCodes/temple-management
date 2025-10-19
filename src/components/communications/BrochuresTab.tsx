import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  Copy, 
  Archive, 
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  User
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateBrochureModal from './CreateBrochureModal';

const BrochuresTab: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock data for brochures
  const brochures = [
    {
      id: 1,
      title: 'Diwali Festival Celebration 2024',
      description: 'Join us for the grand Diwali celebration with traditional rituals and community feast',
      category: 'Festivals',
      status: 'published',
      downloads: 1247,
      createdBy: 'Admin User',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-16',
      thumbnail: '/placeholder.svg',
      formats: ['PDF', 'PPTX']
    },
    {
      id: 2,
      title: 'Monthly Volunteer Training Guide',
      description: 'Comprehensive guide for new volunteers covering all temple activities and protocols',
      category: 'General',
      status: 'published',
      downloads: 456,
      createdBy: 'Volunteer Coordinator',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-12',
      thumbnail: '/placeholder.svg',
      formats: ['PDF']
    },
    {
      id: 3,
      title: 'Holi Spring Festival Invitation',
      description: 'Colorful celebration of Holi with traditional music, dance, and community activities',
      category: 'Events',
      status: 'draft',
      downloads: 0,
      createdBy: 'Events Team',
      createdDate: '2024-01-08',
      lastUpdated: '2024-01-09',
      thumbnail: '/placeholder.svg',
      formats: ['PDF', 'PPTX']
    },
    {
      id: 4,
      title: 'Temple Donation Drive 2024',
      description: 'Support our temple expansion project with your generous contributions',
      category: 'General',
      status: 'published',
      downloads: 892,
      createdBy: 'Finance Team',
      createdDate: '2024-01-05',
      lastUpdated: '2024-01-07',
      thumbnail: '/placeholder.svg',
      formats: ['PDF']
    },
    {
      id: 5,
      title: 'Weekly Puja Schedule',
      description: 'Complete schedule of all weekly pujas and special ceremonies',
      category: 'General',
      status: 'archived',
      downloads: 234,
      createdBy: 'Puja Committee',
      createdDate: '2023-12-20',
      lastUpdated: '2023-12-22',
      thumbnail: '/placeholder.svg',
      formats: ['PDF', 'PPTX']
    },
    {
      id: 6,
      title: 'Community Service Projects',
      description: 'Ongoing community service initiatives and volunteer opportunities',
      category: 'Events',
      status: 'published',
      downloads: 678,
      createdBy: 'Community Leader',
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-03',
      thumbnail: '/placeholder.svg',
      formats: ['PDF']
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'published': 'default',
      'draft': 'secondary',
      'archived': 'outline'
    };
    const colors: Record<string, string> = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800'
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const filteredBrochures = brochures.filter(brochure => {
    const matchesSearch = brochure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brochure.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || brochure.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || brochure.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Brochure Management</h2>
          <p className="text-gray-600">Create and manage temple brochures and promotional materials</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Brochure
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search brochures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Festivals">Festivals</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brochure Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrochures.map((brochure) => (
          <Card key={brochure.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={brochure.thumbnail}
                  alt={brochure.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(brochure.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{brochure.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{brochure.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <Badge variant="outline">{brochure.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {brochure.downloads}
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {brochure.createdBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated {brochure.lastUpdated}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {brochure.formats.map((format) => (
                    <Badge key={format} variant="secondary" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                {brochure.status === 'published' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Archive className="h-3 w-3 mr-1" />
                      Archive
                    </Button>
                  </div>
                )}

                {brochure.status === 'draft' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Publish
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBrochures.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brochures found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first brochure to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Brochure
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Brochure Modal */}
      <CreateBrochureModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default BrochuresTab;