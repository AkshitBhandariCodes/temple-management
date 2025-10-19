import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "../../utils/supabaseClient";

export const ReconciliationTab = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    supabase.from("donations").select("*").then(({ data }) => setDonations(data ?? []));
    supabase.from("expenses").select("*").then(({ data }) => setExpenses(data ?? [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();

    // Real-time subscriptions for both tables
    const donationsSub = supabase.channel('donations-recon').on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchData).subscribe();
    const expensesSub = supabase.channel('expenses-recon').on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(donationsSub);
      supabase.removeChannel(expensesSub);
    };
  }, []);

  const getReconciliationItems = () => {
    return donations.map((d) => ({
      id: d.id,
      type: "donation",
      matched: expenses.some((e) => Math.abs(e.amount - d.net_amount) < 1 && e.expense_date === d.received_at?.split("T")[0]),
      amount: d.net_amount,
      date: d.received_at?.split("T")[0],
      description: d.donor_name || "Anonymous",
      status: d.status,
    }));
  };

  const handleMarkRefunded = async (donationId: string) => {
    await supabase.from("donations").update({ status: "refunded" }).eq("id", donationId);
    await supabase.from("timeline").insert([{
      event_type: "donation_refunded",
      entity: "donations",
      entity_id: donationId,
      created_at: new Date().toISOString(),
    }]);
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader><CardTitle>Reconciliation Status</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full border rounded-lg">
            <thead>
              <tr><th>Type</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {getReconciliationItems().map((item) => (
                <tr key={item.id} className="border-t">
                  <td>{item.type}</td>
                  <td>{item.description}</td>
                  <td>₹{item.amount}</td>
                  <td>{item.date}</td>
                  <td>
                    <Badge variant={item.status === "refunded" ? "destructive" : item.matched ? "default" : "secondary"}>
                      {item.status === "refunded" ? "Refunded" : item.matched ? "Matched" : "Unmatched"}
                    </Badge>
                  </td>
                  <td>
                    {!item.matched && item.status !== "refunded" && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkRefunded(item.id)}>Mark as Refunded</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
