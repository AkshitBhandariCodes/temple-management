import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDonationsTable } from "@/hooks/use-complete-api";
import {
	Heart,
	IndianRupee,
	Calendar,
	CreditCard,
	Loader2,
	Plus,
} from "lucide-react";
import { format } from "date-fns";

interface RecentDonationsProps {
	limit?: number;
	showHeader?: boolean;
	showAddButton?: boolean;
	onAddDonation?: () => void;
}

export const RecentDonations: React.FC<RecentDonationsProps> = ({
	limit = 5,
	showHeader = true,
	showAddButton = false,
	onAddDonation,
}) => {
	const { data: donationsData, isLoading, error } = useDonationsTable();

	const allDonations = donationsData?.data || [];

	// Sort by date and limit
	const donations = allDonations
		.sort(
			(a, b) =>
				new Date(b.donation_date).getTime() -
				new Date(a.donation_date).getTime()
		)
		.slice(0, limit);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	const getPaymentMethodIcon = (method: string) => {
		switch (method) {
			case "upi":
				return "📱";
			case "bank_transfer":
				return "🏦";
			case "card":
				return "💳";
			case "cheque":
				return "📄";
			default:
				return "💵";
		}
	};

	const getPaymentMethodColor = (method: string) => {
		switch (method) {
			case "upi":
				return "bg-blue-100 text-blue-800";
			case "bank_transfer":
				return "bg-green-100 text-green-800";
			case "card":
				return "bg-purple-100 text-purple-800";
			case "cheque":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (isLoading) {
		return (
			<Card>
				{showHeader && (
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Heart className="w-5 h-5 text-red-500" />
							Recent Donations
						</CardTitle>
					</CardHeader>
				)}
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<Loader2 className="w-6 h-6 animate-spin" />
						<span className="ml-2 text-muted-foreground">
							Loading donations...
						</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				{showHeader && (
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Heart className="w-5 h-5 text-red-500" />
							Recent Donations
						</CardTitle>
					</CardHeader>
				)}
				<CardContent>
					<div className="text-center py-8">
						<p className="text-muted-foreground">Unable to load donations</p>
						<p className="text-sm text-red-500">{error.message}</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			{showHeader && (
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Heart className="w-5 h-5 text-red-500" />
							Recent Donations
						</CardTitle>
						{showAddButton && onAddDonation && (
							<Button
								onClick={onAddDonation}
								size="sm"
								className="bg-green-600 hover:bg-green-700">
								<Plus className="w-4 h-4 mr-1" />
								Add
							</Button>
						)}
					</div>
				</CardHeader>
			)}
			<CardContent>
				{donations.length === 0 ? (
					<div className="text-center py-8">
						<Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<p className="text-muted-foreground">No donations recorded yet</p>
						{showAddButton && onAddDonation && (
							<Button
								onClick={onAddDonation}
								className="mt-4 bg-green-600 hover:bg-green-700">
								<Plus className="w-4 h-4 mr-2" />
								Add First Donation
							</Button>
						)}
					</div>
				) : (
					<div className="space-y-4">
						{donations.map((donation) => (
							<div
								key={donation.id}
								className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
								<div className="flex-1">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
											<IndianRupee className="w-5 h-5 text-green-600" />
										</div>
										<div>
											<p className="font-medium text-sm">
												{donation.donor_name || "Anonymous Donor"}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<div className="flex items-center gap-1 text-xs text-muted-foreground">
													<Calendar className="w-3 h-3" />
													{format(
														new Date(donation.donation_date),
														"MMM dd, yyyy"
													)}
												</div>
												<Badge
													variant="outline"
													className={`text-xs ${getPaymentMethodColor(
														donation.payment_method
													)}`}>
													{getPaymentMethodIcon(donation.payment_method)}{" "}
													{donation.payment_method.replace("_", " ")}
												</Badge>
											</div>
											{donation.purpose && (
												<p className="text-xs text-gray-600 mt-1">
													{donation.purpose}
												</p>
											)}
										</div>
									</div>
								</div>
								<div className="text-right">
									<p className="font-bold text-green-600">
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

						{donations.length >= limit && (
							<div className="text-center pt-4 border-t">
								<p className="text-sm text-muted-foreground">
									Showing {limit} most recent donations
								</p>
								<Button variant="outline" size="sm" className="mt-2">
									View All Donations
								</Button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
