import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
	Calendar as CalendarIcon,
	Clock,
	CheckCircle,
	XCircle,
	AlertTriangle,
	Info,
	Download,
	Send,
	Eye,
	Edit3,
	Users,
	Loader2,
} from "lucide-react";
import { format } from "date-fns";
import {
	useVolunteers,
	useVolunteerShifts,
	useVolunteerAttendance,
	useCreateAttendance,
	useUpdateAttendance,
} from "@/hooks/use-complete-api";

export const AttendanceTab = () => {
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [selectedShift, setSelectedShift] = useState<string>("all");
	const [selectedVolunteer, setSelectedVolunteer] = useState<string>("all");

	// Fetch real data
	const { data: volunteersData, isLoading: volunteersLoading } = useVolunteers({
		limit: 1000,
	});
	const { data: shiftsData, isLoading: shiftsLoading } = useVolunteerShifts({
		date: selectedDate,
		limit: 1000,
	});
	const { data: attendanceData, isLoading: attendanceLoading } =
		useVolunteerAttendance({
			date: selectedDate,
			shift_id: selectedShift !== "all" ? selectedShift : undefined,
			volunteer_id: selectedVolunteer !== "all" ? selectedVolunteer : undefined,
			limit: 1000,
		});

	const volunteers = volunteersData?.data || [];
	const shifts = shiftsData?.data || [];
	const attendanceRecords = attendanceData?.data || [];

	const isLoading = volunteersLoading || shiftsLoading || attendanceLoading;

	const getAttendanceIcon = (status: string) => {
		switch (status) {
			case "present":
			case "completed":
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case "absent":
				return <XCircle className="w-4 h-4 text-red-600" />;
			case "late":
				return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
			case "excused":
				return <Info className="w-4 h-4 text-blue-600" />;
			default:
				return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
		}
	};

	const getAttendanceBadge = (status: string) => {
		switch (status) {
			case "present":
			case "completed":
				return (
					<Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
						<CheckCircle className="w-3 h-3" />
						<span>Present</span>
					</Badge>
				);
			case "absent":
				return (
					<Badge className="bg-red-100 text-red-800 flex items-center space-x-1">
						<XCircle className="w-3 h-3" />
						<span>Absent</span>
					</Badge>
				);
			case "late":
				return (
					<Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1">
						<AlertTriangle className="w-3 h-3" />
						<span>Late</span>
					</Badge>
				);
			case "excused":
				return (
					<Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
						<Info className="w-3 h-3" />
						<span>Excused</span>
					</Badge>
				);
			default:
				return <Badge variant="secondary">Not Marked</Badge>;
		}
	};

	// Get attendance record for a specific volunteer and shift
	const getAttendanceForVolunteerShift = (
		volunteerId: string,
		shiftId: string
	) => {
		return attendanceRecords.find(
			(record) =>
				record.volunteer_id === volunteerId && record.shift_id === shiftId
		);
	};

	// Calculate attendance statistics
	const calculateStats = () => {
		const totalRecords = attendanceRecords.length;
		const presentRecords = attendanceRecords.filter(
			(r) => r.status === "present" || r.status === "completed"
		).length;
		const absentRecords = attendanceRecords.filter(
			(r) => r.status === "absent"
		).length;
		const lateRecords = attendanceRecords.filter(
			(r) => r.status === "late"
		).length;

		return {
			total: totalRecords,
			present: presentRecords,
			absent: absentRecords,
			late: lateRecords,
			attendanceRate:
				totalRecords > 0
					? Math.round((presentRecords / totalRecords) * 100)
					: 0,
		};
	};

	const stats = calculateStats();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-temple-saffron mx-auto mb-4" />
					<p className="text-muted-foreground">Loading attendance data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Controls and Stats */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<CalendarIcon className="w-5 h-5" />
							<span>Attendance Tracking</span>
						</div>
						<div className="flex items-center space-x-2">
							<Button variant="outline" size="sm">
								<Download className="w-4 h-4 mr-2" />
								Export Report
							</Button>
							<Button variant="outline" size="sm">
								<Send className="w-4 h-4 mr-2" />
								Send Reminders
							</Button>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<div className="space-y-2">
							<Label>Date</Label>
							<Input
								type="date"
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>Shift Filter</Label>
							<Select value={selectedShift} onValueChange={setSelectedShift}>
								<SelectTrigger>
									<SelectValue placeholder="All shifts" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Shifts</SelectItem>
									{shifts.map((shift) => (
										<SelectItem key={shift.id} value={shift.id}>
											{shift.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Volunteer Filter</Label>
							<Select
								value={selectedVolunteer}
								onValueChange={setSelectedVolunteer}>
								<SelectTrigger>
									<SelectValue placeholder="All volunteers" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Volunteers</SelectItem>
									{volunteers.map((volunteer) => (
										<SelectItem key={volunteer.id} value={volunteer.id}>
											{volunteer.first_name} {volunteer.last_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div></div>
					</div>

					{/* Statistics */}
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						<div className="text-center p-4 bg-blue-50 rounded-lg">
							<div className="text-2xl font-bold text-blue-600">
								{stats.total}
							</div>
							<div className="text-sm text-blue-600">Total Records</div>
						</div>
						<div className="text-center p-4 bg-green-50 rounded-lg">
							<div className="text-2xl font-bold text-green-600">
								{stats.present}
							</div>
							<div className="text-sm text-green-600">Present</div>
						</div>
						<div className="text-center p-4 bg-red-50 rounded-lg">
							<div className="text-2xl font-bold text-red-600">
								{stats.absent}
							</div>
							<div className="text-sm text-red-600">Absent</div>
						</div>
						<div className="text-center p-4 bg-yellow-50 rounded-lg">
							<div className="text-2xl font-bold text-yellow-600">
								{stats.late}
							</div>
							<div className="text-sm text-yellow-600">Late</div>
						</div>
						<div className="text-center p-4 bg-purple-50 rounded-lg">
							<div className="text-2xl font-bold text-purple-600">
								{stats.attendanceRate}%
							</div>
							<div className="text-sm text-purple-600">Attendance Rate</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Shift-based Attendance */}
			<Card>
				<CardHeader>
					<CardTitle>
						Shift Attendance - {format(new Date(selectedDate), "PPP")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{shifts.length === 0 ? (
						<div className="text-center py-8">
							<CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
							<p className="text-lg font-medium">No shifts scheduled</p>
							<p className="text-sm text-muted-foreground">
								No shifts are scheduled for{" "}
								{format(new Date(selectedDate), "PPP")}
							</p>
						</div>
					) : (
						<div className="space-y-6">
							{shifts.map((shift) => (
								<ShiftAttendanceCard
									key={shift.id}
									shift={shift}
									volunteers={volunteers}
									attendanceRecords={attendanceRecords}
									getAttendanceForVolunteerShift={
										getAttendanceForVolunteerShift
									}
									getAttendanceBadge={getAttendanceBadge}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Attendance Records Table */}
			<Card>
				<CardHeader>
					<CardTitle>Attendance Records</CardTitle>
				</CardHeader>
				<CardContent>
					{attendanceRecords.length === 0 ? (
						<div className="text-center py-8">
							<Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
							<p className="text-lg font-medium">No attendance records</p>
							<p className="text-sm text-muted-foreground">
								No attendance has been recorded for the selected filters
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Volunteer</TableHead>
									<TableHead>Shift</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Check In</TableHead>
									<TableHead>Check Out</TableHead>
									<TableHead>Notes</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{attendanceRecords.map((record) => (
									<TableRow key={record.id}>
										<TableCell>
											<div className="flex items-center space-x-3">
												<Avatar className="w-8 h-8">
													<AvatarFallback>
														{record.volunteers?.first_name?.charAt(0)}
														{record.volunteers?.last_name?.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">
														{record.volunteers?.first_name}{" "}
														{record.volunteers?.last_name}
													</p>
													<p className="text-sm text-muted-foreground">
														{record.volunteers?.email}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div>
												<p className="font-medium">
													{record.volunteer_shifts?.title}
												</p>
												<p className="text-sm text-muted-foreground">
													{record.volunteer_shifts?.start_time} -{" "}
													{record.volunteer_shifts?.end_time}
												</p>
											</div>
										</TableCell>
										<TableCell>{getAttendanceBadge(record.status)}</TableCell>
										<TableCell>
											{record.check_in_time
												? format(new Date(record.check_in_time), "HH:mm")
												: "-"}
										</TableCell>
										<TableCell>
											{record.check_out_time
												? format(new Date(record.check_out_time), "HH:mm")
												: "-"}
										</TableCell>
										<TableCell>
											<span className="text-sm">{record.notes || "-"}</span>
										</TableCell>
										<TableCell>
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="outline" size="sm">
														<Edit3 className="w-4 h-4" />
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Update Attendance</DialogTitle>
													</DialogHeader>
													<AttendanceUpdateModal record={record} />
												</DialogContent>
											</Dialog>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

// Shift Attendance Card Component
const ShiftAttendanceCard = ({
	shift,
	volunteers,
	attendanceRecords,
	getAttendanceForVolunteerShift,
	getAttendanceBadge,
}: any) => {
	const createAttendanceMutation = useCreateAttendance();
	const updateAttendanceMutation = useUpdateAttendance();
	const [pendingVolunteers, setPendingVolunteers] = useState<Set<string>>(
		new Set()
	);

	const handleMarkAttendance = async (volunteerId: string, status: string) => {
		// Prevent multiple clicks for the same volunteer
		if (pendingVolunteers.has(volunteerId)) {
			return;
		}

		// Add volunteer to pending set
		setPendingVolunteers((prev) => new Set(prev).add(volunteerId));

		try {
			const existingAttendance = getAttendanceForVolunteerShift(
				volunteerId,
				shift.id
			);

			if (existingAttendance) {
				// Update existing attendance record
				await updateAttendanceMutation.mutateAsync({
					id: existingAttendance.id,
					status,
					check_in_time:
						status === "present" ? new Date().toISOString() : undefined,
					check_out_time:
						status === "absent" ? undefined : existingAttendance.check_out_time,
				});
			} else {
				// Create new attendance record
				await createAttendanceMutation.mutateAsync({
					volunteer_id: volunteerId,
					shift_id: shift.id,
					status,
					check_in_time:
						status === "present" ? new Date().toISOString() : undefined,
				});
			}
		} catch (error) {
			console.error("Failed to mark attendance:", error);
		} finally {
			// Remove volunteer from pending set
			setPendingVolunteers((prev) => {
				const newSet = new Set(prev);
				newSet.delete(volunteerId);
				return newSet;
			});
		}
	};

	// Get volunteers who should be at this shift (for now, show all volunteers)
	const shiftVolunteers = volunteers.slice(0, shift.required_volunteers || 5);

	return (
		<div className="border rounded-lg p-4">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h3 className="font-semibold">{shift.title}</h3>
					<div className="flex items-center space-x-4 text-sm text-muted-foreground">
						<div className="flex items-center space-x-1">
							<CalendarIcon className="w-3 h-3" />
							<span>{shift.shift_date}</span>
						</div>
						<div className="flex items-center space-x-1">
							<Clock className="w-3 h-3" />
							<span>
								{shift.start_time} - {shift.end_time}
							</span>
						</div>
						<span>{shift.location}</span>
					</div>
				</div>
				<div className="text-right">
					<div className="text-sm text-muted-foreground">
						Required Volunteers
					</div>
					<div className="text-2xl font-bold text-blue-600">
						{shift.required_volunteers}
					</div>
					{/* Attendance Summary */}
					<div className="mt-2 text-sm">
						<div className="flex space-x-4">
							<span className="text-green-600">
								Present:{" "}
								{
									shiftVolunteers.filter((v: any) => {
										const att = getAttendanceForVolunteerShift(v.id, shift.id);
										return att?.status === "present";
									}).length
								}
							</span>
							<span className="text-red-600">
								Absent:{" "}
								{
									shiftVolunteers.filter((v: any) => {
										const att = getAttendanceForVolunteerShift(v.id, shift.id);
										return att?.status === "absent";
									}).length
								}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-3">
				{shiftVolunteers.map((volunteer: any) => {
					const attendance = getAttendanceForVolunteerShift(
						volunteer.id,
						shift.id
					);

					return (
						<div
							key={volunteer.id}
							className={`flex items-center justify-between p-3 rounded ${
								attendance?.status === "present"
									? "bg-green-50 border-l-4 border-green-500"
									: attendance?.status === "absent"
									? "bg-red-50 border-l-4 border-red-500"
									: "bg-gray-50"
							}`}>
							<div className="flex items-center space-x-3">
								<Avatar className="w-8 h-8">
									<AvatarFallback>
										{volunteer.first_name?.charAt(0)}
										{volunteer.last_name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">
										{volunteer.first_name} {volunteer.last_name}
									</p>
									<p className="text-sm text-muted-foreground">
										{volunteer.email}
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								{attendance ? (
									<div className="flex items-center space-x-2">
										{getAttendanceBadge(attendance.status)}
										{/* Only show buttons if not marked as present */}
										{attendance.status !== "present" && (
											<div className="flex space-x-1">
												<Button
													size="sm"
													className="bg-green-600 hover:bg-green-700"
													onClick={() =>
														handleMarkAttendance(volunteer.id, "present")
													}
													disabled={
														createAttendanceMutation.isPending ||
														updateAttendanceMutation.isPending ||
														pendingVolunteers.has(volunteer.id)
													}>
													{pendingVolunteers.has(volunteer.id)
														? "Updating..."
														: "Mark Present"}
												</Button>
												{attendance.status !== "absent" && (
													<Button
														size="sm"
														variant="destructive"
														onClick={() =>
															handleMarkAttendance(volunteer.id, "absent")
														}
														disabled={
															createAttendanceMutation.isPending ||
															updateAttendanceMutation.isPending ||
															pendingVolunteers.has(volunteer.id)
														}>
														{pendingVolunteers.has(volunteer.id)
															? "Updating..."
															: "Mark Absent"}
													</Button>
												)}
											</div>
										)}
										{/* Show completion message when marked as present */}
										{attendance.status === "present" && (
											<div className="text-sm text-green-600 font-medium flex items-center space-x-1">
												<CheckCircle className="w-4 h-4" />
												<span>Attendance Recorded</span>
											</div>
										)}
									</div>
								) : (
									<div className="flex space-x-2">
										<Button
											size="sm"
											className="bg-green-600 hover:bg-green-700"
											onClick={() =>
												handleMarkAttendance(volunteer.id, "present")
											}
											disabled={
												createAttendanceMutation.isPending ||
												updateAttendanceMutation.isPending ||
												pendingVolunteers.has(volunteer.id)
											}>
											{pendingVolunteers.has(volunteer.id)
												? "Marking..."
												: "Present"}
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() =>
												handleMarkAttendance(volunteer.id, "absent")
											}
											disabled={
												createAttendanceMutation.isPending ||
												updateAttendanceMutation.isPending ||
												pendingVolunteers.has(volunteer.id)
											}>
											{pendingVolunteers.has(volunteer.id)
												? "Marking..."
												: "Absent"}
										</Button>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

// Attendance Update Modal Component
const AttendanceUpdateModal = ({ record }: { record: any }) => {
	const [status, setStatus] = useState(record.status);
	const [checkIn, setCheckIn] = useState(
		record.check_in_time ? format(new Date(record.check_in_time), "HH:mm") : ""
	);
	const [checkOut, setCheckOut] = useState(
		record.check_out_time
			? format(new Date(record.check_out_time), "HH:mm")
			: ""
	);
	const [notes, setNotes] = useState(record.notes || "");

	const updateAttendanceMutation = useUpdateAttendance();

	const handleUpdate = async () => {
		try {
			const updateData: any = {
				id: record.id,
				status,
				notes,
			};

			if (checkIn) {
				const today = new Date().toISOString().split("T")[0];
				updateData.check_in_time = `${today}T${checkIn}:00.000Z`;
			}

			if (checkOut) {
				const today = new Date().toISOString().split("T")[0];
				updateData.check_out_time = `${today}T${checkOut}:00.000Z`;
			}

			await updateAttendanceMutation.mutateAsync(updateData);
		} catch (error) {
			console.error("Failed to update attendance:", error);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center space-x-3">
				<Avatar>
					<AvatarFallback>
						{record.volunteers?.first_name?.charAt(0)}
						{record.volunteers?.last_name?.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className="font-medium">
						{record.volunteers?.first_name} {record.volunteers?.last_name}
					</p>
					<p className="text-sm text-muted-foreground">
						{record.volunteer_shifts?.title}
					</p>
				</div>
			</div>

			<div className="space-y-2">
				<Label>Attendance Status</Label>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="present">Present</SelectItem>
						<SelectItem value="absent">Absent</SelectItem>
						<SelectItem value="late">Late</SelectItem>
						<SelectItem value="excused">Excused</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{(status === "present" || status === "late") && (
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Check-in Time</Label>
						<Input
							type="time"
							value={checkIn}
							onChange={(e) => setCheckIn(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label>Check-out Time</Label>
						<Input
							type="time"
							value={checkOut}
							onChange={(e) => setCheckOut(e.target.value)}
						/>
					</div>
				</div>
			)}

			<div className="space-y-2">
				<Label>Notes</Label>
				<Textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					placeholder="Add any notes about attendance..."
					rows={3}
				/>
			</div>

			<div className="flex justify-end space-x-2">
				<Button variant="outline">Cancel</Button>
				<Button
					className="bg-temple-saffron hover:bg-temple-saffron/90"
					onClick={handleUpdate}
					disabled={updateAttendanceMutation.isPending}>
					{updateAttendanceMutation.isPending
						? "Updating..."
						: "Update Attendance"}
				</Button>
			</div>
		</div>
	);
};
