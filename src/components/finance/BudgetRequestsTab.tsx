// src/components/finance/BudgetRequestsTab.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DollarSign,
	Calendar,
	FileText,
	CheckCircle,
	XCircle,
	Clock,
	Building2,
	User,
	Filter,
} from "lucide-react";
import {
	useAllBudgetRequests,
	useApproveBudgetRequest,
	useRejectBudgetRequest,
} from "@/hooks/use-budget-requests";

export const BudgetRequestsTab = () => {
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [selectedRequest, setSelectedRequest] = useState<any>(null);
	const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
	const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
	const [approvalData, setApprovalData] = useState({
		approved_amount: "",
		approval_notes: "",
	});
	const [rejectionData, setRejectionData] = useState({
		rejection_reason: "",
	});

	// API Hooks
	const { data: requests, isLoading } = useAllBudgetRequests({
		status: statusFilter === "all" ? undefined : statusFilter,
	});
	const approveMutation = useApproveBudgetRequest();
	const rejectMutation = useRejectBudgetRequest();

	const handleApprove = async () => {
		if (!selectedRequest) return;

		try {
			await approveMutation.mutateAsync({
				requestId: selectedRequest.id,
				approvalData: {
					approved_amount: approvalData.approved_amount
						? parseFloat(approvalData.approved_amount)
						: undefined,
					approval_notes: approvalData.approval_notes || undefined,
					approved_by: null, // TODO: Get from auth context when user system is implemented
				},
			});

			setIsApprovalModalOpen(false);
			setSelectedRequest(null);
			setApprovalData({ approved_amount: "", approval_notes: "" });
		} catch (error) {
			console.error("Error approving request:", error);
		}
	};

	const handleReject = async () => {
		if (!selectedRequest) return;

		try {
			await rejectMutation.mutateAsync({
				requestId: selectedRequest.id,
				rejectionData: {
					rejection_reason: rejectionData.rejection_reason,
					rejected_by: null, // TODO: Get from auth context when user system is implemented
				},
			});

			setIsRejectionModalOpen(false);
			setSelectedRequest(null);
			setRejectionData({ rejection_reason: "" });
		} catch (error) {
			console.error("Error rejecting request:", error);
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

	const pendingRequests = requests?.filter((r) => r.status === "pending") || [];
	const totalPendingAmount = pendingRequests.reduce(
		(sum, r) => sum + r.budget_amount,
		0
	);

	return (
		<div className="space-y-6">
			{/* Header & Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<Clock className="w-6 h-6 text-yellow-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Pending Requests
								</p>
								<p className="text-2xl font-bold">{pendingRequests.length}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<DollarSign className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Pending Amount</p>
								<p className="text-2xl font-bold">
									{formatCurrency(totalPendingAmount)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<Building2 className="w-6 h-6 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Requests</p>
								<p className="text-2xl font-bold">{requests?.length || 0}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<Filter className="w-4 h-4" />
					<Label>Status:</Label>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Requests</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="approved">Approved</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
						</SelectContent>
					</Select>
				</div>
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
							<p className="text-muted-foreground">
								No budget requests found for the selected filter.
							</p>
						</CardContent>
					</Card>
				) : (
					requests?.map((request: any) => (
						<Card
							key={request.id}
							className="hover:shadow-md transition-shadow">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										{getStatusIcon(request.status)}
										<div>
											<CardTitle className="text-lg">
												{request.event_name || "Budget Request"}
											</CardTitle>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<Building2 className="w-3 h-3" />
													{request.community?.name || "Unknown Community"}
												</div>
												<div className="flex items-center gap-1">
													<Calendar className="w-3 h-3" />
													{new Date(request.created_at).toLocaleDateString()}
												</div>
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold text-blue-600">
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

								{request.status === "pending" && (
									<div className="flex gap-2 pt-2">
										<Dialog
											open={isApprovalModalOpen}
											onOpenChange={setIsApprovalModalOpen}>
											<DialogTrigger asChild>
												<Button
													size="sm"
													className="bg-green-600 hover:bg-green-700"
													onClick={() => {
														setSelectedRequest(request);
														setApprovalData({
															approved_amount: request.budget_amount.toString(),
															approval_notes: "",
														});
													}}>
													<CheckCircle className="w-4 h-4 mr-1" />
													Approve
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Approve Budget Request</DialogTitle>
												</DialogHeader>
												<div className="space-y-4">
													<div>
														<Label>Approved Amount (₹)</Label>
														<Input
															type="number"
															step="0.01"
															value={approvalData.approved_amount}
															onChange={(e) =>
																setApprovalData((prev) => ({
																	...prev,
																	approved_amount: e.target.value,
																}))
															}
														/>
													</div>
													<div>
														<Label>Approval Notes (Optional)</Label>
														<Textarea
															value={approvalData.approval_notes}
															onChange={(e) =>
																setApprovalData((prev) => ({
																	...prev,
																	approval_notes: e.target.value,
																}))
															}
															placeholder="Any additional notes..."
														/>
													</div>
													<div className="flex justify-end gap-2">
														<Button
															variant="outline"
															onClick={() => setIsApprovalModalOpen(false)}>
															Cancel
														</Button>
														<Button
															onClick={handleApprove}
															disabled={approveMutation.isPending}
															className="bg-green-600 hover:bg-green-700">
															{approveMutation.isPending
																? "Approving..."
																: "Approve"}
														</Button>
													</div>
												</div>
											</DialogContent>
										</Dialog>

										<Dialog
											open={isRejectionModalOpen}
											onOpenChange={setIsRejectionModalOpen}>
											<DialogTrigger asChild>
												<Button
													size="sm"
													variant="destructive"
													onClick={() => setSelectedRequest(request)}>
													<XCircle className="w-4 h-4 mr-1" />
													Reject
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Reject Budget Request</DialogTitle>
												</DialogHeader>
												<div className="space-y-4">
													<div>
														<Label>Rejection Reason</Label>
														<Textarea
															value={rejectionData.rejection_reason}
															onChange={(e) =>
																setRejectionData((prev) => ({
																	...prev,
																	rejection_reason: e.target.value,
																}))
															}
															placeholder="Please provide a reason for rejection..."
															required
														/>
													</div>
													<div className="flex justify-end gap-2">
														<Button
															variant="outline"
															onClick={() => setIsRejectionModalOpen(false)}>
															Cancel
														</Button>
														<Button
															variant="destructive"
															onClick={handleReject}
															disabled={
																rejectMutation.isPending ||
																!rejectionData.rejection_reason
															}>
															{rejectMutation.isPending
																? "Rejecting..."
																: "Reject"}
														</Button>
													</div>
												</div>
											</DialogContent>
										</Dialog>
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
