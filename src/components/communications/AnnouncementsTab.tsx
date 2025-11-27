import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Megaphone, Pin, Eye, Edit, Trash2, Plus, Calendar, Users,
  Bell, Mail, Smartphone, MessageCircle, Clock, AlertCircle, Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AnnouncementsTab = forwardRef((props, ref) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium',
    audience: '',
    visibility: 'Public',
    is_pinned: false,
    expiry_date: '',
    notifications: {
      push: false,
      email: false,
      sms: false,
      whatsapp: false
    }
  });

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      setShowCreateModal(true);
    }
  }));

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setAnnouncements(data);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    
    const channel = supabase
      .channel('announcements-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return (
      <Badge className={colors[priority] || 'bg-gray-100 text-gray-800'}>
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'expired': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800'
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setIsEditMode(true);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      audience: announcement.audience,
      visibility: announcement.visibility,
      is_pinned: announcement.is_pinned,
      expiry_date: announcement.expiry_date || '',
      notifications: announcement.notifications || {
        push: false,
        email: false,
        sms: false,
        whatsapp: false
      }
    });
    setShowCreateModal(true);
  };

  // ✅ NEW: Function to send notifications via backend
  const sendNotifications = async (announcementData: any) => {
    const { notifications, title, content, audience } = announcementData;
    
    // Fetch recipients based on audience
    let recipientsQuery = supabase.from('users').select('id, name, email, phone');
    
    if (audience === 'Community Members') {
      recipientsQuery = recipientsQuery.eq('role', 'member');
    } else if (audience === 'Volunteers') {
      recipientsQuery = recipientsQuery.eq('role', 'volunteer');
    } else if (audience === 'Donors') {
      recipientsQuery = recipientsQuery.eq('is_donor', true);
    }
    
    const { data: recipients, error } = await recipientsQuery;
    
    if (error || !recipients || recipients.length === 0) {
      console.error('No recipients found');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      // Send Email Notifications
      if (notifications.email) {
        await fetch(`${API_URL}/send-broadcast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: 'email',
            recipients: recipients.map(r => ({ name: r.name, email: r.email })),
            subject: `📢 ${title}`,
            content: content,
          }),
        });
      }

      // Send SMS Notifications
      if (notifications.sms) {
        await fetch(`${API_URL}/send-broadcast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: 'sms',
            recipients: recipients.map(r => ({ name: r.name, phone: r.phone })),
            content: `${title}\n\n${content}`,
          }),
        });
      }

      // Send Push Notifications
      if (notifications.push) {
        // Use browser push notification API or your push service
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body: content,
            icon: '/temple-icon.png',
          });
        }
        
        // Also send via backend to all registered devices
        await fetch(`${API_URL}/send-push-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipients: recipients.map(r => r.id),
            title: title,
            body: content,
          }),
        });
      }

      // Send WhatsApp Notifications (if you have Twilio WhatsApp setup)
      if (notifications.whatsapp) {
        await fetch(`${API_URL}/send-whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipients: recipients.map(r => ({ name: r.name, phone: r.phone })),
            message: `*${title}*\n\n${content}`,
          }),
        });
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!newAnnouncement.content.trim()) {
      toast.error('Please enter content');
      return;
    }

    setIsSending(true);

    try {
      if (isEditMode && editingAnnouncement) {
        // UPDATE existing announcement
        const { error } = await supabase
          .from('announcements')
          .update({
            ...newAnnouncement,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAnnouncement.id);

        if (error) throw error;
        toast.success('Announcement updated successfully');
        
        // Send notifications if enabled
        if (Object.values(newAnnouncement.notifications).some(v => v)) {
          await sendNotifications(newAnnouncement);
        }
      } else {
        // CREATE new announcement
        const announcement = {
          ...newAnnouncement,
          publish_date: new Date().toISOString().split('T')[0],
          status: 'active',
          views: 0,
          created_by: 'Current User'
        };

        const { data, error } = await supabase
          .from('announcements')
          .insert([announcement])
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Announcement created successfully');
        
        // ✅ Send notifications if any are enabled
        if (Object.values(newAnnouncement.notifications).some(v => v)) {
          toast.info('Sending notifications...');
          await sendNotifications(newAnnouncement);
          toast.success('Notifications sent!');
        }
      }

      // Reset form
      setNewAnnouncement({
        title: '',
        content: '',
        category: '',
        priority: 'medium',
        audience: '',
        visibility: 'Public',
        is_pinned: false,
        expiry_date: '',
        notifications: { push: false, email: false, sms: false, whatsapp: false }
      });
      
      setShowCreateModal(false);
      setIsEditMode(false);
      setEditingAnnouncement(null);
      fetchAnnouncements();

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSending(false);
    }
  };

  const togglePin = async (id: string, currentPinned: boolean) => {
    await supabase
      .from('announcements')
      .update({ is_pinned: !currentPinned })
      .eq('id', id);
    fetchAnnouncements();
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    
    await supabase.from('announcements').delete().eq('id', id);
    toast.success('Announcement deleted');
    fetchAnnouncements();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcements Management</h2>
          <p className="text-gray-600 mt-1">Create and manage temple announcements and notices</p>
        </div>
        <Button 
          onClick={() => {
            setIsEditMode(false);
            setEditingAnnouncement(null);
            setShowCreateModal(true);
          }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Active Announcements */}
      <div className="space-y-4">
        {announcements
          .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
          .map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {announcement.is_pinned && <Pin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                      <div className="flex gap-2 mb-3">
                        {getPriorityBadge(announcement.priority)}
                        {getStatusBadge(announcement.status)}
                      </div>
                      <p className="text-gray-600 mb-4">{announcement.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => togglePin(announcement.id, announcement.is_pinned)}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {announcement.audience}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Published {announcement.publish_date}
                  </div>
                  {announcement.expiry_date && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Expires {announcement.expiry_date}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {announcement.views} views
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{announcement.category}</Badge>
                    <Badge variant="outline">{announcement.visibility}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Create/Edit Announcement Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Announcement' : 'Create New Announcement'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    placeholder="Enter announcement title..."
                  />
                </div>

                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    placeholder="Enter announcement content..."
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select 
                      value={newAnnouncement.category}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Important">Important</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Festivals">Festivals</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Priority Level</Label>
                    <Select 
                      value={newAnnouncement.priority}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audience & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audience & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Audience</Label>
                    <Select 
                      value={newAnnouncement.audience}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, audience: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Users">All Users</SelectItem>
                        <SelectItem value="Community Members">Community Members</SelectItem>
                        <SelectItem value="Volunteers">Volunteers</SelectItem>
                        <SelectItem value="Donors">Donors</SelectItem>
                        <SelectItem value="Event Attendees">Event Attendees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Visibility</Label>
                    <Select 
                      value={newAnnouncement.visibility}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, visibility: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Community Only">Community Only</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={newAnnouncement.is_pinned}
                    onCheckedChange={(checked) => 
                      setNewAnnouncement({...newAnnouncement, is_pinned: checked as boolean})
                    }
                  />
                  <Label>Pin to top</Label>
                </div>
              </CardContent>
            </Card>

            {/* Scheduling & Expiry */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scheduling & Expiry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={newAnnouncement.expiry_date}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, expiry_date: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no expiry</p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={newAnnouncement.notifications.push}
                    onCheckedChange={(checked) => 
                      setNewAnnouncement({
                        ...newAnnouncement,
                        notifications: {...newAnnouncement.notifications, push: checked as boolean}
                      })
                    }
                  />
                  <Bell className="h-4 w-4" />
                  <Label>Send push notification</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={newAnnouncement.notifications.email}
                    onCheckedChange={(checked) => 
                      setNewAnnouncement({
                        ...newAnnouncement,
                        notifications: {...newAnnouncement.notifications, email: checked as boolean}
                      })
                    }
                  />
                  <Mail className="h-4 w-4" />
                  <Label>Send email notification</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={newAnnouncement.notifications.sms}
                    onCheckedChange={(checked) => 
                      setNewAnnouncement({
                        ...newAnnouncement,
                        notifications: {...newAnnouncement.notifications, sms: checked as boolean}
                      })
                    }
                  />
                  <Smartphone className="h-4 w-4" />
                  <Label>Send SMS notification</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={newAnnouncement.notifications.whatsapp}
                    onCheckedChange={(checked) => 
                      setNewAnnouncement({
                        ...newAnnouncement,
                        notifications: {...newAnnouncement.notifications, whatsapp: checked as boolean}
                      })
                    }
                  />
                  <MessageCircle className="h-4 w-4" />
                  <Label>Send WhatsApp broadcast</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateModal(false);
                setIsEditMode(false);
                setEditingAnnouncement(null);
              }}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAnnouncement}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  {isEditMode ? 'Update Announcement' : 'Publish Announcement'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

AnnouncementsTab.displayName = 'AnnouncementsTab';

export default AnnouncementsTab;
