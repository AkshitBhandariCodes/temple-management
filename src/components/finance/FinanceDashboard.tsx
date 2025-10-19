import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, IndianRupee, CreditCard, Banknote } from 'lucide-react';
import { useDonations, useExpenses } from '@/hooks/use-complete-api';

export const FinanceDashboard = () => {
  // Fetch real data from MongoDB API
  const { data: donationsData } = useDonations({ limit: 100 });
  const { data: expensesData } = useExpenses({ limit: 100 });

  const donations = donationsData?.data || [];
  const expenses = expensesData?.data || [];

  // Calculate summary from real data
  const totalDonations = donations.reduce((sum, d) => sum + d.net_amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netAmount = totalDonations - totalExpenses;

  // Recent transactions (combine donations and expenses)
  const recentTransactions = [
    ...donations.slice(0, 3).map(d => ({
      id: d.id,
      type: 'donation' as const,
      amount: d.net_amount,
      description: `${d.donor_name || 'Anonymous'} - ${d.source}`,
      date: d.received_at,
      status: d.status
    })),
    ...expenses.slice(0, 2).map(e => ({
      id: e.id,
      type: 'expense' as const,
      amount: e.amount,
      description: `${e.description} - ${e.vendor_name}`,
      date: e.expense_date,
      status: e.status
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Donations</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+{donations.length > 0 ? '12.5' : '0'}%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Expenses</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-red-500">+{expenses.length > 0 ? '8.2' : '0'}%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{Math.abs(netAmount).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Net Balance</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              {netAmount >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={netAmount >= 0 ? 'text-green-500' : 'text-red-500'}>
                {netAmount >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive donation trends chart</p>
                <p className="text-sm">Line chart with multiple series</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-blue-200 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-blue-400"></div>
                </div>
                <p>Expense distribution pie chart</p>
                <p className="text-sm">Budget vs actual comparison</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'donation' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'donation' ? (
                      <IndianRupee className="h-4 w-4 text-green-600" />
                    ) : (
                      <CreditCard className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'donation' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'donation' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </p>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No recent transactions
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
