import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, TrendingUp, Clock, FileText } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const FinanceHeader = () => {
  const [todaysTotal, setTodaysTotal] = useState(0);
  const [monthsTotal, setMonthsTotal] = useState(0);
  const [pendingReconciliation, setPendingReconciliation] = useState(0);
  const [pendingBudgets, setPendingBudgets] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      // Today's Donations
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);

      const { data: todaysDonations } = await supabase
        .from("donations")
        .select("net_amount")
        .eq("received_at", todayStr);
      setTodaysTotal(
        (todaysDonations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0)
      );
      // This Month's Total
      const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1)
        .padStart(2, "0")}-01`;
      const monthEnd = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-31`;

      const { data: monthsDonations } = await supabase
        .from("donations")
        .select("net_amount")
        .gte("received_at", monthStart)
        .lte("received_at", monthEnd);
      setMonthsTotal(
        (monthsDonations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0)
      );

      // Pending Reconciliation (dummy = count pending donations)
      const { data: pending } = await supabase
        .from("donations")
        .select("id", { count: "exact" })
        .eq("reconciled", false);
      setPendingReconciliation(pending?.length ?? 0);

      // Pending Budget Requests
      const { data: budgetRequests } = await supabase
        .from("budgets")
        .select("id", { count: "exact" })
        .eq("status", "pending");
      setPendingBudgets(budgetRequests?.length ?? 0);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
      </div>
      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <IndianRupee className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Donations</p>
              <p className="text-xl font-semibold text-gray-900">
                ₹{todaysTotal.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month's Total</p>
              <p className="text-xl font-semibold text-gray-900">
                ₹{monthsTotal.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Reconciliation</p>
              <p className="text-xl font-semibold text-gray-900">
                {pendingReconciliation}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget Requests</p>
              <p className="text-xl font-semibold text-gray-900">
                {pendingBudgets}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
