import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const [budgets, setBudgets] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newBudget, setNewBudget] = useState<any>({
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

    // Real-time subscription
    const subscription = supabase
      .channel('budgets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, () => {
        fetchBudgets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleCreateBudget = async () => {
    setLoading(true);
    const { error } = await supabase.from("budgets").insert([{
      title: newBudget.title,
      purpose: newBudget.purpose,
      budgeted_amount: parseFloat(newBudget.budgeted_amount),
      period: newBudget.period,
      status: newBudget.status,
      description: newBudget.description,
    }]);
    if (error) setError(error.message);
    setShowAddModal(false);
    setNewBudget({ title: "", purpose: "", budgeted_amount: "", period: "monthly", status: "pending", description: "" });
    setLoading(false);
  };

  const handleApproveBudget = async (budgetId: string) => {
    await supabase.from("budgets").update({ status: "approved", decided_at: new Date().toISOString() }).eq("id", budgetId);
    await supabase.from("timeline").insert([{
      event_type: "budget_approved",
      entity: "budgets",
      entity_id: budgetId,
      created_at: new Date().toISOString(),
    }]);
  };

  const handleRejectBudget = async (budgetId: string) => {
    await supabase.from("budgets").update({ status: "rejected", decided_at: new Date().toISOString() }).eq("id", budgetId);
    await supabase.from("timeline").insert([{
      event_type: "budget_rejected",
      entity: "budgets",
      entity_id: budgetId,
      created_at: new Date().toISOString(),
    }]);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-end">
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Add Budget</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Budget</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newBudget.title} onChange={e => setNewBudget({ ...newBudget, title: e.target.value })} />
              <Label>Purpose</Label>
              <Input value={newBudget.purpose} onChange={e => setNewBudget({ ...newBudget, purpose: e.target.value })} />
              <Label>Budgeted Amount</Label>
              <Input type="number" value={newBudget.budgeted_amount} onChange={e => setNewBudget({ ...newBudget, budgeted_amount: e.target.value })} />
              <Label>Period</Label>
              <Select value={newBudget.period} onValueChange={v => setNewBudget({ ...newBudget, period: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Label>Description</Label>
              <Textarea value={newBudget.description} onChange={e => setNewBudget({ ...newBudget, description: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleCreateBudget}>Add Budget</Button>
            </div>
            {error && <p className="text-destructive mt-2">{error}</p>}
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border rounded-lg">
          <thead>
            <tr><th>Title</th><th>Purpose</th><th>Amount</th><th>Status</th><th>Period</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {budgets.map((budget: any) => (
              <tr key={budget.id} className="border-t">
                <td>{budget.title}</td>
                <td>{budget.purpose}</td>
                <td>₹{budget.budgeted_amount}</td>
                <td><Badge variant={budget.status === "approved" ? "default" : budget.status === "pending" ? "secondary" : "destructive"}>{budget.status}</Badge></td>
                <td>{budget.period}</td>
                <td>
                  {budget.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApproveBudget(budget.id)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRejectBudget(budget.id)}>Reject</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
