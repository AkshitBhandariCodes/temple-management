import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, TrendingUp, Clock, FileText } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const FinanceHeader = () => {
  const [todaysTotal, setTodaysTotal] = useState(0);
  const [monthsTotal, setMonthsTotal] = useState(0);
  const [pendingReconciliation, setPendingReconciliation] = useState(0);
  const [pendingBudgets, setPendingBudgets] = useState(0);

  const fetchStats = async () => {
    try {
      // Today's Donations
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);

      const { data: todaysDonations } = await supabase
        .from("donations")
        .select("net_amount")
        .gte("received_at", `${todayStr}T00:00:00`)
        .lte("received_at", `${todayStr}T23:59:59`);

      setTodaysTotal((todaysDonations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0));

      // This Month's Total
      const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);

      const { data: monthsDonations } = await supabase
        .from("donations")
        .select("net_amount")
        .gte("received_at", `${monthStart}T00:00:00`)
        .lte("received_at", `${monthEnd}T23:59:59`);

      setMonthsTotal((monthsDonations || []).reduce((sum, d) => sum + (d.net_amount || 0), 0));

      // Pending Reconciliation - get ALL donations, then filter
      const { data: allDonations, error: donError } = await supabase
        .from("donations")
        .select("id, reconciled");

      if (donError) {
        console.error("Error fetching donations:", donError);
      } else {
        const unreconciledCount = (allDonations || []).filter(
          d => d.reconciled === false || d.reconciled === null || d.reconciled === undefined
        ).length;
        setPendingReconciliation(unreconciledCount);
        console.log("Pending reconciliation updated:", unreconciledCount);
      }

      // Pending Budgets - get ALL budgets, then filter
      const { data: allBudgets, error: budError } = await supabase
        .from("budgets")
        .select("id, status");

      if (budError) {
        console.error("Error fetching budgets:", budError);
      } else {
        const pendingCount = (allBudgets || []).filter(
          b => b.status === "pending"
        ).length;
        setPendingBudgets(pendingCount);
        console.log("Pending budgets updated:", pendingCount);
      }
    } catch (error) {
      console.error("Error in fetchStats:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, []);

  // Polling every 3 seconds (backup mechanism)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Real-time subscriptions (primary mechanism)
  useEffect(() => {
    const donationsSub = supabase
      .channel("header-donations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations" },
        (payload) => {
          console.log("Donation change detected:", payload);
          fetchStats();
        }
      )
      .subscribe((status) => {
        console.log("Donations subscription status:", status);
      });

    const budgetsSub = supabase
      .channel("header-budgets-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "budgets" },
        (payload) => {
          console.log("Budget change detected:", payload);
          fetchStats();
        }
      )
      .subscribe((status) => {
        console.log("Budgets subscription status:", status);
      });

    return () => {
      supabase.removeChannel(donationsSub);
      supabase.removeChannel(budgetsSub);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Today's Total</div>
              <div className="text-lg font-bold">₹{todaysTotal.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">This Month</div>
              <div className="text-lg font-bold">₹{monthsTotal.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Pending Reconciliation</div>
              <div className="text-lg font-bold">{pendingReconciliation}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Pending Budgets</div>
              <div className="text-lg font-bold">{pendingBudgets}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
