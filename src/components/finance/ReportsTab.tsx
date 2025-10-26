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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	FileText,
	Download,
	Calendar,
	BarChart3,
	PieChart,
	TrendingUp,
	Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ReportsTab = () => {
	const [selectedReportType, setSelectedReportType] = useState("");
	const [dateRange, setDateRange] = useState({ from: "", to: "" });
	const [selectedCommunity, setSelectedCommunity] = useState("all");
	const [reportFormat, setReportFormat] = useState("pdf");
	const [showCustomBuilder, setShowCustomBuilder] = useState(false);

	const reportTypes = [
		{ id: "income-statement", name: "Income Statement", icon: BarChart3 },
		{ id: "cash-flow", name: "Cash Flow Report", icon: TrendingUp },
		{ id: "donor-report", name: "Donor Report", icon: Users },
		{
			id: "community-summary",
			name: "Community Financial Summary",
			icon: PieChart,
		},
		{ id: "tax-report", name: "Tax Report (80G)", icon: FileText },
	];

	const quickReports = [
		{
			name: "Monthly Summary",
			period: "Current Month",
			description: "Complete financial summary for the current month",
		},
		{
			name: "Quarterly Report",
			period: "Current Quarter",
			description: "Quarterly financial performance report",
		},
		{
			name: "Annual Report",
			period: "Current Year",
			description: "Annual financial statement and summary",
		},
		{
			name: "Top Donors",
			period: "Last 12 Months",
			description: "List of top donors and their contributions",
		},
	];

	const generateReport = () => {
		// Mock report generation
		console.log("Generating report:", {
			type: selectedReportType,
			dateRange,
			community: selectedCommunity,
			format: reportFormat,
		});
	};

	return (
		<div className="space-y-6">
			{/* Report Generation Panel */}
			<Card>
				<CardHeader>
					<CardTitle>Generate Financial Report</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label>Report Type</Label>
							<Select
								value={selectedReportType}
								onValueChange={setSelectedReportType}>
								<SelectTrigger>
									<SelectValue placeholder="Select report type" />
								</SelectTrigger>
								<SelectContent>
									{reportTypes.map((type) => (
										<SelectItem key={type.id} value={type.id}>
											{type.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Date Range</Label>
							<div className="flex space-x-2">
								<Input
									type="date"
									value={dateRange.from}
									onChange={(e) =>
										setDateRange((prev) => ({ ...prev, from: e.target.value }))
									}
									className="flex-1"
								/>
								<Input
									type="date"
									value={dateRange.to}
									onChange={(e) =>
										setDateRange((prev) => ({ ...prev, to: e.target.value }))
									}
									className="flex-1"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Community</Label>
							<Select
								value={selectedCommunity}
								onValueChange={setSelectedCommunity}>
								<SelectTrigger>
									<SelectValue placeholder="Select community" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Communities</SelectItem>
									<SelectItem value="comm-1">Main Temple</SelectItem>
									<SelectItem value="comm-2">Youth Group</SelectItem>
									<SelectItem value="comm-3">Women's Group</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Format</Label>
							<Select value={reportFormat} onValueChange={setReportFormat}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="pdf">PDF</SelectItem>
									<SelectItem value="excel">Excel</SelectItem>
									<SelectItem value="csv">CSV</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex justify-end space-x-2">
						<Dialog
							open={showCustomBuilder}
							onOpenChange={setShowCustomBuilder}>
							<DialogTrigger asChild>
								<Button variant="outline">Custom Report Builder</Button>
							</DialogTrigger>
							<DialogContent className="max-w-4xl">
								<DialogHeader>
									<DialogTitle>Custom Report Builder</DialogTitle>
								</DialogHeader>
								<div className="space-y-6">
									<div>
										<h4 className="font-medium mb-3">Data Selection</h4>
										<div className="grid grid-cols-3 gap-4">
											<div className="space-y-2">
												<Label>Tables</Label>
												<div className="space-y-2">
													<label className="flex items-center space-x-2">
														<input type="checkbox" defaultChecked />
														<span className="text-sm">Donations</span>
													</label>
													<label className="flex items-center space-x-2">
														<input type="checkbox" defaultChecked />
														<span className="text-sm">Expenses</span>
													</label>
													<label className="flex items-center space-x-2">
														<input type="checkbox" />
														<span className="text-sm">Budgets</span>
													</label>
												</div>
											</div>
											<div className="space-y-2">
												<Label>Columns</Label>
												<div className="space-y-2">
													<label className="flex items-center space-x-2">
														<input type="checkbox" defaultChecked />
														<span className="text-sm">Amount</span>
													</label>
													<label className="flex items-center space-x-2">
														<input type="checkbox" defaultChecked />
														<span className="text-sm">Date</span>
													</label>
													<label className="flex items-center space-x-2">
														<input type="checkbox" />
														<span className="text-sm">Source/Category</span>
													</label>
													<label className="flex items-center space-x-2">
														<input type="checkbox" />
														<span className="text-sm">Community</span>
													</label>
												</div>
											</div>
											<div className="space-y-2">
												<Label>Filters</Label>
												<div className="space-y-2">
													<Select>
														<SelectTrigger>
															<SelectValue placeholder="Add filter" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="amount">
																Amount Range
															</SelectItem>
															<SelectItem value="date">Date Range</SelectItem>
															<SelectItem value="status">Status</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-medium mb-3">Grouping & Aggregation</h4>
										<div className="grid grid-cols-3 gap-4">
											<div className="space-y-2">
												<Label>Group By</Label>
												<Select>
													<SelectTrigger>
														<SelectValue placeholder="Select grouping" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="date">Date</SelectItem>
														<SelectItem value="community">Community</SelectItem>
														<SelectItem value="category">Category</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>Aggregation</Label>
												<Select>
													<SelectTrigger>
														<SelectValue placeholder="Select function" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="sum">Sum</SelectItem>
														<SelectItem value="count">Count</SelectItem>
														<SelectItem value="average">Average</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>Sort By</Label>
												<Select>
													<SelectTrigger>
														<SelectValue placeholder="Sort order" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="date-desc">
															Date (Newest)
														</SelectItem>
														<SelectItem value="date-asc">
															Date (Oldest)
														</SelectItem>
														<SelectItem value="amount-desc">
															Amount (High to Low)
														</SelectItem>
														<SelectItem value="amount-asc">
															Amount (Low to High)
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-medium mb-3">Visualization</h4>
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label>Chart Type</Label>
												<Select>
													<SelectTrigger>
														<SelectValue placeholder="Select chart" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="bar">Bar Chart</SelectItem>
														<SelectItem value="line">Line Chart</SelectItem>
														<SelectItem value="pie">Pie Chart</SelectItem>
														<SelectItem value="table">Table Only</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>Export Format</Label>
												<Select>
													<SelectTrigger>
														<SelectValue placeholder="Select format" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="pdf">PDF</SelectItem>
														<SelectItem value="excel">Excel</SelectItem>
														<SelectItem value="csv">CSV</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>

									<div className="flex justify-end space-x-2">
										<Button
											variant="outline"
											onClick={() => setShowCustomBuilder(false)}>
											Cancel
										</Button>
										<Button onClick={() => setShowCustomBuilder(false)}>
											Generate Custom Report
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>

						<Button onClick={generateReport} disabled={!selectedReportType}>
							<Download className="h-4 w-4 mr-2" />
							Generate Report
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Quick Reports */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Reports</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{quickReports.map((report, index) => (
							<div
								key={index}
								className="border rounded-lg p-4 hover:shadow-md transition-shadow">
								<div className="flex justify-between items-start mb-2">
									<h4 className="font-medium">{report.name}</h4>
									<Badge variant="outline">{report.period}</Badge>
								</div>
								<p className="text-sm text-gray-600 mb-3">
									{report.description}
								</p>
								<Button size="sm" variant="outline" className="w-full">
									<Download className="h-4 w-4 mr-2" />
									Generate
								</Button>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Report Types Grid */}
			<Card>
				<CardHeader>
					<CardTitle>Available Report Types</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{reportTypes.map((type) => {
							const Icon = type.icon;
							return (
								<div
									key={type.id}
									className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
									<div className="flex items-center space-x-3 mb-3">
										<div className="p-2 bg-blue-100 rounded-lg">
											<Icon className="h-5 w-5 text-blue-600" />
										</div>
										<h4 className="font-medium">{type.name}</h4>
									</div>
									<p className="text-sm text-gray-600 mb-3">
										{type.id === "income-statement" &&
											"Comprehensive income and expense statement with period comparisons"}
										{type.id === "cash-flow" &&
											"Cash flow analysis showing money movement and liquidity"}
										{type.id === "donor-report" &&
											"Detailed donor analysis with contribution patterns and trends"}
										{type.id === "community-summary" &&
											"Financial summary broken down by community activities"}
										{type.id === "tax-report" &&
											"80G tax exemption report for compliance and donor receipts"}
									</p>
									<Button
										size="sm"
										variant="outline"
										className="w-full"
										onClick={() => setSelectedReportType(type.id)}>
										Select Report
									</Button>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Sample Report Preview */}
			<Card>
				<CardHeader>
					<CardTitle>Sample Report Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="bg-gray-50 rounded-lg p-6">
						<div className="text-center mb-6">
							<h3 className="text-xl font-bold">Monthly Financial Summary</h3>
							<p className="text-gray-600">January 2024</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="text-center">
								<p className="text-sm text-gray-600">Total Donations</p>
								<p className="text-2xl font-bold text-green-600">₹1,25,000</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-600">Total Expenses</p>
								<p className="text-2xl font-bold text-red-600">₹85,000</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-600">Net Income</p>
								<p className="text-2xl font-bold text-blue-600">₹40,000</p>
							</div>
						</div>

						<div className="border-t pt-4">
							<h4 className="font-medium mb-3">Donation Sources</h4>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span>Web Gateway</span>
									<span>₹75,000 (60%)</span>
								</div>
								<div className="flex justify-between">
									<span>Hundi Collection</span>
									<span>₹30,000 (24%)</span>
								</div>
								<div className="flex justify-between">
									<span>In-temple</span>
									<span>₹15,000 (12%)</span>
								</div>
								<div className="flex justify-between">
									<span>Bank Transfer</span>
									<span>₹5,000 (4%)</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
