import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, IndianRupee, Banknote } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const FinanceDashboard = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    const { data: donationList } = await supabase.from("donations").select("*").order("received_at", { ascending: false }).limit(10);
    setDonations(donationList || []);
    const { data: expenseList } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false }).limit(10);
    setExpenses(expenseList || []);
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time subscriptions
    const donationsSub = supabase.channel('donations-dashboard').on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchDashboardData).subscribe();
    const expensesSub = supabase.channel('expenses-dashboard').on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchDashboardData).subscribe();

    return () => {
      supabase.removeChannel(donationsSub);
      supabase.removeChannel(expensesSub);
    };
  }, []);

  const totalDonations = donations.reduce((sum, d) => sum + (d.net_amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netAmount = totalDonations - totalExpenses;

  const recentTransactions = [
    ...donations.slice(0, 5).map((d) => ({ id: d.id, type: "donation" as const, amount: d.net_amount, description: `${d.donor_name || "Anonymous"} - ${d.source}`, date: d.received_at, status: d.status })),
    ...expenses.slice(0, 5).map((e) => ({ id: e.id, type: "expense" as const, amount: e.amount, description: `${e.description} - ${e.vendor_name}`, date: e.expense_date, status: e.status })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><IndianRupee className="h-5 w-5 text-green-600" /> Total Donations</CardTitle></CardHeader>
          <CardContent><span className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</span></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="h-5 w-5 text-red-600" /> Total Expenses</CardTitle></CardHeader>
          <CardContent><span className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</span></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-600" /> Net Balance</CardTitle></CardHeader>
          <CardContent><span className="text-2xl font-bold">₹{netAmount.toLocaleString()}</span></CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full border rounded-lg">
              <thead>
                <tr><th>Description</th><th>Date</th><th>Type</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t">
                    <td>{transaction.description}</td>
                    <td>{transaction.date ? new Date(transaction.date).toLocaleDateString() : ""}</td>
                    <td><Badge variant={transaction.type === "donation" ? "default" : "secondary"}>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</Badge></td>
                    <td>{transaction.type === "donation" ? "+" : "-"}₹{transaction.amount?.toLocaleString()}</td>
                    <td><Badge variant={transaction.status === "completed" || transaction.status === "approved" ? "default" : transaction.status === "pending" ? "secondary" : "destructive"}>{transaction.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
