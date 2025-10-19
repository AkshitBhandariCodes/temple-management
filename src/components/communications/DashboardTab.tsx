import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Radio, 
  FileText, 
  TrendingUp,
  Mail,
  Smartphone,
  Bell,
  MessageCircle,
  ExternalLink,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DashboardTab: React.FC = () => {
  // Mock data for charts
  const deliveryTrends = [
    { date: '2024-01-01', sent: 1200, delivered: 1150, failed: 50 },
    { date: '2024-01-02', sent: 1500, delivered: 1420, failed: 80 },
    { date: '2024-01-03', sent: 1100, delivered: 1080, failed: 20 },
    { date: '2024-01-04', sent: 1800, delivered: 1750, failed: 50 },
    { date: '2024-01-05', sent: 1600, delivered: 1580, failed: 20 },
    { date: '2024-01-06', sent: 2000, delivered: 1950, failed: 50 },
    { date: '2024-01-07', sent: 1400, delivered: 1380, failed: 20 }
  ];

  const engagementData = [
    { audience: 'All Users', openRate: 65, clickRate: 12, responseRate: 8 },
    { audience: 'Community Members', openRate: 78, clickRate: 18, responseRate: 15 },
    { audience: 'Donors', openRate: 82, clickRate: 22, responseRate: 12 },
    { audience: 'Volunteers', openRate: 88, clickRate: 28, responseRate: 20 },
    { audience: 'Event Attendees', openRate: 72, clickRate: 16, responseRate: 10 }
  ];

  const recentActivities = [
    { type: 'broadcast', title: 'Festival Celebration Announcement', time: '2 hours ago', status: 'sent' },
    { type: 'brochure', title: 'Diwali Event Brochure', time: '4 hours ago', status: 'published' },
    { type: 'announcement', title: 'Temple Closure Notice', time: '6 hours ago', status: 'active' },
    { type: 'template', title: 'Volunteer Welcome Template', time: '1 day ago', status: 'updated' },
    { type: 'broadcast', title: 'Donation Drive Campaign', time: '2 days ago', status: 'completed' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span className="text-xs">65%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Smartphone className="h-3 w-3" />
                <span className="text-xs">25%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bell className="h-3 w-3" />
                <span className="text-xs">10%</span>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-xs mt-2">
              <ExternalLink className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 scheduled for today
            </p>
            <div className="mt-2">
              <div className="text-xs text-green-600">5 running</div>
              <div className="text-xs text-blue-600">3 scheduled</div>
            </div>
            <Button variant="link" className="p-0 h-auto text-xs mt-2">
              <ExternalLink className="h-3 w-3 mr-1" />
              Manage Campaigns
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brochures & Media</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              1,247 downloads this month
            </p>
            <div className="mt-2">
              <div className="text-xs text-green-600">20 published</div>
              <div className="text-xs text-orange-600">4 pending approval</div>
            </div>
            <Button variant="link" className="p-0 h-auto text-xs mt-2">
              <ExternalLink className="h-3 w-3 mr-1" />
              Create New
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Metrics</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74%</div>
            <p className="text-xs text-muted-foreground">
              Average open rate
            </p>
            <div className="mt-2">
              <div className="text-xs">Click rate: 18%</div>
              <div className="text-xs">Response rate: 12%</div>
            </div>
            <Button variant="link" className="p-0 h-auto text-xs mt-2">
              <ExternalLink className="h-3 w-3 mr-1" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'sent' || activity.status === 'published' || activity.status === 'completed' 
                      ? 'bg-green-500' 
                      : activity.status === 'active' 
                      ? 'bg-blue-500' 
                      : 'bg-orange-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.time} • {activity.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Delivery Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={deliveryTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sent" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="delivered" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="failed" stroke="#ff7c7c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="audience" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="openRate" fill="#8884d8" />
                  <Bar dataKey="clickRate" fill="#82ca9d" />
                  <Bar dataKey="responseRate" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;