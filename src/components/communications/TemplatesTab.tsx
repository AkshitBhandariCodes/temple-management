import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Eye, Copy, Trash2, Plus, Search, Loader2,
  Mail, MessageCircle, Bell, Edit
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const TemplatesTab = forwardRef((props, ref) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [apiTemplates, setApiTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // ✅ NEW: Create template form state
  const [newTemplateForm, setNewTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
    category: '',
    channel: 'email'
  });

  // Clone form state
  const [cloneForm, setCloneForm] = useState({
    name: '',
    subject: '',
    content: '',
    category: '',
    channel: 'email'
  });

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      setShowCreateModal(true);
    }
  }));

  useEffect(() => {
    fetchTemplates();

    const channel = supabase
      .channel('templates-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'message_templates' },
        () => {
          fetchTemplates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ CREATE NEW TEMPLATE
  const handleCreateTemplate = async () => {
    if (!newTemplateForm.name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (!newTemplateForm.content.trim()) {
      toast.error('Please enter template content');
      return;
    }

    try {
      const { error } = await supabase
        .from('message_templates')
        .insert([{
          ...newTemplateForm,
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      toast.success('Template created successfully!');
      setShowCreateModal(false);
      setNewTemplateForm({
        name: '',
        subject: '',
        content: '',
        category: '',
        channel: 'email'
      });
      fetchTemplates();
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast.error(error.message || 'Failed to create template');
    }
  };

  // VIEW: Show full template preview
  const handleView = (template: any) => {
    setSelectedTemplate(template);
    setShowViewModal(true);
  };

  // CLONE: Open customization modal
  const handleClone = (template: any) => {
    setSelectedTemplate(template);
    setCloneForm({
      name: `${template.name} (Copy)`,
      subject: template.subject,
      content: template.content,
      category: template.category,
      channel: template.channel || 'email'
    });
    setShowCloneModal(true);
  };

  // SAVE CLONED TEMPLATE
  const handleSaveClone = async () => {
    if (!cloneForm.name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (!cloneForm.content.trim()) {
      toast.error('Please enter template content');
      return;
    }

    try {
      const { error } = await supabase
        .from('message_templates')
        .insert([{
          ...cloneForm,
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      toast.success('Template cloned successfully!');
      setShowCloneModal(false);
      setCloneForm({
        name: '',
        subject: '',
        content: '',
        category: '',
        channel: 'email'
      });
      fetchTemplates();
    } catch (error: any) {
      console.error('Error cloning template:', error);
      toast.error(error.message || 'Failed to clone template');
    }
  };

  const handleDelete = async (template: any) => {
    if (!confirm(`Delete template "${template.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;
      toast.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const filteredTemplates = apiTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, any> = {
      'email': Mail,
      'sms': MessageCircle,
      'push': Bell
    };
    const Icon = icons[channel] || Mail;
    return <Icon className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-4">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message Templates</h2>
          <p className="text-gray-600 mt-1">Create and manage beautiful email templates for your temple community</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Festivals">Festivals</SelectItem>
                <SelectItem value="Donations">Donations</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">No Templates Found</p>
            <p className="text-sm text-gray-400 mt-2">
              {apiTemplates.length === 0 
                ? "Get started by creating your first template." 
                : "No templates match your search criteria."}
            </p>
            {apiTemplates.length === 0 && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(template.channel)}
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </div>
                <CardTitle className="mt-4">{template.name}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description || template.subject}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Preview:</p>
                    <p className="line-clamp-3">{template.content}</p>
                  </div>

                  <div className="pt-3 border-t flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(template)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleClone(template)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Clone
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(template)}
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

      {/* ✅ CREATE TEMPLATE MODAL */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input
                value={newTemplateForm.name}
                onChange={(e) => setNewTemplateForm({...newTemplateForm, name: e.target.value})}
                placeholder="Enter template name..."
              />
            </div>

            <div>
              <Label>Subject Line</Label>
              <Input
                value={newTemplateForm.subject}
                onChange={(e) => setNewTemplateForm({...newTemplateForm, subject: e.target.value})}
                placeholder="Enter subject line..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select 
                  value={newTemplateForm.category}
                  onValueChange={(value) => setNewTemplateForm({...newTemplateForm, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Festivals">Festivals</SelectItem>
                    <SelectItem value="Donations">Donations</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Channel</Label>
                <Select 
                  value={newTemplateForm.channel}
                  onValueChange={(value) => setNewTemplateForm({...newTemplateForm, channel: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Message Content</Label>
              <Textarea
                value={newTemplateForm.content}
                onChange={(e) => setNewTemplateForm({...newTemplateForm, content: e.target.value})}
                placeholder="Enter your message content..."
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use placeholders like {`{{temple_name}}, {{event_date}}, {{devotee_name}}`} to personalize messages
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateModal(false);
                setNewTemplateForm({
                  name: '',
                  subject: '',
                  content: '',
                  category: '',
                  channel: 'email'
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* VIEW MODAL */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Template Name</label>
                <p className="text-lg font-semibold mt-1">{selectedTemplate.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Subject Line</label>
                <p className="mt-1">{selectedTemplate.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1">{selectedTemplate.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Channel</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getChannelIcon(selectedTemplate.channel)}
                    <span className="capitalize">{selectedTemplate.channel}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Full Message Content</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border min-h-[200px]">
                  <p className="whitespace-pre-wrap">{selectedTemplate.content}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleClone(selectedTemplate);
                  }}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Clone This Template
                </Button>
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CLONE MODAL */}
      <Dialog open={showCloneModal} onOpenChange={setShowCloneModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Template for Your Temple</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input
                value={cloneForm.name}
                onChange={(e) => setCloneForm({...cloneForm, name: e.target.value})}
                placeholder="Enter template name..."
              />
            </div>

            <div>
              <Label>Subject Line</Label>
              <Input
                value={cloneForm.subject}
                onChange={(e) => setCloneForm({...cloneForm, subject: e.target.value})}
                placeholder="Enter subject line..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select 
                  value={cloneForm.category}
                  onValueChange={(value) => setCloneForm({...cloneForm, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Festivals">Festivals</SelectItem>
                    <SelectItem value="Donations">Donations</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Channel</Label>
                <Select 
                  value={cloneForm.channel}
                  onValueChange={(value) => setCloneForm({...cloneForm, channel: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Message Content</Label>
              <Textarea
                value={cloneForm.content}
                onChange={(e) => setCloneForm({...cloneForm, content: e.target.value})}
                placeholder="Customize your message content..."
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use placeholders like {`{{temple_name}}, {{event_date}}, {{devotee_name}}`} to personalize messages
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCloneModal(false);
                setCloneForm({
                  name: '',
                  subject: '',
                  content: '',
                  category: '',
                  channel: 'email'
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveClone} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Save Customized Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

TemplatesTab.displayName = 'TemplatesTab';

export default TemplatesTab;
