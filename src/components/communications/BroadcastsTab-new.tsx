import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Copy, 
  BarChart3,
  Mail,
  Smartphone,
  Bell,
  MessageCircle,
  Users,
  Send,
  Calendar,
  Filter,
  Loader2,
  Plus
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBroadcasts } from '@/hooks/use-communications-api';
import CreateBroadcastModal from './CreateBroadcastModal';

const BroadcastsTab: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch real broadcast data
  const { data: broadcastsData, isLoading, error } = useBroadcasts({
    limit: 1000
  });

  const activeBroadcasts = broadcastsData?.data?.filter(b =>
    b.status === 'sending' || b.status === 'scheduled'
  ) || [];

  const completedBroadcasts = broadcastsData?.data?.filter(b =>
    b.status === 'sent' || b.status === 'completed'
  ) || [];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'sms': return <Smartphone className="h-3 w-3" />;
      case 'push': return <Bell className="h-3 w-3" />;
      case 'whatsapp': return <MessageCircle className="h-3 w-3" />;
      default: return <Send className="h-3 w-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sending':
        return <Badge className="bg-blue-100 text-blue-800">Sending</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      case 'sent':
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatProgress = (sent: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((sent / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load broadcasts</div>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Broadcast Management</h2>
          <p className="text-gray-600">Manage and monitor your communication campaigns</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Broadcast</DialogTitle>
              </DialogHeader>
              <CreateBroadcastModal onClose={() => setShowCreateModal(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Broadcasts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Broadcasts</CardTitle>
        </CardHeader>
        <CardContent>
          {activeBroadcasts.length > 0 ? (
            <div className="space-y-4">
              {activeBroadcasts.map((broadcast) => (
                <div key={broadcast.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{broadcast.subject || 'Untitled Broadcast'}</h3>
                      {getStatusBadge(broadcast.status)}
                      <div className="flex gap-1">
                        {getChannelIcon(broadcast.channel)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{broadcast.sent_count.toLocaleString()} / {broadcast.total_recipients.toLocaleString()} sent</span>
                      <Progress value={formatProgress(broadcast.sent_count, broadcast.total_recipients)} className="w-32" />
                      <span>{formatProgress(broadcast.sent_count, broadcast.total_recipients)}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {broadcast.status === 'sending' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Square className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {broadcast.status === 'scheduled' && (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No Active Broadcasts</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first broadcast campaign to get started
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Broadcast
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Broadcast History */}
      <Card>
        <CardHeader>
          <CardTitle>Broadcast History</CardTitle>
        </CardHeader>
        <CardContent>
          {completedBroadcasts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Campaign Details</th>
                    <th className="text-left p-3">Channel</th>
                    <th className="text-left p-3">Recipients</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {completedBroadcasts.slice(0, 10).map((broadcast) => (
                    <tr key={broadcast.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-blue-600 cursor-pointer hover:underline">
                            {broadcast.subject || 'Untitled Broadcast'}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {broadcast.content.substring(0, 100)}...
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {broadcast.created_at ? new Date(broadcast.created_at).toLocaleDateString() : 'Unknown date'}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(broadcast.channel)}
                          <span className="capitalize">{broadcast.channel}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{broadcast.total_recipients.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">
                            {broadcast.sent_count} sent, {broadcast.failed_count} failed
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(broadcast.status)}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No Broadcast History</p>
              <p className="text-sm text-muted-foreground">
                Completed broadcasts will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BroadcastsTab;
