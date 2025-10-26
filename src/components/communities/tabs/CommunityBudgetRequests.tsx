// src/components/communities/tabs/CommunityBudgetRequests.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Plus,
	DollarSign,
	Calendar,
	FileText,
	Upload,
	CheckCircle,
	XCircle,
	Clock,
} from "lucide-react";
import { Community } from "../types";
import {
	useBudgetRequests,
	useCreateBudgetRequest,
} from "@/hooks/use-budget-requests";

interface CommunityBudgetRequestsProps {
	community: Community;
}

export const CommunityBudgetRequests = ({
	community,
}: CommunityBudgetRequestsProps) => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		budget_amount: "",
		purpose: "",
		event_name: "",
		documents: [] as File[],
	});

	// API Hooks
	const { data: requests, isLoading } = useBudgetRequests(community.id);
	const createRequest = useCreateBudgetRequest();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// For now, we'll just send the form data without file upload
			// In a real implementation, you'd upload files first and get URLs
			const documentUrls = formData.documents.map((file) => ({
				name: file.name,
				url: `/uploads/${file.name}`, // Placeholder URL
				type: file.type,
			}));

			await createRequest.mutateAsync({
				community_id: community.id,
				budget_amount: parseFloat(formData.budget_amount),
				purpose: formData.purpose,
				event_name: formData.event_name || null,
				documents: documentUrls,
			});

			// Reset form and close modal
			setFormData({
				budget_amount: "",
				purpose: "",
				event_name: "",
				documents: [],
			});
			setIsCreateModalOpen(false);
		} catch (error) {
			console.error("Error creating budget request:", error);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "approved":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "rejected":
				return <XCircle className="w-4 h-4 text-red-500" />;
			default:
				return <Clock className="w-4 h-4 text-yellow-500" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-yellow-100 text-yellow-800";
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Budget Requests</h2>
					<p className="text-muted-foreground">
						Submit and track budget requests for community activities
					</p>
				</div>

				<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="w-4 h-4 mr-2" />
							New Request
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Create Budget Request</DialogTitle>
						</DialogHeader>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="budget_amount">Budget Amount (₹)</Label>
									<Input
										id="budget_amount"
										type="number"
										step="0.01"
										placeholder="5000.00"
										value={formData.budget_amount}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												budget_amount: e.target.value,
											}))
										}
										required
									/>
								</div>

								<div>
									<Label htmlFor="event_name">Event Name (Optional)</Label>
									<Input
										id="event_name"
										placeholder="Diwali Festival 2025"
										value={formData.event_name}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												event_name: e.target.value,
											}))
										}
									/>
								</div>
							</div>

							<div>
								<Label htmlFor="purpose">Purpose</Label>
								<Textarea
									id="purpose"
									placeholder="Detailed description of what the budget will be used for..."
									rows={4}
									value={formData.purpose}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											purpose: e.target.value,
										}))
									}
									required
								/>
							</div>

							<div>
								<Label htmlFor="documents">
									Documents (Receipts, Quotes, etc.)
								</Label>
								<div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
									<Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
									<p className="text-sm text-gray-600 mb-2">
										Drop files here or click to upload
									</p>
									<Input
										type="file"
										multiple
										accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
										onChange={(e) => {
											const files = Array.from(e.target.files || []);
											setFormData((prev) => ({ ...prev, documents: files }));
										}}
										className="hidden"
										id="file-upload"
									/>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											document.getElementById("file-upload")?.click()
										}>
										Choose Files
									</Button>
									{formData.documents.length > 0 && (
										<div className="mt-2 text-sm text-gray-600">
											{formData.documents.length} file(s) selected
										</div>
									)}
								</div>
							</div>

							<div className="flex justify-end gap-2 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsCreateModalOpen(false)}>
									Cancel
								</Button>
								<Button type="submit" disabled={createRequest.isPending}>
									{createRequest.isPending ? "Submitting..." : "Submit Request"}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Requests List */}
			<div className="space-y-4">
				{isLoading ? (
					<div className="text-center py-8">
						<p className="text-muted-foreground">Loading budget requests...</p>
					</div>
				) : requests?.length === 0 ? (
					<Card>
						<CardContent className="text-center py-8">
							<DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
							<h3 className="text-lg font-medium mb-2">No Budget Requests</h3>
							<p className="text-muted-foreground mb-4">
								You haven't submitted any budget requests yet.
							</p>
							<Button onClick={() => setIsCreateModalOpen(true)}>
								<Plus className="w-4 h-4 mr-2" />
								Create First Request
							</Button>
						</CardContent>
					</Card>
				) : (
					requests?.map((request: any) => (
						<Card key={request.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										{getStatusIcon(request.status)}
										<div>
											<CardTitle className="text-lg">
												{request.event_name || "Budget Request"}
											</CardTitle>
											<p className="text-sm text-muted-foreground">
												Requested on{" "}
												{new Date(request.created_at).toLocaleDateString()}
											</p>
										</div>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold text-green-600">
											{formatCurrency(request.budget_amount)}
										</div>
										<Badge className={getStatusColor(request.status)}>
											{request.status.charAt(0).toUpperCase() +
												request.status.slice(1)}
										</Badge>
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								<div>
									<Label className="text-sm font-medium">Purpose</Label>
									<p className="text-sm text-muted-foreground mt-1">
										{request.purpose}
									</p>
								</div>

								{request.documents && request.documents.length > 0 && (
									<div>
										<Label className="text-sm font-medium">Documents</Label>
										<div className="flex flex-wrap gap-2 mt-1">
											{request.documents.map((doc: any, index: number) => (
												<Badge
													key={index}
													variant="outline"
													className="flex items-center gap-1">
													<FileText className="w-3 h-3" />
													{doc.name}
												</Badge>
											))}
										</div>
									</div>
								)}

								{request.status === "approved" && (
									<div className="bg-green-50 p-3 rounded-lg">
										<div className="flex items-center gap-2 mb-1">
											<CheckCircle className="w-4 h-4 text-green-600" />
											<span className="font-medium text-green-800">
												Approved
											</span>
										</div>
										{request.approved_amount && (
											<p className="text-sm text-green-700">
												Approved Amount:{" "}
												{formatCurrency(request.approved_amount)}
											</p>
										)}
										{request.approval_notes && (
											<p className="text-sm text-green-700 mt-1">
												Notes: {request.approval_notes}
											</p>
										)}
										<p className="text-xs text-green-600 mt-1">
											Reviewed on{" "}
											{new Date(request.reviewed_at).toLocaleDateString()}
										</p>
									</div>
								)}

								{request.status === "rejected" && (
									<div className="bg-red-50 p-3 rounded-lg">
										<div className="flex items-center gap-2 mb-1">
											<XCircle className="w-4 h-4 text-red-600" />
											<span className="font-medium text-red-800">Rejected</span>
										</div>
										{request.rejection_reason && (
											<p className="text-sm text-red-700">
												Reason: {request.rejection_reason}
											</p>
										)}
										<p className="text-xs text-red-600 mt-1">
											Reviewed on{" "}
											{new Date(request.reviewed_at).toLocaleDateString()}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
};
