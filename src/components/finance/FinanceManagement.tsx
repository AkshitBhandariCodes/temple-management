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
} from "lucide-react";
import {
	useBudgetCategories,
	useCreateBudgetCategory,
	useTransactions,
	useCreateTransaction,
	useFinancialSummary,
} from "@/hooks/use-complete-api";

const FinanceManagement = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [showTransactionModal, setShowTransactionModal] = useState(false);
	const [showCategoryModal, setShowCategoryModal] = useState(false);

	// API hooks
	const { data: categoriesData, isLoading: categoriesLoading } =
		useBudgetCategories();
	const { data: transactionsData, isLoading: transactionsLoading } =
		useTransactions();
	const { data: summaryData, isLoading: summaryLoading } =
		useFinancialSummary();
	const createCategoryMutation = useCreateBudgetCategory();
	const createTransactionMutation = useCreateTransaction();

	const categories = categoriesData?.data || [];
	const transactions = transactionsData?.data || [];
	const summary = summaryData?.data || {};

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
			await createTransactionMutation.mutateAsync({
				...transactionForm,
				amount: parseFloat(transactionForm.amount),
				budget_amount: transactionForm.budget_amount
					? parseFloat(transactionForm.budget_amount)
					: undefined,
			});
			setShowTransactionModal(false);
			setTransactionForm({
				type: "expense",
				amount: "",
				description: "",
				category_id: "",
				payment_method: "cash",
				date: new Date().toISOString().split("T")[0],
			});
		} catch (error) {
			console.error("Failed to create transaction:", error);
		}
	};

	const handleCreateCategory = async () => {
		try {
			await createCategoryMutation.mutateAsync({
				...categoryForm,
				budget_amount: categoryForm.budget_amount
					? parseFloat(categoryForm.budget_amount)
					: 0,
			});
			setShowCategoryModal(false);
			setCategoryForm({
				name: "",
				description: "",
				budget_amount: "",
				category_type: "expense",
			});
		} catch (error) {
			console.error("Failed to create category:", error);
		}
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
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Finance Management</h2>
					<p className="text-muted-foreground">
						Track income, expenses, and budget
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Button onClick={() => setShowCategoryModal(true)} variant="outline">
						<Plus className="w-4 h-4 mr-2" />
						Add Category
					</Button>
					<Button onClick={() => setShowTransactionModal(true)}>
						<Plus className="w-4 h-4 mr-2" />
						Add Transaction
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Income</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{formatCurrency(summary.totalIncome || 0)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Expenses
						</CardTitle>
						<TrendingDown className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{formatCurrency(summary.totalExpenses || 0)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Net Amount</CardTitle>
						<DollarSign className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${
								(summary.netAmount || 0) >= 0
									? "text-green-600"
									: "text-red-600"
							}`}>
							{formatCurrency(summary.netAmount || 0)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Transactions</CardTitle>
						<CreditCard className="h-4 w-4 text-gray-600" />
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

			{/* Transaction Modal */}
			<Dialog
				open={showTransactionModal}
				onOpenChange={setShowTransactionModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Transaction</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Type</Label>
								<Select
									value={transactionForm.type}
									onValueChange={(value) =>
										setTransactionForm({ ...transactionForm, type: value })
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
								<Label>Amount</Label>
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
								/>
							</div>
						</div>
						<div>
							<Label>Description</Label>
							<Input
								value={transactionForm.description}
								onChange={(e) =>
									setTransactionForm({
										...transactionForm,
										description: e.target.value,
									})
								}
								placeholder="Transaction description"
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
