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
  Filter
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateBroadcastModal from './CreateBroadcastModal';

const BroadcastsTab: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for active broadcasts
  const activeBroadcasts = [
    {
      id: 1,
      name: 'Festival Celebration Announcement',
      status: 'sending',
      progress: 65,
      sent: 3250,
      total: 5000,
      channels: ['email', 'sms']
    },
    {
      id: 2,
      name: 'Volunteer Appreciation Event',
      status: 'scheduled',
      progress: 0,
      sent: 0,
      total: 1200,
      channels: ['email', 'push']
    }
  ];

  // Mock data for broadcast history
  const broadcastHistory = [
    {
      id: 1,
      name: 'Diwali Celebration Invite',
      subject: 'Join us for Diwali celebrations at the temple',
      channels: ['email', 'sms', 'whatsapp'],
      createdBy: 'Admin User',
      audience: 'All Users',
      recipients: 8500,
      sent: 8500,
      delivered: 8245,
      failed: 255,
      deliveryRate: 97,
      openRate: 78,
      clickRate: 22,
      responseRate: 8,
      unsubscribes: 12,
      status: 'completed',
      sendDate: '2024-01-15 10:00 AM'
    },
    {
      id: 2,
      name: 'Monthly Donation Drive',
      subject: 'Support our temple with your generous donations',
      channels: ['email'],
      createdBy: 'Finance Team',
      audience: 'Donors',
      recipients: 2400,
      sent: 2400,
      delivered: 2380,
      failed: 20,
      deliveryRate: 99,
      openRate: 85,
      clickRate: 35,
      responseRate: 15,
      unsubscribes: 5,
      status: 'completed',
      sendDate: '2024-01-10 09:00 AM'
    },
    {
      id: 3,
      name: 'Volunteer Training Session',
      subject: 'Important training session for all volunteers',
      channels: ['email', 'push'],
      createdBy: 'Volunteer Coordinator',
      audience: 'Volunteers',
      recipients: 450,
      sent: 450,
      delivered: 445,
      failed: 5,
      deliveryRate: 99,
      openRate: 92,
      clickRate: 45,
      responseRate: 25,
      unsubscribes: 2,
      status: 'completed',
      sendDate: '2024-01-08 02:00 PM'
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'sms': return <Smartphone className="h-3 w-3" />;
      case 'push': return <Bell className="h-3 w-3" />;
      case 'whatsapp': return <MessageCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'sending': 'default',
      'scheduled': 'secondary',
      'completed': 'outline',
      'failed': 'destructive',
      'draft': 'secondary'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

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
          <Button onClick={() => setShowCreateModal(true)}>
            <Send className="h-4 w-4 mr-2" />
            Create Broadcast
          </Button>
        </div>
      </div>

      {/* Active Broadcasts */}
      {activeBroadcasts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Broadcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeBroadcasts.map((broadcast) => (
                <div key={broadcast.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{broadcast.name}</h3>
                      {getStatusBadge(broadcast.status)}
                      <div className="flex gap-1">
                        {broadcast.channels.map((channel) => (
                          <div key={channel} className="flex items-center gap-1 text-xs text-gray-500">
                            {getChannelIcon(channel)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{broadcast.sent.toLocaleString()} / {broadcast.total.toLocaleString()} sent</span>
                      <Progress value={broadcast.progress} className="w-32" />
                      <span>{broadcast.progress}%</span>
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
          </CardContent>
        </Card>
      )}

      {/* Broadcast History */}
      <Card>
        <CardHeader>
          <CardTitle>Broadcast History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Campaign Details</th>
                  <th className="text-left p-3">Audience & Targeting</th>
                  <th className="text-left p-3">Delivery Metrics</th>
                  <th className="text-left p-3">Engagement Stats</th>
                  <th className="text-left p-3">Status & Actions</th>
                </tr>
              </thead>
              <tbody>
                {broadcastHistory.map((broadcast) => (
                  <tr key={broadcast.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-blue-600 cursor-pointer hover:underline">
                          {broadcast.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{broadcast.subject}</div>
                        <div className="flex gap-1 mt-2">
                          {broadcast.channels.map((channel) => (
                            <Badge key={channel} variant="outline" className="text-xs">
                              <span className="flex items-center gap-1">
                                {getChannelIcon(channel)}
                                {channel}
                              </span>
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">by {broadcast.createdBy}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{broadcast.audience}</div>
                        <div className="text-sm text-gray-600">
                          <Users className="h-3 w-3 inline mr-1" />
                          {broadcast.recipients.toLocaleString()} recipients
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-green-600">{broadcast.sent.toLocaleString()}</span> sent
                        </div>
                        <div className="text-sm">
                          <span className="text-blue-600">{broadcast.delivered.toLocaleString()}</span> delivered
                        </div>
                        <div className="text-sm">
                          <span className="text-red-600">{broadcast.failed}</span> failed
                        </div>
                        <div className="text-xs font-medium text-green-600">
                          {broadcast.deliveryRate}% delivery rate
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="text-sm">{broadcast.openRate}% open rate</div>
                        <div className="text-sm">{broadcast.clickRate}% click rate</div>
                        <div className="text-sm">{broadcast.responseRate}% response rate</div>
                        <div className="text-xs text-red-600">{broadcast.unsubscribes} unsubscribes</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-2">
                        {getStatusBadge(broadcast.status)}
                        <div className="text-xs text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {broadcast.sendDate}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Broadcast Modal */}
      <CreateBroadcastModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default BroadcastsTab;