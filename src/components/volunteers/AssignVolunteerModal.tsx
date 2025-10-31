import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Search, Users, Clock, MapPin, CheckCircle, X } from "lucide-react";
import { useVolunteers, useCreateAttendance } from "@/hooks/use-complete-api";
import { useQueryClient } from "@tanstack/react-query";

interface AssignVolunteerModalProps {
	isOpen: boolean;
	onClose: () => void;
	shift: any;
}

const AssignVolunteerModal: React.FC<AssignVolunteerModalProps> = ({
	isOpen,
	onClose,
	shift,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
	const [notes, setNotes] = useState("");

	const { data: volunteersData, isLoading } = useVolunteers({
		status: "active",
		limit: 1000,
	});

	const createAttendanceMutation = useCreateAttendance();
	const queryClient = useQueryClient();

	const volunteers = volunteersData?.data || [];

	const filteredVolunteers = volunteers.filter(
		(volunteer: any) =>
			`${volunteer.first_name} ${volunteer.last_name}`
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleVolunteerToggle = (volunteerId: string) => {
		setSelectedVolunteers((prev) =>
			prev.includes(volunteerId)
				? prev.filter((id) => id !== volunteerId)
				: [...prev, volunteerId]
		);
	};

	const handleAssign = async () => {
		try {
			console.log(
				`🎯 Assigning ${selectedVolunteers.length} volunteers to shift ${shift.id}`
			);

			// Create attendance records for selected volunteers
			const results = [];
			for (const volunteerId of selectedVolunteers) {
				console.log(
					`📝 Creating attendance record for volunteer ${volunteerId}`
				);
				try {
					const result = await createAttendanceMutation.mutateAsync({
						volunteer_id: volunteerId,
						shift_id: shift.id,
						status: "scheduled",
						notes: notes,
					});
					console.log(`✅ Created attendance record:`, result);
					results.push({ volunteerId, success: true, result });
				} catch (error) {
					console.error(`❌ Failed to assign volunteer ${volunteerId}:`, error);
					results.push({ volunteerId, success: false, error });
				}
			}

			const successCount = results.filter((r) => r.success).length;
			const failCount = results.filter((r) => !r.success).length;

			console.log(
				`🎉 Assignment complete: ${successCount} successful, ${failCount} failed`
			);

			if (successCount > 0) {
				// Manually invalidate queries to refresh the UI
				console.log("🔄 Invalidating queries to refresh UI...");

				// Invalidate all volunteer attendance queries (with any parameters)
				await queryClient.invalidateQueries({
					queryKey: ["volunteer-attendance"],
					exact: false,
				});

				// Invalidate volunteer shifts queries
				await queryClient.invalidateQueries({
					queryKey: ["volunteer-shifts"],
					exact: false,
				});

				// Force refetch of attendance data
				await queryClient.refetchQueries({
					queryKey: ["volunteer-attendance"],
				});

				console.log("✅ Queries invalidated and refetched");
			}

			onClose();
			setSelectedVolunteers([]);
			setNotes("");
		} catch (error) {
			console.error("❌ Failed to assign volunteers:", error);
		}
	};

	if (!isOpen) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2 text-sm sm:text-base">
						<Users className="w-4 h-4 sm:w-5 sm:h-5" />
						<span>Assign Volunteers to Shift</span>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Shift Information */}
					<div className="bg-blue-50 p-4 rounded-lg">
						<h3 className="font-semibold text-blue-900 mb-2">{shift.title}</h3>
						<div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-blue-700">
							<div className="flex items-center space-x-1">
								<Clock className="w-4 h-4" />
								<span>
									{new Date(shift.shift_date).toLocaleDateString()} •{" "}
									{shift.start_time} - {shift.end_time}
								</span>
							</div>
							<div className="flex items-center space-x-1">
								<MapPin className="w-4 h-4" />
								<span>{shift.location}</span>
							</div>
							<div className="flex items-center space-x-1">
								<Users className="w-4 h-4" />
								<span>Need {shift.required_volunteers} volunteers</span>
							</div>
						</div>
					</div>

					{/* Search */}
					<div className="space-y-2">
						<Label>Search Volunteers</Label>
						<div className="relative">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					{/* Selected Volunteers Summary */}
					{selectedVolunteers.length > 0 && (
						<div className="bg-green-50 p-4 rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<h4 className="font-medium text-green-900">
									Selected Volunteers ({selectedVolunteers.length})
								</h4>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedVolunteers([])}
									className="text-green-700 hover:text-green-900">
									Clear All
								</Button>
							</div>
							<div className="flex flex-wrap gap-2">
								{selectedVolunteers.map((volunteerId) => {
									const volunteer = volunteers.find(
										(v: any) => v.id === volunteerId
									);
									return volunteer ? (
										<Badge
											key={volunteerId}
											variant="secondary"
											className="bg-green-100 text-green-800">
											{volunteer.first_name} {volunteer.last_name}
											<Button
												variant="ghost"
												size="sm"
												className="ml-1 h-4 w-4 p-0"
												onClick={() => handleVolunteerToggle(volunteerId)}>
												<X className="h-3 w-3" />
											</Button>
										</Badge>
									) : null;
								})}
							</div>
						</div>
					)}

					{/* Volunteers List */}
					<div className="space-y-2">
						<Label>Available Volunteers</Label>
						<div className="max-h-96 overflow-y-auto border rounded-lg">
							{isLoading ? (
								<div className="p-8 text-center">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
									<p className="text-muted-foreground">Loading volunteers...</p>
								</div>
							) : filteredVolunteers.length === 0 ? (
								<div className="p-8 text-center">
									<Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-lg font-medium">No volunteers found</p>
									<p className="text-sm text-muted-foreground">
										{searchTerm
											? "Try adjusting your search"
											: "No active volunteers available"}
									</p>
								</div>
							) : (
								<div className="divide-y">
									{filteredVolunteers.map((volunteer: any) => (
										<div
											key={volunteer.id}
											className={`p-4 hover:bg-gray-50 cursor-pointer ${
												selectedVolunteers.includes(volunteer.id)
													? "bg-blue-50 border-l-4 border-blue-500"
													: ""
											}`}
											onClick={() => handleVolunteerToggle(volunteer.id)}>
											<div className="flex items-center space-x-3">
												<Checkbox
													checked={selectedVolunteers.includes(volunteer.id)}
													onChange={() => handleVolunteerToggle(volunteer.id)}
												/>
												<Avatar className="w-10 h-10">
													<AvatarFallback>
														{volunteer.first_name?.charAt(0)}
														{volunteer.last_name?.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<div className="flex items-center justify-between">
														<div>
															<p className="font-medium">
																{volunteer.first_name} {volunteer.last_name}
															</p>
															<p className="text-sm text-muted-foreground">
																{volunteer.email}
															</p>
														</div>
														<div className="text-right">
															<Badge variant="outline" className="mb-1">
																{volunteer.status}
															</Badge>
															<div className="text-xs text-muted-foreground">
																{volunteer.total_hours_volunteered || 0} hours
															</div>
														</div>
													</div>
													{volunteer.skills && volunteer.skills.length > 0 && (
														<div className="flex flex-wrap gap-1 mt-2">
															{volunteer.skills
																.slice(0, 3)
																.map((skill: string, index: number) => (
																	<Badge
																		key={index}
																		variant="secondary"
																		className="text-xs">
																		{skill}
																	</Badge>
																))}
															{volunteer.skills.length > 3 && (
																<Badge variant="secondary" className="text-xs">
																	+{volunteer.skills.length - 3} more
																</Badge>
															)}
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Assignment Notes */}
					<div className="space-y-2">
						<Label>Assignment Notes (Optional)</Label>
						<Textarea
							placeholder="Add any special instructions or notes for the assigned volunteers..."
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							rows={3}
						/>
					</div>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t space-y-3 sm:space-y-0">
						<div className="text-sm text-muted-foreground text-center sm:text-left">
							{selectedVolunteers.length} of {shift.required_volunteers}{" "}
							volunteers selected
						</div>
						<div className="flex space-x-2 justify-center sm:justify-end">
							<Button variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button
								onClick={handleAssign}
								disabled={
									selectedVolunteers.length === 0 ||
									createAttendanceMutation.isPending
								}
								className="bg-blue-600 hover:bg-blue-700">
								{createAttendanceMutation.isPending ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										<span className="hidden sm:inline">Assigning...</span>
										<span className="sm:hidden">...</span>
									</>
								) : (
									<>
										<CheckCircle className="w-4 h-4 mr-2" />
										<span className="hidden sm:inline">
											Assign {selectedVolunteers.length} Volunteer
											{selectedVolunteers.length !== 1 ? "s" : ""}
										</span>
										<span className="sm:hidden">
											Assign ({selectedVolunteers.length})
										</span>
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AssignVolunteerModal;
