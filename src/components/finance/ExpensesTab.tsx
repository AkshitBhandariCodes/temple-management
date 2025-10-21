import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const ExpensesTab = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newExpense, setNewExpense] = useState({
    description: "",
    vendor_name: "",
    receipt_number: "",
    amount: "",
    category: "maintenance",
    expense_date: "",
    notes: "",
    receipt_attached: false,
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    let query = supabase.from("expenses").select("*").order("expense_date", { ascending: false });

    if (filterCategory !== "all") query = query.eq("category", filterCategory);
    if (filterStatus !== "all") query = query.eq("status", filterStatus);

    const { data, error } = await query;
    if (error) console.error(error);
    else setExpenses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [filterCategory, filterStatus]);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel("expenses-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, () => {
        fetchExpenses(); // Refetch when data changes
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [filterCategory, filterStatus]);

  // Add expense
  const handleAddExpense = async () => {
    setLoading(true);
    const { error } = await supabase.from("expenses").insert([
      {
        description: newExpense.description,
        vendor_name: newExpense.vendor_name,
        receipt_number: newExpense.receipt_number,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        expense_date: newExpense.expense_date,
        notes: newExpense.notes,
        receipt_attached: newExpense.receipt_attached,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding expense");
    } else {
      setShowAddModal(false);
      setNewExpense({
        description: "",
        vendor_name: "",
        receipt_number: "",
        amount: "",
        category: "maintenance",
        expense_date: "",
        notes: "",
        receipt_attached: false,
      });
      fetchExpenses(); // Refetch immediately
    }
    setLoading(false);
  };

  // Approve expense
  const handleApprove = async (id) => {
    await supabase.from("expenses").update({ status: "approved", approval_date: new Date().toISOString() }).eq("id", id);
    fetchExpenses();
  };

  // Reject expense
  const handleReject = async (id) => {
    await supabase.from("expenses").update({ status: "rejected", approval_date: new Date().toISOString() }).eq("id", id);
    fetchExpenses();
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      paid: "bg-blue-100 text-blue-800",
    };
    return <Badge className={colors[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-2xl font-bold">
              ₹{expenses.reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Count</div>
            <div className="text-2xl font-bold">{expenses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {expenses.filter((e) => e.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {expenses.filter((e) => e.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="salaries">Salaries</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setShowAddModal(true)} className="ml-auto">
              <Plus className="w-4 h-4 mr-1" /> Add Expense
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4">Description</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{expense.description}</td>
                    <td className="p-4">{expense.vendor_name}</td>
                    <td className="p-4 font-medium">₹{expense.amount?.toLocaleString()}</td>
                    <td className="p-4">{expense.category}</td>
                    <td className="p-4">{expense.expense_date ? new Date(expense.expense_date).toLocaleDateString() : ""}</td>
                    <td className="p-4">{getStatusBadge(expense.status)}</td>
                    <td className="p-4">
                      {expense.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleApprove(expense.id)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(expense.id)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expenses.length === 0 && (
              <div className="text-center py-12 text-gray-500">No expenses found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
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
              <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="salaries">Salaries</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
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
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddExpense} disabled={loading}>Add Expense</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
