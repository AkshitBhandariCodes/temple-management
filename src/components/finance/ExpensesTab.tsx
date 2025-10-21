import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Eye, Download, Check, X, Paperclip } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const ExpensesTab = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newExpense, setNewExpense] = useState({
    description: "",
    vendor_name: "",
    receipt_number: "",
    amount: "",
    category: "maintenance",
    expense_date: "",
    notes: "",
    community_id: "",
    event_id: "",
    receipt_attached: false,
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
    const subscription = supabase
      .channel("expenses-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, () => {
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
    const { data, error } = await supabase.from("expenses").insert([
      {
        description: newExpense.description,
        vendor_name: newExpense.vendor_name,
        receipt_number: newExpense.receipt_number,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        expense_date: newExpense.expense_date,
        notes: newExpense.notes,
        community_id: newExpense.community_id || null,
        event_id: newExpense.event_id || null,
        receipt_attached: newExpense.receipt_attached,
        status: "pending",
      },
    ]).select();
    
    if (error) {
      setError(error.message);
    } else if (data && data[0]?.id) {
      await supabase.from("timeline").insert([
        {
          event_type: "expense_created",
          entity: "expenses",
          entity_id: data[0].id,
          created_at: new Date().toISOString(),
        },
      ]);
      setShowAddModal(false);
      setNewExpense({
        description: "",
        vendor_name: "",
        receipt_number: "",
        amount: "",
        category: "maintenance",
        expense_date: "",
        notes: "",
        community_id: "",
        event_id: "",
        receipt_attached: false,
      });
    }
    setLoading(false);
  };

  const handleApproveExpense = async (expenseId) => {
    await supabase.from("expenses").update({ status: "approved", approval_date: new Date().toISOString() }).eq("id", expenseId);
    await supabase.from("timeline").insert([
      {
        event_type: "expense_approved",
        entity: "expenses",
        entity_id: expenseId,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleRejectExpense = async (expenseId) => {
    await supabase.from("expenses").update({ status: "rejected", approval_date: new Date().toISOString() }).eq("id", expenseId);
    await supabase.from("timeline").insert([
      {
        event_type: "expense_rejected",
        entity: "expenses",
        entity_id: expenseId,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      searchTerm === "" ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search expenses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add Expense
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4">Expense Details</th>
                  <th className="p-4">Amount & Category</th>
                  <th className="p-4">Association</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Receipt & Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-xs text-gray-500">{expense.vendor_name}</div>
                      <div className="text-xs text-gray-500">{expense.receipt_number}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">₹{expense.amount?.toLocaleString()}</div>
                      <Badge variant="outline" className="mt-1">{expense.category}</Badge>
                    </td>
                    <td className="p-4">
                      {expense.community_id && <div className="text-xs">Community: Main Temple</div>}
                      {expense.event_id && <div className="text-xs">Event: Annual Festival</div>}
                      {!expense.community_id && !expense.event_id && <div className="text-xs text-gray-400">No association</div>}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          expense.status === "approved"
                            ? "outline"
                            : expense.status === "rejected"
                            ? "destructive"
                            : expense.status === "paid"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {expense.status}
                      </Badge>
                      {expense.approved_by && <div className="text-xs mt-1">By: {expense.approved_by}</div>}
                      {expense.approval_date && <div className="text-xs">{new Date(expense.approval_date).toLocaleDateString()}</div>}
                    </td>
                    <td className="p-4">
                      {expense.receipt_attached && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Paperclip className="w-3 h-3 mr-1" /> Receipt
                        </div>
                      )}
                      <div className="text-xs">Expense: {new Date(expense.expense_date).toLocaleDateString()}</div>
                      <div className="text-xs">Entry: {new Date(expense.entry_date || expense.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedExpense(expense)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {expense.status === "pending" && (
                          <>
                            <Button size="sm" variant="default" onClick={() => handleApproveExpense(expense.id)}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectExpense(expense.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredExpenses.length === 0 && <div className="text-center py-12 text-gray-500">No expenses found.</div>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Description</Label>
              <Input value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
            </div>
            <div>
              <Label>Vendor Name</Label>
              <Input value={newExpense.vendor_name} onChange={(e) => setNewExpense({ ...newExpense, vendor_name: e.target.value })} />
            </div>
            <div>
              <Label>Receipt Number</Label>
              <Input value={newExpense.receipt_number} onChange={(e) => setNewExpense({ ...newExpense, receipt_number: e.target.value })} />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="salaries">Salaries</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expense Date</Label>
              <Input type="date" value={newExpense.expense_date} onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea value={newExpense.notes} onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleCreateExpense}>Add Expense</Button>
          </div>
          {error && <div className="text-red-600 pt-2">{error}</div>}
        </DialogContent>
      </Dialog>

      {selectedExpense && (
        <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <div><strong>Description:</strong> {selectedExpense.description}</div>
              <div><strong>Vendor:</strong> {selectedExpense.vendor_name}</div>
              <div><strong>Amount:</strong> ₹{selectedExpense.amount?.toLocaleString()}</div>
              <div><strong>Category:</strong> {selectedExpense.category}</div>
              <div><strong>Status:</strong> {selectedExpense.status}</div>
              <div><strong>Date:</strong> {new Date(selectedExpense.expense_date).toLocaleDateString()}</div>
              <div><strong>Notes:</strong> {selectedExpense.notes}</div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
