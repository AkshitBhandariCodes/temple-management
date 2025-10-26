import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
	Calendar,
	List,
	Plus,
	Loader2,
	CalendarDays,
	Clock,
	MapPin,
	Users,
	CheckSquare,
	Search,
	ChevronLeft,
	ChevronRight,
	Eye,
	Edit,
	Trash2,
	AlertCircle,
	CheckCircle,
	Circle,
	User,
} from "lucide-react";
import {
	format,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	addMonths,
	subMonths,
	isToday,
} from "date-fns";
import {
	useEvents,
	useCreateEvent,
	Event as DatabaseEvent,
	useCommunities,
	useTasks,
	useCreateTask,
	useUpdateTask,
	useDeleteTask,
	Task,
} from "@/hooks/use-complete-api";
import { useToast } from "@/hooks/use-toast";

// Enhanced Event interface for UI
interface UIEvent {
	id: string;
	title: string;
	description: string;
	communityId: string;
	communityName: string;
	location: string;
	startDate: Date;
	endDate: Date;
	timezone: string;
	status: "draft" | "published" | "cancelled" | "completed";
	visibility: "public" | "community" | "private";
	registrationRequired: boolean;
	capacity?: number;
	currentRegistrations: number;
	isRecurring: boolean;
}

// Map database event to UI event type
function mapDatabaseToUIEvent(
	dbEvent: DatabaseEvent,
	communities: any[] = []
): UIEvent {
	const community = communities.find((c) => c.id === dbEvent.community_id);

	return {
		id: dbEvent.id,
		title: dbEvent.title,
		description: dbEvent.description || "",
		communityId: dbEvent.community_id || "",
		communityName: community?.name || "Unknown Community",
		location: dbEvent.location || "",
		startDate: new Date(dbEvent.starts_at),
		endDate: new Date(dbEvent.ends_at),
		timezone: dbEvent.timezone,
		status: dbEvent.status as "draft" | "published" | "cancelled" | "completed",
		visibility: dbEvent.visibility as "public" | "community" | "private",
		registrationRequired: dbEvent.registration_required,
		capacity: dbEvent.capacity,
		currentRegistrations: 0,
		isRecurring: dbEvent.is_recurring,
	};
}

// Status colors
const statusColors = {
	draft: "bg-gray-100 text-gray-800",
	published: "bg-green-100 text-green-800",
	cancelled: "bg-red-100 text-red-800",
	completed: "bg-blue-100 text-blue-800",
};

const communityColors = [
	"bg-purple-100 border-purple-300",
	"bg-blue-100 border-blue-300",
	"bg-green-100 border-green-300",
	"bg-orange-100 border-orange-300",
	"bg-pink-100 border-pink-300",
];

export const EventsTasksManagement: React.FC = () => {
	const { toast } = useToast();
	const {
		data: dbEvents,
		isLoading: eventsLoading,
		refetch: refetchEvents,
	} = useEvents();
	const {
		data: dbTasks,
		isLoading: tasksLoading,
		refetch: refetchTasks,
	} = useTasks();
	const { data: communitiesData, isLoading: communitiesLoading } =
		useCommunities();
	const createEventMutation = useCreateEvent();
	const createTaskMutation = useCreateTask();
	const updateTaskMutation = useUpdateTask();
	const deleteTaskMutation = useDeleteTask();

	const [activeTab, setActiveTab] = useState("events");
	const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
	const [currentDate, setCurrentDate] = useState(new Date());
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCommunity, setSelectedCommunity] = useState<string>("all");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<UIEvent | null>(null);
	const [showEventDetail, setShowEventDetail] = useState(false);

	// Task-related state
	const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [showTaskDetail, setShowTaskDetail] = useState(false);
	const [taskSearchTerm, setTaskSearchTerm] = useState("");
	const [selectedTaskStatus, setSelectedTaskStatus] = useState<string>("all");
	const [selectedTaskPriority, setSelectedTaskPriority] =
		useState<string>("all");

	// Form state for creating events
	const [newEvent, setNewEvent] = useState({
		title: "",
		description: "",
		location: "",
		communityId: "",
		startDate: "",
		startTime: "",
		endDate: "",
		endTime: "",
		capacity: "",
		registrationRequired: false,
		visibility: "public" as "public" | "community" | "private",
	});

	// Form state for creating tasks
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		communityId: "",
		status: "todo" as "todo" | "in-progress" | "completed",
		priority: "medium" as "low" | "medium" | "high",
		dueDate: "",
		assignedTo: [] as string[],
		tags: [] as string[],
	});

	// Convert database events to UI events
	const communities = communitiesData?.data || [];
	const events = useMemo(() => {
		return (dbEvents?.data || []).map((dbEvent: DatabaseEvent) =>
			mapDatabaseToUIEvent(dbEvent, communities)
		);
	}, [dbEvents, communities]);

	// Process tasks data
	const tasks = useMemo(() => {
		return dbTasks?.data || [];
	}, [dbTasks]);

	// Filter events
	const filteredEvents = useMemo(() => {
		return events.filter((event) => {
			if (
				searchTerm &&
				!event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
				!event.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
				!event.location.toLowerCase().includes(searchTerm.toLowerCase())
			) {
				return false;
			}

			if (
				selectedCommunity !== "all" &&
				event.communityId !== selectedCommunity
			) {
				return false;
			}

			if (selectedStatus !== "all" && event.status !== selectedStatus) {
				return false;
			}

			return true;
		});
	}, [events, searchTerm, selectedCommunity, selectedStatus]);

	// Filter tasks
	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			if (
				taskSearchTerm &&
				!task.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) &&
				!task.description?.toLowerCase().includes(taskSearchTerm.toLowerCase())
			) {
				return false;
			}

			if (
				selectedCommunity !== "all" &&
				task.community_id !== selectedCommunity
			) {
				return false;
			}

			if (selectedTaskStatus !== "all" && task.status !== selectedTaskStatus) {
				return false;
			}

			if (
				selectedTaskPriority !== "all" &&
				task.priority !== selectedTaskPriority
			) {
				return false;
			}

			return true;
		});
	}, [
		tasks,
		taskSearchTerm,
		selectedCommunity,
		selectedTaskStatus,
		selectedTaskPriority,
	]);

	// Calendar functions
	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);
	const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

	const eventsForDate = (date: Date) => {
		return filteredEvents.filter((event) => isSameDay(event.startDate, date));
	};

	const getCommunityColor = (communityId: string) => {
		const index =
			communityId.charCodeAt(communityId.length - 1) % communityColors.length;
		return communityColors[index];
	};

	const navigateMonth = (direction: "prev" | "next") => {
		setCurrentDate((prev) =>
			direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)
		);
	};

	const goToToday = () => {
		setCurrentDate(new Date());
	};

	// Handle create event
	const handleCreateEvent = async () => {
		if (
			!newEvent.title ||
			!newEvent.startDate ||
			!newEvent.endDate ||
			!newEvent.communityId
		) {
			toast({
				title: "Missing fields",
				description: "Please fill in all required fields.",
				variant: "destructive",
			});
			return;
		}

		try {
			const startDateTime = new Date(
				`${newEvent.startDate}T${newEvent.startTime || "09:00"}`
			);
			const endDateTime = new Date(
				`${newEvent.endDate}T${newEvent.endTime || "10:00"}`
			);

			await createEventMutation.mutateAsync({
				community_id: newEvent.communityId,
				title: newEvent.title,
				description: newEvent.description,
				location: newEvent.location,
				starts_at: startDateTime.toISOString(),
				ends_at: endDateTime.toISOString(),
				timezone: "Asia/Kolkata",
				visibility: newEvent.visibility,
				capacity: newEvent.capacity ? parseInt(newEvent.capacity) : undefined,
				registration_required: newEvent.registrationRequired,
			});

			setShowCreateModal(false);
			setNewEvent({
				title: "",
				description: "",
				location: "",
				communityId: "",
				startDate: "",
				startTime: "",
				endDate: "",
				endTime: "",
				capacity: "",
				registrationRequired: false,
				visibility: "public",
			});
			refetchEvents();
		} catch (error) {
			console.error("Failed to create event:", error);
		}
	};

	// Handle create task
	const handleCreateTask = async () => {
		if (!newTask.title || !newTask.communityId) {
			toast({
				title: "Missing fields",
				description: "Please fill in title and community.",
				variant: "destructive",
			});
			return;
		}

		try {
			await createTaskMutation.mutateAsync({
				community_id: newTask.communityId,
				title: newTask.title,
				description: newTask.description,
				status: newTask.status,
				priority: newTask.priority,
				due_date: newTask.dueDate || undefined,
				assigned_to: newTask.assignedTo,
				tags: newTask.tags,
			});

			setShowCreateTaskModal(false);
			setNewTask({
				title: "",
				description: "",
				communityId: "",
				status: "todo",
				priority: "medium",
				dueDate: "",
				assignedTo: [],
				tags: [],
			});
			refetchTasks();
		} catch (error) {
			console.error("Failed to create task:", error);
		}
	};

	// Handle update task
	const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
		try {
			await updateTaskMutation.mutateAsync({
				id: taskId,
				...updates,
			});
			refetchTasks();
		} catch (error) {
			console.error("Failed to update task:", error);
		}
	};

	// Handle delete task
	const handleDeleteTask = async (taskId: string) => {
		try {
			await deleteTaskMutation.mutateAsync(taskId);
			refetchTasks();
		} catch (error) {
			console.error("Failed to delete task:", error);
		}
	};

	if (eventsLoading || communitiesLoading || tasksLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin" />
				<span className="ml-2">Loading events...</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Events & Tasks</h1>
						<p className="text-gray-600">
							Manage community events and track tasks
						</p>
					</div>
					<Button onClick={() => setShowCreateModal(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Create Event
					</Button>
				</div>

				{/* Filters */}
				<div className="flex items-center space-x-4">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search events..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					<Select
						value={selectedCommunity}
						onValueChange={setSelectedCommunity}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="All Communities" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Communities</SelectItem>
							{communities.map((community: any) => (
								<SelectItem key={community.id} value={community.id}>
									{community.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="All Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="draft">Draft</SelectItem>
							<SelectItem value="published">Published</SelectItem>
							<SelectItem value="cancelled">Cancelled</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-6">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
					<TabsList className="grid w-full grid-cols-2 mb-6">
						<TabsTrigger value="events" className="flex items-center">
							<CalendarDays className="h-4 w-4 mr-2" />
							Events
						</TabsTrigger>
						<TabsTrigger value="tasks" className="flex items-center">
							<CheckSquare className="h-4 w-4 mr-2" />
							Tasks
						</TabsTrigger>
					</TabsList>

					<TabsContent value="events" className="h-full">
						<div className="flex flex-col h-full">
							{/* View Mode Toggle */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center bg-gray-100 rounded-lg p-1">
									<Button
										variant={viewMode === "calendar" ? "default" : "ghost"}
										size="sm"
										onClick={() => setViewMode("calendar")}>
										<Calendar className="h-4 w-4 mr-2" />
										Calendar
									</Button>
									<Button
										variant={viewMode === "list" ? "default" : "ghost"}
										size="sm"
										onClick={() => setViewMode("list")}>
										<List className="h-4 w-4 mr-2" />
										List
									</Button>
								</div>

								{viewMode === "calendar" && (
									<div className="flex items-center space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => navigateMonth("prev")}>
											<ChevronLeft className="h-4 w-4" />
										</Button>
										<Button variant="outline" size="sm" onClick={goToToday}>
											Today
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => navigateMonth("next")}>
											<ChevronRight className="h-4 w-4" />
										</Button>
										<h3 className="text-lg font-semibold ml-4">
											{format(currentDate, "MMMM yyyy")}
										</h3>
									</div>
								)}
							</div>
							{/* Calendar View */}
							{viewMode === "calendar" && (
								<Card className="flex-1">
									<CardContent className="p-6">
										{/* Days of Week Header */}
										<div className="grid grid-cols-7 gap-px mb-2">
											{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
												(day) => (
													<div
														key={day}
														className="p-2 text-center text-sm font-medium text-gray-500">
														{day}
													</div>
												)
											)}
										</div>

										{/* Calendar Days */}
										<div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
											{calendarDays.map((day) => {
												const dayEvents = eventsForDate(day);
												const isCurrentMonth = isSameMonth(day, currentDate);
												const isDayToday = isToday(day);

												return (
													<div
														key={day.toISOString()}
														className={`
                              min-h-32 bg-white p-2 
                              ${
																!isCurrentMonth
																	? "bg-gray-50 text-gray-400"
																	: ""
															}
                              ${isDayToday ? "bg-blue-50" : ""}
                            `}>
														<div
															className={`
                              text-sm font-medium mb-2
                              ${isDayToday ? "text-blue-600" : ""}
                            `}>
															{format(day, "d")}
														</div>

														<div className="space-y-1">
															{dayEvents.slice(0, 3).map((event) => (
																<div
																	key={event.id}
																	onClick={() => {
																		setSelectedEvent(event);
																		setShowEventDetail(true);
																	}}
																	className={`
                                    p-1 rounded text-xs cursor-pointer border-l-2
                                    ${getCommunityColor(event.communityId)}
                                    hover:shadow-sm transition-shadow
                                  `}>
																	<div className="font-medium truncate">
																		{event.title}
																	</div>
																	<div className="flex items-center space-x-1 mt-1">
																		<Clock className="h-3 w-3" />
																		<span>
																			{format(event.startDate, "HH:mm")}
																		</span>
																	</div>
																</div>
															))}

															{dayEvents.length > 3 && (
																<div className="text-xs text-gray-500 p-1">
																	+{dayEvents.length - 3} more
																</div>
															)}
														</div>
													</div>
												);
											})}
										</div>
									</CardContent>
								</Card>
							)}

							{/* List View */}
							{viewMode === "list" && (
								<div className="space-y-4">
									{filteredEvents.map((event) => (
										<Card
											key={event.id}
											className="hover:shadow-md transition-shadow">
											<CardContent className="p-6">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center space-x-3 mb-2">
															<h3 className="text-lg font-semibold">
																{event.title}
															</h3>
															<Badge className={statusColors[event.status]}>
																{event.status}
															</Badge>
														</div>

														<p className="text-gray-600 mb-3">
															{event.description}
														</p>

														<div className="flex items-center space-x-6 text-sm text-gray-500">
															<div className="flex items-center">
																<CalendarDays className="h-4 w-4 mr-1" />
																{format(event.startDate, "MMM d, yyyy")}
															</div>
															<div className="flex items-center">
																<Clock className="h-4 w-4 mr-1" />
																{format(event.startDate, "HH:mm")} -{" "}
																{format(event.endDate, "HH:mm")}
															</div>
															{event.location && (
																<div className="flex items-center">
																	<MapPin className="h-4 w-4 mr-1" />
																	{event.location}
																</div>
															)}
															<div className="flex items-center">
																<Users className="h-4 w-4 mr-1" />
																{event.communityName}
															</div>
														</div>
													</div>

													<div className="flex items-center space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => {
																setSelectedEvent(event);
																setShowEventDetail(true);
															}}>
															<Eye className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}

									{filteredEvents.length === 0 && (
										<Card>
											<CardContent className="p-12 text-center">
												<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
												<h3 className="text-lg font-medium text-gray-900 mb-2">
													No events found
												</h3>
												<p className="text-gray-500">
													Create your first event to get started.
												</p>
											</CardContent>
										</Card>
									)}
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent value="tasks" className="h-full">
						<div className="flex flex-col h-full">
							{/* Task Filters */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-4">
									<div className="relative flex-1 max-w-md">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<Input
											placeholder="Search tasks..."
											value={taskSearchTerm}
											onChange={(e) => setTaskSearchTerm(e.target.value)}
											className="pl-10"
										/>
									</div>

									<Select
										value={selectedTaskStatus}
										onValueChange={setSelectedTaskStatus}>
										<SelectTrigger className="w-32">
											<SelectValue placeholder="Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Status</SelectItem>
											<SelectItem value="todo">To Do</SelectItem>
											<SelectItem value="in-progress">In Progress</SelectItem>
											<SelectItem value="completed">Completed</SelectItem>
										</SelectContent>
									</Select>

									<Select
										value={selectedTaskPriority}
										onValueChange={setSelectedTaskPriority}>
										<SelectTrigger className="w-32">
											<SelectValue placeholder="Priority" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Priority</SelectItem>
											<SelectItem value="high">High</SelectItem>
											<SelectItem value="medium">Medium</SelectItem>
											<SelectItem value="low">Low</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<Button onClick={() => setShowCreateTaskModal(true)}>
									<Plus className="h-4 w-4 mr-2" />
									Create Task
								</Button>
							</div>

							{/* Tasks List */}
							<div className="space-y-4">
								{filteredTasks.map((task) => (
									<Card
										key={task.id}
										className="hover:shadow-md transition-shadow">
										<CardContent className="p-6">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3 mb-2">
														<div className="flex items-center">
															{task.status === "completed" ? (
																<CheckCircle className="h-5 w-5 text-green-500" />
															) : task.status === "in-progress" ? (
																<AlertCircle className="h-5 w-5 text-yellow-500" />
															) : (
																<Circle className="h-5 w-5 text-gray-400" />
															)}
														</div>
														<h3 className="text-lg font-semibold">
															{task.title}
														</h3>
														<Badge
															className={
																task.priority === "high"
																	? "bg-red-100 text-red-800"
																	: task.priority === "medium"
																	? "bg-yellow-100 text-yellow-800"
																	: "bg-green-100 text-green-800"
															}>
															{task.priority}
														</Badge>
														<Badge
															className={
																task.status === "completed"
																	? "bg-green-100 text-green-800"
																	: task.status === "in-progress"
																	? "bg-blue-100 text-blue-800"
																	: "bg-gray-100 text-gray-800"
															}>
															{task.status}
														</Badge>
													</div>

													{task.description && (
														<p className="text-gray-600 mb-3">
															{task.description}
														</p>
													)}

													<div className="flex items-center space-x-6 text-sm text-gray-500">
														<div className="flex items-center">
															<Users className="h-4 w-4 mr-1" />
															{task.community_name || "Unknown Community"}
														</div>
														{task.due_date && (
															<div className="flex items-center">
																<Clock className="h-4 w-4 mr-1" />
																Due:{" "}
																{format(new Date(task.due_date), "MMM d, yyyy")}
															</div>
														)}
														{task.assigned_to &&
															task.assigned_to.length > 0 && (
																<div className="flex items-center">
																	<User className="h-4 w-4 mr-1" />
																	{task.assigned_to.length} assigned
																</div>
															)}
													</div>
												</div>

												<div className="flex items-center space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															setSelectedTask(task);
															setShowTaskDetail(true);
														}}>
														<Eye className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															handleUpdateTask(task.id, {
																status:
																	task.status === "completed"
																		? "todo"
																		: task.status === "todo"
																		? "in-progress"
																		: "completed",
															})
														}>
														{task.status === "completed" ? (
															<Circle className="h-4 w-4" />
														) : (
															<CheckCircle className="h-4 w-4" />
														)}
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleDeleteTask(task.id)}>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								))}

								{filteredTasks.length === 0 && (
									<Card>
										<CardContent className="p-12 text-center">
											<CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
											<h3 className="text-lg font-medium text-gray-900 mb-2">
												No tasks found
											</h3>
											<p className="text-gray-500">
												Create your first task to get started.
											</p>
										</CardContent>
									</Card>
								)}
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>

			{/* Create Event Modal */}
			<Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Create New Event</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Event Title *</Label>
								<Input
									id="title"
									value={newEvent.title}
									onChange={(e) =>
										setNewEvent((prev) => ({ ...prev, title: e.target.value }))
									}
									placeholder="Enter event title"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="community">Community *</Label>
								<Select
									value={newEvent.communityId}
									onValueChange={(value) =>
										setNewEvent((prev) => ({ ...prev, communityId: value }))
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select community" />
									</SelectTrigger>
									<SelectContent>
										{communities.map((community: any) => (
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
								value={newEvent.description}
								onChange={(e) =>
									setNewEvent((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								placeholder="Enter event description"
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								value={newEvent.location}
								onChange={(e) =>
									setNewEvent((prev) => ({ ...prev, location: e.target.value }))
								}
								placeholder="Enter event location"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="startDate">Start Date *</Label>
								<Input
									id="startDate"
									type="date"
									value={newEvent.startDate}
									onChange={(e) =>
										setNewEvent((prev) => ({
											...prev,
											startDate: e.target.value,
										}))
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="startTime">Start Time</Label>
								<Input
									id="startTime"
									type="time"
									value={newEvent.startTime}
									onChange={(e) =>
										setNewEvent((prev) => ({
											...prev,
											startTime: e.target.value,
										}))
									}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="endDate">End Date *</Label>
								<Input
									id="endDate"
									type="date"
									value={newEvent.endDate}
									onChange={(e) =>
										setNewEvent((prev) => ({
											...prev,
											endDate: e.target.value,
										}))
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="endTime">End Time</Label>
								<Input
									id="endTime"
									type="time"
									value={newEvent.endTime}
									onChange={(e) =>
										setNewEvent((prev) => ({
											...prev,
											endTime: e.target.value,
										}))
									}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="capacity">Capacity</Label>
								<Input
									id="capacity"
									type="number"
									value={newEvent.capacity}
									onChange={(e) =>
										setNewEvent((prev) => ({
											...prev,
											capacity: e.target.value,
										}))
									}
									placeholder="Maximum participants"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="visibility">Visibility</Label>
								<Select
									value={newEvent.visibility}
									onValueChange={(value: "public" | "community" | "private") =>
										setNewEvent((prev) => ({ ...prev, visibility: value }))
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="public">Public</SelectItem>
										<SelectItem value="community">Community Only</SelectItem>
										<SelectItem value="private">Private</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="registrationRequired"
								checked={newEvent.registrationRequired}
								onChange={(e) =>
									setNewEvent((prev) => ({
										...prev,
										registrationRequired: e.target.checked,
									}))
								}
							/>
							<Label htmlFor="registrationRequired">
								Registration Required
							</Label>
						</div>

						<div className="flex justify-end space-x-2 pt-4">
							<Button
								variant="outline"
								onClick={() => setShowCreateModal(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleCreateEvent}
								disabled={createEventMutation.isPending}>
								{createEventMutation.isPending && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								Create Event
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Event Detail Modal */}
			<Dialog open={showEventDetail} onOpenChange={setShowEventDetail}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{selectedEvent?.title}</DialogTitle>
					</DialogHeader>

					{selectedEvent && (
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Badge className={statusColors[selectedEvent.status]}>
									{selectedEvent.status}
								</Badge>
								<Badge variant="outline">{selectedEvent.visibility}</Badge>
							</div>

							<p className="text-gray-600">{selectedEvent.description}</p>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-3">
									<div className="flex items-center">
										<CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
										<span>
											{format(selectedEvent.startDate, "MMM d, yyyy")}
										</span>
									</div>
									<div className="flex items-center">
										<Clock className="h-4 w-4 mr-2 text-gray-500" />
										<span>
											{format(selectedEvent.startDate, "HH:mm")} -{" "}
											{format(selectedEvent.endDate, "HH:mm")}
										</span>
									</div>
									{selectedEvent.location && (
										<div className="flex items-center">
											<MapPin className="h-4 w-4 mr-2 text-gray-500" />
											<span>{selectedEvent.location}</span>
										</div>
									)}
								</div>

								<div className="space-y-3">
									<div className="flex items-center">
										<Users className="h-4 w-4 mr-2 text-gray-500" />
										<span>{selectedEvent.communityName}</span>
									</div>
									{selectedEvent.capacity && (
										<div className="flex items-center">
											<Users className="h-4 w-4 mr-2 text-gray-500" />
											<span>
												{selectedEvent.currentRegistrations} /{" "}
												{selectedEvent.capacity} registered
											</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex justify-end space-x-2 pt-4">
								<Button
									variant="outline"
									onClick={() => setShowEventDetail(false)}>
									Close
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Create Task Modal */}
			<Dialog open={showCreateTaskModal} onOpenChange={setShowCreateTaskModal}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Create New Task</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="taskTitle">Task Title *</Label>
								<Input
									id="taskTitle"
									value={newTask.title}
									onChange={(e) =>
										setNewTask((prev) => ({ ...prev, title: e.target.value }))
									}
									placeholder="Enter task title"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="taskCommunity">Community *</Label>
								<Select
									value={newTask.communityId}
									onValueChange={(value) =>
										setNewTask((prev) => ({ ...prev, communityId: value }))
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select community" />
									</SelectTrigger>
									<SelectContent>
										{communities.map((community: any) => (
											<SelectItem key={community.id} value={community.id}>
												{community.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="taskDescription">Description</Label>
							<Textarea
								id="taskDescription"
								value={newTask.description}
								onChange={(e) =>
									setNewTask((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								placeholder="Enter task description"
								rows={3}
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="taskStatus">Status</Label>
								<Select
									value={newTask.status}
									onValueChange={(
										value: "todo" | "in-progress" | "completed"
									) => setNewTask((prev) => ({ ...prev, status: value }))}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="todo">To Do</SelectItem>
										<SelectItem value="in-progress">In Progress</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="taskPriority">Priority</Label>
								<Select
									value={newTask.priority}
									onValueChange={(value: "low" | "medium" | "high") =>
										setNewTask((prev) => ({ ...prev, priority: value }))
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Low</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="high">High</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="taskDueDate">Due Date</Label>
								<Input
									id="taskDueDate"
									type="date"
									value={newTask.dueDate}
									onChange={(e) =>
										setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))
									}
								/>
							</div>
						</div>

						<div className="flex justify-end space-x-2 pt-4">
							<Button
								variant="outline"
								onClick={() => setShowCreateTaskModal(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleCreateTask}
								disabled={createTaskMutation.isPending}>
								{createTaskMutation.isPending && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								Create Task
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Task Detail Modal */}
			<Dialog open={showTaskDetail} onOpenChange={setShowTaskDetail}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{selectedTask?.title}</DialogTitle>
					</DialogHeader>

					{selectedTask && (
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Badge
									className={
										selectedTask.priority === "high"
											? "bg-red-100 text-red-800"
											: selectedTask.priority === "medium"
											? "bg-yellow-100 text-yellow-800"
											: "bg-green-100 text-green-800"
									}>
									{selectedTask.priority} priority
								</Badge>
								<Badge
									className={
										selectedTask.status === "completed"
											? "bg-green-100 text-green-800"
											: selectedTask.status === "in-progress"
											? "bg-blue-100 text-blue-800"
											: "bg-gray-100 text-gray-800"
									}>
									{selectedTask.status}
								</Badge>
							</div>

							{selectedTask.description && (
								<p className="text-gray-600">{selectedTask.description}</p>
							)}

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-3">
									<div className="flex items-center">
										<Users className="h-4 w-4 mr-2 text-gray-500" />
										<span>{selectedTask.community_name}</span>
									</div>
									{selectedTask.due_date && (
										<div className="flex items-center">
											<Clock className="h-4 w-4 mr-2 text-gray-500" />
											<span>
												Due:{" "}
												{format(new Date(selectedTask.due_date), "MMM d, yyyy")}
											</span>
										</div>
									)}
								</div>

								<div className="space-y-3">
									<div className="flex items-center">
										<CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
										<span>
											Created:{" "}
											{format(new Date(selectedTask.created_at), "MMM d, yyyy")}
										</span>
									</div>
									{selectedTask.assigned_to &&
										selectedTask.assigned_to.length > 0 && (
											<div className="flex items-center">
												<User className="h-4 w-4 mr-2 text-gray-500" />
												<span>
													{selectedTask.assigned_to.length} people assigned
												</span>
											</div>
										)}
								</div>
							</div>

							<div className="flex justify-end space-x-2 pt-4">
								<Button
									variant="outline"
									onClick={() => setShowTaskDetail(false)}>
									Close
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};
