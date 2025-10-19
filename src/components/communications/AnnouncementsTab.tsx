import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Megaphone, 
  Pin, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Calendar,
  Users,
  Bell,
  Mail,
  Smartphone,
  MessageCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AnnouncementsTab: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Temple Closure for Maintenance',
      content: 'The temple will be closed for routine maintenance from January 20-22, 2024. All scheduled pujas will be rescheduled.',
      category: 'Important',
      priority: 'high',
      audience: 'All Users',
      visibility: 'Public',
      isPinned: true,
      publishDate: '2024-01-15',
      expiryDate: '2024-01-25',
      status: 'active',
      views: 1247,
      createdBy: 'Admin User'
    },
    {
      id: 2,
      title: 'New Volunteer Training Session',
      content: 'Join us for a comprehensive volunteer training session covering all temple activities and protocols.',
      category: 'Events',
      priority: 'medium',
      audience: 'Volunteers',
      visibility: 'Community',
      isPinned: false,
      publishDate: '2024-01-10',
      expiryDate: '2024-02-10',
      status: 'active',
      views: 456,
      createdBy: 'Volunteer Coordinator'
    },
    {
      id: 3,
      title: 'Festival Celebration Updates',
      content: 'Updated schedule and guidelines for the upcoming Diwali celebration. Please review the new timings.',
      category: 'Festivals',
      priority: 'medium',
      audience: 'Community Members',
      visibility: 'Community',
      isPinned: true,
      publishDate: '2024-01-08',
      expiryDate: '2024-11-15',
      status: 'active',
      views: 892,
      createdBy: 'Events Team'
    },
    {
      id: 4,
      title: 'Donation Drive Success',
      content: 'Thank you to everyone who contributed to our recent donation drive. We exceeded our goal by 150%!',
      category: 'General',
      priority: 'low',
      audience: 'Donors',
      visibility: 'Private',
      isPinned: false,
      publishDate: '2024-01-05',
      expiryDate: '2024-01-20',
      status: 'expired',
      views: 234,
      createdBy: 'Finance Team'
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium',
    audience: '',
    visibility: 'Public',
    isPinned: false,
    expiryDate: '',
    notifications: {
      push: false,
      email: false,
      sms: false,
      whatsapp: false
    }
  });

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

  const handleCreateAnnouncement = () => {
    const announcement = {
      id: announcements.length + 1,
      ...newAnnouncement,
      publishDate: new Date().toISOString().split('T')[0],
      status: 'active',
      views: 0,
      createdBy: 'Current User'
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      content: '',
      category: '',
      priority: 'medium',
      audience: '',
      visibility: 'Public',
      isPinned: false,
      expiryDate: '',
      notifications: {
        push: false,
        email: false,
        sms: false,
        whatsapp: false
      }
    });
    setShowCreateModal(false);
  };

  const togglePin = (id: number) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, isPinned: !ann.isPinned } : ann
    ));
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Announcements Management</h2>
          <p className="text-gray-600">Create and manage temple announcements and notices</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Active Announcements */}
      <div className="space-y-4">
        {announcements
          .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
          .map((announcement) => (
          <Card key={announcement.id} className={`${announcement.isPinned ? 'ring-2 ring-blue-200 bg-blue-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {announcement.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    {getPriorityBadge(announcement.priority)}
                    {getStatusBadge(announcement.status)}
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">{announcement.content}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {announcement.audience}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Published {announcement.publishDate}
                    </div>
                    {announcement.expiryDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Expires {announcement.expiryDate}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {announcement.views} views
                    </div>
                    <Badge variant="outline">{announcement.category}</Badge>
                    <Badge variant="outline">{announcement.visibility}</Badge>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePin(announcement.id)}
                  >
                    <Pin className={`h-4 w-4 ${announcement.isPinned ? 'text-blue-600' : ''}`} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteAnnouncement(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Announcement Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  placeholder="Enter announcement title..."
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  placeholder="Enter announcement content..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Audience & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle>Audience & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem value="Community">Community Only</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pinned" 
                    checked={newAnnouncement.isPinned}
                    onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, isPinned: checked as boolean})}
                  />
                  <Label htmlFor="pinned" className="flex items-center gap-2">
                    <Pin className="h-4 w-4" />
                    Pin to top
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Scheduling & Expiry */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduling & Expiry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={newAnnouncement.expiryDate}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, expiryDate: e.target.value})}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty for no expiry
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="push-notification" 
                      checked={newAnnouncement.notifications.push}
                      onCheckedChange={(checked) => setNewAnnouncement({
                        ...newAnnouncement, 
                        notifications: {...newAnnouncement.notifications, push: checked as boolean}
                      })}
                    />
                    <Label htmlFor="push-notification" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Send push notification
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-notification" 
                      checked={newAnnouncement.notifications.email}
                      onCheckedChange={(checked) => setNewAnnouncement({
                        ...newAnnouncement, 
                        notifications: {...newAnnouncement.notifications, email: checked as boolean}
                      })}
                    />
                    <Label htmlFor="email-notification" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Send email notification
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sms-notification" 
                      checked={newAnnouncement.notifications.sms}
                      onCheckedChange={(checked) => setNewAnnouncement({
                        ...newAnnouncement, 
                        notifications: {...newAnnouncement.notifications, sms: checked as boolean}
                      })}
                    />
                    <Label htmlFor="sms-notification" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Send SMS notification
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="whatsapp-notification" 
                      checked={newAnnouncement.notifications.whatsapp}
                      onCheckedChange={(checked) => setNewAnnouncement({
                        ...newAnnouncement, 
                        notifications: {...newAnnouncement.notifications, whatsapp: checked as boolean}
                      })}
                    />
                    <Label htmlFor="whatsapp-notification" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Send WhatsApp broadcast
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                Save as Draft
              </Button>
              <Button onClick={handleCreateAnnouncement}>
                Publish Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsTab;