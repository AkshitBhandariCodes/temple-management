import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
	useBudgetCategories,
	useTransactions,
	useFinancialSummary,
} from "@/hooks/use-complete-api";

const FinanceTest = () => {
	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useBudgetCategories();
	const {
		data: transactionsData,
		isLoading: transactionsLoading,
		error: transactionsError,
	} = useTransactions();
	const {
		data: summaryData,
		isLoading: summaryLoading,
		error: summaryError,
	} = useFinancialSummary();

	const categories = categoriesData?.data || [];
	const transactions = transactionsData?.data || [];
	const summary = summaryData?.data || {};

	if (categoriesLoading || transactionsLoading || summaryLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="w-8 h-8 animate-spin" />
				<span className="ml-2">Loading finance data...</span>
			</div>
		);
	}

	if (categoriesError || transactionsError || summaryError) {
		return (
			<div className="p-6">
				<Card className="border-red-200">
					<CardHeader>
						<CardTitle className="text-red-600">Finance API Error</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{categoriesError && (
								<p>Categories Error: {categoriesError.message}</p>
							)}
							{transactionsError && (
								<p>Transactions Error: {transactionsError.message}</p>
							)}
							{summaryError && <p>Summary Error: {summaryError.message}</p>}
						</div>
						<div className="mt-4 p-4 bg-gray-100 rounded">
							<p className="font-medium">To fix this:</p>
							<ol className="list-decimal list-inside mt-2 space-y-1">
								<li>Run setup-finance-database.sql in Supabase Dashboard</li>
								<li>Restart backend server</li>
								<li>Refresh this page</li>
							</ol>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<h2 className="text-2xl font-bold">Finance System Test</h2>

			{/* Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Financial Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4">
						<div>
							<p className="text-sm text-gray-600">Total Income</p>
							<p className="text-2xl font-bold text-green-600">
								₹{(summary.totalIncome || 0).toLocaleString()}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Total Expenses</p>
							<p className="text-2xl font-bold text-red-600">
								₹{(summary.totalExpenses || 0).toLocaleString()}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Net Amount</p>
							<p
								className={`text-2xl font-bold ${
									(summary.netAmount || 0) >= 0
										? "text-green-600"
										: "text-red-600"
								}`}>
								₹{(summary.netAmount || 0).toLocaleString()}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Categories */}
			<Card>
				<CardHeader>
					<CardTitle>Budget Categories ({categories.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4">
						{categories.slice(0, 6).map((category: any) => (
							<div key={category.id} className="p-3 border rounded">
								<div className="flex justify-between items-center">
									<span className="font-medium">{category.name}</span>
									<span
										className={`px-2 py-1 rounded text-xs ${
											category.category_type === "income"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}>
										{category.category_type}
									</span>
								</div>
								<p className="text-sm text-gray-600 mt-1">
									Budget: ₹{(category.budget_amount || 0).toLocaleString()}
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Transactions */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions ({transactions.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{transactions.slice(0, 5).map((transaction: any) => (
							<div
								key={transaction.id}
								className="flex justify-between items-center p-3 border rounded">
								<div>
									<p className="font-medium">{transaction.description}</p>
									<p className="text-sm text-gray-600">
										{new Date(transaction.date).toLocaleDateString()} •{" "}
										{transaction.payment_method}
									</p>
								</div>
								<div className="text-right">
									<p
										className={`font-medium ${
											transaction.type === "income"
												? "text-green-600"
												: "text-red-600"
										}`}>
										{transaction.type === "income" ? "+" : "-"}₹
										{transaction.amount.toLocaleString()}
									</p>
									<p className="text-xs text-gray-500">
										{transaction.budget_categories?.name || "No Category"}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className="text-center">
				<p className="text-green-600 font-medium">
					✅ Finance system is working correctly!
				</p>
				<Button onClick={() => window.location.reload()} className="mt-2">
					Refresh Data
				</Button>
			</div>
		</div>
	);
};

export default FinanceTest;
