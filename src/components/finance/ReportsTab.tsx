import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	TrendingUp,
	TrendingDown,
	IndianRupee,
	Calendar,
	Download,
	RefreshCw,
	BarChart3,
	PieChart,
	Loader2,
	DollarSign,
} from "lucide-react";
import {
	useTransactions,
	useBudgetCategories,
	useFinancialSummary,
} from "@/hooks/use-complete-api";

export const ReportsTab = () => {
	const [timeFilter, setTimeFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const {
		data: transactionsData,
		isLoading: transactionsLoading,
		error: transactionsError,
		refetch: refetchTransactions,
	} = useTransactions();

	const { data: categoriesData, isLoading: categoriesLoading } =
		useBudgetCategories();

	const {
		data: summaryData,
		isLoading: summaryLoading,
		refetch: refetchSummary,
	} = useFinancialSummary();

	const transactions = transactionsData?.data || [];
	const categories = categoriesData?.data || [];
	const summary = summaryData?.data || {};

	// Filter transactions based on time period
	const getFilteredTransactions = () => {
		let filtered = transactions;

		if (timeFilter !== "all") {
			const now = new Date();
			const filterDate = new Date();

			switch (timeFilter) {
				case "today":
					filterDate.setHours(0, 0, 0, 0);
					filtered = transactions.filter(
						(t: any) => new Date(t.date) >= filterDate
					);
					break;
				case "week":
					filterDate.setDate(now.getDate() - 7);
					filtered = transactions.filter(
						(t: any) => new Date(t.date) >= filterDate
					);
					break;
				case "month":
					filterDate.setMonth(now.getMonth() - 1);
					filtered = transactions.filter(
						(t: any) => new Date(t.date) >= filterDate
					);
					break;
				case "year":
					filterDate.setFullYear(now.getFullYear() - 1);
					filtered = transactions.filter(
						(t: any) => new Date(t.date) >= filterDate
					);
					break;
			}
		}

		if (categoryFilter !== "all") {
			filtered = filtered.filter((t: any) => t.category_id === categoryFilter);
		}

		return filtered;
	};

	const filteredTransactions = getFilteredTransactions();

	// Calculate statistics from filtered data
	const income = filteredTransactions.filter((t: any) => t.type === "income");
	const expenses = filteredTransactions.filter(
		(t: any) => t.type === "expense"
	);

	const totalIncome = income.reduce(
		(sum: number, t: any) => sum + (t.amount || 0),
		0
	);
	const totalExpenses = expenses.reduce(
		(sum: number, t: any) => sum + (t.amount || 0),
		0
	);
	const netAmount = totalIncome - totalExpenses;

	// Category-wise breakdown
	const categoryBreakdown = categories
		.map((category: any) => {
			const categoryTransactions = filteredTransactions.filter(
				(t: any) => t.category_id === category.id
			);
			const categoryTotal = categoryTransactions.reduce(
				(sum: number, t: any) => sum + (t.amount || 0),
				0
			);
			return {
				...category,
				total: categoryTotal,
				count: categoryTransactions.length,
			};
		})
		.filter((cat: any) => cat.total > 0);

	// Payment method breakdown
	const paymentMethods = ["cash", "bank_transfer", "card", "upi", "cheque"];
	const paymentMethodBreakdown = paymentMethods
		.map((method) => {
			const methodTransactions = filteredTransactions.filter(
				(t: any) => t.payment_method === method
			);
			const methodTotal = methodTransactions.reduce(
				(sum: number, t: any) => sum + (t.amount || 0),
				0
			);
			return {
				method,
				total: methodTotal,
				count: methodTransactions.length,
			};
		})
		.filter((method) => method.total > 0);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	const getPaymentMethodIcon = (method: string) => {
		const icons: Record<string, string> = {
			cash: "💵",
			bank_transfer: "🏦",
			card: "💳",
			cheque: "📄",
			upi: "📱",
		};
		return icons[method] || "💰";
	};

	if (transactionsLoading || categoriesLoading || summaryLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	if (transactionsError) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center text-destructive">
						<p className="mb-4">
							Error loading reports: {transactionsError.message}
						</p>
						<Button onClick={() => refetchTransactions()} variant="outline">
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
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<BarChart3 className="w-6 h-6 text-blue-600" />
						Financial Reports
					</h2>
					<p className="text-muted-foreground">
						Analyze income, expenses, and financial trends
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4 mr-2" />
						Export Report
					</Button>
					<Button
						onClick={() => {
							refetchTransactions();
							refetchSummary();
						}}
						variant="outline"
						size="sm">
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Report Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label className="text-sm font-medium mb-2 block">
								Time Period
							</label>
							<Select value={timeFilter} onValueChange={setTimeFilter}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Time</SelectItem>
									<SelectItem value="today">Today</SelectItem>
									<SelectItem value="week">Last 7 Days</SelectItem>
									<SelectItem value="month">Last 30 Days</SelectItem>
									<SelectItem value="year">Last Year</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex-1">
							<label className="text-sm font-medium mb-2 block">Category</label>
							<Select value={categoryFilter} onValueChange={setCategoryFilter}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{categories.map((category: any) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name} ({category.category_type})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="border-green-200 bg-green-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-green-800">
							Total Income
						</CardTitle>
						<div className="p-2 bg-green-100 rounded-full">
							<TrendingUp className="h-4 w-4 text-green-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-700">
							{formatCurrency(totalIncome)}
						</div>
						<p className="text-xs text-green-600 mt-1">
							{income.length} transactions
						</p>
					</CardContent>
				</Card>

				<Card className="border-red-200 bg-red-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-red-800">
							Total Expenses
						</CardTitle>
						<div className="p-2 bg-red-100 rounded-full">
							<TrendingDown className="h-4 w-4 text-red-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-700">
							{formatCurrency(totalExpenses)}
						</div>
						<p className="text-xs text-red-600 mt-1">
							{expenses.length} transactions
						</p>
					</CardContent>
				</Card>

				<Card
					className={`border-2 ${
						netAmount >= 0
							? "border-green-200 bg-green-50"
							: "border-red-200 bg-red-50"
					}`}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle
							className={`text-sm font-medium ${
								netAmount >= 0 ? "text-green-800" : "text-red-800"
							}`}>
							Net Balance
						</CardTitle>
						<div
							className={`p-2 rounded-full ${
								netAmount >= 0 ? "bg-green-100" : "bg-red-100"
							}`}>
							<DollarSign
								className={`h-4 w-4 ${
									netAmount >= 0 ? "text-green-600" : "text-red-600"
								}`}
							/>
						</div>
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${
								netAmount >= 0 ? "text-green-700" : "text-red-700"
							}`}>
							{formatCurrency(netAmount)}
						</div>
						<p
							className={`text-xs mt-1 ${
								netAmount >= 0 ? "text-green-600" : "text-red-600"
							}`}>
							{netAmount >= 0 ? "Surplus" : "Deficit"}
						</p>
					</CardContent>
				</Card>

				<Card className="border-blue-200 bg-blue-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-blue-800">
							Total Transactions
						</CardTitle>
						<div className="p-2 bg-blue-100 rounded-full">
							<Calendar className="h-4 w-4 text-blue-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-700">
							{filteredTransactions.length}
						</div>
						<p className="text-xs text-blue-600 mt-1">Selected period</p>
					</CardContent>
				</Card>
			</div>

			{/* Category Breakdown */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PieChart className="w-5 h-5 text-purple-600" />
							Category Breakdown
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{categoryBreakdown.map((category: any) => (
								<div
									key={category.id}
									className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div
											className={`w-3 h-3 rounded-full ${
												category.category_type === "income"
													? "bg-green-500"
													: "bg-red-500"
											}`}
										/>
										<div>
											<p className="font-medium">{category.name}</p>
											<p className="text-xs text-muted-foreground">
												{category.count} transactions
											</p>
										</div>
									</div>
									<div className="text-right">
										<p
											className={`font-medium ${
												category.category_type === "income"
													? "text-green-600"
													: "text-red-600"
											}`}>
											{formatCurrency(category.total)}
										</p>
										<Badge variant="outline" className="text-xs">
											{category.category_type}
										</Badge>
									</div>
								</div>
							))}
							{categoryBreakdown.length === 0 && (
								<p className="text-center text-muted-foreground py-4">
									No category data for selected period
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<IndianRupee className="w-5 h-5 text-orange-600" />
							Payment Methods
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{paymentMethodBreakdown.map((method: any) => (
								<div
									key={method.method}
									className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span className="text-lg">
											{getPaymentMethodIcon(method.method)}
										</span>
										<div>
											<p className="font-medium capitalize">
												{method.method.replace("_", " ")}
											</p>
											<p className="text-xs text-muted-foreground">
												{method.count} transactions
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-medium">
											{formatCurrency(method.total)}
										</p>
									</div>
								</div>
							))}
							{paymentMethodBreakdown.length === 0 && (
								<p className="text-center text-muted-foreground py-4">
									No payment method data for selected period
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Transactions Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{filteredTransactions.slice(0, 10).map((transaction: any) => (
							<div
								key={transaction.id}
								className="flex items-center justify-between p-3 border rounded-lg">
								<div className="flex items-center gap-3">
									<div
										className={`w-3 h-3 rounded-full ${
											transaction.type === "income"
												? "bg-green-500"
												: "bg-red-500"
										}`}
									/>
									<div>
										<p className="font-medium">{transaction.description}</p>
										<p className="text-xs text-muted-foreground">
											{new Date(transaction.date).toLocaleDateString()} •
											{getPaymentMethodIcon(transaction.payment_method)}{" "}
											{transaction.payment_method}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p
										className={`font-medium ${
											transaction.type === "income"
												? "text-green-600"
												: "text-red-600"
										}`}>
										{transaction.type === "income" ? "+" : "-"}
										{formatCurrency(transaction.amount)}
									</p>
									{transaction.budget_categories?.name && (
										<Badge variant="outline" className="text-xs">
											{transaction.budget_categories.name}
										</Badge>
									)}
								</div>
							</div>
						))}
						{filteredTransactions.length === 0 && (
							<p className="text-center text-muted-foreground py-8">
								No transactions found for the selected period
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
