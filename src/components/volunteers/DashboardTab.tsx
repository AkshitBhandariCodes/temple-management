import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  UserCheck,
  FileText,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { format, subDays } from "date-fns";
import { supabase } from "../../utils/supabaseClient";

export const DashboardTab = () => {
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [todayShifts, setTodayShifts] = useState<any[]>([]);

  async function fetchDashboardData() {
    setLoading(true);

    // Fetch volunteers (REMOVED users join)
    const { data: volunteersData } = await supabase
      .from("volunteers")
      .select("*");

    // Fetch applications
    const { data: applicationsData } = await supabase
      .from("volunteer_applications")
      .select("*");

    // Fetch shifts
    const { data: shiftsData } = await supabase
      .from("shifts")
      .select("*")
      .gte("shift_date", format(new Date(), "yyyy-MM-dd"));

    // Fetch attendance for this week
    const weekAgo = subDays(new Date(), 7);
    const { data: attendanceData } = await supabase
      .from("shift_attendance")
      .select("*")
      .gte("created_at", weekAgo.toISOString());

    // Fetch today's shifts
    const { data: todayShiftsData } = await supabase
      .from("shifts")
      .select("*")
      .eq("shift_date", format(new Date(), "yyyy-MM-dd"));

    setVolunteers(volunteersData || []);
    setApplications(applicationsData || []);
    setShifts(shiftsData || []);
    setAttendance(attendanceData || []);
    setTodayShifts(todayShiftsData || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchDashboardData();

    // Real-time subscriptions
    const channel = supabase
      .channel("dashboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "volunteers" }, fetchDashboardData)
      .on("postgres_changes", { event: "*", schema: "public", table: "volunteer_applications" }, fetchDashboardData)
      .on("postgres_changes", { event: "*", schema: "public", table: "shifts" }, fetchDashboardData)
      .on("postgres_changes", { event: "*", schema: "public", table: "shift_attendance" }, fetchDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate stats
  const activeVolunteers = volunteers.filter(v => v.verified).length;
  const newThisMonth = volunteers.filter(v => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    return new Date(v.created_at) > thirtyDaysAgo;
  }).length;

  const pendingApplications = applications.filter(a => a.status === 'pending').length;
  const thisMonthApplications = applications.filter(a => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    return new Date(a.application_date) > thirtyDaysAgo;
  }).length;

  const weekShifts = shifts.filter(s => {
    const shiftDate = new Date(s.shift_date);
    const weekAgo = subDays(new Date(), 7);
    return shiftDate > weekAgo;
  }).length;

  const filledShifts = shifts.filter(s => s.status === 'filled').length;

  const todayAttendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  const weeklyAttendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
    : 0;

  const noShowRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === 'absent').length / attendance.length) * 100)
    : 0;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filled":
        return "bg-green-100 text-green-800";
      case "partially-filled":
        return "bg-yellow-100 text-yellow-800";
      case "open":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Volunteer Overview</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Total Active</div>
                <div className="text-2xl font-bold">{activeVolunteers}</div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">New This Month</span>
                <Badge variant="secondary">+{newThisMonth}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Registered</span>
                <span className="font-medium">{volunteers.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shift Management</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">This Week</div>
                <div className="text-2xl font-bold">{weekShifts}</div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Filled</span>
                <Badge className="bg-green-100 text-green-800">{filledShifts}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Fulfillment Rate</span>
                <span className="font-medium">{weekShifts > 0 ? Math.round((filledShifts / weekShifts) * 100) : 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Tracking</CardTitle>
            <UserCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Today's Rate</div>
                <div className="text-2xl font-bold">{todayAttendanceRate}%</div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Weekly Average</span>
                <Badge className="bg-blue-100 text-blue-800">{weeklyAttendanceRate}%</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">No-show Rate</span>
                <span className="font-medium text-red-600">{noShowRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Pending</div>
                <div className="text-2xl font-bold">{pendingApplications}</div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">This Month</span>
                <Badge variant="secondary">{thisMonthApplications}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">{applications.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Shifts Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Shifts</span>
            <Button variant="outline" size="sm">
              View All Shifts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayShifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  {getStatusIcon(shift.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium">{shift.title}</p>
                      <Badge className={getStatusColor(shift.status)}>
                        {shift.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{shift.start_time} - {shift.end_time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{shift.location}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {shift.assigned_volunteers?.length || 0} / {shift.required_volunteers} assigned
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  {shift.status === 'open' ? 'Assign' : 'Manage'}
                </Button>
              </div>
            ))}
            {todayShifts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>No shifts scheduled for today.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
