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
    else setBudgets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Real-time subscription
  useEffect(() => {
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
    setError("");
    const { data, error } = await supabase.from("budgets").insert([
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
    else {
      setShowAddModal(false);
      setNewBudget({
        title: "",
        purpose: "",
        budgeted_amount: "",
        period: "monthly",
        status: "pending",
        description: "",
      });
      fetchBudgets();
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    await supabase.from("budgets").update({ status: "approved" }).eq("id", id);
    fetchBudgets();
  };

  const handleReject = async (id) => {
    await supabase.from("budgets").update({ status: "rejected" }).eq("id", id);
    fetchBudgets();
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return <Badge className={colors[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Budget</div>
            <div className="text-2xl font-bold">
              ₹{budgets.reduce((sum, b) => sum + (b.budgeted_amount || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Pending Approval</div>
            <div className="text-2xl font-bold text-yellow-600">
              {budgets.filter((b) => b.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {budgets.filter((b) => b.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Budget Requests</h3>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-1" /> Create Budget
            </Button>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4">Title</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Period</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{budget.title}</td>
                    <td className="p-4">{budget.purpose}</td>
                    <td className="p-4 font-medium">₹{budget.budgeted_amount?.toLocaleString()}</td>
                    <td className="p-4">{budget.period}</td>
                    <td className="p-4">{getStatusBadge(budget.status)}</td>
                    <td className="p-4">
                      {budget.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleApprove(budget.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(budget.id)}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {budgets.length === 0 && (
              <div className="text-center py-12 text-gray-500">No budgets found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Budget Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={newBudget.title}
                onChange={(e) => setNewBudget({ ...newBudget, title: e.target.value })}
                placeholder="e.g., Annual Festival Budget"
              />
            </div>
            <div>
              <Label>Purpose</Label>
              <Input
                value={newBudget.purpose}
                onChange={(e) => setNewBudget({ ...newBudget, purpose: e.target.value })}
                placeholder="e.g., Festival Expenses"
              />
            </div>
            <div>
              <Label>Budgeted Amount</Label>
              <Input
                type="number"
                value={newBudget.budgeted_amount}
                onChange={(e) => setNewBudget({ ...newBudget, budgeted_amount: e.target.value })}
                placeholder="10000"
              />
            </div>
            <div>
              <Label>Period</Label>
              <Select value={newBudget.period} onValueChange={(value) => setNewBudget({ ...newBudget, period: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newBudget.description}
                onChange={(e) => setNewBudget({ ...newBudget, description: e.target.value })}
                placeholder="Additional details about this budget..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBudget} disabled={loading}>
              Create Budget
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
