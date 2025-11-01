import React, { useState } from "react";
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
	Filter,
	Plus,
	Eye,
	Download,
	RefreshCw,
	Check,
} from "lucide-react";
import { useDonationsTable, useCreateDonation } from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

export const DonationsTab = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sourceFilter, setSourceFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [showAddModal, setShowAddModal] = useState(false);
	const [newDonation, setNewDonation] = useState({
		donor_name: "",
		donor_email: "",
		donor_phone: "",
		amount: "",
		donation_type: "general",
		payment_method: "cash",
		purpose: "",
		notes: "",
	});

	const {
		data: donationsData,
		isLoading,
		error,
		refetch,
	} = useDonationsTable();

	const createDonationMutation = useCreateDonation();

	const donations = donationsData?.data || [];
	const { toast } = useToast();

	const filteredDonations = donations.filter((donation: any) => {
		const matchesSearch =
			donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			donation.receipt_number
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			donation.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	const handleCreateDonation = async () => {
		try {
			await createDonationMutation.mutateAsync({
				donor_name: newDonation.donor_name || undefined,
				donor_email: newDonation.donor_email || undefined,
				donor_phone: newDonation.donor_phone || undefined,
				amount: parseFloat(newDonation.amount),
				donation_type: newDonation.donation_type,
				payment_method: newDonation.payment_method,
				purpose: newDonation.purpose || undefined,
				notes: newDonation.notes || undefined,
			});

			setShowAddModal(false);
			setNewDonation({
				donor_name: "",
				donor_email: "",
				donor_phone: "",
				amount: "",
				donation_type: "general",
				payment_method: "cash",
				purpose: "",
				notes: "",
			});
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	const getStatusBadge = (status: string) => {
		const variants: Record<
			string,
			"default" | "secondary" | "destructive" | "outline"
		> = {
			completed: "default",
			pending: "secondary",
			failed: "destructive",
			refunded: "outline",
		};
		return variants[status] || "default";
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center text-destructive">
						Error loading donations: {error.message}
						<Button onClick={() => refetch()} className="ml-2">
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
			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">
							{formatCurrency(
								donations.reduce((sum, d) => sum + d.net_amount, 0)
							)}
						</div>
						<p className="text-xs text-muted-foreground">Total Donations</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{donations.length}</div>
						<p className="text-xs text-muted-foreground">Total Count</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">
							{donations.filter((d) => d.status === "completed").length}
						</div>
						<p className="text-xs text-muted-foreground">Completed</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">
							{donations.filter((d) => d.status === "pending").length}
						</div>
						<p className="text-xs text-muted-foreground">Pending</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Actions */}
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
						<CardTitle>Donations</CardTitle>
						<div className="flex gap-2">
							<Button variant="outline" size="sm">
								<Download className="h-4 w-4 mr-2" />
								Export
							</Button>
							<Dialog open={showAddModal} onOpenChange={setShowAddModal}>
								<DialogTrigger asChild>
									<Button size="sm">
										<Plus className="h-4 w-4 mr-2" />
										Add Donation
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-2xl">
									<DialogHeader>
										<DialogTitle>Add New Donation</DialogTitle>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<Label htmlFor="amount">Amount (₹) *</Label>
												<Input
													id="amount"
													type="number"
													value={newDonation.amount}
													onChange={(e) =>
														setNewDonation({
															...newDonation,
															amount: e.target.value,
														})
													}
													placeholder="5000"
													min="0"
													step="0.01"
												/>
											</div>
											<div>
												<Label htmlFor="donation_type">Donation Type</Label>
												<Select
													value={newDonation.donation_type}
													onValueChange={(value) =>
														setNewDonation({
															...newDonation,
															donation_type: value,
														})
													}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="general">
															General Donation
														</SelectItem>
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
														<SelectItem value="education">
															Education Fund
														</SelectItem>
														<SelectItem value="medical">Medical Aid</SelectItem>
														<SelectItem value="other">Other</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<Label htmlFor="donor_name">Donor Name</Label>
												<Input
													id="donor_name"
													value={newDonation.donor_name}
													onChange={(e) =>
														setNewDonation({
															...newDonation,
															donor_name: e.target.value,
														})
													}
													placeholder="John Doe"
												/>
											</div>
											<div>
												<Label htmlFor="donor_email">Donor Email</Label>
												<Input
													id="donor_email"
													type="email"
													value={newDonation.donor_email}
													onChange={(e) =>
														setNewDonation({
															...newDonation,
															donor_email: e.target.value,
														})
													}
													placeholder="john@example.com"
												/>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<Label htmlFor="donor_phone">Donor Phone</Label>
												<Input
													id="donor_phone"
													value={newDonation.donor_phone}
													onChange={(e) =>
														setNewDonation({
															...newDonation,
															donor_phone: e.target.value,
														})
													}
													placeholder="+91-9876543210"
												/>
											</div>
											<div>
												<Label htmlFor="payment_method">Payment Method</Label>
												<Select
													value={newDonation.payment_method}
													onValueChange={(value) =>
														setNewDonation({
															...newDonation,
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
										<div>
											<Label htmlFor="purpose">Purpose/Dedication</Label>
											<Input
												id="purpose"
												value={newDonation.purpose}
												onChange={(e) =>
													setNewDonation({
														...newDonation,
														purpose: e.target.value,
													})
												}
												placeholder="e.g., In memory of..., For specific puja..."
											/>
										</div>
										<div>
											<Label htmlFor="notes">Notes</Label>
											<Textarea
												id="notes"
												value={newDonation.notes}
												onChange={(e) =>
													setNewDonation({
														...newDonation,
														notes: e.target.value,
													})
												}
												placeholder="Additional notes..."
											/>
										</div>
									</div>
									<div className="flex justify-end gap-2">
										<Button
											variant="outline"
											onClick={() => setShowAddModal(false)}>
											Cancel
										</Button>
										<Button
											onClick={handleCreateDonation}
											disabled={createDonationMutation.isPending}>
											{createDonationMutation.isPending
												? "Adding..."
												: "Add Donation"}
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search donations..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select value={sourceFilter} onValueChange={setSourceFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="general">General</SelectItem>
								<SelectItem value="temple_construction">
									Temple Construction
								</SelectItem>
								<SelectItem value="festival">Festival</SelectItem>
								<SelectItem value="puja_sponsorship">
									Puja Sponsorship
								</SelectItem>
								<SelectItem value="annadanam">Annadanam</SelectItem>
								<SelectItem value="education">Education</SelectItem>
								<SelectItem value="medical">Medical</SelectItem>
							</SelectContent>
						</Select>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
								<SelectItem value="refunded">Refunded</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-md border">
						<div className="p-4">
							<div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground border-b pb-2">
								<div className="col-span-2">Receipt #</div>
								<div className="col-span-2">Donor</div>
								<div className="col-span-2">Amount</div>
								<div className="col-span-2">Source</div>
								<div className="col-span-2">Status</div>
								<div className="col-span-2">Date</div>
							</div>
							{filteredDonations.map((donation: Donation) => (
								<div
									key={donation.id}
									className="grid grid-cols-12 gap-4 py-3 border-b last:border-0 items-center">
									<div className="col-span-2 font-mono text-sm">
										{donation.receipt_number}
									</div>
									<div className="col-span-2">
										<div className="font-medium">
											{donation.donor_name || "Anonymous"}
										</div>
										{donation.donor_email && (
											<div className="text-xs text-muted-foreground">
												{donation.donor_email}
											</div>
										)}
									</div>
									<div className="col-span-2">
										<div className="font-medium">
											{formatCurrency(donation.net_amount)}
										</div>
										{donation.provider_fees > 0 && (
											<div className="text-xs text-muted-foreground">
												Fee: {formatCurrency(donation.provider_fees)}
											</div>
										)}
									</div>
									<div className="col-span-2">
										<Badge variant="outline">{donation.source}</Badge>
									</div>
									<div className="col-span-2">
										<Badge variant={getStatusBadge(donation.status)}>
											{donation.status}
										</Badge>
									</div>
									<div className="col-span-2 text-sm text-muted-foreground">
										{new Date(donation.received_at).toLocaleDateString()}
									</div>
								</div>
							))}
							{filteredDonations.length === 0 && (
								<div className="text-center py-8 text-muted-foreground">
									No donations found matching your criteria.
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
