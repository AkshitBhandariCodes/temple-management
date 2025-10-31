import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Calendar as CalendarIcon,
	Clock,
	MapPin,
	Users,
	Plus,
	Edit,
	Copy,
	Trash2,
	UserPlus,
	Filter,
	Grid3X3,
	List,
	CheckCircle,
	XCircle,
	AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
	useVolunteerShifts,
	useCreateVolunteerShift,
	useCommunities,
	useVolunteerAttendance,
} from "@/hooks/use-complete-api";
import AssignVolunteerModal from "./AssignVolunteerModal";

export const ShiftsTab = () => {
	const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
	const [statusFilter, setStatusFilter] = useState("all");
	const [locationFilter, setLocationFilter] = useState("all");
	const [selectedShift, setSelectedShift] = useState<any>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
	const [shiftToAssign, setShiftToAssign] = useState<any>(null);

	// Fetch real shifts data
	const {
		data: shiftsData,
		isLoading,
		error,
	} = useVolunteerShifts({
		limit: 1000,
	});

	// Fetch attendance data to show assignments
	const {
		data: attendanceData,
		isLoading: attendanceLoading,
		error: attendanceError,
	} = useVolunteerAttendance({
		limit: 1000,
	});

	const shifts = shiftsData?.data || [];
	const attendanceRecords = attendanceData?.data || [];

	// Debug logging
	React.useEffect(() => {
		console.log("📊 ShiftsTab - Attendance data updated:", {
			attendanceLoading,
			attendanceError,
			attendanceRecordsCount: attendanceRecords.length,
			attendanceRecords: attendanceRecords,
		});
	}, [attendanceRecords, attendanceLoading, attendanceError]);

	// Helper function to get assigned volunteers for a shift
	const getAssignedVolunteers = (shiftId: string) => {
		const assigned = attendanceRecords.filter(
			(record: any) => record.shift_id === shiftId
		);
		console.log(
			`🔍 Shift ${shiftId} has ${assigned.length} assigned volunteers:`,
			assigned
		);
		console.log(`📊 Total attendance records:`, attendanceRecords.length);
		console.log(`🔍 All attendance records:`, attendanceRecords);
		return assigned;
	};

	// Helper function to handle volunteer assignment
	const handleAssignVolunteers = (shift: any) => {
		setShiftToAssign(shift);
		setIsAssignModalOpen(true);
	};

	// Sort shifts by creation date (latest first) as a backup
	const sortedShifts = [...shifts].sort(
		(a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	const filteredShifts = sortedShifts.filter((shift) => {
		const matchesStatus =
			statusFilter === "all" || shift.status === statusFilter;
		const matchesLocation =
			locationFilter === "all" ||
			shift.location.toLowerCase().includes(locationFilter.toLowerCase());
		return matchesStatus && matchesLocation;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "filled":
				return <Badge className="bg-green-100 text-green-800">Filled</Badge>;
			case "partially-filled":
				return (
					<Badge className="bg-yellow-100 text-yellow-800">
						Partially Filled
					</Badge>
				);
			case "open":
				return <Badge className="bg-red-100 text-red-800">Open</Badge>;
			case "cancelled":
				return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "filled":
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case "partially-filled":
				return <AlertCircle className="w-4 h-4 text-yellow-600" />;
			case "open":
				return <XCircle className="w-4 h-4 text-red-600" />;
			default:
				return null;
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temple-saffron mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading shifts...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<p className="text-lg font-medium mb-2">Failed to load shifts</p>
					<p className="text-muted-foreground">
						Please try refreshing the page
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filter Panel */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Filter className="w-5 h-5" />
							<span>Shift Management</span>
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant={viewMode === "list" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("list")}>
								<List className="w-4 h-4" />
							</Button>
							<Button
								variant={viewMode === "calendar" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("calendar")}>
								<Grid3X3 className="w-4 h-4" />
							</Button>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="open">Open</SelectItem>
								<SelectItem value="partially-filled">
									Partially Filled
								</SelectItem>
								<SelectItem value="filled">Filled</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
						<Select value={locationFilter} onValueChange={setLocationFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Location" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Locations</SelectItem>
								<SelectItem value="main temple">Main Temple</SelectItem>
								<SelectItem value="kitchen">Temple Kitchen</SelectItem>
								<SelectItem value="community hall">Community Hall</SelectItem>
								<SelectItem value="youth center">Youth Center</SelectItem>
							</SelectContent>
						</Select>
						<div></div>
						<Dialog
							open={isCreateModalOpen}
							onOpenChange={setIsCreateModalOpen}>
							<DialogTrigger asChild>
								<Button className="bg-temple-saffron hover:bg-temple-saffron/90">
									<Plus className="w-4 h-4 mr-2" />
									Create Shift
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Create New Shift</DialogTitle>
								</DialogHeader>
								<CreateShiftModal onClose={() => setIsCreateModalOpen(false)} />
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>

			{/* Shifts Display */}
			{viewMode === "list" ? (
				<Card>
					<CardHeader>
						<CardTitle>Shifts ({filteredShifts.length})</CardTitle>
					</CardHeader>
					<CardContent>
						{/* Mobile Card View */}
						<div className="block md:hidden space-y-4">
							{filteredShifts.length === 0 ? (
								<div className="text-center py-8">
									<CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-lg font-medium">No shifts found</p>
									<p className="text-sm text-muted-foreground">
										{statusFilter !== "all" || locationFilter !== "all"
											? "Try adjusting your filters"
											: "No shifts have been created yet"}
									</p>
								</div>
							) : (
								filteredShifts.map((shift) => {
									const assignedVolunteers = getAssignedVolunteers(shift.id);
									return (
										<Card key={shift.id} className="p-4">
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-2">
														{getStatusIcon(shift.status)}
														<h3 className="font-medium">{shift.title}</h3>
													</div>
													{getStatusBadge(shift.status)}
												</div>

												<div className="space-y-2 text-sm text-muted-foreground">
													<div className="flex items-center space-x-1">
														<CalendarIcon className="w-3 h-3" />
														<span>
															{new Date(shift.shift_date).toLocaleDateString()}
														</span>
													</div>
													<div className="flex items-center space-x-1">
														<Clock className="w-3 h-3" />
														<span>
															{shift.start_time} - {shift.end_time}
														</span>
													</div>
													<div className="flex items-center space-x-1">
														<MapPin className="w-3 h-3" />
														<span>{shift.location}</span>
													</div>
												</div>

												<div className="flex items-center justify-between">
													<div className="text-sm">
														<span className="font-medium">
															{assignedVolunteers.length}
														</span>
														/{shift.required_volunteers} assigned
													</div>
													<div className="flex space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleAssignVolunteers(shift)}
															title="Assign volunteers to this shift">
															<UserPlus className="w-4 h-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => setSelectedShift(shift)}>
															<Edit className="w-4 h-4" />
														</Button>
													</div>
												</div>
											</div>
										</Card>
									);
								})
							)}
						</div>

						{/* Desktop Table View */}
						<div className="hidden md:block overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="min-w-[200px]">
											Shift Details
										</TableHead>
										<TableHead className="min-w-[150px]">
											Requirements
										</TableHead>
										<TableHead className="min-w-[150px]">Assignments</TableHead>
										<TableHead className="min-w-[150px]">
											Event Association
										</TableHead>
										<TableHead className="min-w-[120px]">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredShifts.length === 0 ? (
										<TableRow>
											<TableCell colSpan={5} className="text-center py-8">
												<div className="flex items-center justify-center">
													<CalendarIcon className="w-12 h-12 text-muted-foreground mr-4" />
													<div>
														<p className="text-lg font-medium">
															No shifts found
														</p>
														<p className="text-sm text-muted-foreground">
															{statusFilter !== "all" ||
															locationFilter !== "all"
																? "Try adjusting your filters"
																: "No shifts have been created yet"}
														</p>
													</div>
												</div>
											</TableCell>
										</TableRow>
									) : (
										filteredShifts.map((shift) => (
											<TableRow key={shift.id}>
												<TableCell>
													<div className="space-y-1">
														<div className="flex items-center space-x-2">
															{getStatusIcon(shift.status)}
															<p className="font-medium">{shift.title}</p>
														</div>
														<div className="flex items-center space-x-4 text-sm text-muted-foreground">
															<div className="flex items-center space-x-1">
																<CalendarIcon className="w-3 h-3" />
																<span>
																	{new Date(
																		shift.shift_date
																	).toLocaleDateString()}
																</span>
															</div>
															<div className="flex items-center space-x-1">
																<Clock className="w-3 h-3" />
																<span>
																	{shift.start_time} - {shift.end_time}
																</span>
															</div>
															<div className="flex items-center space-x-1">
																<MapPin className="w-3 h-3" />
																<span>{shift.location}</span>
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="space-y-2">
														<div className="text-sm">
															<span className="font-medium">
																{shift.required_volunteers}
															</span>{" "}
															volunteers needed
														</div>
														<div className="flex flex-wrap gap-1">
															{shift.skills_required?.map((skill, index) => (
																<Badge
																	key={index}
																	variant="outline"
																	className="text-xs">
																	{skill}
																</Badge>
															))}
														</div>
														<div className="text-xs text-muted-foreground">
															Open position
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="space-y-2">
														{(() => {
															const assignedVolunteers = getAssignedVolunteers(
																shift.id
															);
															return (
																<>
																	<div className="flex -space-x-2">
																		{assignedVolunteers.length > 0 ? (
																			assignedVolunteers
																				.slice(0, 3)
																				.map((record: any, index: number) => (
																					<Avatar
																						key={index}
																						className="w-6 h-6 border-2 border-white">
																						<AvatarFallback className="text-xs">
																							{record.volunteers?.first_name?.charAt(
																								0
																							)}
																							{record.volunteers?.last_name?.charAt(
																								0
																							)}
																						</AvatarFallback>
																					</Avatar>
																				))
																		) : (
																			<div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
																				<Users className="w-3 h-3 text-gray-400" />
																			</div>
																		)}
																		{assignedVolunteers.length > 3 && (
																			<div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
																				+{assignedVolunteers.length - 3}
																			</div>
																		)}
																	</div>
																	<div className="text-sm">
																		<span className="font-medium">
																			{assignedVolunteers.length}
																		</span>
																		/{shift.required_volunteers} assigned
																	</div>
																	<div className="text-xs text-muted-foreground">
																		{assignedVolunteers.length === 0
																			? "No assignments yet"
																			: assignedVolunteers.length ===
																			  shift.required_volunteers
																			? "Fully staffed"
																			: "Needs more volunteers"}
																	</div>
																	{getStatusBadge(shift.status)}
																</>
															);
														})()}
													</div>
												</TableCell>
												<TableCell>
													<div className="space-y-1">
														<p className="text-sm font-medium">
															{shift.description || "General Volunteer Work"}
														</p>
														<p className="text-xs text-muted-foreground">
															Created:{" "}
															{new Date(shift.created_at).toLocaleDateString()}
														</p>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center space-x-1 flex-wrap">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleAssignVolunteers(shift)}
															className="flex items-center space-x-1 min-w-fit"
															title="Assign volunteers to this shift">
															<UserPlus className="w-4 h-4" />
															<span className="hidden sm:inline">Assign</span>
														</Button>
														<Dialog>
															<DialogTrigger asChild>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => setSelectedShift(shift)}
																	className="flex items-center space-x-1 min-w-fit">
																	<Edit className="w-4 h-4" />
																	<span className="hidden md:inline">Edit</span>
																</Button>
															</DialogTrigger>
															<DialogContent className="max-w-2xl">
																<DialogHeader>
																	<DialogTitle>Edit Shift</DialogTitle>
																</DialogHeader>
																{selectedShift && (
																	<EditShiftModal shift={selectedShift} />
																)}
															</DialogContent>
														</Dialog>
														<Button
															variant="outline"
															size="sm"
															className="flex items-center space-x-1 min-w-fit">
															<Copy className="w-4 h-4" />
															<span className="hidden lg:inline">Copy</span>
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Calendar View</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-7 gap-4">
							{/* Calendar implementation would go here */}
							<div className="col-span-7 text-center py-12 text-muted-foreground">
								<CalendarIcon className="w-12 h-12 mx-auto mb-4 text-temple-saffron/50" />
								<p className="text-lg mb-2">Calendar View</p>
								<p>
									Interactive calendar with drag-and-drop shift scheduling
									coming soon.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Assign Volunteer Modal */}
			{shiftToAssign && (
				<AssignVolunteerModal
					isOpen={isAssignModalOpen}
					onClose={() => {
						setIsAssignModalOpen(false);
						setShiftToAssign(null);
					}}
					shift={shiftToAssign}
				/>
			)}
		</div>
	);
};

// Create Shift Modal Component
const CreateShiftModal = ({ onClose }: { onClose: () => void }) => {
	const [selectedDate, setSelectedDate] = useState<Date>();
	const [formData, setFormData] = useState({
		title: "",
		location: "",
		description: "",
		start_time: "",
		end_time: "",
		required_volunteers: 1,
		skills_required: [] as string[],
		special_instructions: "",
	});

	const createShiftMutation = useCreateVolunteerShift();
	const { data: communitiesData } = useCommunities();
	const communities = communitiesData?.data || [];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.title ||
			!selectedDate ||
			!formData.start_time ||
			!formData.end_time
		) {
			return;
		}

		try {
			// Format date to avoid timezone issues
			const localDate = new Date(
				selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
			);
			const formattedDate = localDate.toISOString().split("T")[0];

			console.log(
				"🗓️ Creating shift with date:",
				formattedDate,
				"times:",
				formData.start_time,
				"-",
				formData.end_time
			);

			await createShiftMutation.mutateAsync({
				community_id: communities[0]?.id || "", // Use first community for now
				title: formData.title,
				description: formData.description,
				location: formData.location,
				shift_date: formattedDate,
				start_time: formData.start_time,
				end_time: formData.end_time,
				required_volunteers: formData.required_volunteers,
				skills_required: formData.skills_required,
			});

			onClose();
		} catch (error) {
			console.error("Failed to create shift:", error);
		}
	};

	return (
		<Tabs defaultValue="basic" className="w-full">
			<TabsList className="grid w-full grid-cols-3">
				<TabsTrigger value="basic">Basic Information</TabsTrigger>
				<TabsTrigger value="assignment">Assignment</TabsTrigger>
				<TabsTrigger value="notifications">Notifications</TabsTrigger>
			</TabsList>

			<TabsContent value="basic" className="space-y-4">
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="title">Shift Title</Label>
							<Input
								id="title"
								placeholder="Enter shift title"
								value={formData.title}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, title: e.target.value }))
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Select
								value={formData.location}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, location: value }))
								}>
								<SelectTrigger>
									<SelectValue placeholder="Select location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Main Temple">Main Temple</SelectItem>
									<SelectItem value="Temple Kitchen">Temple Kitchen</SelectItem>
									<SelectItem value="Community Hall">Community Hall</SelectItem>
									<SelectItem value="Youth Center">Youth Center</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label>Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-left font-normal">
										<CalendarIcon className="mr-2 h-4 w-4" />
										{selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={setSelectedDate}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2">
							<Label htmlFor="start-time">Start Time</Label>
							<Input
								id="start-time"
								type="time"
								value={formData.start_time}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										start_time: e.target.value,
									}))
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="end-time">End Time</Label>
							<Input
								id="end-time"
								type="time"
								value={formData.end_time}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, end_time: e.target.value }))
								}
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="volunteers-needed">Volunteers Needed</Label>
							<Input
								id="volunteers-needed"
								type="number"
								placeholder="Number of volunteers"
								value={formData.required_volunteers}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										required_volunteers: parseInt(e.target.value) || 1,
									}))
								}
								min="1"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="experience-level">Experience Level</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="beginner">Beginner</SelectItem>
									<SelectItem value="intermediate">Intermediate</SelectItem>
									<SelectItem value="advanced">Advanced</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Shift description and requirements"
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="special-instructions">Special Instructions</Label>
						<Textarea
							id="special-instructions"
							placeholder="Any special instructions for volunteers"
							value={formData.special_instructions}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									special_instructions: e.target.value,
								}))
							}
						/>
					</div>

					<div className="flex justify-end space-x-2">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-temple-saffron hover:bg-temple-saffron/90"
							disabled={createShiftMutation.isPending}>
							{createShiftMutation.isPending ? "Creating..." : "Create Shift"}
						</Button>
					</div>
				</form>
			</TabsContent>

			<TabsContent value="assignment" className="space-y-4">
				<div className="text-center py-8 text-muted-foreground">
					<UserPlus className="w-12 h-12 mx-auto mb-4 text-temple-saffron/50" />
					<p>
						Volunteer assignment will be available after creating the shift.
					</p>
				</div>
			</TabsContent>

			<TabsContent value="notifications" className="space-y-4">
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<input type="checkbox" id="notify-assigned" className="rounded" />
						<Label htmlFor="notify-assigned">Notify assigned volunteers</Label>
					</div>
					<div className="flex items-center space-x-2">
						<input type="checkbox" id="send-reminders" className="rounded" />
						<Label htmlFor="send-reminders">Send shift reminders</Label>
					</div>
					<div className="space-y-2">
						<Label htmlFor="custom-message">Custom Message (Optional)</Label>
						<Textarea
							id="custom-message"
							placeholder="Additional message for volunteers"
						/>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
};

// Edit Shift Modal Component
const EditShiftModal = ({ shift }: { shift: any }) => {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="edit-title">Shift Title</Label>
					<Input id="edit-title" defaultValue={shift.title} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="edit-location">Location</Label>
					<Input id="edit-location" defaultValue={shift.location} />
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="edit-date">Date</Label>
					<Input id="edit-date" type="date" defaultValue={shift.date} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="edit-start">Start Time</Label>
					<Input id="edit-start" type="time" defaultValue={shift.startTime} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="edit-end">End Time</Label>
					<Input id="edit-end" type="time" defaultValue={shift.endTime} />
				</div>
			</div>

			<div className="space-y-2">
				<Label>Assigned Volunteers</Label>
				<div className="space-y-2">
					{shift.assignedVolunteers.map((volunteer: any, index: number) => (
						<div
							key={index}
							className="flex items-center justify-between p-2 border rounded">
							<div className="flex items-center space-x-2">
								<Avatar className="w-8 h-8">
									<AvatarImage src={volunteer.avatar} />
									<AvatarFallback>
										{volunteer.name
											.split(" ")
											.map((n: string) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<span>{volunteer.name}</span>
								<Badge
									variant={
										volunteer.status === "confirmed" ? "default" : "secondary"
									}>
									{volunteer.status}
								</Badge>
							</div>
							<Button variant="outline" size="sm">
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					))}
				</div>
			</div>

			<div className="flex justify-end space-x-2">
				<Button variant="outline">Cancel</Button>
				<Button className="bg-temple-saffron hover:bg-temple-saffron/90">
					Save Changes
				</Button>
			</div>
		</div>
	);
};
