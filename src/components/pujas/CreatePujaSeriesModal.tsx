import React, { useState, useEffect } from "react";
import {
	X,
	Calendar,
	Clock,
	MapPin,
	User,
	Bell,
	Users,
	Eye,
	Save,
	Loader2,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RECURRENCE_TYPES = [
	{ value: "none", label: "One-time puja" },
	{ value: "daily", label: "Daily" },
	{ value: "weekly", label: "Weekly" },
	{ value: "monthly", label: "Monthly" },
	{ value: "yearly", label: "Yearly" },
];

const DAYS_OF_WEEK = [
	{ value: "sunday", label: "Sunday" },
	{ value: "monday", label: "Monday" },
	{ value: "tuesday", label: "Tuesday" },
	{ value: "wednesday", label: "Wednesday" },
	{ value: "thursday", label: "Thursday" },
	{ value: "friday", label: "Friday" },
	{ value: "saturday", label: "Saturday" },
];

const WEEK_OF_MONTH = [
	{ value: "1", label: "1st week" },
	{ value: "2", label: "2nd week" },
	{ value: "3", label: "3rd week" },
	{ value: "4", label: "4th week" },
	{ value: "last", label: "Last week" },
];

const PUJA_TYPES = [
	{ value: "aarti", label: "Aarti" },
	{ value: "havan", label: "Havan" },
	{ value: "puja", label: "Puja" },
	{ value: "special_ceremony", label: "Special Ceremony" },
	{ value: "festival", label: "Festival" },
	{ value: "other", label: "Other" },
];

export default function CreatePujaSeriesModal({
	isOpen,
	onClose,
	onSave,
	editData,
	priests,
	locations,
	isLoading = false,
}) {
	const [activeTab, setActiveTab] = useState("basic");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		priest: "",
		type: "puja",
		deity: "",
		startTime: "",
		duration: 60,
		visibility: "public",
		recurrenceType: "none",
		frequency: 1,
		daysOfWeek: [],
		weekOfMonth: "",
		monthSelection: [],
		startDate: new Date().toISOString().split("T")[0],
		endCondition: "never",
		endDate: "",
		endAfterOccurrences: 10,
		timezone: "Asia/Kolkata",
		notifySubscribers: true,
		sendReminders: true,
		reminderTimes: ["30", "15"],
		notifyExceptions: true,
		customNotificationMessage: "",
		enableAttendanceTracking: false,
		capacityLimit: "",
		registrationRequired: false,
		allowExceptions: true,
		autoGenerateInstances: true,
		publicVisibility: true,
		subscriptionEnabled: true,
	});
	const [previewInstances, setPreviewInstances] = useState([]);

	useEffect(() => {
		if (editData) {
			setFormData({
				...formData,
				...editData,
				daysOfWeek: editData.daysOfWeek || [],
				monthSelection: editData.monthSelection || [],
				reminderTimes: editData.reminderTimes || ["30", "15"],
			});
		}
	}, [editData]);

	useEffect(() => {
		if (formData.recurrenceType !== "none") {
			generatePreviewInstances();
		}
	}, [
		formData.recurrenceType,
		formData.frequency,
		formData.daysOfWeek,
		formData.startDate,
		formData.startTime,
	]);

	const generatePreviewInstances = () => {
		const instances = [];
		const startDate = formData.startDate
			? new Date(formData.startDate)
			: new Date();

		if (formData.recurrenceType === "daily") {
			for (let i = 0; i < 20; i++) {
				const instanceDate = new Date(startDate);
				instanceDate.setDate(startDate.getDate() + i * formData.frequency);

				instances.push({
					date: instanceDate.toISOString().split("T")[0],
					time: formData.startTime,
					dayOfWeek: instanceDate.toLocaleDateString("en-US", {
						weekday: "long",
					}),
				});
			}
		} else if (
			formData.recurrenceType === "weekly" &&
			formData.daysOfWeek.length > 0
		) {
			const dayMap = {
				sunday: 0,
				monday: 1,
				tuesday: 2,
				wednesday: 3,
				thursday: 4,
				friday: 5,
				saturday: 6,
			};
			let currentDate = new Date(startDate);
			let instanceCount = 0;

			while (instanceCount < 20) {
				const dayOfWeek = currentDate.getDay();
				const dayName = Object.keys(dayMap).find(
					(key) => dayMap[key] === dayOfWeek
				);

				if (formData.daysOfWeek.includes(dayName)) {
					instances.push({
						date: currentDate.toISOString().split("T")[0],
						time: formData.startTime,
						dayOfWeek: currentDate.toLocaleDateString("en-US", {
							weekday: "long",
						}),
					});
					instanceCount++;
				}

				currentDate.setDate(currentDate.getDate() + 1);
			}
		}

		setPreviewInstances(instances);
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleArrayChange = (field, value, checked) => {
		setFormData((prev) => ({
			...prev,
			[field]: checked
				? [...prev[field], value]
				: prev[field].filter((item) => item !== value),
		}));
	};

	const handleSubmit = () => {
		onSave(formData);
	};

	const isFormValid = () => {
		return (
			formData.title &&
			formData.location &&
			formData.priest &&
			formData.type &&
			formData.startTime
		);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<h2 className="text-2xl font-bold text-gray-900">
						{editData ? "Edit Puja Series" : "Create Puja Series"}
					</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Content */}
				<div className="overflow-y-auto max-h-[calc(90vh-140px)]">
					<Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="basic">Basic Information</TabsTrigger>
							<TabsTrigger value="recurring">Recurring Pattern</TabsTrigger>
							<TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
							<TabsTrigger value="preview">Preview</TabsTrigger>
						</TabsList>

						<TabsContent value="basic" className="space-y-6 mt-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<Label htmlFor="title">Puja Title *</Label>
										<Input
											id="title"
											value={formData.title}
											onChange={(e) =>
												handleInputChange("title", e.target.value)
											}
											placeholder="Enter puja title"
										/>
									</div>

									<div>
										<Label htmlFor="location">Location *</Label>
										<Select
											value={formData.location}
											onValueChange={(value) =>
												handleInputChange("location", value)
											}>
											<SelectTrigger>
												<SelectValue placeholder="Select location" />
											</SelectTrigger>
											<SelectContent>
												{locations.map((location, index) => (
													<SelectItem
														key={`location-${index}`}
														value={location}>
														{location}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="priest">Priest Assignment *</Label>
										<Select
											value={formData.priest}
											onValueChange={(value) =>
												handleInputChange("priest", value)
											}>
											<SelectTrigger>
												<SelectValue placeholder="Select priest" />
											</SelectTrigger>
											<SelectContent>
												{priests.map((priest) => (
													<SelectItem
														key={`priest-${priest.id}`}
														value={priest.name}>
														{priest.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="type">Puja Type *</Label>
										<Select
											value={formData.type}
											onValueChange={(value) =>
												handleInputChange("type", value)
											}>
											<SelectTrigger>
												<SelectValue placeholder="Select puja type" />
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

									<div>
										<Label htmlFor="deity">Deity</Label>
										<Input
											id="deity"
											value={formData.deity}
											onChange={(e) =>
												handleInputChange("deity", e.target.value)
											}
											placeholder="Enter deity name"
										/>
									</div>

									<div>
										<Label htmlFor="visibility">Visibility</Label>
										<Select
											value={formData.visibility}
											onValueChange={(value) =>
												handleInputChange("visibility", value)
											}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="public">Public</SelectItem>
												<SelectItem value="community">Community</SelectItem>
												<SelectItem value="private">Private</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<Label htmlFor="description">Description</Label>
										<Textarea
											id="description"
											value={formData.description}
											onChange={(e) =>
												handleInputChange("description", e.target.value)
											}
											placeholder="Enter puja description"
											rows={4}
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="startTime">Start Time *</Label>
											<Input
												id="startTime"
												type="time"
												value={formData.startTime}
												onChange={(e) =>
													handleInputChange("startTime", e.target.value)
												}
											/>
										</div>

										<div>
											<Label htmlFor="duration">Duration (minutes)</Label>
											<Input
												id="duration"
												type="number"
												value={formData.duration}
												onChange={(e) =>
													handleInputChange(
														"duration",
														parseInt(e.target.value)
													)
												}
												min="15"
												max="480"
											/>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="recurring" className="space-y-6 mt-6">
							<div className="space-y-6">
								<div>
									<Label>Recurrence Type</Label>
									<Select
										value={formData.recurrenceType}
										onValueChange={(value) =>
											handleInputChange("recurrenceType", value)
										}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{RECURRENCE_TYPES.map((type) => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{formData.recurrenceType !== "none" && (
									<>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="frequency">Frequency</Label>
												<div className="flex items-center gap-2">
													<span>Every</span>
													<Input
														id="frequency"
														type="number"
														value={formData.frequency}
														onChange={(e) =>
															handleInputChange(
																"frequency",
																parseInt(e.target.value)
															)
														}
														min="1"
														max="365"
														className="w-20"
													/>
													<span>
														{formData.recurrenceType === "daily" && "day(s)"}
														{formData.recurrenceType === "weekly" && "week(s)"}
														{formData.recurrenceType === "monthly" &&
															"month(s)"}
														{formData.recurrenceType === "yearly" && "year(s)"}
													</span>
												</div>
											</div>

											<div>
												<Label htmlFor="startDate">Start Date</Label>
												<Input
													id="startDate"
													type="date"
													value={formData.startDate}
													onChange={(e) =>
														handleInputChange("startDate", e.target.value)
													}
												/>
											</div>
										</div>

										{formData.recurrenceType === "weekly" && (
											<div>
												<Label>Days of Week</Label>
												<div className="grid grid-cols-4 gap-2 mt-2">
													{DAYS_OF_WEEK.map((day) => (
														<div
															key={day.value}
															className="flex items-center space-x-2">
															<Checkbox
																id={day.value}
																checked={formData.daysOfWeek.includes(
																	day.value
																)}
																onCheckedChange={(checked) =>
																	handleArrayChange(
																		"daysOfWeek",
																		day.value,
																		checked
																	)
																}
															/>
															<Label htmlFor={day.value} className="text-sm">
																{day.label}
															</Label>
														</div>
													))}
												</div>
											</div>
										)}

										{formData.recurrenceType === "monthly" && (
											<div>
												<Label>Week of Month</Label>
												<Select
													value={formData.weekOfMonth}
													onValueChange={(value) =>
														handleInputChange("weekOfMonth", value)
													}>
													<SelectTrigger>
														<SelectValue placeholder="Select week" />
													</SelectTrigger>
													<SelectContent>
														{WEEK_OF_MONTH.map((week) => (
															<SelectItem key={week.value} value={week.value}>
																{week.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										)}

										<div>
											<Label>End Condition</Label>
											<div className="space-y-3 mt-2">
												<div className="flex items-center space-x-2">
													<input
														type="radio"
														id="never"
														name="endCondition"
														value="never"
														checked={formData.endCondition === "never"}
														onChange={(e) =>
															handleInputChange("endCondition", e.target.value)
														}
													/>
													<Label htmlFor="never">
														Never (continues indefinitely)
													</Label>
												</div>

												<div className="flex items-center space-x-2">
													<input
														type="radio"
														id="endDate"
														name="endCondition"
														value="endDate"
														checked={formData.endCondition === "endDate"}
														onChange={(e) =>
															handleInputChange("endCondition", e.target.value)
														}
													/>
													<Label htmlFor="endDate">End by date:</Label>
													<Input
														type="date"
														value={formData.endDate}
														onChange={(e) =>
															handleInputChange("endDate", e.target.value)
														}
														disabled={formData.endCondition !== "endDate"}
														className="w-40"
													/>
												</div>

												<div className="flex items-center space-x-2">
													<input
														type="radio"
														id="endAfter"
														name="endCondition"
														value="endAfter"
														checked={formData.endCondition === "endAfter"}
														onChange={(e) =>
															handleInputChange("endCondition", e.target.value)
														}
													/>
													<Label htmlFor="endAfter">End after:</Label>
													<Input
														type="number"
														value={formData.endAfterOccurrences}
														onChange={(e) =>
															handleInputChange(
																"endAfterOccurrences",
																parseInt(e.target.value)
															)
														}
														disabled={formData.endCondition !== "endAfter"}
														min="1"
														className="w-20"
													/>
													<span>occurrences</span>
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						</TabsContent>

						<TabsContent value="advanced" className="space-y-6 mt-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Bell className="h-5 w-5" />
											Notifications
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between">
											<Label htmlFor="notifySubscribers">
												Notify subscribers of schedule
											</Label>
											<Switch
												id="notifySubscribers"
												checked={formData.notifySubscribers}
												onCheckedChange={(checked) =>
													handleInputChange("notifySubscribers", checked)
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<Label htmlFor="sendReminders">Send reminders</Label>
											<Switch
												id="sendReminders"
												checked={formData.sendReminders}
												onCheckedChange={(checked) =>
													handleInputChange("sendReminders", checked)
												}
											/>
										</div>

										{formData.sendReminders && (
											<div>
												<Label>Reminder Times (minutes before)</Label>
												<div className="grid grid-cols-2 gap-2 mt-2">
													{["30", "15", "5"].map((time) => (
														<div
															key={time}
															className="flex items-center space-x-2">
															<Checkbox
																id={`reminder-${time}`}
																checked={formData.reminderTimes.includes(time)}
																onCheckedChange={(checked) =>
																	handleArrayChange(
																		"reminderTimes",
																		time,
																		checked
																	)
																}
															/>
															<Label
																htmlFor={`reminder-${time}`}
																className="text-sm">
																{time} minutes
															</Label>
														</div>
													))}
												</div>
											</div>
										)}

										<div>
											<Label htmlFor="customMessage">
												Custom notification message
											</Label>
											<Textarea
												id="customMessage"
												value={formData.customNotificationMessage}
												onChange={(e) =>
													handleInputChange(
														"customNotificationMessage",
														e.target.value
													)
												}
												placeholder="Optional custom message for notifications"
												rows={3}
											/>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Users className="h-5 w-5" />
											Attendance & Settings
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between">
											<Label htmlFor="enableAttendance">
												Enable attendance tracking
											</Label>
											<Switch
												id="enableAttendance"
												checked={formData.enableAttendanceTracking}
												onCheckedChange={(checked) =>
													handleInputChange("enableAttendanceTracking", checked)
												}
											/>
										</div>

										{formData.enableAttendanceTracking && (
											<>
												<div>
													<Label htmlFor="capacityLimit">Capacity limit</Label>
													<Input
														id="capacityLimit"
														type="number"
														value={formData.capacityLimit}
														onChange={(e) =>
															handleInputChange("capacityLimit", e.target.value)
														}
														placeholder="Maximum attendees (optional)"
													/>
												</div>

												<div className="flex items-center justify-between">
													<Label htmlFor="registrationRequired">
														Registration required
													</Label>
													<Switch
														id="registrationRequired"
														checked={formData.registrationRequired}
														onCheckedChange={(checked) =>
															handleInputChange("registrationRequired", checked)
														}
													/>
												</div>
											</>
										)}

										<div className="flex items-center justify-between">
											<Label htmlFor="allowExceptions">Allow exceptions</Label>
											<Switch
												id="allowExceptions"
												checked={formData.allowExceptions}
												onCheckedChange={(checked) =>
													handleInputChange("allowExceptions", checked)
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<Label htmlFor="publicVisibility">
												Public visibility
											</Label>
											<Switch
												id="publicVisibility"
												checked={formData.publicVisibility}
												onCheckedChange={(checked) =>
													handleInputChange("publicVisibility", checked)
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<Label htmlFor="subscriptionEnabled">
												Enable subscriptions
											</Label>
											<Switch
												id="subscriptionEnabled"
												checked={formData.subscriptionEnabled}
												onCheckedChange={(checked) =>
													handleInputChange("subscriptionEnabled", checked)
												}
											/>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="preview" className="space-y-6 mt-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Eye className="h-5 w-5" />
										Generated Instances Preview
									</CardTitle>
								</CardHeader>
								<CardContent>
									{previewInstances.length > 0 ? (
										<div className="space-y-4">
											<div className="text-sm text-gray-600">
												Showing next {previewInstances.length} occurrences
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
												{previewInstances.map((instance, index) => (
													<Card
														key={index}
														className="border-l-4 border-l-blue-500">
														<CardContent className="p-3">
															<div className="space-y-1 text-sm">
																<div className="font-medium">
																	{instance.dayOfWeek}
																</div>
																<div className="text-gray-600">
																	{instance.date}
																</div>
																<div className="flex items-center gap-1">
																	<Clock className="h-3 w-3" />
																	{instance.time}
																</div>
															</div>
														</CardContent>
													</Card>
												))}
											</div>

											<Button
												variant="outline"
												size="sm"
												onClick={generatePreviewInstances}>
												Generate More
											</Button>
										</div>
									) : (
										<div className="text-center py-8 text-gray-500">
											<Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
											<p>Configure recurrence pattern to see preview</p>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between p-6 border-t bg-gray-50">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!isFormValid() || isLoading}
						className="flex items-center gap-2">
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								{editData ? "Updating..." : "Creating..."}
							</>
						) : (
							<>
								<Save className="h-4 w-4" />
								{editData ? "Update Series" : "Create Series"}
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
