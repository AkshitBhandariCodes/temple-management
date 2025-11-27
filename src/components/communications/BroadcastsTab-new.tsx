import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Send, Users, Mail, Smartphone, MessageCircle, Plus,
  Calendar, Eye, Loader2, CheckCircle, XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const BroadcastsTab = forwardRef((props, ref) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Form state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('email');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [scheduledDate, setScheduledDate] = useState('');
  
  // Recipient selection
  const [allRecipients, setAllRecipients] = useState<any[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<any[]>([]);

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      setShowCreateModal(true);
    }
  }));

  useEffect(() => {
    fetchBroadcasts();
    fetchRecipients();

    const channel = supabase
      .channel('broadcasts-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'broadcasts' },
        () => {
          fetchBroadcasts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBroadcasts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBroadcasts(data || []);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      toast.error('Failed to load broadcasts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      // Fetch from your users/members table
      const { data, error } = await supabase
        .from('users') // or 'members' depending on your table name
        .select('id, name, email, phone');

      if (error) throw error;
      setAllRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const handleAudienceChange = (audience: string) => {
    setSelectedAudience(audience);
    
    if (audience === 'all') {
      setSelectedRecipients(allRecipients);
    } else {
      // Filter based on audience type
      setSelectedRecipients(allRecipients); // Customize filtering logic
    }
  };

  const handleSendBroadcast = async () => {
    // Validation
    if (!broadcastTitle.trim()) {
      toast.error('Please enter a broadcast title');
      return;
    }

    if (selectedChannel === 'email' && !broadcastSubject.trim()) {
      toast.error('Please enter an email subject');
      return;
    }

    if (!broadcastContent.trim()) {
      toast.error('Please enter broadcast content');
      return;
    }

    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    setIsSending(true);

    try {
      // 1. Save broadcast to database
      const { data: broadcastData, error: broadcastError } = await supabase
        .from('broadcasts')
        .insert([{
          title: broadcastTitle,
          subject: broadcastSubject,
          content: broadcastContent,
          channel: selectedChannel,
          audience: selectedAudience,
          recipient_count: selectedRecipients.length,
          status: 'sending',
          scheduled_date: scheduledDate || null,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (broadcastError) throw broadcastError;

      // 2. Send via backend API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/send-broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: selectedChannel,
          recipients: selectedRecipients.map(r => ({
            name: r.name,
            email: r.email,
            phone: r.phone,
          })),
          subject: broadcastSubject,
          content: broadcastContent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send broadcast');
      }

      // 3. Log messages to message_logs
      for (const recipient of selectedRecipients) {
        await supabase.from('message_logs').insert({
          broadcast_id: broadcastData.id,
          subject: selectedChannel === 'email' ? broadcastSubject : null,
          content: broadcastContent,
          channel: selectedChannel,
          recipient_name: recipient.name,
          recipient_email: recipient.email,
          recipient_phone: recipient.phone,
          delivery_status: 'sent',
          delivery_timestamp: new Date().toISOString(),
        });
      }

      // 4. Update broadcast status
      await supabase
        .from('broadcasts')
        .update({
          status: 'completed',
          sent_count: result.successful,
          failed_count: result.failed,
          sent_at: new Date().toISOString(),
        })
        .eq('id', broadcastData.id);

      toast.success(
        `Broadcast sent! ${result.successful} successful, ${result.failed} failed`
      );

      // Reset form
      setBroadcastTitle('');
      setBroadcastSubject('');
      setBroadcastContent('');
      setSelectedChannel('email');
      setSelectedAudience('all');
      setScheduledDate('');
      setSelectedRecipients([]);
      
      setShowCreateModal(false);
      fetchBroadcasts();

    } catch (error: any) {
      console.error('Error sending broadcast:', error);
      toast.error(error.message || 'Failed to send broadcast');
    } finally {
      setIsSending(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, any> = {
      'email': Mail,
      'sms': Smartphone,
      'whatsapp': MessageCircle,
    };
    const Icon = icons[channel] || Mail;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800',
      'sending': 'bg-blue-100 text-blue-800',
      'scheduled': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-4">Loading broadcasts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Broadcast Messages</h2>
          <p className="text-gray-600 mt-1">Send messages to multiple recipients at once</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Broadcast List */}
      <div className="space-y-4">
        {broadcasts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Send className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium">No broadcasts yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first broadcast to get started</p>
            </CardContent>
          </Card>
        ) : (
          broadcasts.map((broadcast) => (
            <Card key={broadcast.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getChannelIcon(broadcast.channel)}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{broadcast.title}</h3>
                      {broadcast.subject && (
                        <p className="text-sm text-gray-600 mt-1">{broadcast.subject}</p>
                      )}
                      <p className="text-gray-600 mt-2 line-clamp-2">{broadcast.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(broadcast.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {broadcast.recipient_count || 0} recipients
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {broadcast.sent_count || 0} sent
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    {broadcast.failed_count || 0} failed
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(broadcast.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Broadcast Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Broadcast</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label>Broadcast Title</Label>
                <Input
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="Enter broadcast title..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Channel</Label>
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Audience</Label>
                  <Select value={selectedAudience} onValueChange={handleAudienceChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="members">Members Only</SelectItem>
                      <SelectItem value="donors">Donors</SelectItem>
                      <SelectItem value="volunteers">Volunteers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedChannel === 'email' && (
                <div>
                  <Label>Email Subject</Label>
                  <Input
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    placeholder="Enter email subject..."
                  />
                </div>
              )}

              <div>
                <Label>Message Content</Label>
                <Textarea
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  placeholder="Enter your message..."
                  rows={8}
                />
              </div>

              <div>
                <Label>Recipients: {selectedRecipients.length}</Label>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRecipients.length} users will receive this broadcast
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendBroadcast}
              disabled={isSending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Broadcast
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

BroadcastsTab.displayName = 'BroadcastsTab';

export default BroadcastsTab;
