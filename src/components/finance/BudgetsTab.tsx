import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const BudgetsTab = () => {
  const [budgets, setBudgets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [newBudget, setNewBudget] = useState({
    title: "",
    purpose: "",
    budgeted_amount: "",
    period: "monthly",
    status: "pending",
    description: "",
  });

  const fetchBudgets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("budgets").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    setBudgets(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
    const subscription = supabase
      .channel("budgets-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "budgets" }, () => {
        fetchBudgets();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleCreateBudget = async () => {
    setLoading(true);
    const { error } = await supabase.from("budgets").insert([
      {
        title: newBudget.title,
        purpose: newBudget.purpose,
        budgeted_amount: parseFloat(newBudget.budgeted_amount),
        period: newBudget.period,
        status: newBudget.status,
        description: newBudget.description,
      },
    ]);
    if (error) setError(error.message);
    setShowAddModal(false);
    setNewBudget({ title: "", purpose: "", budgeted_amount: "", period: "monthly", status: "pending", description: "" });
    setLoading(false);
  };

  const handleApproveBudget = async (budgetId) => {
    await supabase.from("budgets").update({ status: "approved", decided_at: new Date().toISOString() }).eq("id", budgetId);
    await supabase.from("timeline").insert([
      {
        event_type: "budget_approved",
        entity: "budgets",
        entity_id: budgetId,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleRejectBudget = async (budgetId) => {
    await supabase.from("budgets").update({ status: "rejected", decided_at: new Date().toISOString() }).eq("id", budgetId);
    await supabase.from("timeline").insert([
      {
        event_type: "budget_rejected",
        entity: "budgets",
        entity_id: budgetId,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <CardTitle className="text-lg">Review and approve budget requests from communities</CardTitle>
        <Button onClick={() => setShowAddModal(true)}><Plus className="mr-1" />Add Budget</Button>
      </div>
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Title</Label>
            <Input value={newBudget.title} onChange={e => setNewBudget({ ...newBudget, title: e.target.value })} />
            <Label>Purpose</Label>
            <Input value={newBudget.purpose} onChange={e => setNewBudget({ ...newBudget, purpose: e.target.value })} />
            <Label>Budgeted Amount</Label>
            <Input type="number" value={newBudget.budgeted_amount} onChange={e => setNewBudget({ ...newBudget, budgeted_amount: e.target.value })} />
            <Label>Period</Label>
            <Select value={newBudget.period} onValueChange={v => setNewBudget({ ...newBudget, period: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Label>Description</Label>
            <Textarea value={newBudget.description} onChange={e => setNewBudget({ ...newBudget, description: e.target.value })} />
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleCreateBudget}>Add Budget</Button>
            </div>
            {error && <div className="text-red-600 pt-2">{error}</div>}
          </div>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Period</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td>{budget.title}</td>
                  <td>{budget.purpose}</td>
                  <td>₹{budget.budgeted_amount}</td>
                  <td>{budget.status}</td>
                  <td>{budget.period}</td>
                  <td>
                    {budget.status === "pending" && (
                      <>
                        <Button size="sm" variant="success" onClick={() => handleApproveBudget(budget.id)}>Approve</Button>{" "}
                        <Button size="sm" variant="destructive" onClick={() => handleRejectBudget(budget.id)}>Reject</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {budgets.length === 0 && (
            <div className="py-6 text-center text-gray-500">No budget requests found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
