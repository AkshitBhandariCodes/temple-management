import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Plus, Eye, Download, RefreshCw, Check, X } from 'lucide-react';
import { useExpenses, useCreateExpense, Expense } from '@/hooks/use-complete-api';
import { useToast } from '@/hooks/use-toast';

export const ExpensesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    vendor_name: '',
    receipt_number: '',
    amount: '',
    category: 'maintenance',
    expense_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const { data: expensesData, isLoading, error, refetch } = useExpenses({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    limit: 1000
  });

  const createExpenseMutation = useCreateExpense();

  const expenses = expensesData?.data || [];
  const { toast } = useToast();

  const filteredExpenses = expenses.filter((expense: Expense) => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateExpense = async () => {
    try {
      await createExpenseMutation.mutateAsync({
        description: newExpense.description,
        vendor_name: newExpense.vendor_name,
        receipt_number: newExpense.receipt_number,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        expense_date: newExpense.expense_date,
        notes: newExpense.notes || undefined,
      });

      setShowAddModal(false);
      setNewExpense({
        description: '',
        vendor_name: '',
        receipt_number: '',
        amount: '',
        category: 'maintenance',
        expense_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'approved': 'default',
      'pending': 'secondary',
      'rejected': 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'maintenance': 'bg-blue-100 text-blue-800',
      'utilities': 'bg-green-100 text-green-800',
      'salaries': 'bg-purple-100 text-purple-800',
      'materials': 'bg-orange-100 text-orange-800',
      'events': 'bg-pink-100 text-pink-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['other'];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            Error loading expenses: {error.message}
            <Button onClick={() => refetch()} className="ml-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total Expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">Total Count</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {expenses.filter(e => e.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {expenses.filter(e => e.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Expenses</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                          placeholder="Expense description"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vendor_name">Vendor Name</Label>
                        <Input
                          id="vendor_name"
                          value={newExpense.vendor_name}
                          onChange={(e) => setNewExpense({...newExpense, vendor_name: e.target.value})}
                          placeholder="Vendor or supplier name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="receipt_number">Receipt Number</Label>
                        <Input
                          id="receipt_number"
                          value={newExpense.receipt_number}
                          onChange={(e) => setNewExpense({...newExpense, receipt_number: e.target.value})}
                          placeholder="Receipt or invoice number"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                          placeholder="5000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
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
                    </div>
                    <div>
                      <Label htmlFor="expense_date">Expense Date</Label>
                      <Input
                        id="expense_date"
                        type="date"
                        value={newExpense.expense_date}
                        onChange={(e) => setNewExpense({...newExpense, expense_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newExpense.notes}
                        onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateExpense} disabled={createExpenseMutation.isPending}>
                      {createExpenseMutation.isPending ? 'Adding...' : 'Add Expense'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="salaries">Salaries</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground border-b pb-2">
                <div className="col-span-3">Description</div>
                <div className="col-span-2">Vendor</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Date</div>
              </div>
              {filteredExpenses.map((expense: Expense) => (
                <div key={expense.id} className="grid grid-cols-12 gap-4 py-3 border-b last:border-0 items-center">
                  <div className="col-span-3">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {expense.receipt_number}
                    </div>
                  </div>
                  <div className="col-span-2">{expense.vendor_name}</div>
                  <div className="col-span-2 font-medium">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryBadge(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant={getStatusBadge(expense.status)}>
                      {expense.status}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-sm text-muted-foreground">
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {filteredExpenses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No expenses found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
