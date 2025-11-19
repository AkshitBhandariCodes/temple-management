import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Eye, Copy, Trash2, Download, Filter, Search, Loader2, Plus
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CreateBrochureModal from './CreateBrochureModal';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const BrochuresTab = forwardRef((props, ref) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBrochure, setSelectedBrochure] = useState<any>(null);
  const [brochures, setBrochures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      setShowCreateModal(true);
    }
  }));

  useEffect(() => {
    fetchBrochures();

    const channel = supabase
      .channel('brochures-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'brochures' },
        () => {
          fetchBrochures();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBrochures = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('brochures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrochures(data || []);
    } catch (error) {
      console.error('Error fetching brochures:', error);
      toast.error('Failed to load brochures');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ View brochure handler
  const handleView = (brochure: any) => {
    setSelectedBrochure(brochure);
    setShowViewModal(true);
  };

  // ✅ Clone brochure handler
  const handleClone = async (brochure: any) => {
    try {
      const clonedBrochure = {
        title: `${brochure.title} (Copy)`,
        description: brochure.description,
        category: brochure.category,
        content: brochure.content,
        status: 'draft',
        downloads: 0,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('brochures')
        .insert([clonedBrochure]);

      if (error) throw error;
      toast.success('Brochure cloned successfully');
      fetchBrochures();
    } catch (error) {
      console.error('Error cloning brochure:', error);
      toast.error('Failed to clone brochure');
    }
  };

  // ✅ Delete brochure handler
  const handleDelete = async (brochure: any) => {
    if (!confirm(`Delete "${brochure.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('brochures')
        .delete()
        .eq('id', brochure.id);

      if (error) throw error;
      toast.success('Brochure deleted successfully');
      fetchBrochures();
    } catch (error) {
      console.error('Error deleting brochure:', error);
      toast.error('Failed to delete brochure');
    }
  };

  const filteredBrochures = brochures.filter(brochure => {
    const matchesSearch = brochure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brochure.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || brochure.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || brochure.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-4">Loading brochures...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Brochures</h2>
          <p className="text-gray-600 mt-1">Create and manage temple brochures and promotional materials</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          New Brochure
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search brochures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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
              <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* Brochures Grid */}
      {filteredBrochures.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">No brochures found</p>
            <p className="text-sm text-gray-400 mt-2">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first brochure to get started'}
            </p>
            {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Brochure
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrochures.map((brochure) => (
            <Card key={brochure.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-10 w-10 text-orange-500" />
                  <Badge className={getStatusColor(brochure.status)}>
                    {brochure.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{brochure.title}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {brochure.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category</span>
                    <Badge variant="outline">{brochure.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Downloads</span>
                    <span className="font-medium">{brochure.downloads || 0}</span>
                  </div>

                  <div className="pt-3 border-t flex gap-2">
                    {/* ✅ Working buttons */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(brochure)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleClone(brochure)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Clone
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(brochure)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>View Brochure</DialogTitle>
          </DialogHeader>
          {selectedBrochure && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <p className="text-lg font-semibold">{selectedBrochure.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-gray-600">{selectedBrochure.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p>{selectedBrochure.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedBrochure.status)}>
                    {selectedBrochure.status}
                  </Badge>
                </div>
              </div>
              {selectedBrochure.content && (
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                    <p className="whitespace-pre-wrap">{selectedBrochure.content}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateBrochureModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={fetchBrochures}
      />
    </div>
  );
});

BrochuresTab.displayName = 'BrochuresTab';

export default BrochuresTab;
