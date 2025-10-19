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

export const ExpensesTab = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newExpense, setNewExpense] = useState<any>({
    description: "",
    vendor_name: "",
    receipt_number: "",
    amount: "",
    category: "maintenance",
    expense_date: "",
    notes: "",
  });

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    let query = supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    if (categoryFilter !== "all") query = query.eq("category", categoryFilter);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    const { data, error } = await query;
    if (error) setError(error.message);
    setExpenses(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();

    // Real-time subscription
    const subscription = supabase
      .channel('expenses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        fetchExpenses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [categoryFilter, statusFilter]);

  const handleCreateExpense = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.from("expenses").insert([{
      description: newExpense.description,
      vendor_name: newExpense.vendor_name,
      receipt_number: newExpense.receipt_number,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      expense_date: newExpense.expense_date,
      notes: newExpense.notes,
      status: "pending",
    }]);
    if (error) {
      setError(error.message);
    } else if (data && data[0]?.id) {
      await supabase.from("timeline").insert([{
        event_type: "expense_inserted",
        entity: "expenses",
        entity_id: data[0].id,
        details: newExpense,
        created_at: new Date().toISOString(),
      }]);
    }
    setShowAddModal(false);
    setNewExpense({ description: "", vendor_name: "", receipt_number: "", amount: "", category: "maintenance", expense_date: "", notes: "" });
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-max"><SelectValue>Category</SelectValue></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="salaries">Salaries</SelectItem>
            <SelectItem value="materials">Materials</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-max"><SelectValue>Status</SelectValue></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
              <Label>Vendor Name</Label>
              <Input value={newExpense.vendor_name} onChange={e => setNewExpense({...newExpense, vendor_name: e.target.value})} />
              <Label>Receipt Number</Label>
              <Input value={newExpense.receipt_number} onChange={e => setNewExpense({...newExpense, receipt_number: e.target.value})} />
              <Label>Amount</Label>
              <Input type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
              <Label>Category</Label>
              <Select value={newExpense.category} onValueChange={v => setNewExpense({...newExpense, category: v})}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="salaries">Salaries</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Label>Date</Label>
              <Input type="date" value={newExpense.expense_date} onChange={e => setNewExpense({...newExpense, expense_date: e.target.value})} />
              <Label>Notes</Label>
              <Textarea value={newExpense.notes} onChange={e => setNewExpense({...newExpense, notes: e.target.value})} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleCreateExpense}>Add Expense</Button>
            </div>
            {error && <p className="text-destructive mt-2">{error}</p>}
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border rounded-lg">
          <thead>
            <tr><th>Description</th><th>Vendor</th><th>Amount</th><th>Category</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {expenses.map((expense: any) => (
              <tr key={expense.id} className="border-t">
                <td>{expense.description}</td>
                <td>{expense.vendor_name}</td>
                <td>₹{expense.amount}</td>
                <td>{expense.category}</td>
                <td><Badge variant={expense.status === "approved" ? "default" : expense.status === "pending" ? "secondary" : "destructive"}>{expense.status}</Badge></td>
                <td>{expense.expense_date ? new Date(expense.expense_date).toLocaleDateString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
