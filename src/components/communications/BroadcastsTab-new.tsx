import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play, Pause, Square, Eye, Copy, BarChart3, Mail, Smartphone, Bell, 
  MessageCircle, Users, Send, Calendar, Filter, Loader2, Plus, Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateBroadcastModal from './CreateBroadcastModal';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const BroadcastsTab = forwardRef((props, ref) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<any>(null);
  const [broadcastsData, setBroadcastsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      setShowCreateModal(true);
    }
  }));

  // Fetch broadcasts from database
  const fetchBroadcasts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        setError(error);
        toast.error('Failed to load broadcasts');
        console.error('Supabase error:', error);
      } else {
        setBroadcastsData({ data });
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching broadcasts:', err);
      setError(err);
      toast.error('Failed to load broadcasts');
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time subscription
  useEffect(() => {
    fetchBroadcasts();

    const channel = supabase
      .channel('broadcasts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'broadcasts' }, 
        () => {
          console.log('Broadcast changed, refetching...');
          fetchBroadcasts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeBroadcasts = broadcastsData?.data?.filter(b =>
    b.status === 'sending' || b.status === 'scheduled'
  ) || [];

  const completedBroadcasts = broadcastsData?.data?.filter(b =>
    b.status === 'sent' || b.status === 'completed' || b.status === 'paused' || b.status === 'draft'
  ) || [];

  // Action Handlers
  const handlePause = async (broadcast: any) => {
    try {
      const { error } = await supabase
        .from('broadcasts')
        .update({ status: 'paused' })
        .eq('id', broadcast.id);

      if (error) throw error;
      toast.success('Broadcast paused successfully');
      fetchBroadcasts();
    } catch (error) {
      console.error('Error pausing broadcast:', error);
      toast.error('Failed to pause broadcast');
    }
  };

  const handleResume = async (broadcast: any) => {
    try {
      const { error } = await supabase
        .from('broadcasts')
        .update({ status: 'sending' })
        .eq('id', broadcast.id);

      if (error) throw error;
      toast.success('Broadcast resumed successfully');
      fetchBroadcasts();
    } catch (error) {
      console.error('Error resuming broadcast:', error);
      toast.error('Failed to resume broadcast');
    }
  };

  const handleView = (broadcast: any) => {
    setSelectedBroadcast(broadcast);
    setShowPreviewModal(true);
  };

  const handleCopy = async (broadcast: any) => {
    try {
      const newBroadcast = {
        subject: `${broadcast.subject} (Copy)`,
        content: broadcast.content,
        channel: broadcast.channel,
        audience: broadcast.audience,
        status: 'draft',
        total_recipients: broadcast.total_recipients,
        sent_count: 0,
        failed_count: 0,
        opened_count: 0,
        clicked_count: 0,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('broadcasts')
        .insert([newBroadcast]);

      if (error) throw error;
      toast.success('Broadcast copied successfully');
      fetchBroadcasts();
    } catch (error) {
      console.error('Error copying broadcast:', error);
      toast.error('Failed to copy broadcast');
    }
  };

  const handleDelete = async (broadcast: any) => {
    if (!confirm('Are you sure you want to delete this broadcast?')) return;

    try {
      const { error } = await supabase
        .from('broadcasts')
        .delete()
        .eq('id', broadcast.id);

      if (error) throw error;
      toast.success('Broadcast deleted successfully');
      fetchBroadcasts();
    } catch (error) {
      console.error('Error deleting broadcast:', error);
      toast.error('Failed to delete broadcast');
    }
  };

  const handleViewAnalytics = (broadcast: any) => {
    toast.info('Analytics view coming soon!');
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'sending': 'bg-blue-100 text-blue-800',
      'scheduled': 'bg-purple-100 text-purple-800',
      'sent': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500">Loading broadcasts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600">Error loading broadcasts</div>
        <p className="text-gray-500">Please try again later</p>
        <Button onClick={fetchBroadcasts}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Broadcasts</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your communication campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Active Broadcasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Active Broadcasts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeBroadcasts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No Active Broadcasts</p>
              <p className="text-sm text-gray-400 mt-2">Create your first broadcast campaign to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBroadcasts.map((broadcast) => (
                <div key={broadcast.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getChannelIcon(broadcast.channel)}
                        <h3 className="font-semibold">{broadcast.subject || 'Untitled Broadcast'}</h3>
                        {getStatusBadge(broadcast.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{broadcast.content.substring(0, 100)}...</p>
                    </div>
                    <div className="flex gap-2">
                      {broadcast.status === 'sending' ? (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handlePause(broadcast)}
                          title="Pause"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : broadcast.status === 'paused' ? (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleResume(broadcast)}
                          title="Resume"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : null}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleView(broadcast)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {broadcast.sent_count || 0} / {broadcast.total_recipients || 0} sent
                      </span>
                      <span className="text-gray-600">
                        {broadcast.total_recipients > 0 ? Math.round(((broadcast.sent_count || 0) / broadcast.total_recipients) * 100) : 0}%
                      </span>
                    </div>
                    <Progress value={broadcast.total_recipients > 0 ? ((broadcast.sent_count || 0) / broadcast.total_recipients) * 100 : 0} />
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {broadcast.created_at ? new Date(broadcast.created_at).toLocaleDateString() : 'Unknown date'}
                      </span>
                      {(broadcast.failed_count || 0) > 0 && (
                        <span className="text-red-600">{broadcast.failed_count} failed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Broadcast History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Broadcast History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedBroadcasts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No Broadcast History</p>
              <p className="text-sm text-gray-400 mt-1">Completed broadcasts will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-medium text-gray-700">Campaign Details</th>
                    <th className="pb-3 font-medium text-gray-700">Channel</th>
                    <th className="pb-3 font-medium text-gray-700">Recipients</th>
                    <th className="pb-3 font-medium text-gray-700">Status</th>
                    <th className="pb-3 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {completedBroadcasts.map((broadcast) => (
                    <tr key={broadcast.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{broadcast.subject || 'Untitled Broadcast'}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{broadcast.content.substring(0, 100)}...</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {broadcast.created_at ? new Date(broadcast.created_at).toLocaleDateString() : 'Unknown date'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(broadcast.channel)}
                          <span className="capitalize">{broadcast.channel}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-sm">
                          <p className="font-medium">{(broadcast.total_recipients || 0).toLocaleString()}</p>
                          <p className="text-gray-500">{broadcast.sent_count || 0} sent, {broadcast.failed_count || 0} failed</p>
                        </div>
                      </td>
                      <td className="py-3">
                        {getStatusBadge(broadcast.status)}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleView(broadcast)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleCopy(broadcast)}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleViewAnalytics(broadcast)}
                            title="Analytics"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDelete(broadcast)}
                            title="Delete"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Broadcast Preview</DialogTitle>
          </DialogHeader>
          {selectedBroadcast && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <p className="text-lg font-semibold">{selectedBroadcast.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Channel</label>
                <div className="flex items-center gap-2 mt-1">
                  {getChannelIcon(selectedBroadcast.channel)}
                  <span className="capitalize">{selectedBroadcast.channel}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Content</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <p className="whitespace-pre-wrap">{selectedBroadcast.content}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Audience</label>
                  <p>{selectedBroadcast.audience || 'All Users'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Recipients</label>
                  <p>{(selectedBroadcast.total_recipients || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Sent</label>
                  <p className="text-green-600">{selectedBroadcast.sent_count || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Failed</label>
                  <p className="text-red-600">{selectedBroadcast.failed_count || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div>{getStatusBadge(selectedBroadcast.status)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateBroadcastModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onSuccess={fetchBroadcasts}
      />
    </div>
  );
});

BroadcastsTab.displayName = 'BroadcastsTab';

export default BroadcastsTab;
