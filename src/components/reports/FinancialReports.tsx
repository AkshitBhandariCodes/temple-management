import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar as CalendarIcon, Filter, Mail, FileText, FileSpreadsheet, Presentation } from 'lucide-react';
import { format } from 'date-fns';

export const FinancialReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('income-statement');
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  // Mock financial data
  const incomeData = [
    { category: 'Web Donations', amount: 125000, percentage: 45 },
    { category: 'Hundi Collections', amount: 85000, percentage: 30 },
    { category: 'In-Temple Donations', amount: 70000, percentage: 25 }
  ];

  const expenseData = [
    { category: 'Temple Maintenance', amount: 45000, percentage: 35 },
    { category: 'Event Expenses', amount: 35000, percentage: 27 },
    { category: 'Administrative', amount: 25000, percentage: 19 },
    { category: 'Utilities', amount: 15000, percentage: 12 },
    { category: 'Other', amount: 8000, percentage: 7 }
  ];

  const cashFlowData = [
    { month: 'Jan', inflow: 280000, outflow: 128000, net: 152000 },
    { month: 'Feb', inflow: 320000, outflow: 145000, net: 175000 },
    { month: 'Mar', inflow: 295000, outflow: 135000, net: 160000 },
    { month: 'Apr', inflow: 350000, outflow: 165000, net: 185000 },
    { month: 'May', inflow: 310000, outflow: 148000, net: 162000 },
    { month: 'Jun', inflow: 380000, outflow: 175000, net: 205000 }
  ];

  const donorSegmentation = [
    { segment: 'Major Donors (>₹10k)', count: 45, amount: 450000, color: '#8884d8' },
    { segment: 'Regular Donors (₹1k-10k)', count: 234, amount: 890000, color: '#82ca9d' },
    { segment: 'Small Donors (<₹1k)', count: 567, amount: 234000, color: '#ffc658' },
    { segment: 'First-time Donors', count: 123, amount: 156000, color: '#ff7300' }
  ];

  const standardReports = [
    { id: 'income-statement', name: 'Income Statement', description: 'Revenue and expense summary' },
    { id: 'cash-flow', name: 'Cash Flow Statement', description: 'Cash inflows and outflows' },
    { id: 'donation-summary', name: 'Donation Summary Report', description: 'Detailed donation analysis' },
    { id: 'expense-analysis', name: 'Expense Analysis Report', description: 'Expense breakdown and trends' },
    { id: 'budget-actual', name: 'Budget vs Actual Report', description: 'Budget performance analysis' },
    { id: 'tax-compliance', name: 'Tax Compliance Report (80G)', description: '80G certificate compliance' }
  ];

  return (
    <div className="space-y-6">
      {/* Report Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Financial Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standardReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedReport === report.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <h4 className="font-medium text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select defaultValue="this-month">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Community Filter */}
            <div className="space-y-2">
              <Label>Community</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communities</SelectItem>
                  <SelectItem value="youth">Youth Community</SelectItem>
                  <SelectItem value="seniors">Seniors Community</SelectItem>
                  <SelectItem value="families">Families Community</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Report Viewer */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="donation-summary">Donation Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="income-statement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Section */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ category, percentage }) => `${category} ${percentage}%`}
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {incomeData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.category}</span>
                      <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between items-center font-semibold">
                    <span>Total Revenue</span>
                    <span>₹{incomeData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expense Section */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={100} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                    <Bar dataKey="amount" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {expenseData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.category}</span>
                      <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between items-center font-semibold">
                    <span>Total Expenses</span>
                    <span>₹{expenseData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Net Income Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Net Income Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Gross Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹2,80,000</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">₹1,28,000</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Net Income</p>
                  <p className="text-2xl font-bold text-blue-600">₹1,52,000</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-purple-600">54.3%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cash Flow Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2} name="Cash Inflow" />
                  <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} name="Cash Outflow" />
                  <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} name="Net Cash Flow" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Operating Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash from Donations</span>
                  <span className="font-medium text-green-600">+₹2,80,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Expenses</span>
                  <span className="font-medium text-red-600">-₹1,28,000</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Net Operating Cash</span>
                  <span className="text-green-600">₹1,52,000</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investing Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Asset Purchases</span>
                  <span className="font-medium text-red-600">-₹25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Income</span>
                  <span className="font-medium text-green-600">+₹8,000</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Net Investing Cash</span>
                  <span className="text-red-600">-₹17,000</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Beginning Balance</span>
                  <span className="font-medium">₹3,45,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Change</span>
                  <span className="font-medium text-green-600">+₹1,35,000</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Ending Balance</span>
                  <span className="text-blue-600">₹4,80,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donation-summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donor Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle>Donor Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={donorSegmentation}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ segment, amount }) => `${segment.split(' ')[0]} ₹${(amount/1000).toFixed(0)}k`}
                    >
                      {donorSegmentation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Local (Within City)</span>
                    <div className="text-right">
                      <div className="font-semibold">₹1,68,000</div>
                      <div className="text-sm text-gray-600">60%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Regional (State)</span>
                    <div className="text-right">
                      <div className="font-semibold">₹84,000</div>
                      <div className="text-sm text-gray-600">30%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">National</span>
                    <div className="text-right">
                      <div className="font-semibold">₹28,000</div>
                      <div className="text-sm text-gray-600">10%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Source Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Donation Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">Web Gateway</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-2">₹1,25,000</p>
                  <p className="text-sm text-gray-600">45% of total</p>
                  <p className="text-sm text-green-600 mt-1">+15% growth</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">Hundi Collections</h4>
                  <p className="text-2xl font-bold text-green-600 mt-2">₹85,000</p>
                  <p className="text-sm text-gray-600">30% of total</p>
                  <p className="text-sm text-green-600 mt-1">+8% growth</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">In-Temple</h4>
                  <p className="text-2xl font-bold text-purple-600 mt-2">₹70,000</p>
                  <p className="text-sm text-gray-600">25% of total</p>
                  <p className="text-sm text-green-600 mt-1">+12% growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};