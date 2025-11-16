import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Mail, Smartphone, MessageCircle, Bell, Search, Filter,
  Calendar, CheckCircle, XCircle, Clock, Eye, Download,
  TrendingUp, Users, Send, Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const MessageHistoryTab = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    failed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchMessageLogs();

    // ✅ Real-time subscription
    const channel = supabase
      .channel('message-logs-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'message_logs' },
        () => {
          fetchMessageLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessageLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('message_logs')
        .select('*')
        .order('delivery_timestamp', { ascending: false });

      if (error) throw error;

      setMessages(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const delivered = data?.filter(m => m.delivery_status === 'delivered' || m.delivery_status === 'sent').length || 0;
      const failed = data?.filter(m => m.delivery_status === 'failed').length || 0;
      const pending = data?.filter(m => m.delivery_status === 'pending').length || 0;

      setStats({ total, delivered, failed, pending });

    } catch (error) {
      console.error('Error fetching message logs:', error);
      toast.error('Failed to load message history');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.delivery_status === statusFilter;
    const matchesChannel = channelFilter === 'all' || message.channel === channelFilter;
    
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, any> = {
      'email': Mail,
      'sms': Smartphone,
      'whatsapp': MessageCircle,
      'push': Bell
    };
    const Icon = icons[channel] || Mail;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'delivered': CheckCircle,
      'sent': CheckCircle,
      'failed': XCircle,
      'pending': Clock
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-800',
      'sent': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const handleViewDetails = (message: any) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Timestamp', 'Channel', 'Recipient', 'Subject', 'Status'],
      ...filteredMessages.map(m => [
        new Date(m.delivery_timestamp).toLocaleString(),
        m.channel,
        m.recipient_email || m.recipient_phone || m.recipient_name,
        m.subject || 'N/A',
        m.delivery_status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `message-history-${new Date().toISOString()}.csv`;
    a.click();
    toast.success('Exported to CSV');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-4">Loading message history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message History</h2>
          <p className="text-gray-600 mt-1">View and analyze all sent messages and their performance</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-3xl font-bold mt-2">{stats.total.toLocaleString()}</p>
              </div>
              <Send className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-3xl font-bold mt-2 text-green-600">{stats.delivered.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{stats.failed.toLocaleString()}</p>
              </div>
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold mt-2 text-blue-600">
                  {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
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
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Message History Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No messages found</p>
              <p className="text-sm text-gray-400 mt-2">
                {messages.length === 0 
                  ? 'Messages will appear here once broadcasts are sent' 
                  : 'Try adjusting your filters'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Message Details</th>
                    <th className="text-left p-4 font-semibold">Recipient</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Timestamp</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message) => (
                    <tr key={message.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          {getChannelIcon(message.channel)}
                          <div>
                            {message.subject && (
                              <p className="font-medium">{message.subject}</p>
                            )}
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {message.content}
                            </p>
                            {message.template_used && (
                              <p className="text-xs text-gray-500 mt-1">
                                Template: {message.template_used}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">
                          {message.recipient_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {message.recipient_email || message.recipient_phone || 'N/A'}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(message.delivery_status)}
                          {getStatusBadge(message.delivery_status)}
                        </div>
                        {message.error_message && (
                          <p className="text-xs text-red-600 mt-1">{message.error_message}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{new Date(message.delivery_timestamp).toLocaleDateString()}</p>
                          <p className="text-gray-600">
                            {new Date(message.delivery_timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(message)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Channel</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getChannelIcon(selectedMessage.channel)}
                    <span className="capitalize">{selectedMessage.channel}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedMessage.delivery_status)}
                  </div>
                </div>
              </div>

              {selectedMessage.subject && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Content</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg border">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Recipient</label>
                <div className="mt-1">
                  <p className="font-medium">{selectedMessage.recipient_name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedMessage.recipient_email || selectedMessage.recipient_phone}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Delivery Time</label>
                <p className="mt-1">
                  {new Date(selectedMessage.delivery_timestamp).toLocaleString()}
                </p>
              </div>

              {selectedMessage.error_message && (
                <div>
                  <label className="text-sm font-medium text-red-700">Error Message</label>
                  <p className="mt-1 text-red-600">{selectedMessage.error_message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageHistoryTab;
