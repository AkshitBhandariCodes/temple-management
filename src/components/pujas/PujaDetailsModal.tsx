import React from "react";
import {
	X,
	Calendar,
	Clock,
	MapPin,
	User,
	Users,
	FileText,
	Tag,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface PujaDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	puja: any;
	onEdit?: (puja: any) => void;
}

const STATUS_COLORS = {
	active: "bg-green-100 text-green-800",
	inactive: "bg-gray-100 text-gray-800",
	cancelled: "bg-red-100 text-red-800",
	draft: "bg-yellow-100 text-yellow-800",
};

export default function PujaDetailsModal({
	isOpen,
	onClose,
	puja,
	onEdit,
}: PujaDetailsModalProps) {
	if (!puja) return null;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return {
			date: formatDate(dateString),
			time: formatTime(dateString),
		};
	};

	const startDateTime = formatDateTime(puja.start_date);
	const endDateTime = puja.end_date ? formatDateTime(puja.end_date) : null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Puja Series Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Header Section */}
					<div className="space-y-4">
						<div className="flex items-start justify-between">
							<div>
								<h2 className="text-2xl font-bold text-gray-900">
									{puja.name}
								</h2>
								<p className="text-gray-600 mt-1">
									{puja.description || "No description provided"}
								</p>
							</div>
							<Badge className={STATUS_COLORS[puja.status]}>
								{puja.status}
							</Badge>
						</div>
					</div>

					{/* Basic Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Basic Information
							</h3>

							<div className="space-y-3">
								{puja.deity && (
									<div className="flex items-center gap-3">
										<User className="h-5 w-5 text-gray-400" />
										<div>
											<p className="text-sm font-medium text-gray-700">Deity</p>
											<p className="text-gray-900">{puja.deity}</p>
										</div>
									</div>
								)}

								<div className="flex items-center gap-3">
									<Tag className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-700">Type</p>
										<p className="text-gray-900 capitalize">{puja.type}</p>
									</div>
								</div>

								{puja.location && (
									<div className="flex items-center gap-3">
										<MapPin className="h-5 w-5 text-gray-400" />
										<div>
											<p className="text-sm font-medium text-gray-700">
												Location
											</p>
											<p className="text-gray-900">{puja.location}</p>
										</div>
									</div>
								)}

								<div className="flex items-center gap-3">
									<Clock className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-700">
											Duration
										</p>
										<p className="text-gray-900">
											{puja.duration_minutes || 60} minutes
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900">Schedule</h3>

							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-sm font-medium text-gray-700">
											Start Date & Time
										</p>
										<p className="text-gray-900">{startDateTime.date}</p>
										<p className="text-gray-600 text-sm">
											{startDateTime.time}
										</p>
									</div>
								</div>

								{endDateTime && (
									<div className="flex items-start gap-3">
										<Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-gray-700">
												End Date & Time
											</p>
											<p className="text-gray-900">{endDateTime.date}</p>
											<p className="text-gray-600 text-sm">
												{endDateTime.time}
											</p>
										</div>
									</div>
								)}

								{!puja.end_date && (
									<div className="flex items-center gap-3">
										<AlertCircle className="h-5 w-5 text-blue-400" />
										<div>
											<p className="text-sm font-medium text-gray-700">
												Duration
											</p>
											<p className="text-gray-900">Ongoing series</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Logistics */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900">Logistics</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-3">
								<Users className="h-5 w-5 text-gray-400" />
								<div>
									<p className="text-sm font-medium text-gray-700">
										Max Participants
									</p>
									<p className="text-gray-900">
										{puja.max_participants
											? puja.max_participants
											: "Unlimited"}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<FileText className="h-5 w-5 text-gray-400" />
								<div>
									<p className="text-sm font-medium text-gray-700">
										Registration Required
									</p>
									<p className="text-gray-900">
										{puja.registration_required ? "Yes" : "No"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Requirements */}
					{puja.requirements && puja.requirements.length > 0 && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Requirements
							</h3>
							<div className="bg-gray-50 rounded-lg p-4">
								<ul className="space-y-1">
									{puja.requirements.map(
										(requirement: string, index: number) => (
											<li
												key={index}
												className="text-gray-700 flex items-center gap-2">
												<span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
												{requirement}
											</li>
										)
									)}
								</ul>
							</div>
						</div>
					)}

					{/* Notes */}
					{puja.notes && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900">Notes</h3>
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-gray-700 whitespace-pre-wrap">
									{puja.notes}
								</p>
							</div>
						</div>
					)}

					{/* Metadata */}
					<div className="border-t pt-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
							<div>
								<p className="font-medium">Created</p>
								<p>{new Date(puja.created_at).toLocaleDateString()}</p>
							</div>
							<div>
								<p className="font-medium">Last Updated</p>
								<p>{new Date(puja.updated_at).toLocaleDateString()}</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-end space-x-2 pt-4 border-t">
						<Button type="button" variant="outline" onClick={onClose}>
							Close
						</Button>
						{onEdit && (
							<Button
								onClick={() => {
									onEdit(puja);
									onClose();
								}}>
								Edit Puja Series
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
