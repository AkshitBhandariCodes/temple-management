import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Plus, Save, Play, Download, Calendar as CalendarIcon, Filter, Database, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Table, Share, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const CustomReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [reportName, setReportName] = useState('');
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [chartType, setChartType] = useState('bar');
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });

  // Mock data sources
  const dataSources = [
    {
      id: 'users',
      name: 'Users & Profiles',
      description: 'User registration, profile data, and activity',
      tables: ['users', 'profiles', 'user_activity'],
      fields: ['user_id', 'name', 'email', 'registration_date', 'last_login', 'community_id']
    },
    {
      id: 'communities',
      name: 'Communities & Memberships',
      description: 'Community data and member relationships',
      tables: ['communities', 'memberships', 'community_activity'],
      fields: ['community_id', 'community_name', 'member_count', 'created_date', 'activity_level']
    },
    {
      id: 'events',
      name: 'Events & Registrations',
      description: 'Event data, registrations, and attendance',
      tables: ['events', 'registrations', 'attendance'],
      fields: ['event_id', 'event_name', 'event_date', 'capacity', 'registered', 'attended']
    },
    {
      id: 'donations',
      name: 'Donations & Transactions',
      description: 'Financial transactions and donation data',
      tables: ['donations', 'transactions', 'payment_methods'],
      fields: ['donation_id', 'amount', 'donation_date', 'source', 'payment_method', 'donor_id']
    },
    {
      id: 'volunteers',
      name: 'Volunteers & Shifts',
      description: 'Volunteer data, shifts, and performance',
      tables: ['volunteers', 'shifts', 'volunteer_hours'],
      fields: ['volunteer_id', 'name', 'department', 'hours_worked', 'shift_date', 'rating']
    },
    {
      id: 'pujas',
      name: 'Pujas & Schedules',
      description: 'Puja schedules, bookings, and attendance',
      tables: ['pujas', 'puja_bookings', 'puja_attendance'],
      fields: ['puja_id', 'puja_name', 'schedule_date', 'booked_by', 'attendance_count']
    }
  ];

  // Mock saved reports
  const savedReports = [
    {
      id: 1,
      name: 'Monthly Donation Analysis',
      category: 'Financial',
      created: '2024-01-15',
      lastRun: '2024-01-20',
      schedule: 'Monthly',
      owner: 'Admin',
      shared: true
    },
    {
      id: 2,
      name: 'Community Growth Report',
      category: 'Community',
      created: '2024-01-10',
      lastRun: '2024-01-18',
      schedule: 'Weekly',
      owner: 'Community Manager',
      shared: false
    },
    {
      id: 3,
      name: 'Event Attendance Trends',
      category: 'Events',
      created: '2024-01-08',
      lastRun: '2024-01-19',
      schedule: 'Bi-weekly',
      owner: 'Event Coordinator',
      shared: true
    },
    {
      id: 4,
      name: 'Volunteer Performance Dashboard',
      category: 'Volunteers',
      created: '2024-01-05',
      lastRun: '2024-01-17',
      schedule: 'Daily',
      owner: 'HR Manager',
      shared: false
    }
  ];

  // Mock chart data for preview
  const previewData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 }
  ];

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
    { id: 'line', name: 'Line Chart', icon: LineChartIcon },
    { id: 'pie', name: 'Pie Chart', icon: PieChartIcon },
    { id: 'table', name: 'Table', icon: Table }
  ];

  const handleDataSourceToggle = (sourceId: string) => {
    setSelectedDataSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={previewData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#3b82f6"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {previewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{row.name}</td>
                    <td className="border border-gray-300 p-2 text-right">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">Select a chart type</div>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="library">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Report Builder Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Custom Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Enter report name"
                  />
                </div>
                <div>
                  <Label>Report Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="volunteers">Volunteers</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Source Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={source.id}
                        checked={selectedDataSources.includes(source.id)}
                        onCheckedChange={() => handleDataSourceToggle(source.id)}
                      />
                      <Label htmlFor={source.id} className="font-medium">
                        {source.name}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {source.tables.map((table) => (
                        <Badge key={table} variant="outline" className="text-xs">
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Field Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Available Fields</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDataSources.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Select data sources to see available fields
                  </p>
                ) : (
                  <div className="space-y-4">
                    {dataSources
                      .filter(source => selectedDataSources.includes(source.id))
                      .map((source) => (
                        <div key={source.id}>
                          <h4 className="font-medium mb-2">{source.name}</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {source.fields.map((field) => (
                              <div key={field} className="flex items-center space-x-2">
                                <Checkbox
                                  id={field}
                                  checked={selectedFields.includes(field)}
                                  onCheckedChange={() => handleFieldToggle(field)}
                                />
                                <Label htmlFor={field} className="text-sm">
                                  {field}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filters & Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date || new Date() }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Group By</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sort By</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date_asc">Date (Ascending)</SelectItem>
                      <SelectItem value="date_desc">Date (Descending)</SelectItem>
                      <SelectItem value="value_asc">Value (Ascending)</SelectItem>
                      <SelectItem value="value_desc">Value (Descending)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Label>Custom Filters</Label>
                <Textarea
                  placeholder="Enter custom filter conditions (e.g., amount > 1000 AND community_id = 'youth')"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visualization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-3 block">Chart Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {chartTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          chartType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setChartType(type.id)}
                      >
                        <div className="flex items-center gap-2">
                          <type.icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{type.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block">Chart Configuration</Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="chartTitle">Chart Title</Label>
                      <Input id="chartTitle" placeholder="Enter chart title" />
                    </div>
                    <div>
                      <Label htmlFor="xAxisLabel">X-Axis Label</Label>
                      <Input id="xAxisLabel" placeholder="Enter X-axis label" />
                    </div>
                    <div>
                      <Label htmlFor="yAxisLabel">Y-Axis Label</Label>
                      <Input id="yAxisLabel" placeholder="Enter Y-axis label" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFields.length === 0 ? (
                <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Select fields to see preview</p>
                </div>
              ) : (
                renderChart()
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Run Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          {/* Saved Reports Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Saved Reports Library
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="volunteers">Volunteers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Report
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <Badge variant="outline">{report.category}</Badge>
                        {report.shared && <Badge variant="secondary">Shared</Badge>}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Created: {report.created}</span>
                        <span>Last Run: {report.lastRun}</span>
                        <span>Schedule: {report.schedule}</span>
                        <span>Owner: {report.owner}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Daily Reports</h4>
                  <p className="text-sm text-gray-600 mb-3">1 report scheduled</p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Volunteer Performance Dashboard</span>
                      <p className="text-gray-600">Next run: Tomorrow 6:00 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Weekly Reports</h4>
                  <p className="text-sm text-gray-600 mb-3">1 report scheduled</p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Community Growth Report</span>
                      <p className="text-gray-600">Next run: Monday 9:00 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Monthly Reports</h4>
                  <p className="text-sm text-gray-600 mb-3">1 report scheduled</p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Monthly Donation Analysis</span>
                      <p className="text-gray-600">Next run: 1st of next month</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};