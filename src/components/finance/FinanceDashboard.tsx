import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, IndianRupee, CreditCard, Banknote } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const FinanceDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [timeRange, setTimeRange] = useState("month");

  const fetchDashboardData = async () => {
    const { data: donationList } = await supabase
      .from("donations")
      .select("*")
      .order("received_date", { ascending: false })
      .limit(10);
    setDonations(donationList || []);

    const { data: expenseList } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false })
      .limit(10);
    setExpenses(expenseList || []);
  };

  useEffect(() => {
    fetchDashboardData();
    
    const donationsSub = supabase
      .channel("donations-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, fetchDashboardData)
      .subscribe();
    
    const expensesSub = supabase
      .channel("expenses-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, fetchDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(donationsSub);
      supabase.removeChannel(expensesSub);
    };
  }, []);

  const totalDonations = donations.reduce((sum, d) => sum + (d.net_amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netAmount = totalDonations - totalExpenses;

  const recentTransactions = [
    ...donations.slice(0, 5).map((d) => ({
      id: d.id,
      type: "donation" as const,
      donorName: d.donor_name || "Anonymous",
      description: d.donor_name || "Anonymous",
      source: d.source,
      provider: d.provider,
      netAmount: d.net_amount,
      amount: d.net_amount,
      receivedDate: d.received_date,
      date: d.received_date,
      status: d.status,
    })),
    ...expenses.slice(0, 5).map((e) => ({
      id: e.id,
      type: "expense" as const,
      description: e.description,
      category: e.category,
      vendorName: e.vendor_name,
      amount: e.amount,
      entryDate: e.expense_date,
      date: e.expense_date,
      status: e.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{netAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64"></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    {transaction.type === "donation" ? transaction.donorName : transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.type === "donation"
                      ? `${transaction.source} • ${transaction.provider}`
                      : `${transaction.category} • ${transaction.vendorName}`}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className={`font-semibold ${transaction.type === "donation" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "donation" ? "+" : "-"}₹
                    {transaction.amount?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.date ? new Date(transaction.date).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-400">No recent transactions</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
