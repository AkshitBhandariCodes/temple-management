import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, TrendingUp, Clock, MapPin, Star } from 'lucide-react';

export const EventAnalytics: React.FC = () => {
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  // Mock event data
  const eventMetrics = [
    {
      type: 'Religious Events',
      count: 24,
      totalAttendance: 3420,
      avgAttendance: 142,
      capacity: 4200,
      utilization: 81,
      satisfaction: 9.2,
      cost: 125000,
      revenue: 185000,
      roi: 48
    },
    {
      type: 'Cultural Events',
      count: 12,
      totalAttendance: 2850,
      avgAttendance: 238,
      capacity: 3600,
      utilization: 79,
      satisfaction: 8.8,
      cost: 95000,
      revenue: 142000,
      roi: 49
    },
    {
      type: 'Community Gatherings',
      count: 18,
      totalAttendance: 1980,
      avgAttendance: 110,
      capacity: 2700,
      utilization: 73,
      satisfaction: 8.5,
      cost: 68000,
      revenue: 89000,
      roi: 31
    },
    {
      type: 'Educational Programs',
      count: 8,
      totalAttendance: 640,
      avgAttendance: 80,
      capacity: 800,
      utilization: 80,
      satisfaction: 9.0,
      cost: 32000,
      revenue: 45000,
      roi: 41
    }
  ];

  const attendanceTrends = [
    { month: 'Jan', religious: 142, cultural: 238, community: 110, educational: 80 },
    { month: 'Feb', religious: 156, cultural: 245, community: 125, educational: 85 },
    { month: 'Mar', religious: 148, cultural: 220, community: 118, educational: 78 },
    { month: 'Apr', religious: 165, cultural: 265, community: 135, educational: 92 },
    { month: 'May', religious: 152, cultural: 235, community: 128, educational: 88 },
    { month: 'Jun', religious: 158, cultural: 248, community: 132, educational: 90 }
  ];

  const popularEvents = [
    { name: 'Aarti', attendance: 450, capacity: 500, satisfaction: 9.5, frequency: 'Daily' },
    { name: 'Bhajan Evening', attendance: 320, capacity: 400, satisfaction: 9.2, frequency: 'Weekly' },
    { name: 'Festival Celebration', attendance: 850, capacity: 1000, satisfaction: 9.8, frequency: 'Monthly' },
    { name: 'Spiritual Discourse', attendance: 280, capacity: 350, satisfaction: 9.0, frequency: 'Weekly' },
    { name: 'Community Feast', attendance: 650, capacity: 800, satisfaction: 9.3, frequency: 'Monthly' }
  ];

  const timeSlotAnalysis = [
    { slot: '6:00 AM', events: 12, attendance: 85, success: 92 },
    { slot: '9:00 AM', events: 8, attendance: 78, success: 88 },
    { slot: '12:00 PM', events: 15, attendance: 92, success: 95 },
    { slot: '6:00 PM', events: 25, attendance: 95, success: 98 },
    { slot: '8:00 PM', events: 18, attendance: 88, success: 90 }
  ];

  const seasonalPatterns = [
    { season: 'Spring', events: 45, attendance: 89, satisfaction: 9.1 },
    { season: 'Summer', events: 38, attendance: 82, satisfaction: 8.8 },
    { season: 'Monsoon', events: 32, attendance: 76, satisfaction: 8.5 },
    { season: 'Winter', events: 52, attendance: 94, satisfaction: 9.4 }
  ];

  const recurringVsOneTime = [
    { type: 'Recurring Events', count: 45, attendance: 4250, consistency: 92, color: '#8884d8' },
    { type: 'One-time Events', count: 17, attendance: 1890, consistency: 78, color: '#82ca9d' }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Event Types</SelectItem>
                  <SelectItem value="religious">Religious Events</SelectItem>
                  <SelectItem value="cultural">Cultural Events</SelectItem>
                  <SelectItem value="community">Community Gatherings</SelectItem>
                  <SelectItem value="educational">Educational Programs</SelectItem>
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

      {/* Event Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {eventMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {metric.type}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Events</p>
                  <p className="text-xl font-bold">{metric.count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Attendance</p>
                  <p className="text-xl font-bold">{metric.avgAttendance}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Capacity Utilization</span>
                  <span className="text-sm font-medium">{metric.utilization}%</span>
                </div>
                <Progress value={metric.utilization} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-bold">{metric.satisfaction}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="font-bold text-green-600">{metric.roi}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends by Event Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="religious" stroke="#8884d8" strokeWidth={2} name="Religious" />
                <Line type="monotone" dataKey="cultural" stroke="#82ca9d" strokeWidth={2} name="Cultural" />
                <Line type="monotone" dataKey="community" stroke="#ffc658" strokeWidth={2} name="Community" />
                <Line type="monotone" dataKey="educational" stroke="#ff7300" strokeWidth={2} name="Educational" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recurring vs One-time Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={recurringVsOneTime}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="attendance"
                  label={({ type, attendance }) => `${type}: ${attendance}`}
                >
                  {recurringVsOneTime.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {recurringVsOneTime.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.type}</span>
                  <div className="text-right">
                    <div className="font-medium">{item.count} events</div>
                    <div className="text-sm text-gray-500">{item.consistency}% consistency</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Events */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendance}/{event.capacity}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {event.satisfaction}
                        </span>
                        <Badge variant="outline">{event.frequency}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Utilization</div>
                  <div className="font-bold text-green-600">
                    {Math.round((event.attendance / event.capacity) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimal Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSlotAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="slot" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#3b82f6" name="Avg Attendance %" />
                <Bar dataKey="success" fill="#10b981" name="Success Rate %" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 6:00 PM slot shows highest success rate (98%)</li>
                <li>• Morning slots (6:00 AM) have consistent attendance</li>
                <li>• Avoid 9:00 AM slot for major events</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seasonal Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seasonalPatterns.map((season, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{season.season}</h4>
                    <Badge variant="outline">{season.events} events</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Attendance</p>
                      <div className="flex items-center gap-2">
                        <Progress value={season.attendance} className="flex-1" />
                        <span className="text-sm font-medium">{season.attendance}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{season.satisfaction}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event ROI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Event ROI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">{metric.type}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="font-bold text-red-600">₹{metric.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue Generated</p>
                    <p className="font-bold text-green-600">₹{metric.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="text-xl font-bold text-blue-600">{metric.roi}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Success Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registration vs Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Registration Rate</span>
              <span className="font-bold">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Show-up Rate</span>
              <span className="font-bold text-green-600">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">No-show Rate</span>
              <span className="font-bold text-red-600">13%</span>
            </div>
            <Progress value={87} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waitlist Conversion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Waitlisted</span>
              <span className="font-bold">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Converted</span>
              <span className="font-bold text-green-600">134</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-bold text-blue-600">86%</span>
            </div>
            <Progress value={86} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-bold">9.1/10</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Rate</span>
              <span className="font-bold">74%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recommend Rate</span>
              <span className="font-bold text-green-600">91%</span>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Detailed Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};