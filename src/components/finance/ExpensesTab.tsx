import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Search,
	Plus,
	Download,
	RefreshCw,
	TrendingDown,
	Receipt,
	IndianRupee,
	Loader2,
	Calendar,
	CreditCard,
} from "lucide-react";
import {
	useExpenses,
	useCreateExpense,
	useBudgetCategories,
} from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

export const ExpensesTab = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
	const [showAddModal, setShowAddModal] = useState(false);
	const [newExpense, setNewExpense] = useState({
		vendor_name: "",
		description: "",
		amount: "",
		payment_method: "cash",
		expense_date: new Date().toISOString().split("T")[0],
		budget_category_id: "",
		expense_type: "operational",
		notes: "",
	});

	const { data: expensesData, isLoading, error, refetch } = useExpenses();

	const { data: categoriesData } = useBudgetCategories();
	const createExpenseMutation = useCreateExpense();
	const { toast } = useToast();

	const expenses = expensesData?.data || [];
	const categories = categoriesData?.data || [];

	const filteredExpenses = expenses.filter((expense: any) => {
		const matchesSearch =
			expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			expense.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			categoryFilter === "all" || expense.budget_category_id === categoryFilter;

		const matchesPaymentMethod =
			paymentMethodFilter === "all" ||
			expense.payment_method === paymentMethodFilter;

		return matchesSearch && matchesCategory && matchesPaymentMethod;
	});

	// Calculate expense statistics
	const totalExpenses = expenses.reduce(
		(sum: number, expense: any) => sum + (expense.amount || 0),
		0
	);
	const thisMonthExpenses = expenses
		.filter((expense: any) => {
			const expenseDate = new Date(expense.expense_date);
			const now = new Date();
			return (
				expenseDate.getMonth() === now.getMonth() &&
				expenseDate.getFullYear() === now.getFullYear()
			);
		})
		.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);

	const expenseCategories = categories.filter(
		(cat: any) => cat.category_type === "expense"
	);

	// Debug logging
	React.useEffect(() => {
		console.log("💰 ExpensesTab - Debug Info:", {
			expensesLoading: isLoading,
			expensesError: error?.message,
			totalExpenses: expenses.length,
			rawExpensesData: expensesData,
			expenses: expenses,
			filteredExpenses: filteredExpenses.length,
			filters: {
				searchTerm,
				categoryFilter,
				paymentMethodFilter,
			},
		});

		// Log expenses to see the structure
		if (expenses.length > 0) {
			console.log(
				"💸 All expenses:",
				expenses.map((e) => ({
					id: e.id,
					vendor_name: e.vendor_name,
					amount: e.amount,
					description: e.description,
					expense_date: e.expense_date,
					expense_type: e.expense_type,
					payment_method: e.payment_method,
				}))
			);
		}
	}, [
		expenses,
		isLoading,
		error,
		expensesData,
		filteredExpenses,
		searchTerm,
		categoryFilter,
		paymentMethodFilter,
	]);

	const handleCreateExpense = async () => {
		try {
			console.log("💳 Creating expense with data:", newExpense);

			// Validation
			if (!newExpense.description || !newExpense.amount) {
				toast({
					title: "Validation Error",
					description: "Please fill in description and amount",
					variant: "destructive",
				});
				return;
			}

			const amount = parseFloat(newExpense.amount);
			if (isNaN(amount) || amount <= 0) {
				toast({
					title: "Validation Error",
					description: "Please enter a valid positive amount",
					variant: "destructive",
				});
				return;
			}

			const expenseData = {
				vendor_name: newExpense.vendor_name || undefined,
				description: newExpense.description,
				amount: amount,
				payment_method: newExpense.payment_method,
				expense_date: newExpense.expense_date,
				budget_category_id: newExpense.budget_category_id || null,
				expense_type: newExpense.expense_type || "operational",
				notes: newExpense.notes || undefined,
			};

			console.log("🚀 Sending expense data to API:", expenseData);

			const result = await createExpenseMutation.mutateAsync(expenseData);

			console.log("✅ Expense creation result:", result);

			// Don't show toast here - the mutation hook handles it
			setShowAddModal(false);
			setNewExpense({
				vendor_name: "",
				description: "",
				amount: "",
				payment_method: "cash",
				expense_date: new Date().toISOString().split("T")[0],
				budget_category_id: "",
				expense_type: "operational",
				notes: "",
			});

			console.log("🔄 Expense created, React Query will auto-refresh data");
		} catch (error: any) {
			console.error("❌ Failed to create expense:", error);
			toast({
				title: "Error",
				description: `Failed to add expense: ${error.message}`,
				variant: "destructive",
			});
		}
	};

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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center text-destructive">
						<p className="mb-4">Error loading expenses: {error.message}</p>
						<Button onClick={() => refetch()} variant="outline">
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
						<TrendingDown className="w-6 h-6 text-red-600" />
						Expense Management
					</h2>
					<p className="text-muted-foreground">
						Track and manage temple expenses
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4 mr-2" />
						Export
					</Button>
					<Button
						onClick={() => {
							console.log("🔄 Manual refresh triggered");
							refetch();
						}}
						variant="outline"
						size="sm">
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh ({expenses.length})
					</Button>
				</div>
			</div>

			{/* Enhanced Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="border-red-200 bg-red-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-red-800">
							Total Expenses
						</CardTitle>
						<div className="p-2 bg-red-100 rounded-full">
							<Receipt className="h-4 w-4 text-red-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-700">
							{formatCurrency(totalExpenses)}
						</div>
						<p className="text-xs text-red-600 mt-1">All time expenses</p>
					</CardContent>
				</Card>

				<Card className="border-orange-200 bg-orange-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-orange-800">
							This Month
						</CardTitle>
						<div className="p-2 bg-orange-100 rounded-full">
							<Calendar className="h-4 w-4 text-orange-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-700">
							{formatCurrency(thisMonthExpenses)}
						</div>
						<p className="text-xs text-orange-600 mt-1">Current month</p>
					</CardContent>
				</Card>

				<Card className="border-blue-200 bg-blue-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-blue-800">
							Total Count
						</CardTitle>
						<div className="p-2 bg-blue-100 rounded-full">
							<CreditCard className="h-4 w-4 text-blue-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-700">
							{expenses.length}
						</div>
						<p className="text-xs text-blue-600 mt-1">Total transactions</p>
					</CardContent>
				</Card>

				<Card className="border-purple-200 bg-purple-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-purple-800">
							Categories
						</CardTitle>
						<div className="p-2 bg-purple-100 rounded-full">
							<IndianRupee className="h-4 w-4 text-purple-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-700">
							{expenseCategories.length}
						</div>
						<p className="text-xs text-purple-600 mt-1">Expense categories</p>
					</CardContent>
				</Card>
			</div>

			{/* Expenses List */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Receipt className="w-5 h-5 text-red-600" />
							Expense Transactions
						</CardTitle>
						<Dialog open={showAddModal} onOpenChange={setShowAddModal}>
							<DialogTrigger asChild>
								<Button className="bg-red-600 hover:bg-red-700">
									<Plus className="h-4 w-4 mr-2" />
									Add Expense
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle className="flex items-center gap-2">
										<Receipt className="w-5 h-5 text-red-600" />
										Add New Expense
									</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label
												htmlFor="vendor_name"
												className="text-sm font-medium">
												Vendor Name
											</Label>
											<Input
												id="vendor_name"
												value={newExpense.vendor_name}
												onChange={(e) =>
													setNewExpense({
														...newExpense,
														vendor_name: e.target.value,
													})
												}
												placeholder="e.g., ABC Electrical Services"
											/>
										</div>
										<div>
											<Label
												htmlFor="description"
												className="text-sm font-medium">
												Description *
											</Label>
											<Input
												id="description"
												value={newExpense.description}
												onChange={(e) =>
													setNewExpense({
														...newExpense,
														description: e.target.value,
													})
												}
												placeholder="e.g., Monthly electricity bill"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="amount" className="text-sm font-medium">
												Amount (₹) *
											</Label>
											<div className="relative">
												<IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
												<Input
													id="amount"
													type="number"
													value={newExpense.amount}
													onChange={(e) =>
														setNewExpense({
															...newExpense,
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
										<div>
											<Label
												htmlFor="payment_method"
												className="text-sm font-medium">
												Payment Method
											</Label>
											<Select
												value={newExpense.payment_method}
												onValueChange={(value) =>
													setNewExpense({
														...newExpense,
														payment_method: value,
													})
												}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="cash">💵 Cash</SelectItem>
													<SelectItem value="bank_transfer">
														🏦 Bank Transfer
													</SelectItem>
													<SelectItem value="card">💳 Card</SelectItem>
													<SelectItem value="cheque">📄 Cheque</SelectItem>
													<SelectItem value="upi">📱 UPI</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="grid grid-cols-3 gap-4">
										<div>
											<Label
												htmlFor="expense_type"
												className="text-sm font-medium">
												Expense Type
											</Label>
											<Select
												value={newExpense.expense_type}
												onValueChange={(value) =>
													setNewExpense({
														...newExpense,
														expense_type: value,
													})
												}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="operational">
														🏢 Operational
													</SelectItem>
													<SelectItem value="maintenance">
														🔧 Maintenance
													</SelectItem>
													<SelectItem value="utilities">
														⚡ Utilities
													</SelectItem>
													<SelectItem value="salaries">👥 Salaries</SelectItem>
													<SelectItem value="materials">
														📦 Materials
													</SelectItem>
													<SelectItem value="events">🎉 Events</SelectItem>
													<SelectItem value="other">📋 Other</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label
												htmlFor="budget_category_id"
												className="text-sm font-medium">
												Budget Category
											</Label>
											<Select
												value={newExpense.budget_category_id}
												onValueChange={(value) =>
													setNewExpense({
														...newExpense,
														budget_category_id: value,
													})
												}>
												<SelectTrigger>
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													{expenseCategories.map((category: any) => (
														<SelectItem key={category.id} value={category.id}>
															{category.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label
												htmlFor="expense_date"
												className="text-sm font-medium">
												Expense Date
											</Label>
											<Input
												id="expense_date"
												type="date"
												value={newExpense.expense_date}
												onChange={(e) =>
													setNewExpense({
														...newExpense,
														expense_date: e.target.value,
													})
												}
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="notes" className="text-sm font-medium">
											Notes
										</Label>
										<Textarea
											id="notes"
											value={newExpense.notes}
											onChange={(e) =>
												setNewExpense({
													...newExpense,
													notes: e.target.value,
												})
											}
											placeholder="Additional notes..."
											rows={3}
										/>
									</div>
								</div>
								<div className="flex justify-end space-x-2 pt-4">
									<Button
										variant="outline"
										onClick={() => setShowAddModal(false)}>
										Cancel
									</Button>
									<Button
										onClick={handleCreateExpense}
										disabled={createExpenseMutation.isPending}
										className="bg-red-600 hover:bg-red-700">
										{createExpenseMutation.isPending ? (
											<>
												<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												Adding...
											</>
										) : (
											"Add Expense"
										)}
									</Button>
								</div>
							</DialogContent>
						</Dialog>
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
								{expenseCategories.map((category: any) => (
									<SelectItem key={category.id} value={category.id}>
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={paymentMethodFilter}
							onValueChange={setPaymentMethodFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Payment method" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Methods</SelectItem>
								<SelectItem value="cash">💵 Cash</SelectItem>
								<SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
								<SelectItem value="card">💳 Card</SelectItem>
								<SelectItem value="cheque">📄 Cheque</SelectItem>
								<SelectItem value="upi">📱 UPI</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Debug Info */}
					<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
						<h4 className="font-medium text-yellow-800 mb-2">
							Debug Information
						</h4>
						<div className="text-sm text-yellow-700 space-y-1">
							<p>Total Expenses: {expenses.length}</p>
							<p>Filtered Expenses: {filteredExpenses.length}</p>
							<p>Loading: {isLoading ? "Yes" : "No"}</p>
							<p>Error: {error ? error.message : "None"}</p>
							<p>Search Term: "{searchTerm}"</p>
							<p>Category Filter: {categoryFilter}</p>
							<p>Payment Method Filter: {paymentMethodFilter}</p>
							<p>API Endpoint: /api/expenses</p>
						</div>
					</div>

					<div className="space-y-4">
						{filteredExpenses.map((expense: any) => (
							<div
								key={expense.id}
								className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
								<div className="flex-1">
									<div className="flex items-center gap-4">
										<div className="w-3 h-3 rounded-full bg-red-500" />
										<div>
											<p className="font-medium">{expense.description}</p>
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<span>
													{getPaymentMethodIcon(expense.payment_method)}{" "}
													{expense.payment_method}
												</span>
												<span>•</span>
												<span>
													{new Date(expense.expense_date).toLocaleDateString()}
												</span>
												{expense.vendor_name && (
													<>
														<span>•</span>
														<span className="text-blue-600">
															{expense.vendor_name}
														</span>
													</>
												)}
												{expense.expense_type && (
													<>
														<span>•</span>
														<Badge variant="secondary" className="text-xs">
															{expense.expense_type}
														</Badge>
													</>
												)}
												{expense.budget_categories?.name && (
													<>
														<span>•</span>
														<Badge variant="outline" className="text-xs">
															{expense.budget_categories.name}
														</Badge>
													</>
												)}
											</div>
											{expense.notes && (
												<p className="text-xs text-gray-600 mt-1">
													{expense.notes}
												</p>
											)}
										</div>
									</div>
								</div>
								<div className="text-right">
									<p className="font-medium text-red-600">
										-{formatCurrency(expense.amount)}
									</p>
								</div>
							</div>
						))}
						{filteredExpenses.length === 0 && (
							<div className="text-center py-12 text-muted-foreground">
								<Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
								<p className="text-lg font-medium mb-2">No expenses found</p>
								<p className="text-sm">
									{searchTerm ||
									categoryFilter !== "all" ||
									paymentMethodFilter !== "all"
										? "Try adjusting your filters"
										: "Add your first expense to get started"}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
