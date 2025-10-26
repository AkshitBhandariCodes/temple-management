import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { DashboardTab } from "./DashboardTab";
import { VolunteersTab } from "./VolunteersTab";
import { ShiftsTab } from "./ShiftsTab";
import { AttendanceTab } from "./AttendanceTab";
import { ApplicationsTab } from "./ApplicationsTab";
import { CommunicationsTab } from "./CommunicationsTab";
import { supabase } from "../../utils/supabaseClient";
import { format, subDays } from "date-fns";

export const VolunteersManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState({
    totalVolunteers: 0,
    pendingApplications: 0,
    todayShifts: 0,
    attendanceRate: 0
  });

  // Fetch live stats from Supabase
  async function fetchQuickStats() {
    setLoading(true);

    // Get total verified volunteers
    const { data: volunteersData } = await supabase
      .from("volunteers")
      .select("id")
      .eq("verified", true);

    // Get pending applications
    const { data: applicationsData } = await supabase
      .from("volunteer_applications")
      .select("id")
      .eq("status", "pending");

    // Get today's shifts
    const { data: shiftsData } = await supabase
      .from("shifts")
      .select("id")
      .eq("shift_date", format(new Date(), "yyyy-MM-dd"));

    // Get this week's attendance rate
    const weekAgo = subDays(new Date(), 7);
    const { data: attendanceData } = await supabase
      .from("shift_attendance")
      .select("status")
      .gte("created_at", weekAgo.toISOString());

    const attendanceRate = attendanceData && attendanceData.length > 0
      ? Math.round((attendanceData.filter(a => a.status === 'present' || a.status === 'late').length / attendanceData.length) * 100)
      : 0;

    setQuickStats({
      totalVolunteers: volunteersData?.length || 0,
      pendingApplications: applicationsData?.length || 0,
      todayShifts: shiftsData?.length || 0,
      attendanceRate
    });

    setLoading(false);
  }

  useEffect(() => {
    fetchQuickStats();

    // Real-time subscriptions for stats
    const channel = supabase
      .channel("quick-stats-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "volunteers" }, fetchQuickStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "volunteer_applications" }, fetchQuickStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "shifts" }, fetchQuickStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "shift_attendance" }, fetchQuickStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteers Management</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive volunteer management system
          </p>
        </div>
        <Button className="bg-gradient-to-r from-temple-saffron to-temple-accent hover:from-temple-accent hover:to-temple-saffron text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Volunteer
        </Button>
      </div>

      {/* Quick Stats Bar */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-temple-gold/10 rounded-lg">
                  <Users className="w-5 h-5 text-temple-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Active Volunteers</p>
                  <p className="text-2xl font-bold text-temple-gold">{quickStats.totalVolunteers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-temple-saffron/10 rounded-lg">
                  <FileText className="w-5 h-5 text-temple-saffron" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Applications</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-temple-saffron">{quickStats.pendingApplications}</p>
                    {quickStats.pendingApplications > 0 && (
                      <Badge variant="secondary" className="bg-temple-saffron/10 text-temple-saffron">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-temple-maroon/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-temple-maroon" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Shifts</p>
                  <p className="text-2xl font-bold text-temple-maroon">{quickStats.todayShifts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week's Attendance</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-green-600">{quickStats.attendanceRate}%</p>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Volunteers</span>
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Shifts</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Applications</span>
          </TabsTrigger>
          <TabsTrigger value="communications" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Communications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="volunteers">
          <VolunteersTab />
        </TabsContent>

        <TabsContent value="shifts">
          <ShiftsTab />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTab />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsTab />
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
