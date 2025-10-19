import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Filter,
  Mail,
  Smartphone,
  Bell,
  MessageCircle,
  Eye,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  MousePointer,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '../ui/label';

const MessageHistoryTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // Mock data for message history
  const messageHistory = [
    {
      id: 1,
      subject: 'Welcome to Our Temple Community!',
      content: 'Dear John Doe, Welcome to our temple community! We are delighted to have you join us...',
      channel: 'email',
      messageType: 'individual',
      template: 'Welcome New Member',
      recipient: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        segment: 'New Members'
      },
      deliveryStatus: 'delivered',
      deliveryTimestamp: '2024-01-15 10:30 AM',
      engagement: {
        opened: true,
        openedAt: '2024-01-15 11:45 AM',
        clicked: true,
        clickedAt: '2024-01-15 12:15 PM',
        responded: false
      },
      campaign: {
        name: 'New Member Welcome Series',
        id: 'NMW-001'
      },
      sender: 'Admin User',
      priority: 'medium'
    },
    {
      id: 2,
      subject: null,
      content: 'Hi Sarah! Reminder: Diwali Celebration tomorrow at 6:00 PM. See you there!',
      channel: 'sms',
      messageType: 'broadcast',
      template: 'Event Reminder',
      recipient: {
        name: 'Sarah Johnson',
        phone: '+1-555-0123',
        segment: 'Event Attendees'
      },
      deliveryStatus: 'delivered',
      deliveryTimestamp: '2024-01-14 09:00 AM',
      engagement: {
        opened: true,
        openedAt: '2024-01-14 09:05 AM',
        clicked: false,
        responded: true,
        responseAt: '2024-01-14 09:30 AM'
      },
      campaign: {
        name: 'Diwali Event Reminders',
        id: 'DER-002'
      },
      sender: 'Events Team',
      priority: 'high'
    },
    {
      id: 3,
      subject: 'Puja Starting Soon',
      content: 'Evening Aarti will begin in 15 minutes at the main hall.',
      channel: 'push',
      messageType: 'broadcast',
      template: 'Puja Alert',
      recipient: {
        name: 'All Users',
        segment: 'All Users'
      },
      deliveryStatus: 'delivered',
      deliveryTimestamp: '2024-01-13 06:45 PM',
      engagement: {
        opened: true,
        openedAt: '2024-01-13 06:46 PM',
        clicked: false,
        responded: false
      },
      campaign: {
        name: 'Daily Puja Notifications',
        id: 'DPN-003'
      },
      sender: 'Puja Committee',
      priority: 'medium'
    },
    {
      id: 4,
      subject: 'Thank You for Your Generous Donation',
      content: 'Dear Michael Smith, Thank you for your generous donation of $500. Your support helps us...',
      channel: 'email',
      messageType: 'individual',
      template: 'Donation Receipt',
      recipient: {
        name: 'Michael Smith',
        email: 'michael.smith@email.com',
        segment: 'Donors'
      },
      deliveryStatus: 'delivered',
      deliveryTimestamp: '2024-01-12 02:15 PM',
      engagement: {
        opened: true,
        openedAt: '2024-01-12 03:20 PM',
        clicked: true,
        clickedAt: '2024-01-12 03:25 PM',
        responded: false
      },
      campaign: {
        name: 'Donation Acknowledgments',
        id: 'DA-004'
      },
      sender: 'Finance Team',
      priority: 'medium'
    },
    {
      id: 5,
      subject: null,
      content: 'Thank you Lisa for your $100 donation. Receipt: RCP-2024-001',
      channel: 'sms',
      messageType: 'individual',
      template: 'Donation Confirmation',
      recipient: {
        name: 'Lisa Brown',
        phone: '+1-555-0456',
        segment: 'Donors'
      },
      deliveryStatus: 'failed',
      deliveryTimestamp: '2024-01-11 11:30 AM',
      failureReason: 'Invalid phone number',
      engagement: {
        opened: false,
        clicked: false,
        responded: false
      },
      campaign: {
        name: 'Donation Confirmations',
        id: 'DC-005'
      },
      sender: 'Finance Team',
      priority: 'low'
    },
    {
      id: 6,
      subject: 'Your Volunteer Assignment - January 20, 2024',
      content: 'Dear David Wilson, You have been assigned to Temple Cleaning on January 20, 2024...',
      channel: 'email',
      messageType: 'individual',
      template: 'Volunteer Assignment',
      recipient: {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        segment: 'Volunteers'
      },
      deliveryStatus: 'delivered',
      deliveryTimestamp: '2024-01-10 08:00 AM',
      engagement: {
        opened: true,
        openedAt: '2024-01-10 08:30 AM',
        clicked: false,
        responded: true,
        responseAt: '2024-01-10 09:15 AM'
      },
      campaign: {
        name: 'Weekly Volunteer Assignments',
        id: 'WVA-006'
      },
      sender: 'Volunteer Coordinator',
      priority: 'medium'
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const filteredMessages = messageHistory.filter(message => {
    const matchesSearch = 
      (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChannel = channelFilter === 'all' || message.channel === channelFilter;
    const matchesStatus = statusFilter === 'all' || message.deliveryStatus === statusFilter;
    
    return matchesSearch && matchesChannel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Message History</h2>
        <p className="text-gray-600">View and analyze all sent messages and their performance</p>
      </div>

      {/* Search & Filter Panel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by content, recipient, or sender..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Message Archive ({filteredMessages.length} messages)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Message Details</th>
                  <th className="text-left p-3">Recipient Information</th>
                  <th className="text-left p-3">Engagement Data</th>
                  <th className="text-left p-3">Campaign Association</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(message.channel)}
                          <Badge variant="outline">{message.messageType}</Badge>
                        </div>
                        {message.subject && (
                          <div className="font-medium text-blue-600 cursor-pointer hover:underline">
                            {message.subject}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {message.content}
                        </div>
                        {message.template && (
                          <div className="text-xs text-gray-500">
                            Template: {message.template}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="font-medium">{message.recipient.name}</div>
                        <div className="text-sm text-gray-600">
                          {message.recipient.email || message.recipient.phone || 'Push notification'}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {message.recipient.segment}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          {getStatusIcon(message.deliveryStatus)}
                          {getStatusBadge(message.deliveryStatus)}
                        </div>
                        <div className="text-xs text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {message.deliveryTimestamp}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="h-3 w-3" />
                          <span className={message.engagement.opened ? 'text-green-600' : 'text-gray-400'}>
                            {message.engagement.opened ? 'Opened' : 'Not opened'}
                          </span>
                        </div>
                        {message.engagement.opened && message.engagement.openedAt && (
                          <div className="text-xs text-gray-500 ml-5">
                            {message.engagement.openedAt}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <MousePointer className="h-3 w-3" />
                          <span className={message.engagement.clicked ? 'text-green-600' : 'text-gray-400'}>
                            {message.engagement.clicked ? 'Clicked' : 'Not clicked'}
                          </span>
                        </div>
                        {message.engagement.clicked && message.engagement.clickedAt && (
                          <div className="text-xs text-gray-500 ml-5">
                            {message.engagement.clickedAt}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="h-3 w-3" />
                          <span className={message.engagement.responded ? 'text-green-600' : 'text-gray-400'}>
                            {message.engagement.responded ? 'Responded' : 'No response'}
                          </span>
                        </div>
                        {message.engagement.responded && message.engagement.responseAt && (
                          <div className="text-xs text-gray-500 ml-5">
                            {message.engagement.responseAt}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="font-medium text-blue-600 cursor-pointer hover:underline">
                          {message.campaign.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {message.campaign.id}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          {message.sender}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {message.priority} priority
                        </Badge>
                      </div>
                    </td>
                    
                    <td className="p-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Message Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Message Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(selectedMessage.channel)}
                    <Badge variant="outline">{selectedMessage.channel}</Badge>
                    <Badge variant="outline">{selectedMessage.messageType}</Badge>
                  </div>
                  
                  {selectedMessage.subject && (
                    <div>
                      <Label>Subject</Label>
                      <div className="p-2 bg-gray-50 rounded">{selectedMessage.subject}</div>
                    </div>
                  )}
                  
                  <div>
                    <Label>Content</Label>
                    <div className="p-3 bg-gray-50 rounded whitespace-pre-wrap">
                      {selectedMessage.content}
                    </div>
                  </div>
                  
                  {selectedMessage.template && (
                    <div>
                      <Label>Template Used</Label>
                      <div className="p-2 bg-gray-50 rounded">{selectedMessage.template}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Recipient</Label>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">{selectedMessage.recipient.name}</div>
                        <div className="text-sm text-gray-600">
                          {selectedMessage.recipient.email || selectedMessage.recipient.phone || 'Push notification'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Delivery Status</Label>
                      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
                        {getStatusIcon(selectedMessage.deliveryStatus)}
                        {getStatusBadge(selectedMessage.deliveryStatus)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Delivery Timestamp</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedMessage.deliveryTimestamp}</div>
                  </div>
                  
                  {selectedMessage.failureReason && (
                    <div>
                      <Label>Failure Reason</Label>
                      <div className="p-2 bg-red-50 rounded text-red-800">
                        {selectedMessage.failureReason}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Engagement Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">Opened</span>
                      </div>
                      <div className={selectedMessage.engagement.opened ? 'text-green-600' : 'text-gray-400'}>
                        {selectedMessage.engagement.opened ? 'Yes' : 'No'}
                      </div>
                      {selectedMessage.engagement.openedAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedMessage.engagement.openedAt}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <MousePointer className="h-4 w-4" />
                        <span className="font-medium">Clicked</span>
                      </div>
                      <div className={selectedMessage.engagement.clicked ? 'text-green-600' : 'text-gray-400'}>
                        {selectedMessage.engagement.clicked ? 'Yes' : 'No'}
                      </div>
                      {selectedMessage.engagement.clickedAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedMessage.engagement.clickedAt}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Responded</span>
                      </div>
                      <div className={selectedMessage.engagement.responded ? 'text-green-600' : 'text-gray-400'}>
                        {selectedMessage.engagement.responded ? 'Yes' : 'No'}
                      </div>
                      {selectedMessage.engagement.responseAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedMessage.engagement.responseAt}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MessageHistoryTab;