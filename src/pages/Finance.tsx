import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceHeader } from "@/components/finance/FinanceHeader";
import { FinanceDashboard } from "@/components/finance/FinanceDashboard";
import { DonationsTab } from "@/components/finance/DonationsTab";
import { ExpensesTab } from "@/components/finance/ExpensesTab";
import { BudgetsTab } from "@/components/finance/BudgetsTab";
import { ReportsTab } from "@/components/finance/ReportsTab";
import { ReconciliationTab } from "@/components/finance/ReconciliationTab";
import { BudgetRequestsTab } from "@/components/finance/BudgetRequestsTab";
import { FinanceDebugPanel } from "@/components/debug/FinanceDebugPanel";

export const Finance = () => {
	const [activeTab, setActiveTab] = useState("dashboard");

	return (
		<AdminLayout>
			<div className="space-y-6">
				<FinanceHeader />

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-8">
						<TabsTrigger value="dashboard">Dashboard</TabsTrigger>
						<TabsTrigger value="donations">Donations</TabsTrigger>
						<TabsTrigger value="expenses">Expenses</TabsTrigger>
						<TabsTrigger value="budgets">Budgets</TabsTrigger>
						<TabsTrigger value="budget-requests">Budget Requests</TabsTrigger>
						<TabsTrigger value="reports">Reports</TabsTrigger>
						<TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
						<TabsTrigger value="debug">🔍 Debug</TabsTrigger>
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

					<TabsContent value="debug" className="mt-6">
						<FinanceDebugPanel />
					</TabsContent>

					<TabsContent value="budget-requests" className="mt-6">
						<BudgetRequestsTab />
					</TabsContent>
				</Tabs>
			</div>
		</AdminLayout>
	);
};
