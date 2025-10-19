import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('30D');

  // Mock data for charts
  const donationTrends = [
    { month: 'Jan', web: 45000, hundi: 32000, temple: 28000 },
    { month: 'Feb', web: 52000, hundi: 35000, temple: 31000 },
    { month: 'Mar', web: 48000, hundi: 38000, temple: 29000 },
    { month: 'Apr', web: 61000, hundi: 42000, temple: 35000 },
    { month: 'May', web: 55000, hundi: 39000, temple: 33000 },
    { month: 'Jun', web: 67000, hundi: 45000, temple: 38000 }
  ];

  const eventAttendance = [
    { event: 'Aarti', planned: 150, actual: 142 },
    { event: 'Bhajan', planned: 80, actual: 75 },
    { event: 'Festival', planned: 300, actual: 285 },
    { event: 'Workshop', planned: 50, actual: 48 },
    { event: 'Satsang', planned: 120, actual: 110 }
  ];

  const volunteerEngagement = [
    { name: 'Event Management', value: 35, color: '#8884d8' },
    { name: 'Temple Services', value: 28, color: '#82ca9d' },
    { name: 'Community Support', value: 22, color: '#ffc658' },
    { name: 'Administration', value: 15, color: '#ff7300' }
  ];

  const recentReports = [
    { name: 'Monthly Financial Summary', type: 'Financial', date: '2024-01-15', size: '2.3 MB' },
    { name: 'Community Engagement Report', type: 'Community', date: '2024-01-14', size: '1.8 MB' },
    { name: 'Event Performance Analysis', type: 'Events', date: '2024-01-13', size: '3.1 MB' },
    { name: 'Volunteer Activity Report', type: 'Volunteers', date: '2024-01-12', size: '1.5 MB' }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Financial Overview
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7D">7D</SelectItem>
                  <SelectItem value="30D">30D</SelectItem>
                  <SelectItem value="90D">90D</SelectItem>
                  <SelectItem value="1Y">1Y</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Revenue Metrics</h4>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Donations</span>
                    <span className="font-medium">₹2,45,680</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Growth</span>
                    <span className="font-medium text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Donation</span>
                    <span className="font-medium">₹1,247</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Expense Summary</h4>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Expenses</span>
                    <span className="font-medium">₹1,85,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Budget Variance</span>
                    <span className="font-medium text-green-600">-8.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cost/Event</span>
                    <span className="font-medium">₹3,245</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Community Engagement</h4>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Communities</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Participation Rate</span>
                    <span className="font-medium text-green-600">78.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Task Completion</span>
                    <span className="font-medium">92.3%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Event Performance</h4>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Events Hosted</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Attendance</span>
                    <span className="font-medium">87.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">94.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="web" stroke="#8884d8" strokeWidth={2} name="Web Gateway" />
                <Line type="monotone" dataKey="hundi" stroke="#82ca9d" strokeWidth={2} name="Hundi" />
                <Line type="monotone" dataKey="temple" stroke="#ffc658" strokeWidth={2} name="In-Temple" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Attendance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Event Attendance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Community Activity Heatmap Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Community Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-600">Interactive heatmap showing daily activity levels</p>
                <p className="text-sm text-gray-500 mt-1">Hover over dates for detailed insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Engagement Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={volunteerEngagement}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {volunteerEngagement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Reports
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">{report.type}</span>
                    <span className="text-sm text-gray-500">{report.date}</span>
                    <span className="text-sm text-gray-500">{report.size}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};