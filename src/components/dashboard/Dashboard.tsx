import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { DonationChart } from "./DonationChart";
import { EventAttendanceChart } from "./EventAttendanceChart";
import { DashboardHeader } from "./DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDonations, useExpenses, useEvents, useCommunities, useVolunteers, useCommunityStats, useActivityTimeline } from "@/hooks/use-complete-api";
import { format, startOfWeek, endOfWeek } from "date-fns";
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
} from "lucide-react";

export const Dashboard = () => {
  const currentWeekStart = startOfWeek(new Date());
  const currentWeekEnd = endOfWeek(new Date());

  // Real data hooks
  const { data: donationsData, isLoading: donationsLoading } = useDonations({
    start_date: currentWeekStart.toISOString(),
    end_date: currentWeekEnd.toISOString(),
    status: 'completed',
    limit: 1000
  });

  const { data: expensesData, isLoading: expensesLoading } = useExpenses({
    status: 'approved',
    limit: 1000
  });

  const { data: upcomingEventsData, isLoading: eventsLoading } = useEvents({
    status: 'published',
    start_date: new Date().toISOString(),
    limit: 100
  });

  const { data: communities, isLoading: communitiesLoading } = useCommunities();

  const { data: volunteersData, isLoading: volunteersLoading } = useVolunteers({
    limit: 1000
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Calculate real metrics from data
  const totalDonations = donationsData?.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
  const totalExpenses = expensesData?.data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const netIncome = totalDonations - totalExpenses;
  const totalEvents = upcomingEventsData?.data?.length || 0;
  const totalCommunities = communities?.data?.length || 0;
  const totalVolunteers = volunteersData?.data?.length || 0;

  const isLoading = donationsLoading || expensesLoading || eventsLoading || communitiesLoading || volunteersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
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
          value={formatCurrency(totalDonations)}
          icon={Heart}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Net Income"
          value={formatCurrency(netIncome)}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Events"
          value={formatNumber(totalEvents)}
          icon={Calendar}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Total Volunteers"
          value={formatNumber(totalVolunteers)}
          icon={Users}
          trend={{ value: 15, isPositive: true }}
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
                <span className="text-sm font-medium">This Week</span>
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
                <span className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netIncome)}
                </span>
              </div>
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
                <span className="text-2xl font-bold">{formatNumber(totalCommunities)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Upcoming Events</span>
                <span className="text-2xl font-bold">{formatNumber(totalEvents)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Volunteers</span>
                <span className="text-2xl font-bold">{formatNumber(totalVolunteers)}</span>
              </div>
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