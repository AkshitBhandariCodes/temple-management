import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Check, X, MessageSquare, Paperclip, Calendar, User, FileText, Plus } from 'lucide-react';
import { useExpenses } from '@/hooks/use-complete-api';

export const BudgetsTab = () => {
  // Fetch expenses data to calculate budget vs actual
  const { data: expensesData } = useExpenses({ limit: 1000 });
  const expenses = expensesData?.data || [];

  // Mock budget data (in real implementation, this would come from API)
  const budgets = [
    { id: '1', category: 'maintenance', budgeted_amount: 50000, period: 'monthly', description: 'Temple maintenance and repairs' },
    { id: '2', category: 'utilities', budgeted_amount: 30000, period: 'monthly', description: 'Electricity, water, and other utilities' },
    { id: '3', category: 'events', budgeted_amount: 25000, period: 'monthly', description: 'Festival and special event expenses' },
    { id: '4', category: 'salaries', budgeted_amount: 100000, period: 'monthly', description: 'Staff and priest salaries' },
  ];

  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'maintenance',
    budgeted_amount: '',
    period: 'monthly',
    description: ''
  });

  // Calculate actual spending by category
  const actualSpending = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const filteredBudgets = budgets.filter(budget => {
    const matchesStatus = statusFilter === 'all' || budget.category === statusFilter;
    const matchesCategory = categoryFilter === 'all' || budget.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const getStatusBadge = (budgeted: number, actual: number) => {
    const variance = ((actual - budgeted) / budgeted) * 100;
    if (variance > 20) return { text: 'Over Budget', variant: 'destructive' as const };
    if (variance > 0) return { text: 'Near Limit', variant: 'secondary' as const };
    return { text: 'Under Budget', variant: 'default' as const };
  };

  const handleCreateBudget = () => {
    // In real implementation, this would call API
    console.log('Creating budget:', newBudget);
    setShowCreateModal(false);
    setNewBudget({
      category: 'maintenance',
      budgeted_amount: '',
      period: 'monthly',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹{budgets.reduce((sum, b) => sum + b.budgeted_amount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹{Object.values(actualSpending).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Actual Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {Math.round((Object.values(actualSpending).reduce((sum, amount) => sum + amount, 0) / budgets.reduce((sum, b) => sum + b.budgeted_amount, 0)) * 100) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Budget Utilized</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              ₹{(budgets.reduce((sum, b) => sum + b.budgeted_amount, 0) - Object.values(actualSpending).reduce((sum, amount) => sum + amount, 0)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Remaining Budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Budget Management</CardTitle>
            <div className="flex gap-2">
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Budget
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newBudget.category} onValueChange={(value) => setNewBudget({...newBudget, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="salaries">Salaries</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budgeted_amount">Budgeted Amount</Label>
                      <Input
                        id="budgeted_amount"
                        type="number"
                        value={newBudget.budgeted_amount}
                        onChange={(e) => setNewBudget({...newBudget, budgeted_amount: e.target.value})}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="period">Period</Label>
                      <Select value={newBudget.period} onValueChange={(value) => setNewBudget({...newBudget, period: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newBudget.description}
                        onChange={(e) => setNewBudget({...newBudget, description: e.target.value})}
                        placeholder="Budget description..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBudget}>Create Budget</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="salaries">Salaries</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground border-b pb-2">
                <div className="col-span-3">Category</div>
                <div className="col-span-2">Period</div>
                <div className="col-span-2">Budgeted</div>
                <div className="col-span-2">Actual</div>
                <div className="col-span-2">Variance</div>
                <div className="col-span-1">Status</div>
              </div>
              {filteredBudgets.map((budget) => {
                const actual = actualSpending[budget.category] || 0;
                const variance = actual - budget.budgeted_amount;
                const variancePercent = (variance / budget.budgeted_amount) * 100;
                const statusBadge = getStatusBadge(budget.budgeted_amount, actual);

                return (
                  <div key={budget.id} className="grid grid-cols-12 gap-4 py-3 border-b last:border-0 items-center">
                    <div className="col-span-3">
                      <div className="font-medium">{budget.category}</div>
                      <div className="text-xs text-muted-foreground">{budget.description}</div>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline">{budget.period}</Badge>
                    </div>
                    <div className="col-span-2 font-medium">
                      ₹{budget.budgeted_amount.toLocaleString()}
                    </div>
                    <div className="col-span-2 font-medium">
                      ₹{actual.toLocaleString()}
                    </div>
                    <div className="col-span-2">
                      <div className={`text-sm font-medium ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {variance >= 0 ? '+' : ''}₹{variance.toLocaleString()}
                      </div>
                      <div className={`text-xs ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {variancePercent.toFixed(1)}%
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
                    </div>
                  </div>
                );
              })}
              {filteredBudgets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No budgets found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
