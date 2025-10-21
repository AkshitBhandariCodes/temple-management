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
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const { data: todaysDonations } = await supabase
        .from("donations")
        .select("net_amount")
        .gte("received_date", `${todayStr}T00:00:00`)
        .lte("received_date", `${todayStr}T23:59:59`);

      setTodaysTotal(
        (todaysDonations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0)
      );

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

      const { data: monthsDonations } = await supabase
        .from("donations")
        .select("net_amount")
        .gte("received_date", `${monthStart}T00:00:00`)
        .lte("received_date", `${monthEnd}T23:59:59`);

      setMonthsTotal(
        (monthsDonations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0)
      );

      const { data: pending } = await supabase
        .from("donations")
        .select("id", { count: "exact" })
        .eq("reconciled", false);

      setPendingReconciliation(pending?.length ?? 0);

      const { data: budgetRequests } = await supabase
        .from("budgets")
        .select("id", { count: "exact" })
        .eq("status", "pending");

      setPendingBudgets(budgetRequests?.length ?? 0);
    };

    fetchStats();

    const donationsSub = supabase
      .channel("donations-header")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, fetchStats)
      .subscribe();

    const budgetsSub = supabase
      .channel("budgets-header")
      .on("postgres_changes", { event: "*", schema: "public", table: "budgets" }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(donationsSub);
      supabase.removeChannel(budgetsSub);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Donations</p>
              <p className="text-2xl font-bold mt-1">₹{todaysTotal.toLocaleString()}</p>
            </div>
            <IndianRupee className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month's Total</p>
              <p className="text-2xl font-bold mt-1">₹{monthsTotal.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Reconciliation</p>
              <p className="text-2xl font-bold mt-1">{pendingReconciliation}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Budget Requests</p>
              <p className="text-2xl font-bold mt-1">{pendingBudgets}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
