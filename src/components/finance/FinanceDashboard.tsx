import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, IndianRupee, Banknote } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const FinanceDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const fetchDashboardData = async () => {
    const { data: donationList } = await supabase
      .from("donations")
      .select("*")
      .order("received_at", { ascending: false })
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
  }, []);

  useEffect(() => {
    const donationsSub = supabase
      .channel("donations-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const expensesSub = supabase
      .channel("expenses-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(donationsSub);
      supabase.removeChannel(expensesSub);
    };
  }, []);

  const totalDonations = donations.reduce((sum, d) => sum + (d.net_amount || 0), 0);
  // Only count approved and paid expenses, exclude rejected
  const totalExpenses = expenses
    .filter(e => e.status !== 'rejected')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Donations</div>
                <div className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Banknote className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Expenses</div>
                <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Net Balance</div>
                <div className="text-2xl font-bold">
                  ₹{(totalDonations - totalExpenses).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donations.map((donation) => (
                <div key={donation.id} className="flex justify-between items-center pb-3 border-b last:border-0">
                  <div>
                    <div className="font-medium">{donation.donor_name || "Anonymous"}</div>
                    <div className="text-sm text-gray-500">
                      {donation.received_at ? new Date(donation.received_at).toLocaleDateString() : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{(donation.net_amount || 0).toLocaleString()}</div>
                    <Badge className="bg-green-100 text-green-800 text-xs">{donation.source}</Badge>
                  </div>
                </div>
              ))}
              {donations.length === 0 && (
                <div className="text-center py-8 text-gray-500">No recent donations</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center pb-3 border-b last:border-0">
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-gray-500">
                      {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString() : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{(expense.amount || 0).toLocaleString()}</div>
                    <Badge
                      className={
                        expense.status === "approved"
                          ? "bg-green-100 text-green-800 text-xs"
                          : expense.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 text-xs"
                          : "bg-red-100 text-red-800 text-xs"
                      }
                    >
                      {expense.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="text-center py-8 text-gray-500">No recent expenses</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
