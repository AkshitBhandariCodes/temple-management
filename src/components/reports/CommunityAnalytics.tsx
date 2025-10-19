import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, TrendingUp, Activity, Award, ArrowUp, ArrowDown } from 'lucide-react';

export const CommunityAnalytics: React.FC = () => {
  const [selectedCommunity, setSelectedCommunity] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  // Mock community data
  const communityMetrics = [
    {
      id: 'youth',
      name: 'Youth Community',
      logo: '🌟',
      members: 245,
      growth: 12.5,
      activityLevel: 85,
      contribution: 45000,
      participation: 78,
      status: 'high'
    },
    {
      id: 'seniors',
      name: 'Seniors Community',
      logo: '🙏',
      members: 189,
      growth: 8.3,
      activityLevel: 92,
      contribution: 67000,
      participation: 89,
      status: 'high'
    },
    {
      id: 'families',
      name: 'Families Community',
      logo: '👨‍👩‍👧‍👦',
      members: 156,
      growth: 15.2,
      activityLevel: 76,
      contribution: 38000,
      participation: 82,
      status: 'medium'
    },
    {
      id: 'students',
      name: 'Students Community',
      logo: '📚',
      members: 98,
      growth: 22.1,
      activityLevel: 68,
      contribution: 12000,
      participation: 65,
      status: 'medium'
    },
    {
      id: 'professionals',
      name: 'Professionals Community',
      logo: '💼',
      members: 134,
      growth: 6.7,
      activityLevel: 71,
      contribution: 52000,
      participation: 74,
      status: 'medium'
    }
  ];

  const engagementTrends = [
    { month: 'Jan', youth: 78, seniors: 85, families: 72, students: 65, professionals: 70 },
    { month: 'Feb', youth: 82, seniors: 88, families: 75, students: 68, professionals: 73 },
    { month: 'Mar', youth: 85, seniors: 92, families: 76, students: 68, professionals: 71 },
    { month: 'Apr', youth: 83, seniors: 89, families: 82, students: 65, professionals: 74 },
    { month: 'May', youth: 87, seniors: 94, families: 84, students: 70, professionals: 76 },
    { month: 'Jun', youth: 85, seniors: 92, families: 82, students: 68, professionals: 74 }
  ];

  const memberLifecycle = [
    { stage: 'New Members', count: 45, percentage: 18 },
    { stage: 'Active Members', count: 156, percentage: 62 },
    { stage: 'Engaged Members', count: 38, percentage: 15 },
    { stage: 'At Risk', count: 8, percentage: 3 },
    { stage: 'Inactive', count: 5, percentage: 2 }
  ];

  const communityHealth = [
    { community: 'Youth', satisfaction: 8.5, activity: 85, leadership: 7.8, resources: 8.2 },
    { community: 'Seniors', satisfaction: 9.2, activity: 92, leadership: 9.0, resources: 8.8 },
    { community: 'Families', satisfaction: 8.1, activity: 76, leadership: 7.5, resources: 7.9 },
    { community: 'Students', satisfaction: 7.8, activity: 68, leadership: 7.2, resources: 7.4 },
    { community: 'Professionals', satisfaction: 8.3, activity: 71, leadership: 8.0, resources: 8.1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communities</SelectItem>
                  {communityMetrics.map((community) => (
                    <SelectItem key={community.id} value={community.id}>
                      {community.logo} {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {communityMetrics.map((community) => (
          <Card key={community.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{community.logo}</span>
                  <div>
                    <CardTitle className="text-lg">{community.name}</CardTitle>
                    <Badge className={getStatusColor(community.status)}>
                      {community.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Members</span>
                  </div>
                  <p className="text-xl font-bold">{community.members}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {community.growth > 0 ? (
                      <ArrowUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={community.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {community.growth}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Activity</span>
                  </div>
                  <p className="text-xl font-bold">{community.activityLevel}%</p>
                  <Progress value={community.activityLevel} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Contribution</span>
                  </div>
                  <p className="text-lg font-bold">₹{community.contribution.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Participation</span>
                  </div>
                  <p className="text-lg font-bold">{community.participation}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparative Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Community Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Community</th>
                  <th className="text-right p-3">Members</th>
                  <th className="text-right p-3">Growth</th>
                  <th className="text-right p-3">Activity</th>
                  <th className="text-right p-3">Contribution</th>
                  <th className="text-right p-3">Participation</th>
                  <th className="text-center p-3">Ranking</th>
                </tr>
              </thead>
              <tbody>
                {communityMetrics
                  .sort((a, b) => b.activityLevel - a.activityLevel)
                  .map((community, index) => (
                    <tr key={community.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span>{community.logo}</span>
                          <span className="font-medium">{community.name}</span>
                        </div>
                      </td>
                      <td className="text-right p-3 font-medium">{community.members}</td>
                      <td className="text-right p-3">
                        <span className={community.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                          {community.growth > 0 ? '+' : ''}{community.growth}%
                        </span>
                      </td>
                      <td className="text-right p-3">{community.activityLevel}%</td>
                      <td className="text-right p-3">₹{community.contribution.toLocaleString()}</td>
                      <td className="text-right p-3">{community.participation}%</td>
                      <td className="text-center p-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Member Engagement Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="youth" stroke="#8884d8" strokeWidth={2} name="Youth" />
                <Line type="monotone" dataKey="seniors" stroke="#82ca9d" strokeWidth={2} name="Seniors" />
                <Line type="monotone" dataKey="families" stroke="#ffc658" strokeWidth={2} name="Families" />
                <Line type="monotone" dataKey="students" stroke="#ff7300" strokeWidth={2} name="Students" />
                <Line type="monotone" dataKey="professionals" stroke="#8dd1e1" strokeWidth={2} name="Professionals" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Lifecycle Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberLifecycle}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {memberLifecycle.map((stage, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stage.count}</span>
                    <span className="text-sm text-gray-500">({stage.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Health Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Community Health Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={communityHealth}>
              <PolarGrid />
              <PolarAngleAxis dataKey="community" />
              <PolarRadiusAxis angle={90} domain={[0, 10]} />
              <Radar name="Satisfaction" dataKey="satisfaction" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
              <Radar name="Activity" dataKey="activity" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
              <Radar name="Leadership" dataKey="leadership" stroke="#ffc658" fill="#ffc658" fillOpacity={0.1} />
              <Radar name="Resources" dataKey="resources" stroke="#ff7300" fill="#ff7300" fillOpacity={0.1} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Growth Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Acquisition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Members (30d)</span>
              <span className="font-bold text-green-600">+45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Organic Growth</span>
              <span className="font-medium">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Invited Growth</span>
              <span className="font-medium">32%</span>
            </div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retention Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">30-day Retention</span>
              <span className="font-bold text-blue-600">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">90-day Retention</span>
              <span className="font-medium">74%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">1-year Retention</span>
              <span className="font-medium">62%</span>
            </div>
            <Progress value={87} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Expansion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Communities</span>
              <span className="font-bold">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Community Size</span>
              <span className="font-medium">164 members</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Growth Rate</span>
              <span className="font-medium text-green-600">+12.8%</span>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Expansion Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};