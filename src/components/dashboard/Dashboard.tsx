import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { DonationChart } from "./DonationChart";
import { EventAttendanceChart } from "./EventAttendanceChart";
import { DashboardHeader } from "./DashboardHeader";
import { RecentActivities } from "./RecentActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	useDonations,
	useExpenses,
	useEvents,
	useCommunities,
	useVolunteers,
	useActivityTimeline,
	useTasks,
} from "@/hooks/use-complete-api";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { useMemo } from "react";
import {
	Users,
	Calendar,
	Heart,
	Building2,
	Clock,
	Star,
	Activity,
	Loader2,
	UserCheck,
	TrendingUp,
	DollarSign,
	Target,
	CheckSquare,
} from "lucide-react";

export const Dashboard = () => {
	// Use static date to prevent infinite re-renders
	const today = useMemo(() => new Date().toISOString().split("T")[0], []);

	// Real data hooks - fetch all available data
	const { data: upcomingEventsData, isLoading: eventsLoading } = useEvents({
		status: "published",
		limit: 100,
	});

	const { data: communities, isLoading: communitiesLoading } = useCommunities();

	const { data: tasksData, isLoading: tasksLoading } = useTasks({
		limit: 100,
	});

	const { data: donationsData, isLoading: donationsLoading } = useDonations({
		limit: 1000,
	});

	const { data: expensesData, isLoading: expensesLoading } = useExpenses({
		limit: 1000,
	});

	const { data: volunteersData, isLoading: volunteersLoading } = useVolunteers({
		limit: 1000,
	});

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat("en-IN").format(num);
	};

	// Calculate metrics from real database data (with fallbacks for failing APIs)
	const totalDonations =
		donationsData?.data?.reduce((sum, donation) => {
			return (
				sum + (Number(donation.net_amount) || Number(donation.amount) || 0)
			);
		}, 0) || 0;

	const totalExpenses =
		expensesData?.data?.reduce((sum, expense) => {
			return sum + (Number(expense.amount) || 0);
		}, 0) || 0;

	const netIncome = totalDonations - totalExpenses;

	// Real data from working Supabase APIs
	const totalEvents = upcomingEventsData?.data?.length || 0;
	const totalCommunities = communities?.data?.length || 0;
	const totalTasks = tasksData?.data?.length || 0;
	const completedTasks =
		tasksData?.data?.filter((task) => task.status === "completed").length || 0;
	const pendingTasks = totalTasks - completedTasks;

	// Volunteers data (may fail if using MongoDB)
	const totalVolunteers = volunteersData?.data?.length || 0;

	// Check if APIs are failing
	const donationsAvailable =
		!donationsLoading && donationsData?.success !== false;
	const expensesAvailable = !expensesLoading && expensesData?.success !== false;
	const volunteersAvailable =
		!volunteersLoading && volunteersData?.success !== false;

	// Show loading state while essential data is being fetched
	const isLoading = eventsLoading || communitiesLoading || tasksLoading;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading dashboard data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<DashboardHeader />

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Total Donations"
					value={totalDonations > 0 ? formatCurrency(totalDonations) : "₹0"}
					icon={<Heart className="h-5 w-5" />}
					description={
						donationsLoading
							? "Loading..."
							: donationsAvailable
							? `${donationsData?.data?.length || 0} donations`
							: "Donations API not available"
					}
				/>
				<StatsCard
					title="Net Income"
					value={formatCurrency(netIncome)}
					icon={<TrendingUp className="h-5 w-5" />}
					description={`Revenue: ${formatCurrency(
						totalDonations
					)} - Expenses: ${formatCurrency(totalExpenses)}`}
				/>
				<StatsCard
					title="Active Events"
					value={formatNumber(totalEvents)}
					icon={<Calendar className="h-5 w-5" />}
					description={`Published events`}
				/>
				<StatsCard
					title="Communities"
					value={formatNumber(totalCommunities)}
					icon={<Building2 className="h-5 w-5" />}
					description={`Active communities`}
				/>
			</div>

			{/* Secondary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatsCard
					title="Total Tasks"
					value={formatNumber(totalTasks)}
					icon={<CheckSquare className="h-5 w-5" />}
					description={`${completedTasks} completed, ${pendingTasks} pending`}
				/>
				<StatsCard
					title="Total Volunteers"
					value={formatNumber(totalVolunteers)}
					icon={<Users className="h-5 w-5" />}
					description={
						volunteersLoading
							? "Loading..."
							: volunteersAvailable
							? `Registered volunteers`
							: "Volunteers API not available"
					}
				/>
				<StatsCard
					title="Total Expenses"
					value={totalExpenses > 0 ? formatCurrency(totalExpenses) : "₹0"}
					icon={<DollarSign className="h-5 w-5" />}
					description={
						expensesLoading
							? "Loading..."
							: expensesAvailable
							? `${expensesData?.data?.length || 0} expenses`
							: "Expenses API not available"
					}
				/>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="w-5 h-5" />
							Financial Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium">Total Donations</span>
								<span className="text-2xl font-bold text-green-600">
									{formatCurrency(totalDonations)}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium">Total Expenses</span>
								<span className="text-2xl font-bold text-red-600">
									{formatCurrency(totalExpenses)}
								</span>
							</div>
							<div className="flex justify-between items-center pt-2 border-t">
								<span className="text-sm font-medium">Net Income</span>
								<span
									className={`text-2xl font-bold ${
										netIncome >= 0 ? "text-green-600" : "text-red-600"
									}`}>
									{formatCurrency(netIncome)}
								</span>
							</div>
							{donationsLoading || expensesLoading ? (
								<div className="flex items-center justify-center py-4">
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
									<span className="text-sm text-muted-foreground">
										Loading financial data...
									</span>
								</div>
							) : (
								<div className="text-xs text-muted-foreground pt-2">
									Based on {donationsData?.data?.length || 0} donations and{" "}
									{expensesData?.data?.length || 0} expenses
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="w-5 h-5" />
							Community Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium">Active Communities</span>
								<span className="text-2xl font-bold">
									{formatNumber(totalCommunities)}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium">Published Events</span>
								<span className="text-2xl font-bold">
									{formatNumber(totalEvents)}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium">Active Tasks</span>
								<span className="text-2xl font-bold">
									{formatNumber(totalTasks)}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium">Volunteers</span>
								<span className="text-2xl font-bold">
									{formatNumber(totalVolunteers)}
								</span>
							</div>
							{communitiesLoading || tasksLoading || volunteersLoading ? (
								<div className="flex items-center justify-center py-4">
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
									<span className="text-sm text-muted-foreground">
										Loading community data...
									</span>
								</div>
							) : (
								<div className="text-xs text-muted-foreground pt-2">
									{completedTasks} tasks completed, {pendingTasks} pending
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activities and Quick Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<RecentActivities />
				</div>
				<div>
					<QuickActions />
				</div>
			</div>
		</div>
	);
};
