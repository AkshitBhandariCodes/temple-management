import { useState } from "react";
import {
	Calendar,
	List,
	Clock,
	Plus,
	Upload,
	Download,
	Search,
	Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CalendarView from "./CalendarView";
import ScheduleView from "./ScheduleView";
import CreatePujaSeriesModal from "./CreatePujaSeriesModal";
import ExceptionManagementModal from "./ExceptionManagementModal";
import PujaInstanceModal from "./PujaInstanceModal";
import StatusUpdateModal from "./StatusUpdateModal";
import { usePujaSeries } from "@/hooks/use-complete-api";

const PujasManagement = () => {
	console.log("🔵 PujasManagement component rendering...");

	const [activeTab, setActiveTab] = useState("list");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [selectedPuja, setSelectedPuja] = useState(null);
	const [showInstanceModal, setShowInstanceModal] = useState(false);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [showExceptionModal, setShowExceptionModal] = useState(false);

	// Generate puja instances from series data for Calendar and Schedule views
	const generatePujaInstances = (seriesData: any[]) => {
		const instances: any[] = [];
		const today = new Date();

		seriesData.forEach((series: any) => {
			// Generate instances for the next 30 days based on series schedule
			for (let i = 0; i < 30; i++) {
				const instanceDate = new Date(today);
				instanceDate.setDate(today.getDate() + i);

				// Extract time from start_date or use default
				const startDate = new Date(series.start_date);
				const startTime = startDate.toTimeString().slice(0, 5); // HH:MM format

				// Create instance based on schedule_config or intelligent scheduling
				const shouldCreateInstance = shouldCreateInstanceForDate(
					series,
					instanceDate
				);

				if (shouldCreateInstance) {
					// Vary the status for more realistic data
					let instanceStatus = "scheduled";
					if (instanceDate < today) {
						// Past instances - mostly completed, some delayed
						instanceStatus = Math.random() > 0.2 ? "completed" : "delayed";
					} else if (instanceDate.toDateString() === today.toDateString()) {
						// Today's instances - mix of on-time and scheduled
						instanceStatus = Math.random() > 0.5 ? "on-time" : "scheduled";
					}

					// Assign priests based on puja type
					let assignedPriest = "Pandit Sharma";
					if (series.name?.toLowerCase().includes("hanuman")) {
						assignedPriest = "Pandit Kumar";
					} else if (
						series.name?.toLowerCase().includes("lakshmi") ||
						series.name?.toLowerCase().includes("festival")
					) {
						assignedPriest = "Pandit Gupta";
					}

					instances.push({
						id: `${series.id}-${instanceDate.toISOString().split("T")[0]}`,
						title: series.name,
						date: instanceDate.toISOString().split("T")[0],
						startTime: startTime,
						status: instanceStatus,
						duration: series.duration_minutes || 60,
						location: series.location || "Main Temple",
						priest: assignedPriest,
						seriesId: series.id,
						deity: series.deity,
						description: series.description,
					});
				}
			}
		});

		return instances;
	};

	// Helper function to determine if an instance should be created for a specific date
	const shouldCreateInstanceForDate = (series: any, date: Date) => {
		const config = series.schedule_config || {};
		const seriesName = series.name?.toLowerCase() || "";

		// Only create instances for active series
		if (series.status !== "active") return false;

		// Check schedule_config first
		if (config.frequency) {
			if (config.frequency === "daily") {
				return true;
			}
			if (config.frequency === "weekly") {
				const dayName = date
					.toLocaleDateString("en-US", { weekday: "long" })
					.toLowerCase();
				return config.day === dayName;
			}
			if (config.frequency === "monthly") {
				return date.getDate() === (config.date || 1);
			}
		}

		// Intelligent scheduling based on puja name/type
		if (
			seriesName.includes("daily") ||
			seriesName.includes("morning") ||
			seriesName.includes("evening")
		) {
			return true; // Daily pujas
		}

		if (
			seriesName.includes("weekly") ||
			seriesName.includes("tuesday") ||
			seriesName.includes("hanuman")
		) {
			return date.getDay() === 2; // Tuesday for Hanuman
		}

		if (seriesName.includes("monthly") || seriesName.includes("satyanarayan")) {
			return date.getDate() === 15; // 15th of each month
		}

		if (seriesName.includes("festival") || seriesName.includes("special")) {
			// Only on specific dates for festivals
			const startDate = new Date(series.start_date);
			return date.toDateString() === startDate.toDateString();
		}

		// Default: create instances every few days for other pujas
		return date.getDate() % 3 === 0;
	};

	const mockPriests = [
		{ id: 1, name: "Pandit Sharma" },
		{ id: 2, name: "Pandit Kumar" },
		{ id: 3, name: "Pandit Gupta" },
	];
	const mockLocations = ["Main Temple", "Prayer Hall", "Meditation Room"];

	// Handler functions for child components
	const handleInstanceClick = (instance: any) => {
		setSelectedPuja(instance);
		setShowInstanceModal(true);
	};

	const handleStatusUpdate = (instance: any) => {
		setSelectedPuja(instance);
		setShowStatusModal(true);
	};

	const handleAddException = (instance: any) => {
		setSelectedPuja(instance);
		setShowExceptionModal(true);
	};

	const handleCreateSave = (formData: any) => {
		console.log("Creating puja series:", formData);
		setShowCreateModal(false);
		// TODO: Implement actual save logic
	};

	// Fetch real puja series data
	const {
		data: pujaSeriesData,
		isLoading,
		error,
	} = usePujaSeries({
		status: statusFilter === "all" ? undefined : statusFilter,
		limit: 1000,
	});

	// Debug logging
	console.log("🔵 PujasManagement Debug:", {
		pujaSeriesData,
		isLoading,
		error,
		statusFilter,
	});

	const pujaSeries = pujaSeriesData?.data || [];

	// Generate puja instances from series data
	const pujaInstances = generatePujaInstances(pujaSeries);

	const filteredSeries = pujaSeries.filter(
		(series: any) =>
			series.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			series.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusBadge = (status: string) => {
		const variants = {
			active: "bg-green-100 text-green-800",
			inactive: "bg-gray-100 text-gray-800",
			cancelled: "bg-red-100 text-red-800",
			draft: "bg-yellow-100 text-yellow-800",
		};
		return variants[status as keyof typeof variants] || variants.active;
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		console.error("❌ Pujas API Error:", error);
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<div className="text-red-500 mb-4">Failed to load puja series</div>
					<p className="text-muted-foreground">Error: {error.message}</p>
					<p className="text-xs text-gray-500 mt-2">
						Check console for details
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Puja Management</h2>
					<p className="text-muted-foreground">
						Manage puja schedules and series
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Button variant="outline">
						<Upload className="w-4 h-4 mr-2" />
						Import
					</Button>
					<Button variant="outline">
						<Download className="w-4 h-4 mr-2" />
						Export
					</Button>
					<Button onClick={() => setShowCreateModal(true)}>
						<Plus className="w-4 h-4 mr-2" />
						Create Puja Series
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="flex items-center space-x-4">
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search puja series..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="inactive">Inactive</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
						<SelectItem value="draft">Draft</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-card text-card-foreground rounded-lg border p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Total Series
							</p>
							<p className="text-2xl font-bold">{pujaSeries.length}</p>
						</div>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</div>
				</div>

				<div className="bg-card text-card-foreground rounded-lg border p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Active
							</p>
							<p className="text-2xl font-bold">
								{pujaSeries.filter((s) => s.status === "active").length}
							</p>
						</div>
						<div className="h-4 w-4 rounded-full bg-green-500"></div>
					</div>
				</div>

				<div className="bg-card text-card-foreground rounded-lg border p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								This Month
							</p>
							<p className="text-2xl font-bold">
								{
									pujaInstances.filter((instance) => {
										const instanceDate = new Date(instance.date);
										const today = new Date();
										return (
											instanceDate.getMonth() === today.getMonth() &&
											instanceDate.getFullYear() === today.getFullYear()
										);
									}).length
								}
							</p>
						</div>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</div>
				</div>

				<div className="bg-card text-card-foreground rounded-lg border p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Avg Duration
							</p>
							<p className="text-2xl font-bold">
								{pujaSeries.length > 0
									? Math.round(
											pujaSeries.reduce(
												(sum, s) => sum + (s.duration_minutes || 60),
												0
											) / pujaSeries.length
									  )
									: 60}
								m
							</p>
						</div>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</div>
				</div>
			</div>

			{/* Main Content Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="list" className="flex items-center gap-2">
						<List className="w-4 h-4" />
						List View
					</TabsTrigger>
					<TabsTrigger value="calendar" className="flex items-center gap-2">
						<Calendar className="w-4 h-4" />
						Calendar View
					</TabsTrigger>
					<TabsTrigger value="schedule" className="flex items-center gap-2">
						<Clock className="w-4 h-4" />
						Schedule View
					</TabsTrigger>
				</TabsList>

				<TabsContent value="list" className="mt-6">
					{filteredSeries.length === 0 ? (
						<div className="flex items-center justify-center h-96">
							<div className="text-center">
								<Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-lg font-medium">No puja series found</p>
								<p className="text-sm text-muted-foreground">
									{searchTerm || statusFilter !== "all"
										? "Try adjusting your filters"
										: "No puja series have been created yet"}
								</p>
								<Button
									className="mt-4"
									onClick={() => setShowCreateModal(true)}>
									<Plus className="w-4 h-4 mr-2" />
									Create First Puja Series
								</Button>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{filteredSeries.map((series: any) => (
								<div
									key={series.id}
									className="bg-card text-card-foreground rounded-lg border p-6">
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-lg font-semibold">{series.name}</h3>
												<Badge className={getStatusBadge(series.status)}>
													{series.status}
												</Badge>
											</div>
											<p className="text-muted-foreground mb-2">
												{series.description}
											</p>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<span>
													Location:{" "}
													{series.schedule_config?.location || "Not specified"}
												</span>
												<span>Deity: {series.deity || "Not specified"}</span>
												<span>Type: {series.type}</span>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Button variant="outline" size="sm">
												View Details
											</Button>
											<Button variant="outline" size="sm">
												Edit
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="calendar" className="mt-6">
					<CalendarView
						pujaInstances={pujaInstances}
						onInstanceClick={handleInstanceClick}
						onStatusUpdate={handleStatusUpdate}
						onAddException={handleAddException}
					/>
				</TabsContent>

				<TabsContent value="schedule" className="mt-6">
					<ScheduleView
						pujaInstances={pujaInstances}
						onInstanceClick={handleInstanceClick}
						onStatusUpdate={handleStatusUpdate}
					/>
				</TabsContent>
			</Tabs>

			{/* Modals */}
			{showCreateModal && (
				<CreatePujaSeriesModal
					isOpen={showCreateModal}
					onClose={() => setShowCreateModal(false)}
					onSave={handleCreateSave}
					editData={null}
					priests={mockPriests}
					locations={mockLocations}
				/>
			)}

			{selectedPuja && (
				<>
					<PujaInstanceModal
						isOpen={showInstanceModal}
						onClose={() => setShowInstanceModal(false)}
						instanceData={selectedPuja}
						seriesData={selectedPuja}
					/>
					<StatusUpdateModal
						isOpen={showStatusModal}
						onClose={() => setShowStatusModal(false)}
						onSave={(data: any) => {
							console.log("Status update:", data);
							setShowStatusModal(false);
						}}
						instanceData={selectedPuja}
					/>
					<ExceptionManagementModal
						isOpen={showExceptionModal}
						onClose={() => setShowExceptionModal(false)}
						onSave={(data: any) => {
							console.log("Exception added:", data);
							setShowExceptionModal(false);
						}}
						pujaData={selectedPuja}
						priests={mockPriests}
						locations={mockLocations}
					/>
				</>
			)}
		</div>
	);
};

export default PujasManagement;
