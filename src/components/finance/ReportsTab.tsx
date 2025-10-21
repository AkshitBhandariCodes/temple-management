import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "../../utils/supabaseClient";

export const ReportsTab = () => {
  const [selectedReportType, setSelectedReportType] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedCommunity, setSelectedCommunity] = useState("all");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: "income-statement", name: "Income Statement", icon: BarChart3 },
    { id: "cash-flow", name: "Cash Flow Report", icon: TrendingUp },
    { id: "donor-report", name: "Donor Report", icon: Users },
    { id: "community-summary", name: "Community Financial Summary", icon: PieChart },
    { id: "tax-report", name: "Tax Report (80G)", icon: FileText },
  ];

  const quickReports = [
    { name: "Monthly Summary", period: "Current Month", description: "Complete financial summary for the current month" },
    { name: "Quarterly Report", period: "Current Quarter", description: "Quarterly financial performance report" },
    { name: "Annual Report", period: "Current Year", description: "Annual financial statement and summary" },
    { name: "Top Donors", period: "Last 12 Months", description: "List of top donors and their contributions" },
  ];

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchReport();
    }
  }, [dateRange.from, dateRange.to, selectedReportType]);

  const fetchReport = async () => {
    if (!dateRange.from || !dateRange.to) return;
    setLoading(true);

    const { data: donations } = await supabase
      .from("donations")
      .select("*")
      .gte("received_date", dateRange.from)
      .lte("received_date", dateRange.to);

    const { data: expenses } = await supabase
      .from("expenses")
      .select("*")
      .gte("expense_date", dateRange.from)
      .lte("expense_date", dateRange.to);

    setTotalIncome((donations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0));
    setTotalExpense((expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0));

    setReportData([
      ...(donations || []).map((d) => ({
        type: "Donation",
        amount: d.net_amount,
        source: d.source,
        provider: d.provider,
        donor: d.donor_name,
        date: d.received_date,
        status: d.status,
      })),
      ...(expenses || []).map((e) => ({
        type: "Expense",
        amount: e.amount,
        category: e.category,
        vendor: e.vendor_name,
        date: e.expense_date,
        status: e.status,
      })),
    ]);

    setLoading(false);
  };

  const handleDownloadCSV = () => {
    const headers = Object.keys(reportData[0] || {});
    const csvRows = [
      headers.join(","),
      ...reportData.map((row) => headers.map((header) => JSON.stringify(row[header] || "")).join(",")),
    ];
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `finance_report_${dateRange.from}_${dateRange.to}.csv`;
    link.click();
  };

  const generateReport = () => {
    console.log("Generating report:", {
      type: selectedReportType,
      dateRange,
      community: selectedCommunity,
      format: reportFormat,
    });
    fetchReport();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickReports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-xs text-gray-500">{report.description}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" /> Generate
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportTypes.map((type) => (
              <div
                key={type.id}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedReportType === type.id ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedReportType(type.id)}
              >
                <div className="flex items-center gap-3">
                  <type.icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{type.name}</p>
                    <p className="text-xs text-gray-500">
                      {type.id === "income-statement" && "Comprehensive income and expense statement with period comparisons"}
                      {type.id === "cash-flow" && "Cash flow analysis showing money movement and liquidity"}
                      {type.id === "donor-report" && "Detailed donor analysis with contribution patterns and trends"}
                      {type.id === "community-summary" && "Financial summary broken down by community activities"}
                      {type.id === "tax-report" && "80G tax exemption report for compliance and donor receipts"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Report Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>From Date</Label>
              <Input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} />
            </div>
            <div>
              <Label>To Date</Label>
              <Input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Community</Label>
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communities</SelectItem>
                  <SelectItem value="main">Main Temple</SelectItem>
                  <SelectItem value="youth">Youth Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Format</Label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={generateReport}>
              <FileText className="w-4 h-4 mr-1" /> Generate Report
            </Button>
            <Button variant="outline" onClick={handleDownloadCSV} disabled={reportData.length === 0}>
              <Download className="w-4 h-4 mr-1" /> Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Total Income</div>
                  <div className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Total Expense</div>
                  <div className="text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Net</div>
                  <div className="text-2xl font-bold">₹{(totalIncome - totalExpense).toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>
            <div className="text-sm text-gray-500 mb-2">Showing {reportData.length} transactions</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
