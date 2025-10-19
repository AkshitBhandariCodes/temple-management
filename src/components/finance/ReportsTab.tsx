import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "../../utils/supabaseClient";
import Papa from "papaparse"; // Ensure you run: npm install papaparse

export const ReportsTab = () => {
  const [reportType, setReportType] = useState("income-statement");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Fetch summary and raw records
  useEffect(() => {
    const fetchReport = async () => {
      if (!fromDate || !toDate) return;
      // Donations query
      const { data: donations } = await supabase
        .from("donations")
        .select("*")
        .gte("received_at", fromDate)
        .lte("received_at", toDate);
      // Expenses query
      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .gte("expense_date", fromDate)
        .lte("expense_date", toDate);

      setTotalIncome((donations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0));
      setTotalExpense((expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0));

      // Compose report
      setReportData([
        ...(donations || []).map((d) => ({
          type: "Donation",
          amount: d.net_amount,
          source: d.source,
          provider: d.provider,
          donor: d.donor_name,
          date: d.received_at,
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
    };
    fetchReport();
  }, [reportType, fromDate, toDate]);

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "finance_report.csv";
    link.click();
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Finance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-max"><SelectValue>Report Type</SelectValue></SelectTrigger>
              <SelectContent>
                <SelectItem value="income-statement">Income Statement</SelectItem>
                <SelectItem value="cash-flow">Cash Flow</SelectItem>
                <SelectItem value="donor-report">Donor Report</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              placeholder="From Date"
            />
            <Input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              placeholder="To Date"
            />
            <Button onClick={handleDownloadCSV} disabled={!reportData.length}>
              Download CSV
            </Button>
          </div>
          <div className="space-y-2">
            <div>Total Income: <span className="font-bold">₹{totalIncome}</span></div>
            <div>Total Expense: <span className="font-bold">₹{totalExpense}</span></div>
            <div>Net: <span className="font-bold">₹{totalIncome - totalExpense}</span></div>
          </div>
          {/* Optionally display data preview */}
          <div className="overflow-x-auto mt-4">
            {(reportData.length > 0) && (
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    {Object.keys(reportData[0]).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-2 py-1">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
