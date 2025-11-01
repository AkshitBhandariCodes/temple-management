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
	Heart,
	Plus,
	Calendar,
	CreditCard,
	Loader2,
	IndianRupee,
	User,
	Mail,
	Phone,
	MapPin,
	Receipt,
	TrendingUp,
	Users,
	Target,
} from "lucide-react";
import {
	useDonationsTable,
	useCreateDonation,
	useDonationCategories,
	useDonationsSummary,
	useTopDonors,
} from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

const DonationsManagement = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [showDonationModal, setShowDonationModal] = useState(false);
	const { toast } = useToast();

	// API hooks
	const {
		data: donationsData,
		isLoading: donationsLoading,
		error: donationsError,
		refetch: refetchDonations,
	} = useDonationsTable();

	const {
		data: summaryData,
		isLoading: summaryLoading,
		error: summaryError,
	} = useDonationsSummary();

	const { data: categoriesData, isLoading: categoriesLoading } =
		useDonationCategories();

	const { data: topDonorsData, isLoading: topDonorsLoading } = useTopDonors();

	const createDonationMutation = useCreateDonation();

	// Data extraction
	const donations = donationsData?.data || [];
	const summary = summaryData?.data || {};
	const categories = categoriesData?.data || [];
	const topDonors = topDonorsData?.data || [];

	// Form state
	const [donationForm, setDonationForm] = useState({
		donor_name: "",
		donor_email: "",
		donor_phone: "",
		amount: "",
		donation_type: "general",
		payment_method: "cash",
		purpose: "",
		notes: "",
	});

	const handleCreateDonation = async () => {
		try {
			console.log("💰 Creating donation with form data:", donationForm);

			// Enhanced validation
			if (!donationForm.amount) {
				toast({
					title: "Validation Error",
					description: "Please enter donation amount",
					variant: "destructive",
				});
				return;
			}

			// Validate amount is positive number
			const amount = parseFloat(donationForm.amount);
			if (isNaN(amount) || amount <= 0) {
				toast({
					title: "Validation Error",
					description: "Please enter a valid positive amount",
					variant: "destructive",
				});
				return;
			}

			const donationData = {
				...donationForm,
				amount: amount,
				// Clean up empty strings
				donor_name: donationForm.donor_name.trim() || null,
				donor_email: donationForm.donor_email.trim() || null,
				donor_phone: donationForm.donor_phone.trim() || null,
				purpose: donationForm.purpose.trim() || null,
				notes: donationForm.notes.trim() || null,
			};

			console.log("🚀 Sending donation data to API:", donationData);

			await createDonationMutation.mutateAsync(donationData);

			setShowDonationModal(false);
			setDonationForm({
				donor_name: "",
				donor_email: "",
				donor_phone: "",
				amount: "",
				donation_type: "general",
				payment_method: "cash",
				purpose: "",
				notes: "",
			});

			console.log("✅ Donation created successfully");
		} catch (error) {
			console.error("❌ Failed to create donation:", error);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	const getDonationTypeLabel = (type: string) => {
		const labels = {
			general: "General Donation",
			temple_construction: "Temple Construction",
			festival: "Festival Celebration",
			puja_sponsorship: "Puja Sponsorship",
			annadanam: "Annadanam",
			education: "Education Fund",
			medical: "Medical Aid",
			other: "Other",
		};
		return labels[type] || type;
	};

	const getPaymentMethodIcon = (method: string) => {
		const icons = {
			cash: "💵",
			upi: "📱",
			bank_transfer: "🏦",
			card: "💳",
			cheque: "📄",
			online: "🌐",
		};
		return icons[method] || "💰";
	};

	if (donationsLoading || summaryLoading) {
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
						<Heart className="w-6 h-6 text-red-500" />
						Donations Management
					</h2>
					<p className="text-muted-foreground">
						Manage temple donations and track donor contributions
					</p>
					{/* Status indicator */}
					{donationsError ? (
						<div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
							<p className="text-sm font-medium text-red-800">⚠️ API Error:</p>
							<p className="text-xs text-red-600">{donationsError.message}</p>
						</div>
					) : (
						<div className="mt-1 text-xs text-green-600">
							✅ {donations.length} donations loaded
						</div>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						onClick={() => setShowDonationModal(true)}
						className="bg-red-600 hover:bg-red-700">
						<Heart className="w-4 h-4 mr-2" />
						Add Donation
					</Button>
					<Button
						onClick={() => refetchDonations()}
						variant="outline"
						size="sm">
						🔄 Refresh
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="border-red-200 bg-red-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-red-800">
							Total Donations
						</CardTitle>
						<Heart className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-700">
							{formatCurrency(summary.totalAmount || 0)}
						</div>
						<p className="text-xs text-red-600 mt-1">
							{summary.totalCount || 0} donations received
						</p>
					</CardContent>
				</Card>

				<Card className="border-green-200 bg-green-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-green-800">
							This Month
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-700">
							{formatCurrency(summary.thisMonthAmount || 0)}
						</div>
						<p className="text-xs text-green-600 mt-1">
							{summary.thisMonthCount || 0} donations this month
						</p>
					</CardContent>
				</Card>

				<Card className="border-blue-200 bg-blue-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-blue-800">
							Average Donation
						</CardTitle>
						<Target className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-700">
							{formatCurrency(summary.averageAmount || 0)}
						</div>
						<p className="text-xs text-blue-600 mt-1">Per donation average</p>
					</CardContent>
				</Card>

				<Card className="border-purple-200 bg-purple-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-purple-800">
							Active Donors
						</CardTitle>
						<Users className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-700">
							{topDonors.length}
						</div>
						<p className="text-xs text-purple-600 mt-1">Registered donors</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="donations">All Donations</TabsTrigger>
					<TabsTrigger value="donors">Top Donors</TabsTrigger>
					<TabsTrigger value="categories">Categories</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Recent Donations */}
						<Card>
							<CardHeader>
								<CardTitle>Recent Donations</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{donations.slice(0, 5).map((donation: any) => (
										<div
											key={donation.id}
											className="flex items-center justify-between p-3 border rounded-lg">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
													<Heart className="w-5 h-5 text-red-600" />
												</div>
												<div>
													<p className="font-medium">
														{donation.donor_name || "Anonymous"}
													</p>
													<p className="text-sm text-muted-foreground">
														{getDonationTypeLabel(donation.donation_type)}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-bold text-red-600">
													{formatCurrency(donation.amount)}
												</p>
												<p className="text-xs text-muted-foreground">
													{getPaymentMethodIcon(donation.payment_method)}{" "}
													{donation.payment_method}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Donation Categories Progress */}
						<Card>
							<CardHeader>
								<CardTitle>Category Progress</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{categories.slice(0, 5).map((category: any) => {
										const percentage =
											category.target_amount > 0
												? (category.collected_amount / category.target_amount) *
												  100
												: 0;
										return (
											<div key={category.id} className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="font-medium text-sm">
														{category.name}
													</span>
													<span className="text-sm text-muted-foreground">
														{Math.round(percentage)}%
													</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div
														className="bg-red-600 h-2 rounded-full transition-all duration-300"
														style={{
															width: `${Math.min(percentage, 100)}%`,
														}}></div>
												</div>
												<div className="flex justify-between text-xs text-muted-foreground">
													<span>
														{formatCurrency(category.collected_amount)}
													</span>
													<span>{formatCurrency(category.target_amount)}</span>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="donations" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>All Donations</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{donations.map((donation: any) => (
									<div
										key={donation.id}
										className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
										<div className="flex-1">
											<div className="flex items-center gap-4">
												<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
													<Heart className="w-6 h-6 text-red-600" />
												</div>
												<div>
													<p className="font-medium">
														{donation.donor_name || "Anonymous Donor"}
													</p>
													<div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
														<span>
															{getDonationTypeLabel(donation.donation_type)}
														</span>
														<span>•</span>
														<span>{donation.donation_date}</span>
														<span>•</span>
														<span>
															{getPaymentMethodIcon(donation.payment_method)}{" "}
															{donation.payment_method}
														</span>
													</div>
													{donation.purpose && (
														<p className="text-sm text-gray-600 mt-1">
															Purpose: {donation.purpose}
														</p>
													)}
												</div>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-red-600 text-lg">
												{formatCurrency(donation.amount)}
											</p>
											{donation.receipt_number && (
												<p className="text-xs text-muted-foreground">
													Receipt: {donation.receipt_number}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="donors" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Top Donors</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{topDonors.map((donor: any, index: number) => (
									<div
										key={donor.donor_email || index}
										className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
												{index + 1}
											</div>
											<div>
												<p className="font-medium">{donor.donor_name}</p>
												<p className="text-sm text-muted-foreground">
													{donor.donation_count} donations • Last:{" "}
													{donor.last_donation_date}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-red-600">
												{formatCurrency(donor.total_donated)}
											</p>
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
							<CardTitle>Donation Categories</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{categories.map((category: any) => (
									<Card key={category.id} className="border-red-200">
										<CardHeader>
											<CardTitle className="text-lg">{category.name}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground mb-4">
												{category.description}
											</p>
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>Collected:</span>
													<span className="font-medium">
														{formatCurrency(category.collected_amount)}
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span>Target:</span>
													<span className="font-medium">
														{formatCurrency(category.target_amount)}
													</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div
														className="bg-red-600 h-2 rounded-full"
														style={{
															width: `${Math.min(
																(category.collected_amount /
																	category.target_amount) *
																	100,
																100
															)}%`,
														}}></div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Create Donation Modal */}
			<Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Heart className="w-5 h-5 text-red-600" />
							Add New Donation
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						{/* Donor Information */}
						<div>
							<h3 className="font-medium mb-3">Donor Information (Optional)</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label>Donor Name</Label>
									<Input
										value={donationForm.donor_name}
										onChange={(e) =>
											setDonationForm({
												...donationForm,
												donor_name: e.target.value,
											})
										}
										placeholder="Enter donor name"
									/>
								</div>
								<div>
									<Label>Email</Label>
									<Input
										type="email"
										value={donationForm.donor_email}
										onChange={(e) =>
											setDonationForm({
												...donationForm,
												donor_email: e.target.value,
											})
										}
										placeholder="donor@email.com"
									/>
								</div>
								<div>
									<Label>Phone</Label>
									<Input
										value={donationForm.donor_phone}
										onChange={(e) =>
											setDonationForm({
												...donationForm,
												donor_phone: e.target.value,
											})
										}
										placeholder="+91-9876543210"
									/>
								</div>
							</div>
						</div>

						{/* Donation Details */}
						<div>
							<h3 className="font-medium mb-3">Donation Details</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label>Amount (₹) *</Label>
									<div className="relative">
										<IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
										<Input
											type="number"
											value={donationForm.amount}
											onChange={(e) =>
												setDonationForm({
													...donationForm,
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
									<Label>Donation Type</Label>
									<Select
										value={donationForm.donation_type}
										onValueChange={(value) =>
											setDonationForm({ ...donationForm, donation_type: value })
										}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="general">General Donation</SelectItem>
											<SelectItem value="temple_construction">
												Temple Construction
											</SelectItem>
											<SelectItem value="festival">
												Festival Celebration
											</SelectItem>
											<SelectItem value="puja_sponsorship">
												Puja Sponsorship
											</SelectItem>
											<SelectItem value="annadanam">Annadanam</SelectItem>
											<SelectItem value="education">Education Fund</SelectItem>
											<SelectItem value="medical">Medical Aid</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Payment Method</Label>
									<Select
										value={donationForm.payment_method}
										onValueChange={(value) =>
											setDonationForm({
												...donationForm,
												payment_method: value,
											})
										}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cash">💵 Cash</SelectItem>
											<SelectItem value="upi">📱 UPI</SelectItem>
											<SelectItem value="bank_transfer">
												🏦 Bank Transfer
											</SelectItem>
											<SelectItem value="card">💳 Card</SelectItem>
											<SelectItem value="cheque">📄 Cheque</SelectItem>
											<SelectItem value="online">🌐 Online</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Additional Information */}
						<div>
							<h3 className="font-medium mb-3">Additional Information</h3>
							<div className="space-y-4">
								<div>
									<Label>Purpose/Dedication</Label>
									<Input
										value={donationForm.purpose}
										onChange={(e) =>
											setDonationForm({
												...donationForm,
												purpose: e.target.value,
											})
										}
										placeholder="e.g., In memory of..., For specific puja..."
									/>
								</div>
								<div>
									<Label>Notes</Label>
									<Textarea
										value={donationForm.notes}
										onChange={(e) =>
											setDonationForm({
												...donationForm,
												notes: e.target.value,
											})
										}
										placeholder="Additional notes about the donation"
										rows={3}
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => setShowDonationModal(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleCreateDonation}
								disabled={createDonationMutation.isPending}
								className="bg-red-600 hover:bg-red-700">
								{createDonationMutation.isPending ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									"Create Donation"
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DonationsManagement;
