import React, { useState, useEffect } from "react";
import { Calendar, Clock, Loader2 } from "lucide-react";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useUpdatePujaSeries, useCommunities } from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

interface EditPujaSeriesModalProps {
	isOpen: boolean;
	onClose: () => void;
	puja: any;
}

const PUJA_TYPES = [
	{ value: "aarti", label: "Aarti" },
	{ value: "puja", label: "Puja" },
	{ value: "havan", label: "Havan" },
	{ value: "special_ceremony", label: "Special Ceremony" },
	{ value: "festival", label: "Festival" },
	{ value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
	{ value: "draft", label: "Draft" },
	{ value: "cancelled", label: "Cancelled" },
];

export default function EditPujaSeriesModal({
	isOpen,
	onClose,
	puja,
}: EditPujaSeriesModalProps) {
	const { toast } = useToast();
	const { data: communitiesData } = useCommunities();
	const updatePujaMutation = useUpdatePujaSeries();

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		deity: "",
		type: "puja",
		status: "active",
		community_id: "",
		location: "",
		start_date: "",
		start_time: "06:00",
		end_date: "",
		duration_minutes: 60,
		max_participants: "",
		registration_required: false,
		requirements: "",
		notes: "",
	});

	const communities = communitiesData?.data || [];

	// Populate form when puja data changes
	useEffect(() => {
		if (puja) {
			const startDate = new Date(puja.start_date);
			const endDate = puja.end_date ? new Date(puja.end_date) : null;

			setFormData({
				name: puja.name || "",
				description: puja.description || "",
				deity: puja.deity || "",
				type: puja.type || "puja",
				status: puja.status || "active",
				community_id: puja.community_id || "",
				location: puja.location || "",
				start_date: startDate.toISOString().split("T")[0],
				start_time: startDate.toTimeString().substring(0, 5),
				end_date: endDate ? endDate.toISOString().split("T")[0] : "",
				duration_minutes: puja.duration_minutes || 60,
				max_participants: puja.max_participants
					? puja.max_participants.toString()
					: "",
				registration_required: puja.registration_required || false,
				requirements: Array.isArray(puja.requirements)
					? puja.requirements.join(", ")
					: "",
				notes: puja.notes || "",
			});
		}
	}, [puja]);

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name || !formData.community_id || !formData.start_date) {
			toast({
				title: "Missing fields",
				description: "Please fill in name, community, and start date.",
				variant: "destructive",
			});
			return;
		}

		try {
			const startDateTime = new Date(
				`${formData.start_date}T${formData.start_time}`
			);
			const endDateTime = formData.end_date
				? new Date(`${formData.end_date}T${formData.start_time}`)
				: null;

			const updateData = {
				id: puja.id,
				community_id: formData.community_id,
				name: formData.name,
				description: formData.description,
				deity: formData.deity,
				type: formData.type,
				status: formData.status,
				start_date: startDateTime.toISOString(),
				end_date: endDateTime?.toISOString(),
				location: formData.location,
				duration_minutes: formData.duration_minutes,
				max_participants: formData.max_participants
					? parseInt(formData.max_participants)
					: undefined,
				registration_required: formData.registration_required,
				requirements: formData.requirements
					? formData.requirements.split(",").map((r) => r.trim())
					: [],
				notes: formData.notes,
			};

			await updatePujaMutation.mutateAsync(updateData);
			onClose();
		} catch (error) {
			console.error("Failed to update puja series:", error);
			toast({
				title: "Update Failed",
				description: "Failed to update puja series. Please try again.",
				variant: "destructive",
			});
		}
	};

	if (!isOpen || !puja) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Edit Puja Series
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Basic Information</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Puja Name *</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="e.g., Morning Aarti"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="community">Community *</Label>
								<Select
									value={formData.community_id}
									onValueChange={(value) =>
										handleInputChange("community_id", value)
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select community" />
									</SelectTrigger>
									<SelectContent>
										{communities.map((community) => (
											<SelectItem key={community.id} value={community.id}>
												{community.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) =>
									handleInputChange("description", e.target.value)
								}
								placeholder="Describe the puja ceremony..."
								rows={3}
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="deity">Deity</Label>
								<Input
									id="deity"
									value={formData.deity}
									onChange={(e) => handleInputChange("deity", e.target.value)}
									placeholder="e.g., Lord Ganesha"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="type">Type</Label>
								<Select
									value={formData.type}
									onValueChange={(value) => handleInputChange("type", value)}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{PUJA_TYPES.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<Select
									value={formData.status}
									onValueChange={(value) => handleInputChange("status", value)}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{STATUS_OPTIONS.map((status) => (
											<SelectItem key={status.value} value={status.value}>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Schedule Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Schedule</h3>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="start_date">Start Date *</Label>
								<Input
									id="start_date"
									type="date"
									value={formData.start_date}
									onChange={(e) =>
										handleInputChange("start_date", e.target.value)
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="start_time">Start Time</Label>
								<Input
									id="start_time"
									type="time"
									value={formData.start_time}
									onChange={(e) =>
										handleInputChange("start_time", e.target.value)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="duration">Duration (minutes)</Label>
								<Input
									id="duration"
									type="number"
									value={formData.duration_minutes}
									onChange={(e) =>
										handleInputChange(
											"duration_minutes",
											parseInt(e.target.value) || 60
										)
									}
									min="15"
									max="480"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="end_date">End Date (Optional)</Label>
							<Input
								id="end_date"
								type="date"
								value={formData.end_date}
								onChange={(e) => handleInputChange("end_date", e.target.value)}
							/>
						</div>
					</div>

					{/* Location & Logistics */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Location & Logistics</h3>

						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								value={formData.location}
								onChange={(e) => handleInputChange("location", e.target.value)}
								placeholder="e.g., Main Temple Hall"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="max_participants">Max Participants</Label>
								<Input
									id="max_participants"
									type="number"
									value={formData.max_participants}
									onChange={(e) =>
										handleInputChange("max_participants", e.target.value)
									}
									placeholder="Leave empty for unlimited"
								/>
							</div>

							<div className="space-y-2">
								<Label className="flex items-center space-x-2">
									<input
										type="checkbox"
										checked={formData.registration_required}
										onChange={(e) =>
											handleInputChange(
												"registration_required",
												e.target.checked
											)
										}
									/>
									<span>Registration Required</span>
								</Label>
							</div>
						</div>
					</div>

					{/* Additional Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Additional Information</h3>

						<div className="space-y-2">
							<Label htmlFor="requirements">
								Requirements (comma-separated)
							</Label>
							<Input
								id="requirements"
								value={formData.requirements}
								onChange={(e) =>
									handleInputChange("requirements", e.target.value)
								}
								placeholder="e.g., Clean clothes, Devotional mindset"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								value={formData.notes}
								onChange={(e) => handleInputChange("notes", e.target.value)}
								placeholder="Additional notes or instructions..."
								rows={3}
							/>
						</div>
					</div>

					{/* Form Actions */}
					<div className="flex justify-end space-x-2 pt-4 border-t">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={updatePujaMutation.isPending}
							className="min-w-[120px]">
							{updatePujaMutation.isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Updating...
								</>
							) : (
								"Update Puja Series"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
