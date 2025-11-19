import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, Radio, FileText, TrendingUp, Mail, Smartphone, 
  Bell, MessageCircle, ExternalLink, Activity, Loader2 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/lib/supabaseClient';

interface DashboardTabProps {
  onNavigateToTab?: (tabName: string) => void;
}

interface DashboardStats {
  totalMessages: number;
  messageGrowth: string;
  activeCampaigns: number;
  scheduledToday: number;
  runningCampaigns: number;
  scheduledCampaigns: number;
  totalBrochures: number;
  monthlyDownloads: number;
  publishedBrochures: number;
  pendingApproval: number;
  avgOpenRate: number;
  clickRate: number;
  responseRate: number;
}

interface DeliveryTrend {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
}

interface EngagementData {
  audience: string;
  openRate: number;
  clickRate: number;
  responseRate: number;
}

interface RecentActivity {
  type: string;
  title: string;
  time: string;
  status: string;
  created_at: string;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigateToTab }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    messageGrowth: '0%',
    activeCampaigns: 0,
    scheduledToday: 0,
    runningCampaigns: 0,
    scheduledCampaigns: 0,
    totalBrochures: 0,
    monthlyDownloads: 0,
    publishedBrochures: 0,
    pendingApproval: 0,
    avgOpenRate: 0,
    clickRate: 0,
    responseRate: 0,
  });

  const [deliveryTrends, setDeliveryTrends] = useState<DeliveryTrend[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions
    const broadcastsChannel = supabase
      .channel('dashboard-broadcasts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'broadcasts' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const brochuresChannel = supabase
      .channel('dashboard-brochures')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brochures' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const announcementsChannel = supabase
      .channel('dashboard-announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(broadcastsChannel);
      supabase.removeChannel(brochuresChannel);
      supabase.removeChannel(announcementsChannel);
    };
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      const [
        broadcastsResult,
        brochuresResult,
        announcementsResult,
        templatesResult,
      ] = await Promise.all([
        supabase.from('broadcasts').select('*'),
        supabase.from('brochures').select('*'),
        supabase.from('announcements').select('*'),
        supabase.from('message_templates').select('*'),
      ]);

      const broadcasts = broadcastsResult.data || [];
      const brochures = brochuresResult.data || [];
      const announcements = announcementsResult.data || [];
      const templates = templatesResult.data || [];

      const totalMessages = broadcasts.reduce((sum, b) => sum + (b.total_recipients || 0), 0);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthMessages = broadcasts
        .filter(b => new Date(b.created_at) >= lastMonth)
        .reduce((sum, b) => sum + (b.total_recipients || 0), 0);
      const messageGrowth = totalMessages > 0 
        ? `+${Math.round((lastMonthMessages / totalMessages) * 100)}%`
        : '0%';

      const activeCampaigns = broadcasts.filter(
        b => b.status === 'sending' || b.status === 'scheduled'
      ).length;

      const today = new Date().toISOString().split('T')[0];
      const scheduledToday = broadcasts.filter(
        b => b.scheduled_at && b.scheduled_at.startsWith(today)
      ).length;

      const runningCampaigns = broadcasts.filter(b => b.status === 'sending').length;
      const scheduledCampaigns = broadcasts.filter(b => b.status === 'scheduled').length;

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyDownloads = brochures
        .filter(b => new Date(b.created_date) >= thisMonth)
        .reduce((sum, b) => sum + (b.downloads || 0), 0);

      const publishedBrochures = brochures.filter(b => b.status === 'published').length;
      const pendingApproval = brochures.filter(b => b.status === 'draft').length;

      const completedBroadcasts = broadcasts.filter(b => b.status === 'sent' || b.status === 'completed');
      const totalSent = completedBroadcasts.reduce((sum, b) => sum + (b.sent_count || 0), 0);
      const totalOpened = completedBroadcasts.reduce((sum, b) => sum + (b.opened_count || 0), 0);
      const totalClicked = completedBroadcasts.reduce((sum, b) => sum + (b.clicked_count || 0), 0);
      const totalResponded = completedBroadcasts.reduce((sum, b) => sum + (b.responded_count || 0), 0);

      const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
      const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;
      const responseRate = totalSent > 0 ? Math.round((totalResponded / totalSent) * 100) : 0;

      setStats({
        totalMessages,
        messageGrowth,
        activeCampaigns,
        scheduledToday,
        runningCampaigns,
        scheduledCampaigns,
        totalBrochures: brochures.length,
        monthlyDownloads,
        publishedBrochures,
        pendingApproval,
        avgOpenRate,
        clickRate,
        responseRate,
      });

      const trends = generateDeliveryTrends(broadcasts);
      setDeliveryTrends(trends);

      const engagement = generateEngagementData(broadcasts);
      setEngagementData(engagement);

      const activities = generateRecentActivities(broadcasts, brochures, announcements, templates);
      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDeliveryTrends = (broadcasts: any[]): DeliveryTrend[] => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayBroadcasts = broadcasts.filter(b => 
        b.created_at && b.created_at.startsWith(dateStr)
      );

      const sent = dayBroadcasts.reduce((sum, b) => sum + (b.total_recipients || 0), 0);
      const delivered = dayBroadcasts.reduce((sum, b) => sum + (b.sent_count || 0), 0);
      const failed = dayBroadcasts.reduce((sum, b) => sum + (b.failed_count || 0), 0);

      last7Days.push({ date: dateStr, sent, delivered, failed });
    }
    return last7Days;
  };

  const generateEngagementData = (broadcasts: any[]): EngagementData[] => {
    const audienceTypes = ['All Users', 'Community Members', 'Donors', 'Volunteers', 'Event Attendees'];
    
    return audienceTypes.map(audience => {
      const audienceBroadcasts = broadcasts.filter(b => 
        b.audience === audience && (b.status === 'sent' || b.status === 'completed')
      );

      if (audienceBroadcasts.length === 0) {
        return { audience, openRate: 0, clickRate: 0, responseRate: 0 };
      }

      const totalSent = audienceBroadcasts.reduce((sum, b) => sum + (b.sent_count || 0), 0);
      const totalOpened = audienceBroadcasts.reduce((sum, b) => sum + (b.opened_count || 0), 0);
      const totalClicked = audienceBroadcasts.reduce((sum, b) => sum + (b.clicked_count || 0), 0);
      const totalResponded = audienceBroadcasts.reduce((sum, b) => sum + (b.responded_count || 0), 0);

      return {
        audience,
        openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
        clickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
        responseRate: totalSent > 0 ? Math.round((totalResponded / totalSent) * 100) : 0,
      };
    });
  };

  const generateRecentActivities = (
    broadcasts: any[], 
    brochures: any[], 
    announcements: any[], 
    templates: any[]
  ): RecentActivity[] => {
    const activities: RecentActivity[] = [];

    broadcasts.slice(0, 2).forEach(b => {
      activities.push({
        type: 'broadcast',
        title: b.subject || 'Untitled Broadcast',
        time: getTimeAgo(b.created_at),
        status: b.status,
        created_at: b.created_at,
      });
    });

    brochures.slice(0, 2).forEach(b => {
      activities.push({
        type: 'brochure',
        title: b.title,
        time: getTimeAgo(b.created_date),
        status: b.status,
        created_at: b.created_date,
      });
    });

    announcements.slice(0, 1).forEach(a => {
      activities.push({
        type: 'announcement',
        title: a.title,
        time: getTimeAgo(a.created_at),
        status: a.status,
        created_at: a.created_at,
      });
    });

    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  };

  const getTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'broadcast': return <Radio className="h-4 w-4 text-green-600" />;
      case 'brochure': return <FileText className="h-4 w-4 text-green-600" />;
      case 'announcement': return <Bell className="h-4 w-4 text-blue-600" />;
      case 'template': return <MessageCircle className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  // Navigation handlers
  const handleViewDetails = () => {
    if (onNavigateToTab) onNavigateToTab('history');
  };

  const handleManageCampaigns = () => {
    if (onNavigateToTab) onNavigateToTab('broadcasts');
  };

  const handleCreateNew = () => {
    if (onNavigateToTab) onNavigateToTab('brochures');
  };

  const handleViewAnalytics = () => {
    if (onNavigateToTab) onNavigateToTab('history');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Messages Sent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="h-3 w-3" /> {stats.messageGrowth} from last month
            </p>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> 65%
              </span>
              <span className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" /> 25%
              </span>
              <span className="flex items-center gap-1">
                <Bell className="h-3 w-3" /> 10%
              </span>
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-orange-600 hover:text-orange-700"
              onClick={handleViewDetails}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
            <Radio className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.scheduledToday} scheduled for today
            </p>
            <div className="mt-2 space-y-1 text-xs">
              <div className="text-green-600">{stats.runningCampaigns} running</div>
              <div className="text-blue-600">{stats.scheduledCampaigns} scheduled</div>
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-orange-600 hover:text-orange-700"
              onClick={handleManageCampaigns}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Manage Campaigns
            </Button>
          </CardContent>
        </Card>

        {/* Brochures & Media */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Brochures & Media</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBrochures}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.monthlyDownloads} downloads this month
            </p>
            <div className="mt-2 space-y-1 text-xs">
              <div className="text-green-600">{stats.publishedBrochures} published</div>
              <div className="text-orange-600">{stats.pendingApproval} pending approval</div>
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-orange-600 hover:text-orange-700"
              onClick={handleCreateNew}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Create New
            </Button>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Engagement Metrics</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgOpenRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Average open rate</p>
            <div className="mt-2 space-y-1 text-xs">
              <div>Click rate: {stats.clickRate}%</div>
              <div>Response rate: {stats.responseRate}%</div>
            </div>
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-orange-600 hover:text-orange-700"
              onClick={handleViewAnalytics}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No recent activities</p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time} • {activity.type}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      activity.status === 'sent' || activity.status === 'published' || activity.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Delivery Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Message Delivery Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={deliveryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Audience Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="audience" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="openRate" fill="#3b82f6" />
              <Bar dataKey="clickRate" fill="#10b981" />
              <Bar dataKey="responseRate" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
