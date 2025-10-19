import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Link, Eye, Plus } from 'lucide-react';
import { useDonations, useExpenses } from '@/hooks/use-complete-api';

export const ReconciliationTab = () => {
  // Fetch real data from MongoDB API
  const { data: donationsData } = useDonations({ limit: 100 });
  const { data: expensesData } = useExpenses({ limit: 100 });

  const donations = donationsData?.data || [];
  const expenses = expensesData?.data || [];

  // Create reconciliation items from real data
  const reconciliationItems = [
    ...donations.map(d => ({
      id: d.id,
      type: 'donation' as const,
      amount: d.net_amount,
      date: d.received_at,
      description: `${d.donor_name || 'Anonymous'} - ${d.source}`,
      reference: d.receipt_number,
      status: d.reconciled ? 'matched' as const : 'pending' as const,
      bankReference: d.transaction_id,
      reconciledAt: d.reconciled ? d.updated_at : undefined,
      notes: d.notes,
      source: 'api' as const
    })),
    ...expenses.map(e => ({
      id: e.id,
      type: 'expense' as const,
      amount: e.amount,
      date: e.expense_date,
      description: `${e.description} - ${e.vendor_name}`,
      reference: e.receipt_number,
      status: e.status === 'approved' ? 'matched' as const : 'pending' as const,
      bankReference: e.receipt_number,
      reconciledAt: e.updated_at,
      notes: e.notes,
      source: 'api' as const
    }))
  ];

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('');

  const matchedCount = reconciliationItems.filter(item => item.status === 'matched').length;
  const unmatchedCount = reconciliationItems.filter(item => item.status === 'pending').length;
  const exceptionCount = reconciliationItems.filter(item => item.status === 'exception').length;
  const totalCount = reconciliationItems.length;
  const reconciledPercentage = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

  const getStatusBadge = (status: string) => {
    const variants = {
      matched: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      exception: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4 text-yellow-600" />;
      case 'exception':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Reconciliation Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{matchedCount}</div>
              <div className="text-sm text-gray-600">Matched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{unmatchedCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{exceptionCount}</div>
              <div className="text-sm text-gray-600">Exceptions</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Reconciliation Progress</span>
              <span className="text-sm text-gray-600">{reconciledPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${reconciledPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Last reconciliation: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>
            <div className="space-x-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Manual Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unreconciled Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Reconciliation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Transaction Details</th>
                  <th className="text-left p-3">Reference</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reconciliationItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <Badge className={getStatusBadge(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">{item.type}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-mono text-sm">{item.reference}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">₹{item.amount.toLocaleString()}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm">{new Date(item.date).toLocaleDateString()}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                            </DialogHeader>
                            {selectedItem && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Transaction Info</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="font-medium">Type:</span> {selectedItem.type}</p>
                                      <p><span className="font-medium">Amount:</span> ₹{selectedItem.amount.toLocaleString()}</p>
                                      <p><span className="font-medium">Date:</span> {new Date(selectedItem.date).toLocaleString()}</p>
                                      <p><span className="font-medium">Reference:</span> {selectedItem.reference}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Status</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="font-medium">Status:</span>
                                        <Badge className={`ml-2 ${getStatusBadge(selectedItem.status)}`}>
                                          {selectedItem.status}
                                        </Badge>
                                      </p>
                                      {selectedItem.bankReference && (
                                        <p><span className="font-medium">Bank Ref:</span> {selectedItem.bankReference}</p>
                                      )}
                                      {selectedItem.notes && (
                                        <p><span className="font-medium">Notes:</span> {selectedItem.notes}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reconciliationItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions to reconcile
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
