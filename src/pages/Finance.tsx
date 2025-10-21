import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinanceHeader } from '@/components/finance/FinanceHeader';
import { FinanceDashboard } from '@/components/finance/FinanceDashboard';
import { DonationsTab } from '@/components/finance/DonationsTab';
import { ExpensesTab } from '@/components/finance/ExpensesTab';
import { BudgetsTab } from '@/components/finance/BudgetsTab';
import { ReportsTab } from '@/components/finance/ReportsTab';
import { ReconciliationTab } from '@/components/finance/ReconciliationTab';

export const Finance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
          <p className="text-gray-500 mt-1">Track donations, expenses, budgets, and financial reports</p>
        </div>

        <FinanceHeader />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <FinanceDashboard />
          </TabsContent>

          <TabsContent value="donations" className="mt-6">
            <DonationsTab />
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <ExpensesTab />
          </TabsContent>

          <TabsContent value="budgets" className="mt-6">
            <BudgetsTab />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="reconciliation" className="mt-6">
            <ReconciliationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
