import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DollarSign,
	TrendingUp,
	TrendingDown,
	Plus,
	Calendar,
	CreditCard,
	Loader2,
	IndianRupee,
	Receipt,
	Wallet,
	PiggyBank,
} from "lucide-react";
import {
	useBudgetCategories,
	useCreateBudgetCategory,
	useTransactions,
	useCreateTransaction,
	useFinancialSummary,
} from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

const FinanceManagement = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [showTransactionModal, setShowTransactionModal] = useState(false);
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [transactionType, setTransactionType] = useState<"income" | "expense">(
		"income"
	);
	const { toast } = useToast();

	// API hooks with enhanced error handling and debugging
	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		error: categoriesError,
		refetch: refetchCategories,
	} = useBudgetCategories();
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
	const createCategoryMutation = useCreateBudgetCategory();
	const createTransactionMutation = useCreateTransaction();

	const categories = categoriesData?.data || [];
	const transactions = transactionsData?.data || [];
	const summary = summaryData?.data || {};

	// Enhanced debugging and error tracking
	React.useEffect(() => {
		console.log("💰 FinanceManagement - Data Status:", {
			categoriesLoading,
			transactionsLoading,
			summaryLoading,
			categoriesError: categoriesError?.message,
			transactionsError: transactionsError?.message,
			summaryError: summaryError?.message,
			categoriesCount: categories.length,
			transactionsCount: transactions.length,
			summaryData: summary,
			rawCategoriesData: categoriesData,
			rawTransactionsData: transactionsData,
			rawSummaryData: summaryData,
		});

		// Log specific transaction data for debugging
		if (transactions.length > 0) {
			console.log(
				"📋 Current transactions:",
				transactions.map((t) => ({
					id: t.id,
					type: t.type,
					amount: t.amount,
					description: t.description,
					date: t.date,
				}))
			);
		}

		// Log summary details
		if (summary && Object.keys(summary).length > 0) {
			console.log("📊 Current summary:", {
				totalIncome: summary.totalIncome,
				totalExpenses: summary.totalExpenses,
				netAmount: summary.netAmount,
				transactionCount: summary.transactionCount,
			});
		}
	}, [
		categoriesData,
		transactionsData,
		summaryData,
		categoriesLoading,
		transactionsLoading,
		summaryLoading,
		categoriesError,
		transactionsError,
		summaryError,
		categories.length,
		transactions.length,
	]);

	// Filter categories by type for better UX
	const incomeCategories = categories.filter(
		(cat: any) => cat.category_type === "income"
	);
	const expenseCategories = categories.filter(
		(cat: any) => cat.category_type === "expense"
	);

	// Form states
	const [transactionForm, setTransactionForm] = useState({
		type: "expense",
		amount: "",
		description: "",
		category_id: "",
		payment_method: "cash",
		date: new Date().toISOString().split("T")[0],
	});

	const [categoryForm, setCategoryForm] = useState({
		name: "",
		description: "",
		budget_amount: "",
		category_type: "expense",
	});

	const handleCreateTransaction = async () => {
		try {
			console.log("💳 Creating transaction with form data:", transactionForm);

			// Enhanced validation
			if (!transactionForm.amount || !transactionForm.description) {
				console.error("❌ Validation failed - missing required fields:", {
					amount: transactionForm.amount,
					description: transactionForm.description,
				});
				toast({
					title: "Validation Error",
					description: "Please fill in amount and description",
					variant: "destructive",
				});
				return;
			}

			// Validate amount is positive number
			const amount = parseFloat(transactionForm.amount);
			if (isNaN(amount) || amount <= 0) {
				console.error(
					"❌ Validation failed - invalid amount:",
					transactionForm.amount
				);
				toast({
					title: "Validation Error",
					description: "Please enter a valid positive amount",
					variant: "destructive",
				});
				return;
			}

			const transactionData = {
				...transactionForm,
				amount: amount,
				// Ensure category_id is null if empty string
				category_id: transactionForm.category_id || null,
			};

			console.log("🚀 Sending transaction data to API:", transactionData);
			console.log("🔍 Transaction validation:", {
				type: transactionData.type,
				amount: transactionData.amount,
				description: transactionData.description?.length,
				category_id: transactionData.category_id,
				payment_method: transactionData.payment_method,
				date: transactionData.date,
			});

			const result = await createTransactionMutation.mutateAsync(
				transactionData
			);
			console.log("✅ Transaction creation result:", result);

			// Don't show toast here - the mutation hook handles it
			// Don't manually refetch - React Query invalidation handles it

			setShowTransactionModal(false);
			setTransactionForm({
				type: "expense",
				amount: "",
				description: "",
				category_id: "",
				payment_method: "cash",
				date: new Date().toISOString().split("T")[0],
			});

			console.log("🔄 Transaction created, React Query will auto-refresh data");
		} catch (error) {
			console.error("❌ Failed to create transaction:", error);
			console.error("❌ Error details:", error.message);
			console.error("❌ Full error object:", JSON.stringify(error, null, 2));
			toast({
				title: "Error",
				description: `Failed to create transaction: ${error.message}`,
				variant: "destructive",
			});
		}
	};

	const handleCreateCategory = async () => {
		try {
			console.log("🔄 Creating category:", categoryForm);

			// Validate required fields
			if (!categoryForm.name) {
				toast({
					title: "Validation Error",
					description: "Please enter a category name",
					variant: "destructive",
				});
				return;
			}

			const categoryData = {
				...categoryForm,
				budget_amount: categoryForm.budget_amount
					? parseFloat(categoryForm.budget_amount)
					: 0,
			};

			console.log("📝 Sending category data:", categoryData);

			await createCategoryMutation.mutateAsync(categoryData);

			toast({
				title: "Success!",
				description: "Budget category created successfully",
			});

			setShowCategoryModal(false);
			setCategoryForm({
				name: "",
				description: "",
				budget_amount: "",
				category_type: "expense",
			});
		} catch (error) {
			console.error("❌ Failed to create category:", error);
			toast({
				title: "Error",
				description: "Failed to create category. Please try again.",
				variant: "destructive",
			});
		}
	};

	// Quick action handlers for common transactions
	const handleQuickDonation = () => {
		setTransactionType("income");
		setTransactionForm({
			...transactionForm,
			type: "income",
			category_id:
				incomeCategories.find((cat) =>
					cat.name.toLowerCase().includes("donation")
				)?.id || "",
			description: "Donation received",
		});
		setShowTransactionModal(true);
	};

	const handleQuickExpense = () => {
		setTransactionType("expense");
		setTransactionForm({
			...transactionForm,
			type: "expense",
			description: "",
		});
		setShowTransactionModal(true);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	if (categoriesLoading || transactionsLoading || summaryLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<IndianRupee className="w-6 h-6 text-green-600" />
						Finance Management
					</h2>
					<p className="text-muted-foreground">
						Track donations, expenses, and temple finances
					</p>
					{/* Debug Info */}
					{(categoriesError || transactionsError || summaryError) && (
						<div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
							<p className="text-sm font-medium text-red-800">
								⚠️ API Issues Detected:
							</p>
							{categoriesError && (
								<p className="text-xs text-red-600">
									Categories: {categoriesError.message}
								</p>
							)}
							{transactionsError && (
								<p className="text-xs text-red-600">
									Transactions: {transactionsError.message}
								</p>
							)}
							{summaryError && (
								<p className="text-xs text-red-600">
									Summary: {summaryError.message}
								</p>
							)}
							<p className="text-xs text-red-500 mt-1">
								Check console for detailed logs. Ensure backend is running on
								port 5000.
							</p>
						</div>
					)}
					{!categoriesError && !transactionsError && !summaryError && (
						<div className="mt-1 text-xs text-green-600">
							✅ API Status: {categories.length} categories,{" "}
							{transactions.length} transactions loaded
						</div>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						onClick={handleQuickDonation}
						className="bg-green-600 hover:bg-green-700">
						<PiggyBank className="w-4 h-4 mr-2" />
						Add Donation
					</Button>
					<Button
						onClick={handleQuickExpense}
						variant="outline"
						className="border-red-200 text-red-600 hover:bg-red-50">
						<Receipt className="w-4 h-4 mr-2" />
						Add Expense
					</Button>
					<Button onClick={() => setShowCategoryModal(true)} variant="outline">
						<Plus className="w-4 h-4 mr-2" />
						Add Category
					</Button>
					{/* Debug refresh button */}
					<Button
						onClick={async () => {
							console.log("🔄 Manual refresh triggered");
							await Promise.all([
								refetchTransactions(),
								refetchSummary(),
								refetchCategories(),
							]);
							console.log("✅ Manual refresh completed");
						}}
						variant="outline"
						size="sm"
						className="text-xs">
						🔄 Refresh
					</Button>
				</div>
			</div>

			{/* Enhanced Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
							{formatCurrency(summary.totalIncome || 0)}
						</div>
						<p className="text-xs text-green-600 mt-1">
							+{incomeCategories.length} income sources
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
							{formatCurrency(summary.totalExpenses || 0)}
						</div>
						<p className="text-xs text-red-600 mt-1">
							{expenseCategories.length} expense categories
						</p>
					</CardContent>
				</Card>

				<Card
					className={`border-2 ${
						(summary.netAmount || 0) >= 0
							? "border-green-200 bg-green-50"
							: "border-red-200 bg-red-50"
					}`}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle
							className={`text-sm font-medium ${
								(summary.netAmount || 0) >= 0
									? "text-green-800"
									: "text-red-800"
							}`}>
							Net Balance
						</CardTitle>
						<div
							className={`p-2 rounded-full ${
								(summary.netAmount || 0) >= 0 ? "bg-green-100" : "bg-red-100"
							}`}>
							<Wallet
								className={`h-4 w-4 ${
									(summary.netAmount || 0) >= 0
										? "text-green-600"
										: "text-red-600"
								}`}
							/>
						</div>
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${
								(summary.netAmount || 0) >= 0
									? "text-green-700"
									: "text-red-700"
							}`}>
							{formatCurrency(summary.netAmount || 0)}
						</div>
						<p
							className={`text-xs mt-1 ${
								(summary.netAmount || 0) >= 0
									? "text-green-600"
									: "text-red-600"
							}`}>
							{(summary.netAmount || 0) >= 0 ? "Positive balance" : "Deficit"}
						</p>
					</CardContent>
				</Card>

				<Card className="border-blue-200 bg-blue-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-blue-800">
							Transactions
						</CardTitle>
						<div className="p-2 bg-blue-100 rounded-full">
							<CreditCard className="h-4 w-4 text-blue-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{summary.transactionCount || 0}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="transactions">Transactions</TabsTrigger>
					<TabsTrigger value="categories">Categories</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Recent Transactions */}
						<Card>
							<CardHeader>
								<CardTitle>Recent Transactions</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{transactions.slice(0, 5).map((transaction: any) => (
										<div
											key={transaction.id}
											className="flex items-center justify-between">
											<div>
												<p className="font-medium">{transaction.description}</p>
												<p className="text-sm text-muted-foreground">
													{new Date(transaction.date).toLocaleDateString()}
												</p>
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
												<Badge variant="outline" className="text-xs">
													{transaction.budget_categories?.name || "No Category"}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Budget Categories */}
						<Card>
							<CardHeader>
								<CardTitle>Budget Categories</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{categories.slice(0, 5).map((category: any) => (
										<div key={category.id} className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="font-medium">{category.name}</span>
												<Badge
													variant={
														category.category_type === "income"
															? "default"
															: "secondary"
													}>
													{category.category_type}
												</Badge>
											</div>
											<div className="text-sm text-muted-foreground">
												Budget: {formatCurrency(category.budget_amount || 0)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="transactions" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>All Transactions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{transactions.map((transaction: any) => (
									<div
										key={transaction.id}
										className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex-1">
											<div className="flex items-center gap-4">
												<div
													className={`w-3 h-3 rounded-full ${
														transaction.type === "income"
															? "bg-green-500"
															: "bg-red-500"
													}`}
												/>
												<div>
													<p className="font-medium">
														{transaction.description}
													</p>
													<p className="text-sm text-muted-foreground">
														{new Date(transaction.date).toLocaleDateString()} •{" "}
														{transaction.payment_method}
													</p>
												</div>
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
											<Badge variant="outline" className="text-xs">
												{transaction.budget_categories?.name || "No Category"}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="categories" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Budget Categories</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{categories.map((category: any) => (
									<Card key={category.id}>
										<CardHeader>
											<div className="flex items-center justify-between">
												<CardTitle className="text-lg">
													{category.name}
												</CardTitle>
												<Badge
													variant={
														category.category_type === "income"
															? "default"
															: "secondary"
													}>
													{category.category_type}
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-2">
												{category.description}
											</p>
											<p className="font-medium">
												Budget: {formatCurrency(category.budget_amount || 0)}
											</p>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Enhanced Transaction Modal */}
			<Dialog
				open={showTransactionModal}
				onOpenChange={setShowTransactionModal}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{transactionForm.type === "income" ? (
								<>
									<PiggyBank className="w-5 h-5 text-green-600" />
									Add Income
								</>
							) : (
								<>
									<Receipt className="w-5 h-5 text-red-600" />
									Add Expense
								</>
							)}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label className="text-sm font-medium">
									Transaction Type *
								</Label>
								<Select
									value={transactionForm.type}
									onValueChange={(value) =>
										setTransactionForm({ ...transactionForm, type: value })
									}>
									<SelectTrigger
										className={
											transactionForm.type === "income"
												? "border-green-200"
												: "border-red-200"
										}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="income">
											<div className="flex items-center gap-2">
												<TrendingUp className="w-4 h-4 text-green-600" />
												Income
											</div>
										</SelectItem>
										<SelectItem value="expense">
											<div className="flex items-center gap-2">
												<TrendingDown className="w-4 h-4 text-red-600" />
												Expense
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label className="text-sm font-medium">Amount (₹) *</Label>
								<div className="relative">
									<IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
									<Input
										type="number"
										value={transactionForm.amount}
										onChange={(e) =>
											setTransactionForm({
												...transactionForm,
												amount: e.target.value,
											})
										}
										placeholder="0.00"
										className="pl-10"
										min="0"
										step="0.01"
									/>
								</div>
							</div>
						</div>
						<div>
							<Label className="text-sm font-medium">Description *</Label>
							<Input
								value={transactionForm.description}
								onChange={(e) =>
									setTransactionForm({
										...transactionForm,
										description: e.target.value,
									})
								}
								placeholder={
									transactionForm.type === "income"
										? "e.g., Donation from devotee"
										: "e.g., Temple maintenance"
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Category</Label>
								<Select
									value={transactionForm.category_id}
									onValueChange={(value) =>
										setTransactionForm({
											...transactionForm,
											category_id: value,
										})
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category: any) => (
											<SelectItem key={category.id} value={category.id}>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Payment Method</Label>
								<Select
									value={transactionForm.payment_method}
									onValueChange={(value) =>
										setTransactionForm({
											...transactionForm,
											payment_method: value,
										})
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="cash">Cash</SelectItem>
										<SelectItem value="card">Card</SelectItem>
										<SelectItem value="bank_transfer">Bank Transfer</SelectItem>
										<SelectItem value="upi">UPI</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div>
							<Label>Date</Label>
							<Input
								type="date"
								value={transactionForm.date}
								onChange={(e) =>
									setTransactionForm({
										...transactionForm,
										date: e.target.value,
									})
								}
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => setShowTransactionModal(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleCreateTransaction}
								disabled={createTransactionMutation.isPending}>
								{createTransactionMutation.isPending ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									"Create Transaction"
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Category Modal */}
			<Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Category</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label>Name</Label>
							<Input
								value={categoryForm.name}
								onChange={(e) =>
									setCategoryForm({ ...categoryForm, name: e.target.value })
								}
								placeholder="Category name"
							/>
						</div>
						<div>
							<Label>Description</Label>
							<Textarea
								value={categoryForm.description}
								onChange={(e) =>
									setCategoryForm({
										...categoryForm,
										description: e.target.value,
									})
								}
								placeholder="Category description"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Type</Label>
								<Select
									value={categoryForm.category_type}
									onValueChange={(value) =>
										setCategoryForm({ ...categoryForm, category_type: value })
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="income">Income</SelectItem>
										<SelectItem value="expense">Expense</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Budget Amount</Label>
								<Input
									type="number"
									value={categoryForm.budget_amount}
									onChange={(e) =>
										setCategoryForm({
											...categoryForm,
											budget_amount: e.target.value,
										})
									}
									placeholder="0.00"
								/>
							</div>
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => setShowCategoryModal(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleCreateCategory}
								disabled={createCategoryMutation.isPending}>
								{createCategoryMutation.isPending ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									"Create Category"
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default FinanceManagement;
