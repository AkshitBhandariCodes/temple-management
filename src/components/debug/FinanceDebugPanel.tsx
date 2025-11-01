import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	useTransactions,
	useFinancialSummary,
	useBudgetCategories,
	useCreateTransaction,
} from "@/hooks/use-complete-api";
import { Loader2, RefreshCw, Database, Wifi, AlertCircle } from "lucide-react";

export const FinanceDebugPanel = () => {
	const [testAmount, setTestAmount] = useState("1000");
	const [testDescription, setTestDescription] = useState("Debug Test Donation");

	// API hooks
	const {
		data: transactionsData,
		isLoading: transactionsLoading,
		error: transactionsError,
		refetch: refetchTransactions,
	} = useTransactions();

	const {
		data: summaryData,
		isLoading: summaryLoading,
		error: summaryError,
		refetch: refetchSummary,
	} = useFinancialSummary();

	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useBudgetCategories();

	const createTransactionMutation = useCreateTransaction();

	// Data extraction
	const transactions = transactionsData?.data || [];
	const summary = summaryData?.data || {};
	const categories = categoriesData?.data || [];

	const donations = transactions.filter((t) => t.type === "income");
	const expenses = transactions.filter((t) => t.type === "expense");

	const handleTestDonation = async () => {
		try {
			const amount = parseFloat(testAmount);
			if (isNaN(amount) || amount <= 0) {
				alert("Invalid amount");
				return;
			}

			const donationCategory = categories.find(
				(cat) =>
					cat.category_type === "income" &&
					cat.name.toLowerCase().includes("donation")
			);

			const testData = {
				type: "income" as const,
				amount: amount,
				description: testDescription,
				payment_method: "cash" as const,
				date: new Date().toISOString().split("T")[0],
				category_id: donationCategory?.id || null,
			};

			console.log("🧪 Creating test donation:", testData);

			await createTransactionMutation.mutateAsync(testData);

			console.log("✅ Test donation created successfully");

			// Manual refresh after a delay
			setTimeout(() => {
				refetchTransactions();
				refetchSummary();
			}, 1000);
		} catch (error) {
			console.error("❌ Test donation failed:", error);
		}
	};

	const getStatusIcon = (loading: boolean, error: any, data: any) => {
		if (loading)
			return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
		if (error) return <AlertCircle className="w-4 h-4 text-red-500" />;
		if (data) return <Database className="w-4 h-4 text-green-500" />;
		return <Wifi className="w-4 h-4 text-gray-400" />;
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						🔍 Finance System Debug Panel
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* API Status */}
					<div>
						<h3 className="font-semibold mb-3">API Status</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="flex items-center justify-between p-3 border rounded">
								<span className="text-sm">Transactions</span>
								<div className="flex items-center gap-2">
									{getStatusIcon(
										transactionsLoading,
										transactionsError,
										transactionsData
									)}
									<Badge
										variant={transactionsError ? "destructive" : "default"}>
										{transactions.length} items
									</Badge>
								</div>
							</div>
							<div className="flex items-center justify-between p-3 border rounded">
								<span className="text-sm">Summary</span>
								<div className="flex items-center gap-2">
									{getStatusIcon(summaryLoading, summaryError, summaryData)}
									<Badge variant={summaryError ? "destructive" : "default"}>
										₹{summary.totalIncome || 0}
									</Badge>
								</div>
							</div>
							<div className="flex items-center justify-between p-3 border rounded">
								<span className="text-sm">Categories</span>
								<div className="flex items-center gap-2">
									{getStatusIcon(
										categoriesLoading,
										categoriesError,
										categoriesData
									)}
									<Badge variant={categoriesError ? "destructive" : "default"}>
										{categories.length} items
									</Badge>
								</div>
							</div>
						</div>
					</div>

					{/* Current Data */}
					<div>
						<h3 className="font-semibold mb-3">Current Data</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center p-3 bg-green-50 rounded">
								<div className="text-2xl font-bold text-green-600">
									{donations.length}
								</div>
								<div className="text-sm text-green-700">Donations</div>
							</div>
							<div className="text-center p-3 bg-red-50 rounded">
								<div className="text-2xl font-bold text-red-600">
									{expenses.length}
								</div>
								<div className="text-sm text-red-700">Expenses</div>
							</div>
							<div className="text-center p-3 bg-blue-50 rounded">
								<div className="text-2xl font-bold text-blue-600">
									₹{summary.totalIncome?.toLocaleString() || "0"}
								</div>
								<div className="text-sm text-blue-700">Total Income</div>
							</div>
							<div className="text-center p-3 bg-purple-50 rounded">
								<div className="text-2xl font-bold text-purple-600">
									₹{summary.netAmount?.toLocaleString() || "0"}
								</div>
								<div className="text-sm text-purple-700">Net Amount</div>
							</div>
						</div>
					</div>

					{/* Test Donation */}
					<div>
						<h3 className="font-semibold mb-3">Test Donation Creation</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
							<div>
								<Label htmlFor="test-amount">Amount (₹)</Label>
								<Input
									id="test-amount"
									type="number"
									value={testAmount}
									onChange={(e) => setTestAmount(e.target.value)}
									min="1"
								/>
							</div>
							<div>
								<Label htmlFor="test-description">Description</Label>
								<Input
									id="test-description"
									value={testDescription}
									onChange={(e) => setTestDescription(e.target.value)}
								/>
							</div>
							<Button
								onClick={handleTestDonation}
								disabled={createTransactionMutation.isPending}
								className="bg-green-600 hover:bg-green-700">
								{createTransactionMutation.isPending ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									"Create Test Donation"
								)}
							</Button>
						</div>
					</div>

					{/* Manual Refresh */}
					<div>
						<h3 className="font-semibold mb-3">Manual Controls</h3>
						<div className="flex gap-2">
							<Button
								onClick={() => refetchTransactions()}
								variant="outline"
								size="sm">
								<RefreshCw className="w-4 h-4 mr-2" />
								Refresh Transactions
							</Button>
							<Button
								onClick={() => refetchSummary()}
								variant="outline"
								size="sm">
								<RefreshCw className="w-4 h-4 mr-2" />
								Refresh Summary
							</Button>
						</div>
					</div>

					{/* Recent Transactions */}
					{transactions.length > 0 && (
						<div>
							<h3 className="font-semibold mb-3">
								Recent Transactions (Last 5)
							</h3>
							<div className="space-y-2">
								{transactions.slice(0, 5).map((transaction) => (
									<div
										key={transaction.id}
										className="flex items-center justify-between p-2 border rounded text-sm">
										<div>
											<span
												className={`font-medium ${
													transaction.type === "income"
														? "text-green-600"
														: "text-red-600"
												}`}>
												{transaction.type === "income" ? "+" : "-"}₹
												{transaction.amount}
											</span>
											<span className="ml-2 text-gray-600">
												{transaction.description}
											</span>
										</div>
										<div className="text-gray-500 text-xs">
											{transaction.date}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Error Display */}
					{(transactionsError || summaryError || categoriesError) && (
						<div>
							<h3 className="font-semibold mb-3 text-red-600">Errors</h3>
							<div className="space-y-2">
								{transactionsError && (
									<div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
										<strong>Transactions Error:</strong>{" "}
										{transactionsError.message}
									</div>
								)}
								{summaryError && (
									<div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
										<strong>Summary Error:</strong> {summaryError.message}
									</div>
								)}
								{categoriesError && (
									<div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
										<strong>Categories Error:</strong> {categoriesError.message}
									</div>
								)}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
