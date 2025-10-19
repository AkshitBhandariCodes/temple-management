import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Plus, TrendingUp, Users, Calendar as CalendarIcon, Award } from 'lucide-react';
import { OverviewDashboard } from '@/components/reports/OverviewDashboard';
import { FinancialReports } from '@/components/reports/FinancialReports';
import { CommunityAnalytics } from '@/components/reports/CommunityAnalytics';
import { EventAnalytics } from '@/components/reports/EventAnalytics';
import { VolunteerReports } from '@/components/reports/VolunteerReports';
import { CustomReports } from '@/components/reports/CustomReports';

export const ReportsAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock KPI data
  const kpiData = [
    {
      title: 'Total Donations This Month',
      value: '₹2,45,680',
      trend: '+12.5%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Active Community Members',
      value: '1,247',
      trend: '+8.2%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Event Attendance Rate',
      value: '87.3%',
      trend: '+5.1%',
      icon: CalendarIcon,
      color: 'text-purple-600'
    },
    {
      title: 'Volunteer Engagement Score',
      value: '9.2/10',
      trend: '+0.3',
      icon: Award,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into temple operations and performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Custom Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Report
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export All Reports
          </Button>
        </div>
      </div>

      {/* Quick Insights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <p className={`text-sm font-medium mt-1 ${kpi.color}`}>
                    {kpi.trend} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview Dashboard</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="community">Community Analytics</TabsTrigger>
          <TabsTrigger value="events">Event Analytics</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteer Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewDashboard />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="community">
          <CommunityAnalytics />
        </TabsContent>

        <TabsContent value="events">
          <EventAnalytics />
        </TabsContent>

        <TabsContent value="volunteers">
          <VolunteerReports />
        </TabsContent>

        <TabsContent value="custom">
          <CustomReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};