import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Calendar, BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from "../../utils/supabaseClient";

export const ReportsTab = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [reportFormat, setReportFormat] = useState('csv');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'income-statement', name: 'Income Statement', icon: BarChart3 },
    { id: 'cash-flow', name: 'Cash Flow Report', icon: TrendingUp },
    { id: 'donor-report', name: 'Donor Report', icon: Users },
    { id: 'community-summary', name: 'Community Financial Summary', icon: PieChart },
  ];

  const quickReports = [
    { name: 'Monthly Summary', period: 'Current Month', value: 'monthly' },
    { name: 'Quarterly Report', period: 'Current Quarter', value: 'quarterly' },
    { name: 'Annual Report', period: 'Current Year', value: 'annual' },
    { name: 'Top Donors', period: 'Last 12 Months', value: 'top-donors' }
  ];

  const getDateRangeForPeriod = (period) => {
    const today = new Date();
    let from, to;

    switch(period) {
      case 'monthly':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'quarterly':
        const quarter = Math.floor(today.getMonth() / 3);
        from = new Date(today.getFullYear(), quarter * 3, 1);
        to = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'annual':
        from = new Date(today.getFullYear(), 0, 1);
        to = new Date(today.getFullYear(), 11, 31);
        break;
      case 'top-donors':
        from = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        to = today;
        break;
      default:
        return null;
    }

    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    };
  };

  const handleQuickReport = (period) => {
    const range = getDateRangeForPeriod(period);
    setDateRange(range);
    setTimeout(() => generateReport(range.from, range.to), 100);
  };

  const generateReport = async (fromDate = dateRange.from, toDate = dateRange.to) => {
  if (!fromDate || !toDate) {
    alert("Please select date range");
    return;
  }

  setLoading(true);

  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .gte('received_at', `${fromDate}T00:00:00`)
    .lte('received_at', `${toDate}T23:59:59`);

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .gte('expense_date', `${fromDate}T00:00:00`)
    .lte('expense_date', `${toDate}T23:59:59`);

  // Filter out rejected expenses
  const validExpenses = (expenses || []).filter(e => e.status !== 'rejected');

  const totalDonations = (donations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0);
  const totalExpenses = validExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netIncome = totalDonations - totalExpenses;

  setReportData({
    donations: donations || [],
    expenses: validExpenses,  // Use filtered expenses
    totalDonations,
    totalExpenses,
    netIncome,
    fromDate,
    toDate,
  });

  setLoading(false);
};


  const downloadReport = () => {
    if (!reportData) {
      alert("Please generate a report first");
      return;
    }

    // Create comprehensive CSV with all details
    let csv = "Finance Report\n";
    csv += `Period: ${reportData.fromDate} to ${reportData.toDate}\n\n`;
    csv += "=== SUMMARY ===\n";
    csv += `Total Donations,${reportData.totalDonations}\n`;
    csv += `Total Expenses,${reportData.totalExpenses}\n`;
    csv += `Net Income,${reportData.netIncome}\n\n`;
    
    csv += "=== DONATIONS ===\n";
    csv += "Date,Donor,Amount,Source,Provider,Status\n";
    reportData.donations.forEach(d => {
      csv += `${d.received_at || ''},${d.donor_name || 'Anonymous'},${d.net_amount},${d.source || ''},${d.provider || ''},${d.status}\n`;
    });
    
    csv += "\n=== EXPENSES ===\n";
    csv += "Date,Description,Vendor,Amount,Category,Status\n";
    reportData.expenses.forEach(e => {
      csv += `${e.expense_date || ''},${e.description || ''},${e.vendor_name || ''},${e.amount},${e.category || ''},${e.status}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `finance_report_${reportData.fromDate}_to_${reportData.toDate}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  selectedReportType === type.id ? 'border-blue-500 shadow-md' : 'hover:shadow-sm'
                }`}
                onClick={() => setSelectedReportType(type.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-medium">{type.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {type.id === 'income-statement' && 'Comprehensive income and expense statement with period comparisons'}
                    {type.id === 'cash-flow' && 'Cash flow analysis showing money movement and liquidity'}
                    {type.id === 'donor-report' && 'Detailed donor analysis with contribution patterns and trends'}
                    {type.id === 'community-summary' && 'Financial summary broken down by community activities'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Reports */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickReports.map((report) => (
            <Card key={report.name} className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{report.period}</p>
                  </div>
                  <Badge variant="outline">{report.period}</Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => handleQuickReport(report.value)}
                >
                  <Download className="w-3 h-3 mr-1" /> Generate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div>
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <div>
              <Label>Format</Label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => generateReport()} disabled={loading || !dateRange.from || !dateRange.to}>
                <BarChart3 className="w-4 h-4 mr-2" /> Generate
              </Button>
              <Button onClick={downloadReport} disabled={!reportData} variant="outline">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
          </div>

          {/* Report Preview */}
          {reportData && (
            <div className="mt-6 border-t pt-6">
              <h4 className="text-lg font-semibold mb-4">Report Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Total Donations</div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{reportData.totalDonations.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Total Expenses</div>
                    <div className="text-2xl font-bold text-red-600">
                      ₹{reportData.totalExpenses.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Net Income</div>
                    <div className={`text-2xl font-bold ${reportData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{reportData.netIncome.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Donations ({reportData.donations.length})</h5>
                  <div className="border rounded max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="p-2 text-left">Donor</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.donations.map((d) => (
                          <tr key={d.id} className="border-t">
                            <td className="p-2">{d.donor_name || 'Anonymous'}</td>
                            <td className="p-2 text-right">₹{d.net_amount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Expenses ({reportData.expenses.length})</h5>
                  <div className="border rounded max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="p-2 text-left">Description</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.expenses.map((e) => (
                          <tr key={e.id} className="border-t">
                            <td className="p-2">{e.description}</td>
                            <td className="p-2 text-right">₹{e.amount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
